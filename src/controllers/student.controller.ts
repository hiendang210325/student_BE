import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service.js';
import { ApiResponseBuilder } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class StudentController {
  /**
   * GET /api/students
   * Hỗ trợ danh sách đang hoạt động, thùng rác (isDeleted=true), tìm kiếm, lọc theo tên lớp, trạng thái và phân trang
   */
  static async getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await StudentService.getStudents(req.query);
      ApiResponseBuilder.paginated(res, data, 'Lấy danh sách học sinh thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/stats
   * Lấy thống kê số lượng học sinh
   */
  static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await StudentService.getStats();
      ApiResponseBuilder.success(res, stats, 'Lấy thống kê số lượng học sinh thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/:id
   * Lấy thông tin chi tiết học sinh theo ID hoặc mã học sinh
   */
  static async getStudentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.getStudentById(req.params.id);
      ApiResponseBuilder.success(res, student, 'Lấy thông tin học sinh thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/students
   * Thêm mới một học sinh
   */
  static async createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.createStudent(req.body);
      ApiResponseBuilder.created(res, student, 'Thêm mới học sinh thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/:id
   * Cập nhật thông tin học sinh
   */
  static async updateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.updateStudent(req.params.id, req.body);
      ApiResponseBuilder.success(res, student, 'Cập nhật thông tin học sinh thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/:id
   * Xóa mềm: chuyển học sinh vào "Thùng rác"
   */
  static async softDeleteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.softDeleteStudent(req.params.id);
      ApiResponseBuilder.success(
        res,
        student,
        `Đã chuyển học sinh "${student.fullName}" vào thùng rác thành công`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/students/:id/restore
   * Khôi phục học sinh từ "Thùng rác"
   */
  static async restoreStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.restoreStudent(req.params.id);
      ApiResponseBuilder.success(
        res,
        student,
        `Đã khôi phục học sinh "${student.fullName}" về danh sách lớp học thành công`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/:id/permanent
   * Xóa vĩnh viễn học sinh khỏi cơ sở dữ liệu
   */
  static async permanentDeleteStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await StudentService.permanentDeleteStudent(req.params.id);
      ApiResponseBuilder.success(res, null, 'Đã xóa vĩnh viễn học sinh khỏi cơ sở dữ liệu');
    } catch (error) {
      next(error);
    }
  }
}
