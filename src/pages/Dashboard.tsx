import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FolderGit2,
  CheckSquare,
  MessageSquareDiff,
  Users,
  Calendar,
  Mail,
  Plus,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, theme } = useAuth();

  // Mock workspace statistics matching dashboard design
  const stats = [
    { label: 'Active Projects', value: '12', change: '+2 from last week', trend: 'up', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Tasks In Progress', value: '45', change: '+8 from last week', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Reviews', value: '7', change: '-2 from last week', trend: 'down', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Team Members', value: '38', change: '+3 from last week', trend: 'up', color: 'text-sky-500', bg: 'bg-sky-500/10' }
  ];

  // Mock timeline schedule
  const schedule = [
    { time: '09:30 AM', title: 'Client Sync - Alpha Project', duration: '30m', source: 'Calendar', color: 'bg-emerald-500/10 text-emerald-500' },
    { time: '11:00 AM', title: 'MoM Review - Beta Project', duration: '45m', source: 'Calendar', color: 'bg-indigo-500/10 text-indigo-500' },
    { time: '02:00 PM', title: 'Sprint Planning', duration: '1h', source: 'Slack', color: 'bg-purple-500/10 text-purple-500' },
    { time: '04:30 PM', title: 'Design Review - Gamma', duration: '30m', source: 'Calendar', color: 'bg-cyan-500/10 text-cyan-500' }
  ];

  // Mock notifications matching user's image exactly
  const notifications = [
    { title: 'PR #128 has been merged', subtitle: 'Alpha Project', time: '5m ago', type: 'git', read: false },
    { title: 'New MoM generated', subtitle: 'Beta Project - 20 May 2025', time: '15m ago', type: 'mom', read: false },
    { title: 'Meeting reminder', subtitle: 'Client Sync - Alpha Project', time: '30m ago', type: 'calendar', read: false },
    { title: 'Leave request approved', subtitle: 'Rahul Sharma', time: '1h ago', type: 'leave', read: true }
  ];

  // Mock tasks matching user's image
  const tasks = [
    { title: 'Review API integration', project: 'Alpha Project', priority: 'High', date: 'May 21', color: 'border-rose-500 text-rose-500 bg-rose-500/5' },
    { title: 'Update project documentation', project: 'Beta Project', priority: 'Medium', date: 'May 22', color: 'border-amber-500 text-amber-500 bg-amber-500/5' },
    { title: 'UI testing and feedback', project: 'Gamma Project', priority: 'Low', date: 'May 23', color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5' }
  ];

  // Mock Project Health
  const projects = [
    { name: 'Alpha Project', status: 'On Track', progress: 75, color: 'bg-emerald-500' },
    { name: 'Beta Project', status: 'At Risk', progress: 50, color: 'bg-amber-500' },
    { name: 'Gamma Project', status: 'On Track', progress: 80, color: 'bg-emerald-500' },
    { name: 'Delta Project', status: 'Delayed', progress: 30, color: 'bg-rose-500' }
  ];

  const cardBgClass = theme === 'dark' ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-xs';
  const textTitleClass = theme === 'dark' ? 'text-white' : 'text-slate-800';
  const textMutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const innerBgClass = theme === 'dark' ? 'bg-[#141624]/40 border-slate-800/50' : 'bg-slate-50 border-slate-200/50';

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight m-0 flex items-center gap-2 ${textTitleClass}`}>
            Good morning, {user?.name.split(' ')[0] || 'Kavya'} <span className="animate-bounce">👋</span>
          </h1>
          <p className={`${textMutedClass} text-sm mt-1`}>Here's what's happening across your workspace today.</p>
        </div>

        {/* Date Selector */}
        <div className={`border px-4 py-2.5 rounded-xl flex items-center space-x-2 text-xs font-semibold ${theme === 'dark' ? 'bg-[#141624]/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
          }`}>
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>May 20, 2026</span>
        </div>
      </div>

      {/* Grid of core metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className={`border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 ${cardBgClass}`}>
            <div className="space-y-2">
              <span className={`text-xs font-semibold uppercase tracking-wider block ${textMutedClass}`}>{stat.label}</span>
              <h2 className={`text-3xl font-bold m-0 leading-none ${textTitleClass}`}>{stat.value}</h2>
              <span className={`text-xs font-semibold block ${stat.change.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change.includes('+') ? '↑' : '↓'} {stat.change}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              {i === 0 && <FolderGit2 className="w-6 h-6" />}
              {i === 1 && <CheckSquare className="w-6 h-6" />}
              {i === 2 && <MessageSquareDiff className="w-6 h-6" />}
              {i === 3 && <Users className="w-6 h-6" />}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Analytics & Project Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview Pie/Chart Mockup */}
        <div className={`border p-6 rounded-2xl space-y-6 lg:col-span-2 ${cardBgClass}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Project Overview</h3>
            <select className={`border text-xs rounded-xl px-3 py-1.5 outline-none ${theme === 'dark' ? 'bg-[#141624] border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
              <option>All Projects</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-4">
            {/* Left Column: Radial progress and indicators */}
            <div className={`flex flex-col sm:flex-row items-center justify-around md:col-span-1 pr-4 gap-4 border-r ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200/60'
              }`}>
              {/* Visual simulation of Total Progress radial chart */}
              <div className="flex items-center justify-center relative flex-shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke={theme === 'dark' ? '#1c1e30' : '#e2e8f0'} strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="54" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="339" strokeDashoffset="108" strokeLinecap="round" />
                  <circle cx="64" cy="64" r="54" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="339" strokeDashoffset="260" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold ${textTitleClass}`}>68%</span>
                  <span className={`text-[9px] font-medium ${textMutedClass}`}>Total Progress</span>
                </div>
              </div>

              {/* Progress indicators list */}
              <div className="space-y-2.5 w-full max-w-[150px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>On Track</span>
                  </div>
                  <span className={`text-xs font-semibold ${textTitleClass}`}>7 (58%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>At Risk</span>
                  </div>
                  <span className={`text-xs font-semibold ${textTitleClass}`}>3 (25%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Delayed</span>
                  </div>
                  <span className={`text-xs font-semibold ${textTitleClass}`}>2 (17%)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Line chart (Progress over time) */}
            <div className="md:col-span-2 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMutedClass}`}>Progress Over Time</span>
                <select className={`border text-[10px] rounded-lg px-2.5 py-1 outline-none ${theme === 'dark' ? 'bg-[#141624] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                  <option>This Month</option>
                </select>
              </div>

              {/* High fidelity SVG line chart */}
              <div className={`w-full h-44 relative rounded-xl p-2 border ${theme === 'dark' ? 'bg-[#0a0b10]/40 border-slate-800/20' : 'bg-slate-50/50 border-slate-200/50'
                }`}>
                {/* Custom tooltip badge matching mockup */}
                <div className={`absolute left-[58%] top-[12%] border shadow-xl rounded-lg px-3 py-1.5 z-10 flex flex-col items-center ${theme === 'dark' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                  }`}>
                  <span className={`text-[9px] font-bold leading-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-450'}`}>May 20</span>
                  <span className={`text-xs font-bold mt-0.5 leading-none ${theme === 'dark' ? 'text-indigo-650' : 'text-indigo-400'}`}>68%</span>
                </div>

                <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeDasharray="3" />
                  <line x1="40" y1="55" x2="480" y2="55" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeDasharray="3" />
                  <line x1="40" y1="90" x2="480" y2="90" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeDasharray="3" />
                  <line x1="40" y1="125" x2="480" y2="125" stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeDasharray="3" />

                  {/* Y-axis labels */}
                  <text x="10" y="24" fill="#64748b" className="text-[9px] font-semibold">100%</text>
                  <text x="15" y="59" fill="#64748b" className="text-[9px] font-semibold">75%</text>
                  <text x="15" y="94" fill="#64748b" className="text-[9px] font-semibold">50%</text>
                  <text x="15" y="129" fill="#64748b" className="text-[9px] font-semibold">25%</text>
                  <text x="20" y="145" fill="#64748b" className="text-[9px] font-semibold">0%</text>

                  {/* X-axis labels */}
                  <text x="40" y="148" fill="#64748b" className="text-[9px] font-semibold" textAnchor="middle">May 1</text>
                  <text x="150" y="148" fill="#64748b" className="text-[9px] font-semibold" textAnchor="middle">May 7</text>
                  <text x="260" y="148" fill="#64748b" className="text-[9px] font-semibold" textAnchor="middle">May 14</text>
                  <text x="370" y="148" fill="#64748b" className="text-[9px] font-semibold" textAnchor="middle">May 21</text>
                  <text x="480" y="148" fill="#64748b" className="text-[9px] font-semibold" textAnchor="middle">May 28</text>

                  {/* Vertical dotted sync pointer on May 20 */}
                  <line x1="330" y1="20" x2="330" y2="125" stroke="rgba(99, 102, 241, 0.25)" strokeDasharray="3" />

                  {/* Linear gradient definitions */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path d="M 40 120 C 100 100, 150 90, 200 85 C 250 80, 300 65, 330 60 C 370 54, 430 45, 480 32 L 480 125 L 40 125 Z" fill="url(#chartGradient)" />

                  {/* Smooth curve line */}
                  <path d="M 40 120 C 100 100, 150 90, 200 85 C 250 80, 300 65, 330 60 C 370 54, 430 45, 480 32" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Pulse dot pointer at current day intersection (May 20) */}
                  <circle cx="330" cy="60" r="6" fill="#6366f1" stroke={theme === 'dark' ? '#0c0d14' : '#ffffff'} strokeWidth="2" />
                  <circle cx="330" cy="60" r="10" stroke="#6366f1" strokeWidth="1" className="animate-ping opacity-75" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule Card */}
        <div className={`border p-6 rounded-2xl flex flex-col justify-between ${cardBgClass}`}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-base font-bold ${textTitleClass}`}>Today's Schedule</h3>
              <a href="/workspace/calendar" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">View Calendar</a>
            </div>

            <div className="space-y-4">
              {schedule.map((slot, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${innerBgClass}`}>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-medium w-16 ${textMutedClass}`}>{slot.time}</span>
                    <span className={`text-xs font-bold truncate max-w-[150px] ${textTitleClass}`}>{slot.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${slot.color}`}>
                    {slot.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks & Project Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks lists */}
        <div className={`border p-6 rounded-2xl space-y-6 ${cardBgClass}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${textTitleClass}`}>My Tasks</h3>
            <div className="flex space-x-3 text-xs font-semibold">
              <button className="text-indigo-550 border-b border-indigo-500 pb-1">Upcoming</button>
              <button className={`${textMutedClass} hover:text-indigo-500 transition-colors`}>In Progress</button>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.map((task, i) => (
              <div key={i} className={`p-4 border rounded-2xl flex items-center justify-between ${innerBgClass}`}>
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${textTitleClass}`}>{task.title}</h4>
                  <span className={`text-[10px] block ${textMutedClass}`}>{task.project}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${task.color}`}>
                    {task.priority}
                  </span>
                  <span className={`text-[10px] ${textMutedClass}`}>{task.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health progress meters */}
        <div className={`border p-6 rounded-2xl space-y-6 ${cardBgClass}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Project Health</h3>
            <a href="/projects" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">View All</a>
          </div>

          <div className="space-y-5">
            {projects.map((project, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={theme === 'dark' ? 'text-slate-350' : 'text-slate-700'}>{project.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${project.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-500' :
                      project.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                    {project.status}
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#1c1e30]' : 'bg-slate-200'}`}>
                  <div className={`h-full ${project.color}`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications feed */}
        <div className={`border p-6 rounded-2xl space-y-6 ${cardBgClass}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Recent Notifications</h3>
            <span className="text-xs font-bold text-indigo-500 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-4">
            {notifications.map((notif, i) => (
              <div key={i} className={`flex items-start space-x-3 p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-slate-800/20' : 'hover:bg-slate-100/50'
                }`}>
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <h4 className={`text-xs font-bold leading-tight ${textTitleClass}`}>{notif.title}</h4>
                  <span className={`text-[10px] block ${textMutedClass}`}>{notif.subtitle} • {notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Integrations Status Bar */}
      <div className={`border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBgClass}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${textMutedClass}`}>Connected Integrations</span>
        <div className="flex flex-wrap gap-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'
            }`}>
            <Mail className="w-4 h-4 text-rose-500" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Gmail</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'
            }`}>
            <Calendar className="w-4 h-4 text-indigo-550" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Calendar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'
            }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M6 3v12" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>GitHub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
