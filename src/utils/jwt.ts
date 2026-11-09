import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AppRole } from '../config/constants.js';

export interface JwtUserPayload {
  userId: string;
  username: string;
  email: string;
  role: AppRole;
}

/**
 * Ký và tạo mới token JWT cho người dùng
 */
export const signToken = (
  payload: JwtUserPayload,
  expiresIn: string | number = ENV.JWT_EXPIRES_IN
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

/**
 * Xác thực và giải mã token JWT
 */
export const verifyToken = (token: string): JwtUserPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtUserPayload;
};

