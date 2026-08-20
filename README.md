# 📚 Study Planner — Hệ thống hỗ trợ lập kế hoạch học tập cho sinh viên

> Đề tài Nghiên cứu Khoa học Sinh viên — Trường Đại học Mở TP.HCM

Ứng dụng **Progressive Web App (PWA)** full-stack giúp sinh viên quản lý môn học, công việc (task) theo hạn nộp, thời khóa biểu, phiên học tập trung (Pomodoro) và theo dõi tiến độ học tập bằng biểu đồ trực quan. Hệ thống tự động tính toán độ ưu tiên công việc dựa trên deadline và cập nhật lại mỗi ngày bằng cron job.

**Stack:** React 18 + Vite (PWA) · Node.js/Express · PostgreSQL + Prisma ORM · JWT Authentication

---

## ✨ Tính năng chính

| Nhóm chức năng | Mô tả |
|---|---|
| 🔐 **Xác thực** | Đăng ký, đăng nhập bằng JWT, đổi mật khẩu; mật khẩu được băm bằng `bcrypt` |
| 📖 **Quản lý môn học** | Thêm/sửa/xóa môn học, gán số giờ học mục tiêu mỗi tuần, mã màu riêng cho từng môn |
| ✅ **Quản lý công việc (Task)** | Tạo task gắn với môn học và deadline; theo dõi trạng thái `TODO → IN_PROGRESS → DONE` |
| ⚡ **Độ ưu tiên tự động** | Priority (Cao/Trung bình/Thấp) được tính tự động theo thời gian còn lại đến deadline, cập nhật ngầm mỗi ngày qua **cron job** (`node-cron`) |
| 🗓️ **Thời khóa biểu** | Tạo lịch học lặp lại theo tuần, xem lịch học "hôm nay" và toàn bộ tuần |
| ⏱️ **Pomodoro / Phiên học tập** | Ghi nhận thời lượng học tập theo từng task, phục vụ thống kê |
| 📊 **Analytics Dashboard** | Tổng giờ học, tỷ lệ hoàn thành task, phân bổ thời gian theo môn học, xu hướng hoàn thành task 6 tháng gần nhất |
| 🏆 **Huy hiệu thành tích** | Tự động xét huy hiệu (Task Master, Bookworm, Early Bird, 7-Day Streak) dựa trên dữ liệu học tập thực tế |
| 📱 **PWA** | Cài đặt như ứng dụng native, hoạt động offline nhờ Service Worker cache API (`vite-plugin-pwa`) |

---

## 🏗️ Kiến trúc hệ thống

Monorepo gồm 2 phần độc lập, giao tiếp qua REST API:

```
study-planner/
├── Client/     # React 18 + Vite — Frontend PWA
└── Server/     # Node.js + Express — Backend REST API
```

```
React (Vite, PWA) ──axios──▶ Express REST API ──Prisma ORM──▶ PostgreSQL
                                     │
                              JWT Middleware (bảo vệ route)
                                     │
                          node-cron (tự động cập nhật priority mỗi ngày)
```

### Backend — `/Server`

| Thành phần | Công nghệ |
|---|---|
| Runtime / Framework | Node.js, Express 4 |
| Database / ORM | PostgreSQL, Prisma ORM 5 |
| Xác thực | JSON Web Token (`jsonwebtoken`), `bcrypt` |
| Bảo mật | `helmet`, `cors`, `express-validator` (validate input) |
| Tác vụ nền | `node-cron` (tự động tính lại priority mỗi 00:00) |

**REST API — `/api/v1`:**

```
POST   /auth/register              Đăng ký tài khoản
POST   /auth/login                 Đăng nhập, trả về JWT
PUT    /auth/forgot-password       Đổi mật khẩu (yêu cầu token)

GET    /subjects/getSubject        Danh sách môn học
POST   /subjects/createSubject     Tạo môn học
PUT    /subjects/updateSubject/:id Cập nhật môn học
DELETE /subjects/deleteSubject/:id Xóa môn học

GET    /tasks/getTask              Danh sách công việc
POST   /tasks/createTask           Tạo công việc (auto tính priority)
PUT    /tasks/updateTask/:id       Cập nhật công việc
PATCH  /tasks/updateStatus/:id     Cập nhật trạng thái
DELETE /tasks/deleteTask/:id       Xóa công việc
GET    /tasks/weekly-progress      Tiến độ tuần

POST   /schedule/create            Tạo lịch học
GET    /schedule/today             Lịch học hôm nay
GET    /schedule/all               Toàn bộ lịch học
DELETE /schedule/:id               Xóa lịch học

POST   /studySession/saveTime      Lưu phiên học (Pomodoro)
GET    /studySession/weekly-chart  Dữ liệu biểu đồ tuần
GET    /studySession/total-time    Tổng thời gian học

GET    /analytics/overview         Toàn bộ số liệu Dashboard

DELETE /users/delete                Xóa tài khoản cá nhân
```

Toàn bộ route (trừ `register`/`login`) được bảo vệ bằng middleware xác thực JWT (`verifyToken`), lỗi được xử lý tập trung qua một global error handler (bao gồm bắt lỗi trùng dữ liệu từ Prisma).

**Database schema (Prisma):** `User` 1—n `Subject`, `Task`, `StudySession`, `ClassSchedule`; `Task` liên kết tùy chọn tới `Subject` và có nhiều `StudySession`; `ClassSchedule` liên kết `User` + `Subject` với lịch lặp theo tuần.

### Frontend — `/Client`

| Thành phần | Công nghệ |
|---|---|
| Framework | React 18, Vite 6 |
| Styling | Tailwind CSS 4, MUI, Radix UI (component primitives) |
| Routing | React Router 7 |
| Gọi API | Axios (tự động đính kèm JWT qua interceptor) |
| Biểu đồ | Recharts |
| Form | React Hook Form |
| Kéo-thả | React DnD |
| PWA | `vite-plugin-pwa` — manifest, service worker, cache API theo chiến lược `NetworkFirst` |

**Các trang chính:** Đăng nhập / Đăng ký / Quên mật khẩu, Dashboard, Tasks, Subjects, Calendar, Pomodoro, Analytics, Profile, Settings.

---

## 🚀 Cài đặt & chạy dự án

### Yêu cầu
- Node.js ≥ 18
- PostgreSQL đang chạy (local hoặc cloud)

### 1. Backend

```bash
cd Server
npm install

# Tạo file .env với các biến:
# DATABASE_URL=postgresql://user:password@localhost:5432/study_planner
# JWT_SECRET=your_secret_key
# PORT=5000

npm run db:generate   # generate Prisma client
npm run db:push       # đồng bộ schema lên database
npm run dev            # chạy server (nodemon) tại http://localhost:5000
```

### 2. Frontend

```bash
cd Client
npm install
npm run dev             # chạy dev server Vite
```

> Frontend gọi API mặc định tới `http://localhost:5000/api/v1` (cấu hình trong `Client/src/api/axiosClient.ts`) — đảm bảo cổng backend khớp trước khi chạy.

---

## 👤 Vai trò cá nhân trong dự án

Dự án được phát triển theo nhóm trong khuôn khổ Nghiên cứu Khoa học Sinh viên. Đóng góp cá nhân tập trung ở phần **Backend**: thiết kế schema dữ liệu bằng Prisma ORM, xây dựng REST API (xác thực JWT, CRUD môn học/công việc/lịch học), middleware bảo mật (`helmet`, xác thực token, validate input), và cơ chế tự động tính lại độ ưu tiên công việc bằng `node-cron`.

---