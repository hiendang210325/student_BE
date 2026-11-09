import { Response } from 'express';
import { HTTP_STATUS } from '../config/constants.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiResponseBuilder {
  /**
   * Gửi phản hồi JSON thành công
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  /**
   * Gửi phản hồi tạo mới dữ liệu thành công (HTTP 201)
   */
  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Gửi phản hồi dữ liệu danh sách có phân trang
   */
  static paginated<T>(
    res: Response,
    data: PaginatedData<T>,
    message = 'Retrieved list successfully'
  ): Response {
    return this.success(res, data, message, HTTP_STATUS.OK);
  }

  /**
   * Gửi phản hồi lỗi
   */
  static error(
    res: Response,
    message = 'An unexpected error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || undefined,
      timestamp: new Date().toISOString(),
    });
  }
}

