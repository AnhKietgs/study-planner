# 📱 Study Planner Frontend (Client)

Ứng dụng **frontend** cho hệ thống hỗ trợ lập kế hoạch học tập cho sinh viên (Study Planner), được build bằng **React + Vite** dưới dạng **PWA (Progressive Web App)**. Theo `index.html` và `README.md` gốc trong repo, project có tên **"Smart Study Planner UI Design"** và là một code bundle được export từ Figma Make (thiết kế gốc: `https://www.figma.com/design/vyRYR7fUMEulDeEVhwWgpS/Smart-Study-Planner-UI-Design`).


---

## 📑 Mục lục

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Routing & Pages](#-routing--pages)
- [Authentication](#-authentication)
- [Request Flow](#-request-flow)
- [Error Handling](#-error-handling)
- [Security](#-security)
- [PWA & Offline Support](#-pwa--offline-support)
- [Available Scripts](#-available-scripts)



---

## ✨ Features

- 🔑 **Đăng nhập / Đăng ký / Quên mật khẩu** (`Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`)
- 📊 **Dashboard** – trang tổng quan, gọi song song 4 API (task, subject, weekly-progress, lịch học hôm nay) (`Dashboard.jsx`)
- ✅ **Quản lý Task** – xem, tạo, xóa, cập nhật trạng thái task (`Tasks.jsx`)
- 🗓️ **Calendar / Thời khóa biểu** – xem, tạo, xóa lịch học theo môn (`Calendar.jsx`)
- 📘 **Quản lý môn học (Subjects)** – xem và tạo môn học mới (`Subjects.jsx`)
- ⏱️ **Pomodoro Timer** – đếm giờ focus/short break/long break, lưu số phiên đã hoàn thành trong ngày vào `localStorage`, lưu phiên học lên server (`Pomodoro.jsx`)
- 📈 **Analytics** – hiển thị thống kê tổng hợp lấy từ API `analytics/overview` (`Analytics.jsx`)
- 👤 **Profile** – trang hồ sơ cá nhân, tổng hợp dữ liệu từ API analytics và task (`Profile.jsx`)
- ⚙️ **Settings** – cài đặt giao diện (chế độ sáng/tối, màu chủ đạo) lưu trong `localStorage` với key `userSettings` (`Settings.jsx`)
- 🔔 **Notification Bell** – hệ thống thông báo trong `Navbar.jsx`, tổng hợp từ API task & analytics, tính thời gian tương đối ("Just now", "X mins ago"...)
- 🌗 **Dark Mode** – bật/tắt qua `document.documentElement.classList` dựa trên `localStorage.userSettings.appearance`, có script chống "chớp" theme trong `index.html`
- 📲 **PWA / Cài đặt ứng dụng** – `InstallPrompt.jsx`, service worker qua `vite-plugin-pwa`, hoạt động offline
- 🎨 **UI Component Library** – bộ component dựng sẵn theo phong cách shadcn/ui trong `src/app/components/ui/` (accordion, dialog, dropdown, sidebar, chart, calendar, table, v.v.)

---

## 🛠 Tech Stack

| Technology | Usage |
| ---------- | ----- |
| React 18 (`react`, `react-dom`) | Thư viện UI chính (khai báo ở `peerDependencies`) |
| Vite 6 | Build tool & dev server |
| TypeScript / JSX | Một phần code dùng `.tsx`/`.ts` (Login, Signup, api layer...), phần còn lại dùng `.jsx` |
| React Router 7 (`react-router`) | Định tuyến SPA (`createBrowserRouter`) |
| Tailwind CSS 4 (`@tailwindcss/vite`, `tailwindcss`) | Styling utility-first |
| Radix UI (`@radix-ui/react-*`) | Các primitive UI không giao diện (accessible components) |
| MUI (`@mui/material`, `@mui/icons-material`) | Thư viện component Material UI |
| shadcn/ui-style components | Bộ component dựng sẵn trong `src/app/components/ui/` (theo `ATTRIBUTIONS.md`) |
| lucide-react | Bộ icon |
| Axios | Gọi API (dùng trong `authApi.ts`/`axiosClient.ts`) |
| recharts | Vẽ biểu đồ (dùng cho Analytics/Dashboard) |
| react-hook-form | Quản lý form |
| react-dnd, react-dnd-html5-backend | Kéo-thả (drag & drop) |
| date-fns, react-day-picker | Xử lý ngày tháng, chọn ngày (Calendar) |
| motion | Animation |
| sonner | Toast/notification UI |
| vite-plugin-pwa | Cấu hình PWA: manifest, service worker, cache API bằng Workbox |
| PostCSS (`postcss.config.mjs`) | Xử lý CSS (Tailwind v4 tự cấu hình plugin PostCSS) |

---

## 🗂 Project Structure


```text
Client/
├── ATTRIBUTIONS.md            # Ghi công shadcn/ui và ảnh Unsplash
├── README.md                  # README gốc (mô tả bundle Figma Make)
├── index.html                 # HTML entry, có script chống "chớp" dark mode
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.js
├── vite-env.d.ts
├── vite.config.ts             # Cấu hình Vite + React + Tailwind + PWA (vite-plugin-pwa)
├── dist/                      # Build output đã tồn tại sẵn (assets, sw.js, manifest.webmanifest...)
├── guidelines/
│   └── Guidelines.md          # File template trống, chưa được điền nội dung cụ thể
├── public/
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
└── src/
    ├── main.tsx                # Entry point React, render <App /> vào #root
    ├── api/
    │   ├── axiosClient.ts      # Instance Axios (baseURL, interceptor gắn Bearer token)
    │   └── authApi.ts          # Hàm login/register gọi qua axiosClient
    ├── app/
    │   ├── App.tsx             # Khởi tạo router, đăng ký Service Worker (PWA), xử lý theme
    │   ├── Layout.jsx          # Layout chính: Navbar + Sidebar + <Outlet />
    │   ├── routes.js           # Khai báo route bằng createBrowserRouter
    │   ├── components/         # Component dùng chung: Navbar, Sidebar, Button, Card, Input, Modal, Table, InstallPrompt, AuthLayout...
    │   │   ├── figma/
    │   │   │   └── ImageWithFallback.tsx
    │   │   └── ui/              # Bộ UI component style shadcn/ui (accordion, dialog, sidebar, chart, calendar, table, v.v.)
    │   └── pages/               # Các trang: Dashboard, Tasks, Calendar, Subjects, Pomodoro, Analytics, Profile, Settings, Login, Signup, ForgotPassword
    └── styles/
        ├── fonts.css
        ├── index.css
        ├── tailwind.css
        └── theme.css
```

---

## 🚀 Installation


```bash
git clone https://github.com/AnhKietgs/study-planner.git

cd study-planner/Client

npm install

npm run dev
```

Ứng dụng dev server sẽ chạy qua Vite (mặc định `http://localhost:5173`, không có cấu hình `server.port` tùy chỉnh trong `vite.config.ts` — Không xác định từ source code cổng chính xác nếu Vite dùng cổng khác do đã bị chiếm dụng).

---

---

### 1. Qua lớp `axiosClient` (chỉ dùng cho Auth)

`src/api/axiosClient.ts` tạo một instance Axios với:
- `baseURL: 'http://localhost:5000/api/v1'` (hard-code, kèm comment nhắc nhở hỏi lại nhóm Backend về port thực tế)
- Interceptor request: tự động gắn header `Authorization: Bearer <token>` lấy từ `localStorage.getItem('token')`
- Interceptor response: trả thẳng về `response.data`

`src/api/authApi.ts` cung cấp:
```ts
authApi.login(data)     // POST /auth/login
authApi.register(data)  // POST /auth/register
```
Chỉ **`Login.tsx`** và **`Signup.tsx`** sử dụng `authApi`/`axiosClient`.

### 2. Qua `fetch()` trực tiếp trong từng trang (hard-code URL)

Các trang còn lại **không** dùng `axiosClient`, mà gọi thẳng `fetch('http://localhost:5000/api/v1/...')` với header `Authorization` tự lấy token từ `localStorage` trong từng file:

| File | Endpoint được gọi |
| ---- | ------------------ |
| `Dashboard.jsx` | `GET /tasks/getTask`, `GET /subjects/getSubject`, `GET /tasks/weekly-progress`, `GET /schedule/today` |
| `Tasks.jsx` | `GET /tasks/getTask`, `GET /subjects/getSubject`, `POST /tasks/createTask`, `DELETE /tasks/deleteTask/:id`, `PATCH /tasks/updateStatus/:id` |
| `Calendar.jsx` | `GET /subjects/getSubject`, `GET /schedule/all`, `DELETE /schedule/:id`, `POST /schedule/create` |
| `Subjects.jsx` | `GET /subjects/getSubject`, `POST /subjects/createSubject` |
| `Pomodoro.jsx` | `GET /tasks/getTask`, `POST /studySession/saveTime` |
| `Analytics.jsx` | `GET /analytics/overview` |
| `Profile.jsx` | `GET /analytics/overview`, `GET /tasks/getTask` |
| `Navbar.jsx` (NotificationBell) | `GET /tasks/getTask`, `GET /analytics/overview` |

---

## 🧭 Routing & Pages


| Path | Component | Layout |
| ---- | --------- | ------ |
| `/login` | `Login` | Không dùng `Layout` |
| `/Signup` | `Signup` | Không dùng `Layout` |
| `/ForgotPassword` | `ForgotPassword` | Không dùng `Layout` |
| `/` (index) | `Dashboard` | `Layout` (Navbar + Sidebar) |
| `/tasks` | `Tasks` | `Layout` |
| `/calendar` | `Calendar` | `Layout` |
| `/subjects` | `Subjects` | `Layout` |
| `/pomodoro` | `Pomodoro` | `Layout` |
| `/analytics` | `Analytics` | `Layout` |
| `/profile` | `Profile` | `Layout` |
| `/settings` | `Settings` | `Layout` |

Menu điều hướng trong `Sidebar.jsx` khớp với danh sách trang trên (Dashboard, Tasks, Calendar, Subjects, Pomodoro, Analytics, Profile, Settings), mỗi mục có icon từ `lucide-react`.

---

## 🔐 Authentication

- **Login**: gọi `authApi.login({ email, password })` → nếu response có `token`, lưu `token` và một object `user` (gồm `fullName`, `email`, `createdAt`) vào `localStorage`, phát sự kiện tùy chỉnh `profileUpdated`, rồi `navigate("/")`.
- **Register**: `Signup.tsx` gọi `authApi.register(...)` (import `authApi` tương tự Login).
- **Lưu trữ token**: token JWT được lưu ở `localStorage.getItem/setItem('token')`, **không dùng cookie hay context/state management tập trung**.
- **Gắn token vào request**:
  - Với các API gọi qua `axiosClient`: tự động gắn qua interceptor.
  - Với các API gọi qua `fetch()` trực tiếp trong từng trang: mỗi trang tự đọc `localStorage.getItem('token')` và tự thêm header `Authorization: Bearer <token>` theo từng nơi gọi.
- **Đăng xuất**: `Navbar.jsx` có icon `LogOut` từ `lucide-react` (dùng để thực hiện đăng xuất, chi tiết xử lý cụ thể nằm trong phần code của `Navbar.jsx` không được trích dẫn đầy đủ ở đây).
- **Verify Token phía Client**: Không tìm thấy trong source code — không có logic giải mã/kiểm tra hạn token ở phía frontend; việc token hợp lệ hay không phụ thuộc hoàn toàn vào phản hồi lỗi (401/403) từ backend.

---

## 🔄 Request Flow

Luồng xử lý request tiêu biểu khi người dùng thao tác trên một trang (ví dụ trang Tasks), suy ra từ cấu trúc thực tế của code:

```text
User Interaction (UI Component / Page trong src/app/pages)
  ↓
Đọc token từ localStorage
  ↓
Gọi API
  ├─ authApi (axiosClient, có interceptor) — chỉ dùng cho Login/Signup
  └─ fetch() trực tiếp với URL hard-code — dùng cho Tasks/Subjects/Calendar/Pomodoro/Analytics/Profile/Navbar
  ↓
Backend REST API (http://localhost:5000/api/v1/...)
  ↓
Nhận JSON response
  ↓
Cập nhật React state (useState) trong component/page
  ↓
Re-render UI
```
---

## ⚠️ Error Handling

- **Login/Signup**: bọc lời gọi API trong `try/catch`; khi lỗi, đọc `error.response?.data?.message` (định dạng lỗi từ Axios) để hiển thị dưới ô input tương ứng, có fallback message mặc định (`"Login failed. Please check your credentials."`).
- **Các trang dùng `fetch()`**: theo các đoạn code đã xem (ví dụ `Tasks.jsx`, `Calendar.jsx`, `Pomodoro.jsx`, `Dashboard.jsx`, `Analytics.jsx`, `Subjects.jsx`, `Navbar.jsx`), việc kiểm tra `response.ok` và xử lý lỗi được thực hiện trong từng hàm gọi API riêng lẻ của từng trang, không qua một bộ xử lý lỗi tập trung.
- **Toast/Notification**: có thư viện `sonner` trong dependencies, được dùng để hiển thị thông báo (ví dụ toast trong `Pomodoro.jsx` có state `toast`).
- **Validation phía Client**: `Login.tsx`/`Signup.tsx` tự kiểm tra field rỗng (`if (!email.trim())`) trước khi gửi request, hiển thị message `"Field is required"` ngay trên UI.
- **Global Error Boundary**: Không tìm thấy trong source code (không có `ErrorBoundary` component nào trong `src/app`).

---

## 🛡 Security

| Cơ chế | Chi tiết theo mã nguồn |
| ------ | ----------------------- |
| **Lưu token** | JWT được lưu trong `localStorage` (không phải cookie `httpOnly`) |
| **Gắn Authorization header** | Thủ công/qua interceptor tùy theo cách gọi API (xem mục Authentication) |
| **HTTPS / CORS** | Không tìm thấy trong source code (không có cấu hình domain, chỉ gọi `http://localhost:5000`) |
| **Input Validation** | Kiểm tra rỗng cơ bản trên form Login/Signup/ForgotPassword bằng `useState` + điều kiện `if` thủ công, không dùng schema validation (không có `zod`/`yup` dù có `react-hook-form` trong dependencies) |
| **Content Security / Helmet tương đương phía FE** | Không tìm thấy trong source code |
| **Route Guard** | Không tìm thấy trong source code (xem mục Routing & Pages) |

---

## 📲 PWA & Offline Support

- **Manifest**: tên `"Study Planner App"`, short name `"StudyPlanner"`, `theme_color: "#4A90E2"`, `display: "standalone"`, icon `192x192` và `512x512` lấy từ `public/`.
- **Service Worker**: `registerType: "autoUpdate"`, đăng ký qua `virtual:pwa-register` trong `App.tsx`, có xử lý `onNeedRefresh` (hỏi người dùng có muốn tải lại khi có bản mới) và `onOfflineReady`.
- **Workbox caching**: cache các request khớp pattern `/\/api\/v1\/.*/i` theo chiến lược `NetworkFirst`, cache tối đa 100 entry, hết hạn sau 24 giờ (`maxAgeSeconds: 60 * 60 * 24`), timeout mạng 3 giây.
- **InstallPrompt**: component `InstallPrompt.jsx` hiển thị nút cài đặt PWA (chỉ hiện khi phù hợp).
- **Build output**: thư mục `dist/` trong repo đã chứa sẵn `manifest.webmanifest`, `sw.js`, `workbox-*.js` — cho thấy project từng được build qua `vite build`.

---

## 📜 Available Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Chạy dev server bằng `vite` |
| `npm run build` | Build production bằng `vite build` |
| `npm run preview` | Xem trước bản build production bằng `vite preview` |

---