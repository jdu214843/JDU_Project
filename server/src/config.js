import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Always load .env relative to the server folder (works even if started from repo root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  uploadsDir: process.env.UPLOADS_DIR || 'uploads',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  // Email/SMTP
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'no-reply@ecosoil.local',
  webBaseUrl: process.env.WEB_BASE_URL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-pro-latest',
  aiProvider: process.env.AI_PROVIDER || '',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1:8b',
  ollamaTimeoutMs: process.env.OLLAMA_TIMEOUT_MS ? parseInt(process.env.OLLAMA_TIMEOUT_MS, 10) : 25000,
};

if (!config.dbUrl) {
  console.warn('DATABASE_URL is not set. Set it in .env');
}
