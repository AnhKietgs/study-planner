import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default function Layout() {
  
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      
      // Kiểm tra biến appearance lưu trong file Settings
      if (parsed.appearance === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8">
        <div className="max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}