import mongoose from 'mongoose';
import { ENV } from './env.js';

interface ConnectOptions {
  maxRetries?: number;
  retryIntervalMs?: number;
}

/**
 * Kết nối đến cơ sở dữ liệu MongoDB với cơ chế tự động thử lại và các trình lắng nghe sự kiện kết nối
 */
export const connectDatabase = async (options: ConnectOptions = {}): Promise<typeof mongoose> => {
  const { maxRetries = 5, retryIntervalMs = 3000 } = options;
  let retries = 0;

  // Bật chế độ truy vấn nghiêm ngặt của Mongoose (chỉ chấp nhận các trường đã định nghĩa trong schema)
  mongoose.set('strictQuery', true);

  // Lắng nghe các sự kiện trạng thái kết nối của Mongoose
  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error:`, err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn(`[MongoDB] Disconnected from database.`);
  });

  while (retries < maxRetries) {
    try {
      console.log(`[MongoDB] Attempting to connect to ${ENV.MONGODB_URI} (Attempt ${retries + 1}/${maxRetries})...`);
      const conn = await mongoose.connect(ENV.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      return conn;
    } catch (error) {
      retries += 1;
      console.error(`[MongoDB] Connection attempt ${retries} failed:`, error instanceof Error ? error.message : error);

      if (retries >= maxRetries) {
        console.error(`[MongoDB] Exceeded maximum retries (${maxRetries}). Exiting process.`);
        throw error;
      }

      console.log(`[MongoDB] Retrying in ${retryIntervalMs / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
    }
  }

  throw new Error('[MongoDB] Failed to connect after retries.');
};

/**
 * Ngắt kết nối an toàn khỏi cơ sở dữ liệu MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed gracefully.');
  } catch (error) {
    console.error('[MongoDB] Error during disconnection:', error);
  }
};

