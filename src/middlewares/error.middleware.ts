import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiError.js';
import { ApiResponseBuilder } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';
import { ENV } from '../config/env.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Lỗi hệ thống nội bộ';
  let errors = err.errors || undefined;

  // 1. Lỗi sai định dạng ID của Mongoose (CastError)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Dữ liệu ID không hợp lệ cho trường: ${err.path}`;
  }

  // 2. Lỗi trùng lặp khóa duy nhất trong MongoDB (Mã lỗi 11000)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'trường dữ liệu';
    const val = err.keyValue ? err.keyValue[field] : '';
    message = `Giá trị "${val}" của trường "${field}" đã tồn tại trong hệ thống.`;
  }

  // 3. Lỗi xác thực ràng buộc dữ liệu của Mongoose (ValidationError)
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Dữ liệu không thỏa mãn ràng buộc hệ thống';
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 4. Các lỗi liên quan đến xác thực JWT Token
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token xác thực không hợp lệ';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
  }

  // Ghi nhật ký các lỗi máy chủ nội bộ bất ngờ trong môi trường phát triển
  if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error('[Unhandled Internal Error]:', err);
  }

  // Trả về phản hồi lỗi chuẩn định dạng JSON cho client
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

