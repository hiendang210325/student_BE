import { ClassRoom, IClassRoomDocument } from '../models/class.model.js';
import { Student } from '../models/student.model.js';
import { AppError } from '../utils/apiError.js';

export interface ClassWithCount {
  id: string;
  name: string;
  grade: number;
  academicYear: string;
  homeroomTeacher: string;
  roomNumber: string;
  schedule?: string;
  maxCapacity?: number;
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassService {
  /**
   * Lấy danh sách tất cả các lớp học kèm tổng số học sinh được tính động
   */
  static async getClasses(): Promise<ClassWithCount[]> {
    const classes = await ClassRoom.find().sort({ grade: 1, name: 1 });

    // Tổng hợp sĩ số học sinh thực tế theo từng tên lớp học (MongoDB Aggregation)
    const studentCounts = await Student.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: '$classes' },
      { $group: { _id: '$classes', count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    studentCounts.forEach((c) => countMap.set(c._id, c.count));

    return classes.map((cls) => {
      const clsJson = cls.toJSON() as any;
      return {
        ...clsJson,
        id: clsJson.id || cls._id.toString(),
        totalStudents: countMap.get(cls.name) || 0,
      } as ClassWithCount;
    });
  }

  /**
   * Tạo mới một lớp học
   */
  static async createClass(data: any): Promise<IClassRoomDocument> {
    const existing = await ClassRoom.findOne({ name: data.name.trim() });
    if (existing) {
      throw AppError.conflict(`Lớp học "${data.name}" đã tồn tại trên hệ thống.`);
    }

    const created = await ClassRoom.create({
      ...data,
      name: data.name.trim(),
    });

    return created;
  }

  /**
   * Lấy thông tin chi tiết lớp học theo ID
   */
  static async getClassById(id: string): Promise<IClassRoomDocument> {
    const cls = await ClassRoom.findById(id);
    if (!cls) {
      throw AppError.notFound('Không tìm thấy lớp học yêu cầu.');
    }
    return cls;
  }
}
