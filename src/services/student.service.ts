import mongoose from 'mongoose';
import { Student, IStudentDocument } from '../models/student.model.js';
import { AppError } from '../utils/apiError.js';
import { PaginatedData } from '../utils/apiResponse.js';

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  className?: string;
  status?: string;
  isDeleted?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class StudentService {
  /**
   * Lấy danh sách học sinh phân trang kết hợp tìm kiếm đa trường và các bộ lọc
   */
  static async getStudents(
    query: StudentQueryParams = {}
  ): Promise<PaginatedData<IStudentDocument>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    // Xây dựng bộ điều kiện lọc dữ liệu
    const filter: Record<string, any> = {};

    // Trạng thái xóa mềm: Mặc định lấy danh sách đang hoạt động (isDeleted: false)
    if (query.isDeleted !== undefined) {
      filter.isDeleted = query.isDeleted === true || query.isDeleted === 'true';
    } else {
      filter.isDeleted = false;
    }

    // Lọc theo lớp học
    if (query.className && query.className !== 'ALL') {
      filter.classes = query.className;
    }

    // Lọc theo trạng thái học sinh (Đang học, Bảo lưu, Nghỉ học)
    if (query.status && query.status !== 'ALL') {
      filter.status = query.status;
    }

    // Tìm kiếm mờ khớp với họ tên, mã học sinh, email hoặc SĐT phụ huynh
    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { studentCode: searchRegex },
        { email: searchRegex },
        { parentPhone: searchRegex },
        { classes: searchRegex },
      ];
    }

    // Sắp xếp thứ tự danh sách (mặc định theo ngày tạo mới nhất)
    const sortField = query.sortBy || 'createdAt';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
    const sortOption: Record<string, 1 | -1> = { [sortField]: sortDirection };

    const [items, total] = await Promise.all([
      Student.find(filter).sort(sortOption).skip(skip).limit(limit),
      Student.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Tìm kiếm học sinh theo ID MongoDB hoặc mã học sinh (studentCode)
   */
  static async getStudentById(idOrCode: string): Promise<IStudentDocument> {
    let student: IStudentDocument | null = null;

    if (mongoose.Types.ObjectId.isValid(idOrCode)) {
      student = await Student.findById(idOrCode);
    }

    if (!student) {
      student = await Student.findOne({ studentCode: idOrCode.toUpperCase() });
    }

    if (!student) {
      throw AppError.notFound(`Không tìm thấy thông tin học sinh với mã/ID: ${idOrCode}`);
    }

    return student;
  }

  /**
   * Tạo mới học sinh với cơ chế tự động sinh mã học sinh nếu chưa cung cấp
   */
  static async createStudent(data: any): Promise<IStudentDocument> {
    let code = data.studentCode ? data.studentCode.trim().toUpperCase() : '';

    if (!code) {
      // Tự động sinh mã học sinh mới dạng HSxxxx
      const lastStudent = await Student.findOne().sort({ createdAt: -1 });
      const nextNum = lastStudent ? Math.floor(Math.random() * 8000) + 1000 : 1;
      code = `HS${String(nextNum).padStart(4, '0')}`;
    }

    const existing = await Student.findOne({ studentCode: code });
    if (existing) {
      throw AppError.conflict(`Mã học sinh "${code}" đã tồn tại trên hệ thống.`);
    }

    const student = await Student.create({
      ...data,
      studentCode: code,
      isDeleted: false,
    });

    return student;
  }

  /**
   * Cập nhật thông tin chi tiết học sinh
   */
  static async updateStudent(idOrCode: string, payload: any): Promise<IStudentDocument> {
    const student = await this.getStudentById(idOrCode);

    // Nếu người dùng thay đổi mã học sinh, đảm bảo mã mới chưa bị trùng lặp
    if (payload.studentCode && payload.studentCode.toUpperCase() !== student.studentCode) {
      const codeExists = await Student.findOne({
        studentCode: payload.studentCode.toUpperCase(),
        _id: { $ne: student._id },
      });
      if (codeExists) {
        throw AppError.conflict(`Mã học sinh "${payload.studentCode}" đã được sử dụng.`);
      }
      student.studentCode = payload.studentCode.toUpperCase();
    }

    if (payload.fullName !== undefined) student.fullName = payload.fullName.trim();
    if (payload.email !== undefined) student.email = payload.email.trim();
    if (payload.gender !== undefined) student.gender = payload.gender;
    if (payload.classes !== undefined) student.classes = payload.classes;
    if (payload.parentPhone !== undefined) student.parentPhone = payload.parentPhone.trim();
    if (payload.status !== undefined) student.status = payload.status;
    if (payload.dateOfBirth !== undefined) student.dateOfBirth = payload.dateOfBirth;
    if (payload.address !== undefined) student.address = payload.address;
    if (payload.academicYear !== undefined) student.academicYear = payload.academicYear;
    if (payload.note !== undefined) student.note = payload.note;

    await student.save();
    return student;
  }

  /**
   * Xóa mềm học sinh: chuyển học sinh vào "Thùng rác"
   */
  static async softDeleteStudent(idOrCode: string): Promise<IStudentDocument> {
    const student = await this.getStudentById(idOrCode);
    if (student.isDeleted) {
      throw AppError.badRequest(`Học sinh "${student.fullName}" đã ở trong thùng rác.`);
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    student.isDeleted = true;
    student.deletedDate = formattedDate;
    await student.save();

    return student;
  }

  /**
   * Khôi phục học sinh bị xóa mềm từ "Thùng rác"
   */
  static async restoreStudent(idOrCode: string): Promise<IStudentDocument> {
    const student = await this.getStudentById(idOrCode);
    if (!student.isDeleted) {
      throw AppError.badRequest(`Học sinh "${student.fullName}" không nằm trong thùng rác.`);
    }

    student.isDeleted = false;
    student.deletedDate = undefined;
    student.status = 'Đang học';
    await student.save();

    return student;
  }

  /**
   * Xóa vĩnh viễn học sinh khỏi cơ sở dữ liệu
   */
  static async permanentDeleteStudent(idOrCode: string): Promise<void> {
    const student = await this.getStudentById(idOrCode);
    await Student.findByIdAndDelete(student._id);
  }

  /**
   * Tổng hợp dữ liệu thống kê số lượng học sinh cho bảng điều khiển và các huy hiệu
   */
  static async getStats(): Promise<{
    activeCount: number;
    trashCount: number;
    studyingCount: number;
    reservedCount: number;
    leaveCount: number;
  }> {
    const [activeCount, trashCount, studyingCount, reservedCount, leaveCount] = await Promise.all([
      Student.countDocuments({ isDeleted: false }),
      Student.countDocuments({ isDeleted: true }),
      Student.countDocuments({ isDeleted: false, status: 'Đang học' }),
      Student.countDocuments({ isDeleted: false, status: 'Bảo lưu' }),
      Student.countDocuments({ isDeleted: false, status: 'Nghỉ học' }),
    ]);

    return {
      activeCount,
      trashCount,
      studyingCount,
      reservedCount,
      leaveCount,
    };
  }
}

