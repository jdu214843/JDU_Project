import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

export const uploadsDir = path.join(rootDir, config.uploadsDir);
export const publicUploadPath = uploadsDir; // static served from /uploads

export function ensureUploadsDir() {
  // Skip directory creation in serverless environments (like Vercel)
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('Serverless environment detected, skipping uploads directory creation');
    return;
  }
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

