import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponseBuilder } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class AuthController {
  /**
   * POST /api/auth/login
   * Đăng nhập người dùng bằng tên tài khoản và mật khẩu
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);

      ApiResponseBuilder.success(res, result, 'Đăng nhập thành công', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Lấy thông tin tài khoản người dùng đang đăng nhập
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Chưa đăng nhập' });
        return;
      }

      const user = await AuthService.getCurrentUser(userId);
      ApiResponseBuilder.success(res, user, 'Lấy thông tin người dùng thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Đăng xuất khỏi hệ thống
   */
  static async logout(_req: Request, res: Response): Promise<void> {
    ApiResponseBuilder.success(res, null, 'Đăng xuất thành công');
  }

  /**
   * POST /api/auth/register (Quản trị viên tạo người dùng mới)
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await AuthService.register(req.body);
      ApiResponseBuilder.created(res, newUser, 'Đăng ký tài khoản người dùng thành công');
    } catch (error) {
      next(error);
    }
  }
}
