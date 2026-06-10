import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConnection || { conn: null, promise: null };

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

export async function connectToDatabase() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongodbUri, {
      bufferCommands: false,
      autoIndex: env.nodeEnv !== "production"
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
