import { v2 as cloudinary } from 'cloudinary';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/constants.js';
import fs from 'node:fs/promises';

cloudinary.config({
  secure: true,
  cloud_name: env(ENV_VARS.CLOUDINARY_NAME),
  api_key: env(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: env(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);

  return response.secure_url;
};
