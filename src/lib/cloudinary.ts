import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

export function configureCloudinary() {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true
  });

  return true;
}

export async function uploadToCloudinary(dataUri: string, folder = "sankalp-digital-pathshala") {
  if (!configureCloudinary()) {
    return {
      uploaded: false,
      reason: "cloudinary-not-configured"
    };
  }

  const response = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto"
  });

  return {
    uploaded: true,
    url: response.secure_url,
    publicId: response.public_id
  };
}
