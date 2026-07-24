import { RouterProvider } from "react-router";
import { router } from "./routes";
import InstallPrompt from "./components/InstallPrompt";
import { registerSW } from "virtual:pwa-register";
import { useEffect } from 'react';
// 1. Kích hoạt Service Worker để app chạy được Offline
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Có phiên bản mới của ứng dụng. Bạn có muốn tải lại trang?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App đã sẵn sàng hoạt động offline!");
  },
});

export default function App() {
  return (
    <>
      {/* 2. Giữ nguyên hệ thống Routing của bạn */}
      <RouterProvider router={router} />

export default function App() {
  
  useEffect(() => {
    document.body.classList.add('bg-[#F8FAFC]', 'dark:bg-[#0F172A]', 'overscroll-y-none');

    const savedSettings = localStorage.getItem('userSettings');
    const currentPath = window.location.pathname.toLowerCase();
    const isAuthPage = ['/login', '/signup', '/forgotpassword'].includes(currentPath);

    // Đặt màu mặc định nếu chưa có
    let themeColor = '#2563EB'; 

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.appearance === 'dark' && !isAuthPage) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      if (parsed.primaryColor) {
        themeColor = parsed.primaryColor;
      }
    } else if (isAuthPage) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    document.documentElement.style.setProperty('--color-primary', themeColor);

  }, []); 

      {/* 3. Chèn nút hiển thị Cài đặt PWA (Nút này sẽ ẩn nếu người dùng dùng web/đã cài) */}
      <InstallPrompt />
    </>
  );
}
