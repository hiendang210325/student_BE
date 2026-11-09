import { z } from 'zod';
import { STUDENT_STATUS, GENDER } from '../config/constants.js';

export const createStudentSchema = z.object({
  body: z.object({
    studentCode: z
      .string({ required_error: 'Mã học sinh là bắt buộc' })
      .min(3, 'Mã học sinh tối thiểu 3 ký tự')
      .trim()
      .toUpperCase(),
    fullName: z
      .string({ required_error: 'Họ và tên học sinh là bắt buộc' })
      .min(2, 'Họ và tên tối thiểu 2 ký tự')
      .trim(),
    email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
    gender: z.enum([GENDER.FEMALE, GENDER.MALE]).default(GENDER.FEMALE),
    classes: z.array(z.string().trim()).min(1, 'Học sinh phải theo học ít nhất một lớp học'),
    className: z.string().optional(),
    parentPhone: z
      .string({ required_error: 'Số điện thoại phụ huynh là bắt buộc' })
      .min(9, 'Số điện thoại phụ huynh tối thiểu 9 ký tự')
      .trim(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    academicYear: z.string().default('2025-2026'),
    status: z
      .enum([STUDENT_STATUS.STUDYING, STUDENT_STATUS.RESERVED, STUDENT_STATUS.LEAVE])
      .default(STUDENT_STATUS.STUDYING),
    note: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID học sinh là bắt buộc' }),
  }),
  body: z.object({
    studentCode: z.string().min(3).trim().toUpperCase().optional(),
    fullName: z.string().min(2).trim().optional(),
    email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
    gender: z.enum([GENDER.FEMALE, GENDER.MALE]).optional(),
    classes: z.array(z.string().trim()).min(1, 'Học sinh phải theo học ít nhất một lớp học').optional(),
    className: z.string().optional(),
    parentPhone: z.string().min(9).trim().optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    academicYear: z.string().optional(),
    status: z.enum([STUDENT_STATUS.STUDYING, STUDENT_STATUS.RESERVED, STUDENT_STATUS.LEAVE]).optional(),
    note: z.string().optional(),
  }),
});

export const studentQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    className: z.string().optional(),
    status: z.string().optional(),
    isDeleted: z.enum(['true', 'false']).optional(),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

