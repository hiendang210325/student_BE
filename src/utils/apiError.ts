import { HTTP_STATUS } from '../config/constants.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    errors?: unknown,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Dữ liệu yêu cầu không hợp lệ', errors?: unknown): AppError {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST, errors);
  }

  static unauthorized(message = 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn'): AppError {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message = 'Bạn không có quyền thực hiện thao tác này'): AppError {
    return new AppError(message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(message = 'Tài nguyên yêu cầu không tồn tại'): AppError {
    return new AppError(message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(message = 'Dữ liệu đã tồn tại trong hệ thống'): AppError {
    return new AppError(message, HTTP_STATUS.CONFLICT);
  }

  static internal(message = 'Lỗi máy chủ nội bộ'): AppError {
    return new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, undefined, false);
  }
}

