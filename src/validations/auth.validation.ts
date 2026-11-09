import { z } from 'zod';
import { APP_ROLES } from '../config/constants.js';

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Vui lòng nhập tên đăng nhập' })
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
      .trim(),
    password: z
      .string({ required_error: 'Vui lòng nhập mật khẩu' })
      .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    rememberMe: z.boolean().optional(),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Tên đăng nhập là bắt buộc' })
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
      .trim(),
    password: z
      .string({ required_error: 'Mật khẩu là bắt buộc' })
      .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    email: z
      .string({ required_error: 'Email là bắt buộc' })
      .email('Định dạng email không hợp lệ')
      .trim()
      .toLowerCase(),
    fullName: z
      .string({ required_error: 'Họ và tên là bắt buộc' })
      .min(2, 'Họ và tên tối thiểu 2 ký tự')
      .trim(),
    role: z.enum([APP_ROLES.ADMIN, APP_ROLES.TEACHER, APP_ROLES.STAFF]).optional(),
    phoneNumber: z.string().optional(),
  }),
});

