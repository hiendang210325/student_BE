import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Không tìm thấy tuyến đường API: [${req.method}] ${req.originalUrl}`));
};

