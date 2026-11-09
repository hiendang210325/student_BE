import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtUserPayload } from '../utils/jwt.js';
import { AppError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { AppRole } from '../config/constants.js';

// Mở rộng giao diện Request của Express để lưu trữ thông tin người dùng đã xác thực
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

/**
 * Middleware xác thực token JWT từ tiêu đề Authorization (Bearer <token>)
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(AppError.unauthorized('Vui lòng đăng nhập để tiếp tục truy cập.'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(AppError.unauthorized('Mã token xác thực không hợp lệ.'));
    }

    const decoded = verifyToken(token);

    // Xác minh tài khoản người dùng vẫn còn tồn tại và đang hoạt động trong cơ sở dữ liệu
    const existingUser = await User.findById(decoded.userId).select('+isActive');
    if (!existingUser || !existingUser.isActive) {
      return next(AppError.unauthorized('Tài khoản người dùng không tồn tại hoặc đã bị khóa.'));
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Mã token không hợp lệ hoặc đã bị thay đổi.'));
    }
    next(error);
  }
};

/**
 * Middleware phân quyền người dùng theo vai trò (RBAC - Role-Based Access Control)
 */
export const authorize = (...roles: AppRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Chưa xác thực người dùng.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Bạn không có quyền thực hiện hành động này. Yêu cầu quyền: ${roles.join(', ')}`)
      );
    }

    next();
  };
};

