import http from 'http';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';

const startServer = async (): Promise<void> => {
  try {
    // 1. Khởi tạo và thiết lập kết nối tới cơ sở dữ liệu MongoDB
    await connectDatabase();

    // 2. Khởi tạo ứng dụng Express
    const app = createApp();
    const server = http.createServer(app);

    // 3. Bắt đầu lắng nghe yêu cầu tại cổng đã cấu hình (Port 5000)
    server.listen(ENV.PORT, () => {
      console.log('====================================================');
      console.log(`🚀 [SERVER] Lớp Văn chị Vân API Server is running!`);
      console.log(`📡 [PORT]   http://localhost:${ENV.PORT}/api`);
      console.log(`🩺 [HEALTH] http://localhost:${ENV.PORT}/api/health`);
      console.log(`🌍 [ENV]    ${ENV.NODE_ENV}`);
      console.log('====================================================');
    });

    // 4. Xử lý tắt máy chủ an toàn (Graceful Shutdown)
    const handleShutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Bắt buộc dừng tiến trình nếu quá trình tắt an toàn bị treo quá thời gian
      setTimeout(() => {
        console.error('[Server] Forcing shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ [Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

