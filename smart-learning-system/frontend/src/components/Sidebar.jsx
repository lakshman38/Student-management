import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, Briefcase,
  BarChart3, LogOut, Menu, X, GraduationCap, Star,
  FileText, UserCheck, Settings
} from 'lucide-react';

const adminNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/users', icon: Users, label: 'User Management' },
  { to: '/dashboard/courses', icon: BookOpen, label: 'Course Management' },
  { to: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'Job Management' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics & Reports' },
];

const trainerNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/my-courses', icon: BookOpen, label: 'My Courses' },
  { to: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/dashboard/evaluations', icon: Star, label: 'Evaluations' },
  { to: '/dashboard/students', icon: Users, label: 'My Students' },
];

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/courses', icon: BookOpen, label: 'Browse Courses' },
  { to: '/dashboard/my-courses', icon: GraduationCap, label: 'My Courses' },
  { to: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'Job Portal' },
  { to: '/dashboard/profile', icon: Settings, label: 'Profile' },
];

const roleNavMap = { admin: adminNav, trainer: trainerNav, student: studentNav };
const roleColorMap = { admin: 'bg-red-500', trainer: 'bg-purple-500', student: 'bg-blue-500' };
const roleLabelMap = { admin: 'Admin Portal', trainer: 'Trainer Portal', student: 'Student Portal' };

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = roleNavMap[user?.role] || [];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">SmartLearn</p>
              <p className="text-xs" style={{ color: 'hsl(215 20% 65%)' }}>{roleLabelMap[user?.role]}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${roleColorMap[user?.role]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs truncate capitalize" style={{ color: 'hsl(215 20% 65%)' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-item ${isActive(to) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? label : ''}
          >
            <Icon className="nav-item-icon flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-red-400 hover:bg-red-500/20 hover:text-red-300 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="nav-item-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
