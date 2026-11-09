import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { studentRoutes } from './student.routes.js';
import { classRoutes } from './class.routes.js';
import { ApiResponseBuilder } from '../utils/apiResponse.js';

const router = Router();

// Điểm cuối kiểm tra tình trạng hoạt động của máy chủ (Health Check)
router.get('/health', (_req, res) => {
  ApiResponseBuilder.success(
    res,
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'Lớp Văn chị Vân API Server',
    },
    'Hệ thống đang hoạt động ổn định'
  );
});

// Gắn kết các tuyến đường nhánh mô-đun (Xác thực, Học sinh, Lớp học)
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);

export const apiRouter = router;

