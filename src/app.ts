import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';

export const createApp = (): Application => {
  const app = express();

  // 1. Thiết lập các tiêu đề HTTP bảo mật (Security Headers)
  app.use(helmet());

  // 2. Cấu hình bảo mật CORS (cho phép frontend kết nối)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Cho phép các yêu cầu không có origin (ví dụ: ứng dụng di động, lệnh curl, công cụ Postman)
        if (!origin) return callback(null, true);
        if (ENV.CORS_ORIGIN.indexOf(origin) !== -1 || !ENV.IS_PROD) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Phân tích dữ liệu gửi lên (Body Parser) & Nén dữ liệu Gzip (Compression)
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. Ghi nhật ký yêu cầu HTTP (Logging)
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan(ENV.IS_PROD ? 'combined' : 'dev'));
  }

  // 5. Gắn các tuyến đường API với tiền tố /api
  app.use('/api', apiRouter);

  // 6. Xử lý các tuyến đường không tồn tại (Lỗi 404)
  app.use(notFoundHandler);

  // 7. Xử lý lỗi hệ thống tập trung toàn cục
  app.use(errorHandler);

  return app;
};

