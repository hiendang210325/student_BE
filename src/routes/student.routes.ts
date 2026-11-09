import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createStudentSchema,
  updateStudentSchema,
  studentQuerySchema,
} from '../validations/student.validation.js';

const router = Router();

// Lấy dữ liệu thống kê tổng quan số lượng học sinh (đang học, bảo lưu, nghỉ học, thùng rác)
router.get('/stats', StudentController.getStats);

// Lấy danh sách học sinh (hỗ trợ danh sách hoạt động, thùng rác, tìm kiếm, lọc theo lớp/trạng thái và phân trang)
router.get('/', validateRequest(studentQuerySchema), StudentController.getStudents);

// Lấy chi tiết thông tin một học sinh theo mã ID hoặc mã học sinh (studentCode)
router.get('/:id', StudentController.getStudentById);

// Thêm mới một học sinh vào hệ thống
router.post('/', validateRequest(createStudentSchema), StudentController.createStudent);

// Cập nhật thông tin chi tiết của học sinh
router.put('/:id', validateRequest(updateStudentSchema), StudentController.updateStudent);

// Xóa mềm: Chuyển học sinh vào "Thùng rác"
router.delete('/:id', StudentController.softDeleteStudent);

// Khôi phục học sinh từ "Thùng rác" trở lại danh sách lớp học
router.post('/:id/restore', StudentController.restoreStudent);

// Xóa vĩnh viễn học sinh khỏi cơ sở dữ liệu
router.delete('/:id/permanent', StudentController.permanentDeleteStudent);

export const studentRoutes = router;

