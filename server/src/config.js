import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  uploadsDir: process.env.UPLOADS_DIR || 'uploads',
};

if (!config.dbUrl) {
  console.warn('DATABASE_URL is not set. Set it in .env');
}

