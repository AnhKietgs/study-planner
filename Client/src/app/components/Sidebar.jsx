import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  Timer, 
  BarChart3, 
  User, 
  Settings 
} from 'lucide-react';
import { useLocation, Link } from 'react-router';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: Timer, label: 'Pomodoro', path: '/pomodoro' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-[#E5E7EB] dark:border-[#334155] fixed left-0 top-16 bottom-0 z-30 transition-colors duration-300">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]' 
                  : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] hover:text-[#111827] dark:hover:text-white' 
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[16px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}