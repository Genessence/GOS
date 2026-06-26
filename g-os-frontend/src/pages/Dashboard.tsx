import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, theme } = useAuth();
  const navigate = useNavigate();

  // Mock workspace statistics matching dashboard design
  const stats = [
    { label: 'Active Projects', value: '12', change: '+2 from last week', trend: 'up', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Tasks In Progress', value: '45', change: '+8 from last week', trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Reviews', value: '7', change: '-2 from last week', trend: 'down', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Team Members', value: '38', change: '+3 from last week', trend: 'up', color: 'text-sky-500', bg: 'bg-sky-500/10' }
  ];

  // Helper to format dynamic dates relative to today
  const getRelativeDateStr = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Dynamic timeline schedule loaded from localStorage to show realtime meetings and attendees
  const schedule = useMemo(() => {
    let meetingsList: any[] = [];
    try {
      const stored = localStorage.getItem('gos_meetings');
      if (stored) {
        meetingsList = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    
    const currentDayOfWeek = new Date().getDay();
    const todayIndex = currentDayOfWeek >= 1 && currentDayOfWeek <= 5 ? currentDayOfWeek - 1 : 2; // Wednesday default

    const typeColors: Record<string, string> = {
      'one-one': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'sprint-ceremony': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'client-facing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'internal': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    if (meetingsList.length === 0) {
      return [
        { time: '09:30 AM', title: 'Client Sync - Alpha Project', duration: '30m', color: 'bg-emerald-500/10 text-emerald-500', attendees: [] },
        { time: '11:00 AM', title: 'MoM Review - Beta Project', duration: '45m', color: 'bg-indigo-500/10 text-indigo-500', attendees: [] },
        { time: '02:00 PM', title: 'Sprint Planning', duration: '1h', color: 'bg-purple-500/10 text-purple-500', attendees: [] },
        { time: '04:30 PM', title: 'Design Review - Gamma', duration: '30m', color: 'bg-cyan-500/10 text-cyan-500', attendees: [] }
      ];
    }

    return meetingsList
      .filter(m => m.dayIndex === todayIndex)
      .sort((a, b) => a.startHour - b.startHour)
      .map(m => {
        const durationMin = Math.round((m.endHour - m.startHour) * 60);
        const durationStr = durationMin >= 60 ? `${durationMin / 60}h` : `${durationMin}m`;
        const timeStr = m.timeLabel.split(' – ')[0] || m.timeLabel.split(' - ')[0] || '';
        return {
          time: timeStr,
          title: m.title,
          duration: durationStr,
          color: typeColors[m.type] || 'bg-slate-500/10 text-slate-500',
          attendees: m.attendees || [],
        };
      });
  }, []);

  // Mock notifications matching user's image exactly
  const notifications = [
    { title: 'PR #128 has been merged', subtitle: 'Alpha Project', time: '5m ago', type: 'git', read: false },
    { title: 'New MoM generated', subtitle: `Beta Project - ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, time: '15m ago', type: 'mom', read: false },
    { title: 'Meeting reminder', subtitle: 'Client Sync - Alpha Project', time: '30m ago', type: 'calendar', read: false },
    { title: 'Leave request approved', subtitle: 'Rahul Sharma', time: '1h ago', type: 'leave', read: true }
  ];

  // Mock tasks matching user's image
  const tasks = [
    { title: 'Review API integration', project: 'Alpha Project', priority: 'High', date: getRelativeDateStr(1), color: 'border-rose-500 text-rose-500 bg-rose-500/5' },
    { title: 'Update project documentation', project: 'Beta Project', priority: 'Medium', date: getRelativeDateStr(2), color: 'border-amber-500 text-amber-500 bg-amber-500/5' },
    { title: 'UI testing and feedback', project: 'Gamma Project', priority: 'Low', date: getRelativeDateStr(3), color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5' }
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-8 flex flex-col justify-between gap-5 max-w-[1600px] mx-auto overflow-hidden">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight m-0 flex items-center gap-2 ${textTitleClass}`}>
            {getGreeting()}, {user?.name.split(' ')[0] || 'Kavya'} <span className="animate-bounce">👋</span>
          </h1>
          <p className={`${textMutedClass} text-sm mt-1`}>Here's what's happening across your workspace today.</p>
        </div>

        {/* Date Selector */}
        <div className={`border px-4 py-2.5 rounded-xl flex items-center space-x-2 text-xs font-semibold ${theme === 'dark' ? 'bg-[#141624]/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
          }`}>
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>{currentFormattedDate}</span>
        </div>
      </div>

      {/* Grid of core metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i}
            onClick={() => {
              if (i === 0) navigate('/projects/overview');
              if (i === 1) navigate('/team/timesheets');
              if (i === 2) navigate('/workspace/reviews');
              if (i === 3) navigate('/team');
            }}
            className={`border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-indigo-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xs ${cardBgClass}`}
          >
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Project Overview Pie/Chart Mockup */}
        <div className={`border p-6 rounded-2xl flex flex-col justify-between h-full lg:col-span-2 ${cardBgClass}`}>
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <h3 className={`text-base font-bold ${textTitleClass}`}>Project Overview</h3>
              <button 
                onClick={() => navigate('/projects/overview')} 
                className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors mt-0.5"
              >
                Manage Projects
              </button>
            </div>
            <select className={`border text-xs rounded-xl px-3 py-1.5 outline-none transition-colors ${theme === 'dark' ? 'bg-[#141624] border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              <option>All Projects</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center flex-1 min-h-0 py-2">
            {/* Left Column: Radial progress and indicators */}
            <div className={`flex flex-col sm:flex-row items-center justify-around md:col-span-1 pr-4 gap-4 border-r h-full ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200/60'
              }`}>
              {/* Visual simulation of Total Progress radial chart */}
              <div className="flex items-center justify-center relative flex-shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke={theme === 'dark' ? '#1c1e30' : '#e2e8f0'} strokeWidth="10" fill="transparent" />
                  {/* On Track Segment: 58.3% */}
                  <circle cx="64" cy="64" r="54" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="197 339" strokeDashoffset="0" strokeLinecap="round" />
                  {/* At Risk Segment: 25% */}
                  <circle cx="64" cy="64" r="54" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="85 339" strokeDashoffset="-197" strokeLinecap="round" />
                  {/* Delayed Segment: 16.7% */}
                  <circle cx="64" cy="64" r="54" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="57 339" strokeDashoffset="-282" strokeLinecap="round" />
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
            <div className="md:col-span-2 space-y-2 relative h-full flex flex-col justify-between">
              <div className="flex items-center justify-between flex-shrink-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMutedClass}`}>Progress Over Time</span>
                <select className={`border text-[10px] rounded-lg px-2.5 py-1 outline-none ${theme === 'dark' ? 'bg-[#141624] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                  <option>This Month</option>
                </select>
              </div>

              {/* High fidelity SVG line chart */}
              <div className={`w-full flex-1 min-h-[120px] relative rounded-xl p-2 border ${theme === 'dark' ? 'bg-[#0a0b10]/40 border-slate-800/20' : 'bg-slate-50/50 border-slate-200/50'
                }`}>
                {/* Custom tooltip badge matching mockup */}
                <div className={`absolute left-[58%] top-[12%] border shadow-xl rounded-lg px-3 py-1.5 z-10 flex flex-col items-center ${theme === 'dark' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                  }`}>
                  <span className={`text-[9px] font-bold leading-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>May 20</span>
                  <span className={`text-xs font-bold mt-0.5 leading-none ${theme === 'dark' ? 'text-indigo-600' : 'text-indigo-600'}`}>68%</span>
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
        <div className={`border p-6 rounded-2xl flex flex-col h-full ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Today's Schedule</h3>
            <button onClick={() => navigate('/workspace/calendar')} className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">View Calendar</button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {schedule.map((slot, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${innerBgClass}`}>
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`text-xs font-medium w-16 flex-shrink-0 ${textMutedClass}`}>{slot.time}</span>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-bold truncate max-w-[160px] ${textTitleClass}`}>{slot.title}</span>
                    {slot.attendees && slot.attendees.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex -space-x-1 overflow-hidden">
                          {slot.attendees.slice(0, 3).map((att: any, idx: number) => (
                            <img key={idx} src={att.avatar} alt={att.name} className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white object-cover" title={att.name} />
                          ))}
                        </div>
                        {slot.attendees.length > 3 && (
                          <span className="text-[8px] text-slate-500 font-semibold">+{slot.attendees.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${slot.color}`}>
                  {slot.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks & Project Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* My Tasks lists */}
        <div className={`border p-6 rounded-2xl flex flex-col h-full ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-base font-bold ${textTitleClass}`}>My Tasks</h3>
            <div className="flex space-x-3 text-xs font-semibold">
              <button className={`border-b border-indigo-500 pb-1 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Upcoming</button>
              <button className={`${textMutedClass} hover:text-indigo-500 transition-colors`}>In Progress</button>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
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
        <div className={`border p-6 rounded-2xl flex flex-col h-full ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Project Health</h3>
            <button 
              onClick={() => navigate('/projects/overview')} 
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {projects.map((project, i) => (
              <div 
                key={i} 
                onClick={() => navigate('/projects/overview')}
                className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col gap-2 ${
                  theme === 'dark' 
                    ? 'border-transparent hover:bg-slate-800/10 hover:border-slate-800/40' 
                    : 'border-transparent hover:bg-slate-50 hover:border-slate-200/60 shadow-xs hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`transition-colors flex items-center gap-1 ${
                    theme === 'dark' 
                      ? 'text-slate-300 group-hover:text-indigo-400' 
                      : 'text-slate-700 group-hover:text-indigo-600'
                  }`}>
                    {project.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0" />
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5 ${
                    project.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    project.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      project.status === 'On Track' ? 'bg-emerald-500 animate-pulse' :
                      project.status === 'At Risk' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 animate-pulse'
                    }`} />
                    {project.status}
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#1c1e30]' : 'bg-slate-200'}`}>
                  <div className={`h-full transition-all duration-500 ${project.color}`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications feed */}
        <div className={`border p-6 rounded-2xl flex flex-col h-full ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-base font-bold ${textTitleClass}`}>Recent Notifications</h3>
            <button onClick={() => navigate('/notifications')} className="text-xs font-bold text-indigo-500 hover:underline">View All</button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {notifications.map((notif, i) => (
              <div key={i} onClick={() => navigate('/notifications')} className={`flex items-start space-x-3 p-2 rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800/20' : 'hover:bg-slate-100/50'
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
      <div className={`border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 ${cardBgClass}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${textMutedClass}`}>Connected Integrations</span>
        <div className="flex flex-wrap gap-4">
          <div 
            onClick={() => navigate('/workspace/mail')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer hover:border-indigo-500/80 hover:bg-indigo-500/5 transition-all duration-200 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Gmail</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div 
            onClick={() => navigate('/workspace/calendar')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer hover:border-indigo-500/80 hover:bg-indigo-500/5 transition-all duration-200 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-550" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Calendar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div 
            onClick={() => navigate('/projects')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer hover:border-indigo-500/80 hover:bg-indigo-500/5 transition-all duration-200 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
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
