import dotenv from 'dotenv';
dotenv.config();

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
};

if (!config.dbUrl) {
  console.warn('DATABASE_URL is not set. Set it in .env');
}
