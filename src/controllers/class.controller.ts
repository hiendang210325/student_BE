import { Request, Response, NextFunction } from 'express';
import { ClassService } from '../services/class.service.js';
import { ApiResponseBuilder } from '../utils/apiResponse.js';

export class ClassController {
  /**
   * GET /api/classes
   * Lấy danh sách tất cả các lớp học
   */
  static async getClasses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classes = await ClassService.getClasses();
      ApiResponseBuilder.success(res, classes, 'Lấy danh sách lớp học thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/classes
   * Tạo mới một lớp học
   */
  static async createClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await ClassService.createClass(req.body);
      ApiResponseBuilder.created(res, created, 'Thêm mới lớp học thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/classes/:id
   * Lấy thông tin chi tiết lớp học theo ID
   */
  static async getClassById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cls = await ClassService.getClassById(req.params.id);
      ApiResponseBuilder.success(res, cls, 'Lấy thông tin chi tiết lớp học thành công');
    } catch (error) {
      next(error);
    }
  }
}
