import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClassColorTheme {
  bg: string;
  border: string;
  text: string;
}

export interface IClassRoom {
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacher: string;
  roomNumber: string;
  schedule?: string;
  maxCapacity?: number;
  description?: string;
  colorTheme?: IClassColorTheme;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClassRoomDocument extends IClassRoom, Document {}

export interface IClassRoomModel extends Model<IClassRoomDocument> {}

const classRoomSchema = new Schema<IClassRoomDocument, IClassRoomModel>(
  {
    name: {
      type: String,
      required: [true, 'Tên lớp học là bắt buộc'],
      unique: true,
      trim: true,
      index: true,
    },
    grade: {
      type: Number,
      required: [true, 'Khối lớp là bắt buộc'],
      min: 1,
      max: 12,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
    },
    homeroomTeacher: {
      type: String,
      default: 'Chị Vân',
      trim: true,
    },
    roomNumber: {
      type: String,
      default: 'P.201',
      trim: true,
    },
    schedule: {
      type: String,
      default: 'Thứ 2, Thứ 5 (18:00 - 20:00)',
      trim: true,
    },
    maxCapacity: {
      type: Number,
      default: 30,
    },
    description: {
      type: String,
      default: '',
    },
    colorTheme: {
      bg: { type: String, default: '#FFE0EB' },
      border: { type: String, default: '#F8A5C2' },
      text: { type: String, default: '#A61E4D' },
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

export const ClassRoom = mongoose.model<IClassRoomDocument, IClassRoomModel>('ClassRoom', classRoomSchema);

