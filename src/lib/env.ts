export const env = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "development-only-change-me",
  adminId: process.env.ADMIN_ID || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "Sankalp@2026",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development"
};

export function isDatabaseConfigured() {
  return Boolean(env.mongodbUri);
}

export function isProduction() {
  return env.nodeEnv === "production";
}

export function requireEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) {
    throw new Error(`${String(name)} is not configured`);
  }
  return value;
}
