import dotenv from 'dotenv';
import path from 'path';

// Tải các biến môi trường cấu hình từ tệp tin .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quanlyhocsinh',
  JWT_SECRET: process.env.JWT_SECRET || 'lop_van_chi_van_default_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;

