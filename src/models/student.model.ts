import mongoose, { Document, Schema, Model } from 'mongoose';
import { STUDENT_STATUS, GENDER, StudentStatus, Gender } from '../config/constants.js';

export interface IStudent {
  studentCode: string;
  fullName: string;
  email: string;
  gender: Gender;
  classes: string[];
  className: string;
  parentPhone: string;
  dateOfBirth?: string;
  address?: string;
  academicYear: string;
  status: StudentStatus;
  isDeleted: boolean;
  deletedDate?: string;
  gpa?: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentDocument extends IStudent, Document {}

export interface IStudentModel extends Model<IStudentDocument> {}

const studentSchema = new Schema<IStudentDocument, IStudentModel>(
  {
    studentCode: {
      type: String,
      required: [true, 'Mã học sinh là bắt buộc'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Họ và tên học sinh là bắt buộc'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.FEMALE,
    },
    classes: {
      type: [String],
      default: ['Văn 9A'],
      index: true,
    },
    className: {
      type: String,
      default: 'Văn 9A',
      trim: true,
    },
    parentPhone: {
      type: String,
      required: [true, 'Số điện thoại phụ huynh là bắt buộc'],
      trim: true,
      index: true,
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(STUDENT_STATUS),
      default: STUDENT_STATUS.STUDYING,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedDate: {
      type: String,
      default: undefined,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10,
      default: undefined,
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : '';
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Tạo chỉ mục văn bản tổng hợp để hỗ trợ tìm kiếm mờ siêu nhanh theo mã học sinh, họ tên, email và SĐT phụ huynh
studentSchema.index({
  studentCode: 'text',
  fullName: 'text',
  email: 'text',
  parentPhone: 'text',
});

// Tự động đồng bộ trường className với lớp đầu tiên trong danh sách các lớp học trước khi lưu
studentSchema.pre('save', function (next) {
  if (this.classes && this.classes.length > 0) {
    this.className = this.classes[0];
  }
  next();
});

export const Student = mongoose.model<IStudentDocument, IStudentModel>('Student', studentSchema);

