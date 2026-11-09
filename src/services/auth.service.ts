import { User, IUserDocument } from '../models/user.model.js';
import { AppError } from '../utils/apiError.js';
import { signToken } from '../utils/jwt.js';
import { ENV } from '../config/env.js';

export interface LoginResult {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
    phoneNumber?: string;
    isActive: boolean;
  };
  tokens: {
    accessToken: string;
    expiresIn: string;
  };
}

export class AuthService {
  /**
   * Xác thực người dùng bằng tên đăng nhập và mật khẩu
   */
  static async login(username: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ username: username.toLowerCase() }).select('+password');
    if (!user) {
      throw AppError.unauthorized('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw AppError.unauthorized('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const accessToken = signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const userJson = user.toJSON() as unknown as LoginResult['user'];

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
      },
      tokens: {
        accessToken,
        expiresIn: ENV.JWT_EXPIRES_IN,
      },
    };
  }

  /**
   * Lấy thông tin tài khoản người dùng hiện tại đã xác thực
   */
  static async getCurrentUser(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('Không tìm thấy thông tin tài khoản người dùng.');
    }
    return user;
  }

  /**
   * Đăng ký tài khoản người dùng mới
   */
  static async register(data: {
    username: string;
    password?: string;
    email: string;
    fullName: string;
    role?: any;
    phoneNumber?: string;
  }): Promise<IUserDocument> {
    const existingUsername = await User.findOne({ username: data.username.toLowerCase() });
    if (existingUsername) {
      throw AppError.conflict('Tên đăng nhập đã được sử dụng.');
    }

    const existingEmail = await User.findOne({ email: data.email.toLowerCase() });
    if (existingEmail) {
      throw AppError.conflict('Địa chỉ email đã được sử dụng.');
    }

    const newUser = await User.create(data);
    return newUser;
  }
}
