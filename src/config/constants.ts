export const APP_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STAFF: 'STAFF',
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export const STUDENT_STATUS = {
  STUDYING: 'Đang học',
  RESERVED: 'Bảo lưu',
  LEAVE: 'Nghỉ học',
} as const;

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export const GENDER = {
  FEMALE: 'Nữ',
  MALE: 'Nam',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

