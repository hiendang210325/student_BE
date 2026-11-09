import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Student } from '../models/student.model.js';
import { ClassRoom } from '../models/class.model.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { APP_ROLES, STUDENT_STATUS, GENDER } from '../config/constants.js';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDatabase();

    // 1. Xóa sạch dữ liệu cũ trong các bộ sưu tập (Collections)
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      ClassRoom.deleteMany({}),
    ]);
    console.log('[Seed] Collections cleared.');

    // 2. Khởi tạo dữ liệu người dùng (Admin, Giáo viên, Trợ giảng)
    console.log('[Seed] Seeding Users...');
    const users = await User.create([
      {
        username: 'chivan',
        password: 'Password123!',
        email: 'chivan@lopvan.edu.vn',
        fullName: 'Chị Vân',
        role: APP_ROLES.ADMIN,
        phoneNumber: '0901 234 567',
        isActive: true,
      },
      {
        username: 'huonggiang',
        password: 'Password123!',
        email: 'huonggiang@lopvan.edu.vn',
        fullName: 'Nguyễn Hương Giang',
        role: APP_ROLES.TEACHER,
        phoneNumber: '0902 345 678',
        isActive: true,
      },
      {
        username: 'nhanvien',
        password: 'Password123!',
        email: 'trogiang@lopvan.edu.vn',
        fullName: 'Trần Minh Quân',
        role: APP_ROLES.STAFF,
        phoneNumber: '0903 456 789',
        isActive: true,
      },
    ]);
    console.log(`[Seed] Created ${users.length} users (Admin account: username="chivan", password="Password123!").`);

    // 3. Khởi tạo danh sách các lớp học (Văn 9A, Văn 8B...)
    console.log('[Seed] Seeding ClassRooms...');
    const classes = await ClassRoom.create([
      {
        name: 'Văn 9A',
        grade: 9,
        academicYear: '2025-2026',
        homeroomTeacher: 'Chị Vân',
        roomNumber: 'P.201',
        schedule: 'Thứ 2, Thứ 5 (18:00 - 20:00)',
        maxCapacity: 30,
        description: 'Lớp ôn luyện ngữ văn trọng điểm khối 9 vào 10 chuyên.',
      },
      {
        name: 'Văn 8B',
        grade: 8,
        academicYear: '2025-2026',
        homeroomTeacher: 'Chị Vân',
        roomNumber: 'P.202',
        schedule: 'Thứ 3, Thứ 6 (18:00 - 20:00)',
        maxCapacity: 30,
        description: 'Nâng cao kỹ năng cảm thụ tác phẩm văn học lớp 8.',
      },
      {
        name: 'Văn 7C',
        grade: 7,
        academicYear: '2025-2026',
        homeroomTeacher: 'Cô Giang',
        roomNumber: 'P.101',
        schedule: 'Thứ 4, Thứ 7 (18:00 - 20:00)',
        maxCapacity: 25,
        description: 'Lớp rèn luyện phương pháp làm văn tự sự và biểu cảm khối 7.',
      },
      {
        name: 'Văn 6D',
        grade: 6,
        academicYear: '2025-2026',
        homeroomTeacher: 'Cô Giang',
        roomNumber: 'P.102',
        schedule: 'Thứ 3, Chủ Nhật (08:30 - 10:30)',
        maxCapacity: 25,
        description: 'Khởi đầu môn Văn THCS: mở rộng vốn từ và hành văn tự nhiên.',
      },
      {
        name: 'Ôn thi chuyên',
        grade: 9,
        academicYear: '2025-2026',
        homeroomTeacher: 'Chị Vân',
        roomNumber: 'P.301',
        schedule: 'Thứ 7, Chủ Nhật (14:00 - 16:30)',
        maxCapacity: 20,
        description: 'Lớp bồi dưỡng học sinh giỏi và luyện thi chuyên ngữ văn cấp tỉnh/thành phố.',
      },
    ]);
    console.log(`[Seed] Created ${classes.length} classrooms.`);

    // 4. Khởi tạo 42 học sinh đang hoạt động (Khớp chuẩn giao diện "Danh sách 42")
    console.log('[Seed] Seeding 42 Active Students...');
    const activeStudentData = [
      { code: 'HS0001', name: 'Nguyễn Minh Anh', email: 'minhanh.nguyen@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 201', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0002', name: 'Trần Gia Bảo', email: 'giabao.tran@gmail.com', gender: GENDER.MALE, classes: ['Văn 8B'], phone: '0900 111 202', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0003', name: 'Lê Thảo Linh', email: 'thaolinh.le@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A', 'Ôn thi chuyên'], phone: '0900 111 203', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0004', name: 'Đặng Hoàng Nam', email: 'hoangnam.dang@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 204', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0005', name: 'Vũ Ngọc Hân', email: 'ngochan.vu@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 205', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0006', name: 'Bùi Khánh Vy', email: 'khanhvy.bui@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 206', status: STUDENT_STATUS.RESERVED },
      { code: 'HS0007', name: 'Phạm Đức Nhật', email: 'ducnhat.pham@gmail.com', gender: GENDER.MALE, classes: ['Văn 6D'], phone: '0900 111 207', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0008', name: 'Ngô Bảo Châu', email: 'baochau.ngo@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 208', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0009', name: 'Hoàng Quốc Khánh', email: 'quockhanh.hoang@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 209', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0010', name: 'Đỗ Thùy Dung', email: 'thuydung.do@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 7C'], phone: '0900 111 210', status: STUDENT_STATUS.LEAVE },
      { code: 'HS0011', name: 'Lý Quốc Huy', email: 'quochuy.ly@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 211', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0012', name: 'Dương Thúy Hằng', email: 'thuyhang.duong@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 212', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0013', name: 'Mai Tiến Dũng', email: 'tiendung.mai@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 213', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0014', name: 'Đinh Lan Hương', email: 'lanhuong.dinh@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 6D'], phone: '0900 111 214', status: STUDENT_STATUS.RESERVED },
      { code: 'HS0015', name: 'Lương Bảo Trâm', email: 'baotram.luong@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A', 'Ôn thi chuyên'], phone: '0900 111 215', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0016', name: 'Tạ Minh Khang', email: 'minhkhang.ta@gmail.com', gender: GENDER.MALE, classes: ['Văn 8B'], phone: '0900 111 216', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0017', name: 'Phan Diệu Linh', email: 'dieulinh.phan@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 7C'], phone: '0900 111 217', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0018', name: 'Hồ Tuấn Kiệt', email: 'tuankiet.ho@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 218', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0019', name: 'Chu Quỳnh Anh', email: 'quynhanh.chu@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 6D'], phone: '0900 111 219', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0020', name: 'Võ Thanh Bình', email: 'thanhbinh.vo@gmail.com', gender: GENDER.MALE, classes: ['Văn 8B'], phone: '0900 111 220', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0021', name: 'Nguyễn Tố Như', email: 'tonhu.nguyen@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 221', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0022', name: 'Lê Thành Đạt', email: 'thanhdat.le@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 222', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0023', name: 'Phạm Yến Nhi', email: 'yennhi.pham@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 223', status: STUDENT_STATUS.RESERVED },
      { code: 'HS0024', name: 'Đoàn Gia Huy', email: 'giahuy.doan@gmail.com', gender: GENDER.MALE, classes: ['Văn 6D'], phone: '0900 111 224', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0025', name: 'Bùi Phương Linh', email: 'phuonglinh.bui@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 225', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0026', name: 'Trịnh Văn Quyết', email: 'vanquyet.trinh@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 226', status: STUDENT_STATUS.LEAVE },
      { code: 'HS0027', name: 'Lý Kim Ngân', email: 'kimngan.ly@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 227', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0028', name: 'Hoàng Trọng Nghĩa', email: 'trongnghia.hoang@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 228', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0029', name: 'Vũ Thảo Trang', email: 'thaotrang.vu@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 6D'], phone: '0900 111 229', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0030', name: 'Đỗ Hữu Thắng', email: 'huuthang.do@gmail.com', gender: GENDER.MALE, classes: ['Văn 8B'], phone: '0900 111 230', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0031', name: 'Nguyễn Cẩm Tú', email: 'camtu.nguyen@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A', 'Ôn thi chuyên'], phone: '0900 111 231', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0032', name: 'Trần Quang Dũng', email: 'quangdung.tran@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 232', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0033', name: 'Lê Kiều Oanh', email: 'kieuoanh.le@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 233', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0034', name: 'Phan Đình Khôi', email: 'dinhkhoi.phan@gmail.com', gender: GENDER.MALE, classes: ['Văn 6D'], phone: '0900 111 234', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0035', name: 'Vũ Như Quỳnh', email: 'nhuquynh.vu@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 235', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0036', name: 'Hoàng Minh Châu', email: 'minhchau.hoang@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 236', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0037', name: 'Đặng Tuấn Vũ', email: 'tuanvu.dang@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 237', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0038', name: 'Lâm Thu Trang', email: 'thutrang.lam@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 238', status: STUDENT_STATUS.RESERVED },
      { code: 'HS0039', name: 'Dương Việt Hoàng', email: 'viethoang.duong@gmail.com', gender: GENDER.MALE, classes: ['Văn 6D'], phone: '0900 111 239', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0040', name: 'Mai Ánh Tuyết', email: 'anhtuyet.mai@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 240', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0041', name: 'Bùi Minh Trí', email: 'minhtri.bui@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 241', status: STUDENT_STATUS.STUDYING },
      { code: 'HS0042', name: 'Ngô Khánh An', email: 'khanhan.ngo@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 7C'], phone: '0900 111 242', status: STUDENT_STATUS.STUDYING },
    ];

    const activeStudents = await Student.insertMany(
      activeStudentData.map((s) => ({
        studentCode: s.code,
        fullName: s.name,
        email: s.email,
        gender: s.gender,
        classes: s.classes,
        className: s.classes[0],
        parentPhone: s.phone,
        status: s.status,
        isDeleted: false,
      }))
    );
    console.log(`[Seed] Created ${activeStudents.length} active students.`);

    // 5. Khởi tạo 14 học sinh trong thùng rác đã xóa mềm (Khớp chuẩn giao diện "Thùng rác 14")
    console.log('[Seed] Seeding 14 Trash (Soft-deleted) Students...');
    const trashStudentData = [
      { code: 'HS0043', name: 'Vũ Đình Trọng', email: 'dinhtrong.vu@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 243', deletedDate: '01/11/2026' },
      { code: 'HS0044', name: 'Nguyễn Hà My', email: 'hamy.nguyen@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 244', deletedDate: '02/11/2026' },
      { code: 'HS0045', name: 'Trần Gia Hưng', email: 'giahung.tran@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 245', deletedDate: '02/11/2026' },
      { code: 'HS0046', name: 'Lê Bảo Ngọc', email: 'baongoc.le@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 246', deletedDate: '03/11/2026' },
      { code: 'HS0047', name: 'Phạm Minh Quân', email: 'minhquan.pham@gmail.com', gender: GENDER.MALE, classes: ['Văn 6D'], phone: '0900 111 247', deletedDate: '03/11/2026' },
      { code: 'HS0048', name: 'Hoàng Hải Yến', email: 'haiyen.hoang@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 248', deletedDate: '04/11/2026' },
      { code: 'HS0049', name: 'Đỗ Tuấn Anh', email: 'tuananh.do@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 249', deletedDate: '05/11/2026' },
      { code: 'HS0050', name: 'Bùi Thảo My', email: 'thaomy.bui@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 7C'], phone: '0900 111 250', deletedDate: '05/11/2026' },
      { code: 'HS0051', name: 'Lý Quốc Bảo', email: 'quocbao.ly@gmail.com', gender: GENDER.MALE, classes: ['Văn 8B'], phone: '0900 111 251', deletedDate: '06/11/2026' },
      { code: 'HS0052', name: 'Đặng Kim Chi', email: 'kimchi.dang@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 6D'], phone: '0900 111 252', deletedDate: '06/11/2026' },
      { code: 'HS0053', name: 'Dương Văn Toàn', email: 'vantoan.duong@gmail.com', gender: GENDER.MALE, classes: ['Văn 9A'], phone: '0900 111 253', deletedDate: '07/11/2026' },
      { code: 'HS0054', name: 'Mai Phương Uyên', email: 'phuonguyen.mai@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 8B'], phone: '0900 111 254', deletedDate: '07/11/2026' },
      { code: 'HS0055', name: 'Hồ Quang Hiếu', email: 'quanghieu.ho@gmail.com', gender: GENDER.MALE, classes: ['Văn 7C'], phone: '0900 111 255', deletedDate: '08/11/2026' },
      { code: 'HS0056', name: 'Ngô Thục Quyên', email: 'thucquyen.ngo@gmail.com', gender: GENDER.FEMALE, classes: ['Văn 9A'], phone: '0900 111 256', deletedDate: '08/11/2026' },
    ];

    const trashStudents = await Student.insertMany(
      trashStudentData.map((s) => ({
        studentCode: s.code,
        fullName: s.name,
        email: s.email,
        gender: s.gender,
        classes: s.classes,
        className: s.classes[0],
        parentPhone: s.phone,
        status: STUDENT_STATUS.LEAVE,
        isDeleted: true,
        deletedDate: s.deletedDate,
      }))
    );
    console.log(`[Seed] Created ${trashStudents.length} trash students.`);

    console.log('====================================================');
    console.log('✅ [Seed] Database seeding completed successfully!');
    console.log(`   - Users:        ${users.length}`);
    console.log(`   - ClassRooms:   ${classes.length}`);
    console.log(`   - Active List:  ${activeStudents.length} students`);
    console.log(`   - Trash List:   ${trashStudents.length} students`);
    console.log('====================================================');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedData();

