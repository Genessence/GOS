import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FolderGit2,
  TrendingUp,
  AlertOctagon,
  Calendar,
  DollarSign,
  ChevronRight,
  Plus,
  Users,
  Target,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ProjectInfo {
  id: string;
  name: string;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
  ownerName: string;
  ownerAvatar: string;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  budgetUsed: number;
  budgetTotal: number;
}

export const ProjectsOverview: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState<'all' | 'On Track' | 'At Risk' | 'Delayed'>('all');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Unified project metadata matching workspace specs
  const [projectsList] = useState<ProjectInfo[]>([
    { id: 'p1', name: 'PayGate Platform', progress: 78, status: 'On Track', ownerName: 'Aarav Rao', ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', tasksCompleted: 35, tasksTotal: 45, dueDate: '25 Jul 2026', budgetUsed: 78000, budgetTotal: 100000 },
    { id: 'p2', name: 'Integrations Hub', progress: 42, status: 'At Risk', ownerName: 'Ankit Sharma', ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', tasksCompleted: 14, tasksTotal: 33, dueDate: '15 Aug 2026', budgetUsed: 31000, budgetTotal: 50000 },
    { id: 'p3', name: 'Frontend Core UI', progress: 91, status: 'On Track', ownerName: 'Kavya Chopra', ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', tasksCompleted: 58, tasksTotal: 64, dueDate: '10 Jul 2026', budgetUsed: 38000, budgetTotal: 40000 },
    { id: 'p4', name: 'Mobile Invoicing App', progress: 15, status: 'Delayed', ownerName: 'Rahul Sharma', ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', tasksCompleted: 6, tasksTotal: 40, dueDate: '30 Sep 2026', budgetUsed: 12000, budgetTotal: 50000 },
  ]);

  const [milestones] = useState([
    { title: 'Payment Pipeline Sec-Audit', project: 'PayGate Platform', date: 'Jul 2', status: 'upcoming' },
    { title: 'Figma Design Hand-off', project: 'Mobile Invoicing App', date: 'Jul 10', status: 'pending' },
    { title: 'Stripe API Webhooks Sign-off', project: 'Integrations Hub', date: 'Jul 15', status: 'upcoming' },
    { title: 'Core UI v1.0.0 Stable Tag', project: 'Frontend Core UI', date: 'Jul 22', status: 'completed' },
  ]);

  const [risks] = useState([
    { desc: 'Third-party webhook latency delays core pipeline', severity: 'High', status: 'Mitigated', project: 'Integrations Hub' },
    { desc: 'Mobile QA engineer allocation gap in July sprint', severity: 'Medium', status: 'Unmitigated', project: 'Mobile Invoicing App' },
    { desc: 'Figma redline validation dependencies', severity: 'Low', status: 'Mitigated', project: 'Frontend Core UI' },
  ]);

  // Compute metrics
  const activeCount = projectsList.length;
  const onTrackCount = projectsList.filter(p => p.status === 'On Track').length;
  const atRiskCount = projectsList.filter(p => p.status === 'At Risk').length;
  const delayedCount = projectsList.filter(p => p.status === 'Delayed').length;

  const totalBudget = projectsList.reduce((acc, p) => acc + p.budgetTotal, 0);
  const totalBudgetUsed = projectsList.reduce((acc, p) => acc + p.budgetUsed, 0);
  const averageCompletion = Math.round(projectsList.reduce((acc, p) => acc + p.progress, 0) / activeCount);

  const filteredProjects = projectsList.filter(p => filterStatus === 'all' || p.status === filterStatus);

  // Dynamic status mapping classes
  const statusBadgeClasses = {
    'On Track': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    'At Risk': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    'Delayed': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
  };

  const statusDotClasses = {
    'On Track': 'bg-emerald-500',
    'At Risk': 'bg-amber-500',
    'Delayed': 'bg-rose-500'
  };

  // theme classes
  const textTitleClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardBgClass = isDark ? 'bg-[#0f1022] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-xs';
  const innerBgClass = isDark ? 'bg-[#141624]/60' : 'bg-slate-50';
  const borderClass = isDark ? 'border-slate-800/60' : 'border-slate-200';

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight m-0 ${textTitleClass}`}>Projects Health & Overview</h1>
          <p className={`${textMutedClass} text-xs mt-1`}>Consolidated dashboard of active development tracks, milestone statuses, and blockers.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-center">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-shrink-0">
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>Total Tracks</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none ${textTitleClass}`}>{activeCount}</h2>
            <span className="text-[10px] text-slate-500 font-semibold">Active</span>
          </div>
        </div>
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider text-emerald-500`}>On Track</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none text-emerald-500`}>{onTrackCount}</h2>
            <span className="text-[10px] text-slate-500 font-semibold">{Math.round((onTrackCount / activeCount) * 100)}%</span>
          </div>
        </div>
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider text-amber-500`}>At Risk</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none text-amber-500`}>{atRiskCount}</h2>
            <span className="text-[10px] text-slate-500 font-semibold">{Math.round((atRiskCount / activeCount) * 100)}%</span>
          </div>
        </div>
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider text-rose-500`}>Delayed</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none text-rose-500`}>{delayedCount}</h2>
            <span className="text-[10px] text-slate-500 font-semibold">{Math.round((delayedCount / activeCount) * 100)}%</span>
          </div>
        </div>
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>Avg Progress</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none ${textTitleClass}`}>{averageCompletion}%</h2>
            <span className="text-[10px] text-slate-500 font-semibold">Total</span>
          </div>
        </div>
        <div className={`border p-4 rounded-xl flex flex-col justify-between ${cardBgClass}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>Budget Health</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <h2 className={`text-2xl font-bold leading-none ${textTitleClass}`}>${Math.round(totalBudgetUsed / 1000)}k</h2>
            <span className="text-[10px] text-slate-500 font-semibold">of ${Math.round(totalBudget / 1000)}k</span>
          </div>
        </div>
      </div>

      {/* Charts Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
        
        {/* Total Progress Radial Ring */}
        <div className={`border p-6 rounded-2xl flex flex-col ${cardBgClass}`}>
          <h3 className={`text-sm font-bold ${textTitleClass} mb-4`}>Status Distribution</h3>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="flex items-center justify-center relative flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke={isDark ? '#1c1e30' : '#e2e8f0'} strokeWidth="9" fill="transparent" />
                {/* On Track Segment: 58.3% */}
                <circle cx="64" cy="64" r="54" stroke="#10b981" strokeWidth="9" fill="transparent" strokeDasharray="197 339" strokeDashoffset="0" strokeLinecap="round" />
                {/* At Risk Segment: 25% */}
                <circle cx="64" cy="64" r="54" stroke="#f59e0b" strokeWidth="9" fill="transparent" strokeDasharray="85 339" strokeDashoffset="-197" strokeLinecap="round" />
                {/* Delayed Segment: 16.7% */}
                <circle cx="64" cy="64" r="54" stroke="#ef4444" strokeWidth="9" fill="transparent" strokeDasharray="57 339" strokeDashoffset="-282" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${textTitleClass}`}>{averageCompletion}%</span>
                <span className={`text-[8.5px] font-bold uppercase tracking-wider ${textMutedClass}`}>Total</span>
              </div>
            </div>
             <div className="space-y-2.5 w-full max-w-[130px]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />On Track</span>
                <span className={textTitleClass}>{onTrackCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />At Risk</span>
                <span className={textTitleClass}>{atRiskCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />Delayed</span>
                <span className={textTitleClass}>{delayedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Line Chart */}
        <div className={`border p-6 rounded-2xl flex flex-col justify-between lg:col-span-2 ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <span className={`text-xs font-bold uppercase tracking-wider ${textMutedClass}`}>Workspace Milestones Timeline</span>
            <div className={`flex p-0.5 rounded-lg border text-[10px] font-bold ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {(['week', 'month', 'quarter'] as const).map(p => (
                <button key={p} onClick={() => setTimePeriod(p)} className={`px-2 py-0.5 rounded capitalize ${timePeriod === p ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[120px] relative rounded-xl p-2">
            {/* Custom Tooltip */}
            <div className={`absolute left-[54%] top-[12%] border shadow-xl rounded-lg px-2.5 py-1 z-10 flex flex-col items-center backdrop-blur-md ${isDark ? 'bg-[#0f1022]/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
              <span className={`text-[8px] font-bold uppercase tracking-wider ${textMutedClass}`}>Current Health</span>
              <span className="text-xs font-extrabold mt-0.5 text-indigo-500 dark:text-indigo-400">Stable (68%)</span>
            </div>

            <svg className="w-full h-full" viewBox="0 0 500 120" fill="none">
              {/* Grid Lines */}
              <line x1="40" y1="15" x2="480" y2="15" stroke={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} strokeDasharray="3" />
              <line x1="40" y1="50" x2="480" y2="50" stroke={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} strokeDasharray="3" />
              <line x1="40" y1="85" x2="480" y2="85" stroke={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} strokeDasharray="3" />
              
              <text x="15" y="20" fill="#64748b" className="text-[8px] font-bold">100%</text>
              <text x="15" y="55" fill="#64748b" className="text-[8px] font-bold">50%</text>
              <text x="15" y="90" fill="#64748b" className="text-[8px] font-bold">0%</text>

              {/* Gradient overlay */}
              <defs>
                <linearGradient id="chartOverlay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d="M 40 90 C 100 80, 150 70, 200 62 C 250 55, 300 40, 350 35 C 400 28, 450 20, 480 15 L 480 100 L 40 100 Z" fill="url(#chartOverlay)" />
              <path d="M 40 90 C 100 80, 150 70, 200 62 C 250 55, 300 40, 350 35 C 400 28, 450 20, 480 15" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_2px_6px_rgba(99,102,241,0.3)]" />
              
              <circle cx="350" cy="35" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Detailed Projects catalog table */}
      <div className={`border p-6 rounded-2xl flex flex-col ${cardBgClass} flex-1 min-h-[300px]`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
          <div>
            <h3 className={`text-sm font-bold ${textTitleClass}`}>Active Development Catalog</h3>
            <p className={`${textMutedClass} text-[10px] mt-0.5`}>Individual project progress meters, budgets, and links to task boards.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className={textMutedClass}>Filter Health:</span>
            <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {(['all', 'On Track', 'At Risk', 'Delayed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2 py-0.5 rounded ${filterStatus === status ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${textMutedClass} ${borderClass}`}>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Overall Progress</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4">Lead Owner</th>
                <th className="py-3 px-4">Tasks Sync</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Budget Sync</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
              {filteredProjects.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors`}>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 font-mono text-[10px] text-slate-400 font-bold">{p.progress}%</span>
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div className={`h-full rounded-full ${
                          p.status === 'On Track' ? 'bg-emerald-500' :
                          p.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold inline-flex items-center gap-1.5 ${statusBadgeClasses[p.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotClasses[p.status]} animate-pulse`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img src={p.ownerAvatar} alt={p.ownerName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">{p.ownerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 font-bold">{p.tasksCompleted} / {p.tasksTotal}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">{p.dueDate}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 font-bold">
                    ${Math.round(p.budgetUsed / 1000)}k <span className="opacity-45">/ ${Math.round(p.budgetTotal / 1000)}k</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate('/projects')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${
                        isDark 
                          ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10' 
                          : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      Open Board <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs italic text-slate-500">No projects match the selected health filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Milestones checklist & Blocker risk registers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
        
        {/* Milestone checklist card */}
        <div className={`border p-6 rounded-2xl flex flex-col justify-between ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-sm font-bold ${textTitleClass}`}>Upcoming Milestones</h3>
            <span className="text-[10px] font-semibold text-slate-500">Jul 2026 Target</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[140px] pr-1">
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border ${innerBgClass} ${borderClass}`}>
                <div className="flex items-center space-x-2.5 min-w-0">
                  {m.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-bold truncate ${m.status === 'completed' ? 'line-through opacity-50' : ''} ${textTitleClass}`}>{m.title}</span>
                    <span className="text-[9px] text-slate-500 font-semibold truncate">{m.project}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  m.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'
                }`}>{m.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Register Block */}
        <div className={`border p-6 rounded-2xl flex flex-col justify-between ${cardBgClass}`}>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className={`text-sm font-bold ${textTitleClass}`}>Active Risk Log</h3>
            <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Dev Blockers</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[140px] pr-1">
            {risks.map((r, i) => (
              <div key={i} className={`p-2.5 rounded-xl border ${innerBgClass} ${borderClass} space-y-1.5`}>
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{r.project}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                      r.severity === 'High' ? 'bg-rose-500/10 text-rose-500' :
                      r.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                    }`}>{r.severity}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                      r.status === 'Mitigated' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500 animate-pulse'
                    }`}>{r.status}</span>
                  </div>
                </div>
                <p className="text-[10.5px] leading-normal text-slate-500 font-semibold">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProjectsOverview;
