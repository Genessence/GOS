import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import {
  LayoutDashboard,
  Mail,
  Calendar,
  Users,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  MessageSquare,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Layers,
  Sparkles,
  Kanban,
  Sun,
  Moon,
  BarChart4,
  CheckSquare,
  ChevronsLeft,
  Home
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const GlobalLayout: React.FC = () => {
  const { user, switchRole, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  // Sidebar sections mapping the 3 categories in the mockup
  const navigationSections: SidebarSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { name: 'Mail Workspace', path: '/workspace/mail', icon: <Mail className="w-5 h-5" /> },
        { name: 'Calendar & MoM', path: '/workspace/calendar', icon: <Calendar className="w-5 h-5" /> },
        { name: 'Projects Overview', path: '/projects/overview', icon: <BarChart4 className="w-5 h-5" /> },
        { name: 'Kanban Boards', path: '/projects', icon: <Kanban className="w-5 h-5" /> },
        { name: 'Team Chat', path: '/workspace/chat', icon: <MessageSquare className="w-5 h-5" /> },
      ]
    },
    {
      title: 'PEOPLE & CULTURE',
      items: [
        { name: 'HR & People', path: '/team', icon: <Users className="w-5 h-5" />, roles: ['Director', 'Project Lead'] },
        { name: 'Pending Reviews', path: '/workspace/reviews', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['Director', 'Project Lead'] },
        { name: 'Timesheets', path: '/team/timesheets', icon: <Clock className="w-5 h-5" /> },
        { name: 'Leave Management', path: '/team/leaves', icon: <FileText className="w-5 h-5" /> },
        { name: 'Performance', path: '/team/kpis', icon: <ShieldAlert className="w-5 h-5" />, roles: ['Director', 'Project Lead'] }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
        { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> }
      ]
    }
  ];

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0c0d14] text-slate-100' : 'bg-slate-50 text-slate-855'
      }`}>
      {/* Sidebar Navigation */}
      <aside
        className={`border-r flex flex-col justify-between transition-all duration-300 relative z-30 ${collapsed ? 'w-20' : 'w-64'
          } ${theme === 'dark' ? 'bg-[#0c0d14] border-slate-800/60' : 'bg-white border-slate-200'
          }`}
      >
        {/* Header Branding */}
        <div>
          <div className={`h-20 flex items-center border-b transition-all ${collapsed ? 'px-2 justify-center' : 'px-6 justify-between'
            } ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'
            }`}>
            <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className={`font-bold text-base leading-none tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>G-OS</span>
                  <span className="text-[8px] text-slate-500 font-medium tracking-wide mt-1 whitespace-nowrap">Genessence Operating System</span>
                </div>
              )}
            </Link>

            {/* Collapse / Expand Trigger Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1 rounded-md transition-colors ${collapsed ? 'mt-1' : ''
                } ${theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-slate-800/40' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Standalone Dashboard Link matching active screenshot look */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-md ${isActive
                  ? 'bg-[#2f32a6] text-white shadow-indigo-600/20'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
              title={collapsed ? 'Dashboard' : undefined}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </div>

          {/* Navigation Links grouped by layer */}
          <nav className="p-4 pt-2 space-y-5 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {navigationSections.map((section, idx) => {
              // Filter section items based on user role permissions
              const allowedItems = section.items.filter(
                (item) => !item.roles || item.roles.includes(user.role)
              );

              if (allowedItems.length === 0) return null;

              return (
                <div key={idx} className="space-y-1">
                  {!collapsed && (
                    <span className={`text-[9px] font-bold tracking-wider px-3 block mb-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                      {section.title}
                    </span>
                  )}
                  {allowedItems.map((item, itemIdx) => (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                          ? 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20'
                          : theme === 'dark'
                            ? 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      <div className="flex-shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors">{item.icon}</div>
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </NavLink>
                  ))}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Area - User Profile */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200/60'
          }`}>

          {/* User Profile and Switchable Roles Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${collapsed ? 'justify-center' : ''
                } ${theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100'
                }`}
            >
              <div className="flex items-center space-x-3 text-left">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
                {!collapsed && (
                  <div className="overflow-hidden max-w-[120px]">
                    <h4 className={`text-xs font-semibold truncate leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user.name}</h4>
                    <span className="text-[10px] text-indigo-500 font-medium truncate uppercase tracking-wider block">{user.role}</span>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Role Switcher Dropdown popup */}
            {showRoleDropdown && (
              <div className={`absolute bottom-full left-0 mb-2 w-52 rounded-2xl shadow-2xl p-2 z-50 space-y-1 ${collapsed ? 'left-16' : ''
                } ${theme === 'dark' ? 'bg-[#0f111a] border border-slate-800' : 'bg-white border border-slate-200'
                }`}>
                <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'}`}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Persona</span>
                </div>
                {(['Director', 'Project Lead', 'Engineer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all ${user.role === r
                      ? 'bg-indigo-600/10 text-indigo-500'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <span>{r}</span>
                    {user.role === r && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </button>
                ))}
                <div className={`border-t pt-1 mt-1 ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'}`}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0c0d14]' : 'bg-[#f8fafc]'
        }`}>
        {/* Top Navbar */}
        <header className={`h-16 border-b px-6 flex items-center justify-between z-20 flex-shrink-0 transition-colors ${theme === 'dark' ? 'border-slate-800/60 bg-[#0c0d14]' : 'border-slate-200 bg-white'
          }`}>
          {/* Left search */}
          <div className="flex items-center space-x-4 w-96">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Search anything (⌘ + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all ${theme === 'dark'
                  ? 'bg-[#141624]/60 border-slate-800/80 text-white placeholder-slate-500'
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
              />
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center space-x-3">
            {/* Quick action button */}
            <button
              onClick={() => navigate('/workspace/calendar')}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create MoM</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-slate-800/30 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button onClick={() => navigate('/notifications')} className={`p-2 rounded-xl relative transition-all ${theme === 'dark' ? 'hover:bg-slate-800/30 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-[#0c0d14]" />
            </button>

            {/* Conversations / Help */}
            <button onClick={() => navigate('/workspace/chat')} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-slate-800/30 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}>
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Vertical separator */}
            <span className={`w-px h-5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Quick Identity HUD badge */}
            <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-xl ${theme === 'dark' ? 'bg-[#141624]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                {user.role} mode
              </span>
            </div>
          </div>
        </header>

        {/* Workspace Dynamic Content Area */}
        <main className={`flex-1 overflow-y-auto relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0b10]' : 'bg-[#f1f5f9]'
          }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default GlobalLayout;
