import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Flame, 
  Target, 
  Heart,
  ChevronRight,
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Performance: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  // Static performance data
  const performanceKPIs = {
    score: 4.5,
    maxScore: 5.0,
    attendance: 98,
    completion: 92,
    ranking: "3 / 48"
  };

  const okrs = [
    { goal: "Finish G-OS Dashboard implementation", progress: 80, deadline: "Jun 30, 2026", track: "Core UI" },
    { goal: "Optimise auth session start times to under 30s", progress: 100, deadline: "Completed", track: "Infrastructure" },
    { goal: "Implement Timesheet & Leave Router mapping", progress: 95, deadline: "Jun 28, 2026", track: "Core UI" }
  ];

  const badges = [
    { title: "Employee of the Month", icon: "🏆", desc: "For exceptional velocity and design polish.", date: "May 2026", color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30" },
    { title: "Attendance Champion", icon: "🔥", desc: "Maintained a perfect 98% attendance rating.", date: "Q1 2026", color: "from-rose-500/20 to-orange-500/10 text-rose-450 border-rose-500/30" },
    { title: "Best Performer", icon: "⭐", desc: "Maintained a 4.5+ manager performance score.", date: "H1 2026", color: "from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30" },
    { title: "Innovation Award", icon: "💡", desc: "Pioneered G-OS automated transcript summarizing.", date: "Apr 2026", color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30" }
  ];

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2.5">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            <span>Performance & KPIs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your professional quarterly achievements, evaluate target OKRs, and review feedback reports.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Performance Score", val: `${performanceKPIs.score} / ${performanceKPIs.maxScore}`, sub: "Cycle: Q2 Target", icon: <Award className="w-5 h-5 text-amber-400" /> },
          { title: "Attendance Score", val: `${performanceKPIs.attendance}%`, sub: "Goal: 95.0% min", icon: <Flame className="w-5 h-5 text-rose-500" /> },
          { title: "Task Completion", val: `${performanceKPIs.completion}%`, sub: "12 of 13 cards closed", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
          { title: "Team Ranking", val: `#${performanceKPIs.ranking}`, sub: "Top 10 percentile", icon: <Sparkles className="w-5 h-5 text-indigo-400" /> }
        ].map((card, idx) => (
          <div key={idx} className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</h4>
              <span className="text-xl font-bold tracking-tight block mt-2">{card.val}</span>
              <p className="text-[10px] text-slate-500 font-medium mt-1">{card.sub}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-[#141624]/60 border border-slate-800/40' : 'bg-slate-50 border border-slate-200'}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Graph and circular metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Performance Line Graph */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className={`border-b pb-4 mb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
            <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'} uppercase tracking-wider`}>Performance Trend Graph</h3>
            <p className="text-[10px] text-slate-400 mt-1">Monthly performance progression score chart</p>
          </div>

          {/* SVG Canvas for dependency-free Line Chart */}
          <div className="relative w-full h-56 mt-2 flex items-center justify-center">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="20" x2="450" y2="20" stroke="#334155" strokeDasharray="3,3" strokeOpacity="0.25"/>
              <line x1="50" y1="70" x2="450" y2="70" stroke="#334155" strokeDasharray="3,3" strokeOpacity="0.25"/>
              <line x1="50" y1="120" x2="450" y2="120" stroke="#334155" strokeDasharray="3,3" strokeOpacity="0.25"/>
              <line x1="50" y1="170" x2="450" y2="170" stroke="#334155" strokeOpacity="0.4"/>

              {/* Chart Data Area Fill (January: 4.2 -> February: 4.5 -> March: 4.8) */}
              {/* x-coords: Jan=100, Feb=250, Mar=400 */}
              {/* y-coords (score scale 0-5 => y-coord = 170 - (score * 30)): Jan(4.2)=44, Feb(4.5)=35, Mar(4.8)=26 */}
              <path 
                d="M 100 170 L 100 44 L 250 35 L 400 26 L 400 170 Z" 
                fill="url(#chartGrad)"
              />

              {/* Chart Line */}
              <path 
                d="M 100 44 L 250 35 L 400 26" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* January Dot & Label */}
              <circle cx="100" cy="44" r="5.5" fill="#818cf8" stroke="#4f46e5" strokeWidth="2.5"/>
              <text x="100" y="24" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">4.2 / 5</text>
              <text x="100" y="185" fill="#64748b" fontSize="10" fontWeight="semibold" textAnchor="middle">January</text>

              {/* February Dot & Label */}
              <circle cx="250" cy="35" r="5.5" fill="#818cf8" stroke="#4f46e5" strokeWidth="2.5"/>
              <text x="250" y="15" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">4.5 / 5</text>
              <text x="250" y="185" fill="#64748b" fontSize="10" fontWeight="semibold" textAnchor="middle">February</text>

              {/* March Dot & Label */}
              <circle cx="400" cy="26" r="5.5" fill="#818cf8" stroke="#4f46e5" strokeWidth="2.5"/>
              <text x="400" y="6" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">4.8 / 5</text>
              <text x="400" y="185" fill="#64748b" fontSize="10" fontWeight="semibold" textAnchor="middle">March</text>
            </svg>
          </div>
        </div>

        {/* Circular Progress Gauges */}
        <div className={`p-6 rounded-2xl border flex flex-col ${
          isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className={`border-b pb-4 mb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
            <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'} uppercase tracking-wider`}>Metrics Overview</h3>
            <p className="text-[10px] text-slate-400 mt-1">Detailed metric breakdowns</p>
          </div>

          <div className="flex-1 flex flex-col justify-around py-2 gap-4">
            {/* Task Completion Gauge */}
            <div className={`flex items-center space-x-4 p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/15 border-slate-800/30' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Circular Ring SVG */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="4.5" fill="transparent" />
                  <circle cx="28" cy="28" r="24" stroke="#34d399" strokeWidth="4.5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - 0.92)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute text-[10px] font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>92%</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold">Task Completion %</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Completed: 92% | Pending: 8%</p>
              </div>
            </div>

            {/* Attendance Score Gauge */}
            <div className={`flex items-center space-x-4 p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/15 border-slate-800/30' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="4.5" fill="transparent" />
                  <circle cx="28" cy="28" r="24" stroke="#818cf8" strokeWidth="4.5" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - 0.98)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute text-[10px] font-bold font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>98%</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold">Attendance Rate</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Current Rate: 98% (Target: 95%)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Goals, badges & reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goals & OKRs */}
        <div className={`p-6 rounded-2xl border flex flex-col ${
          isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-3 mb-4 flex items-center space-x-2 ${
            isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'
          }`}>
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Goals & OKRs</span>
          </h3>

          <div className="space-y-4 flex-1">
            {okrs.map((okr, idx) => (
              <div key={idx} className={`space-y-2 p-3 rounded-xl border ${
                isDark ? 'bg-[#141624]/40 border-slate-800/40' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold truncate pr-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{okr.goal}</span>
                  <span className="font-mono font-bold text-indigo-400">{okr.progress}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                  <div className="h-full bg-indigo-500" style={{ width: `${okr.progress}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-1">
                  <span>Track: {okr.track}</span>
                  <span>Due: {okr.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manager feedback Monthly Report */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-3 mb-4 flex items-center space-x-2 ${
            isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'
          }`}>
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Monthly Performance Report</span>
          </h3>
          
          <div className={`flex-1 p-4 rounded-xl border-l-4 border-l-indigo-500 relative flex flex-col justify-center leading-relaxed ${
            isDark ? 'bg-slate-900/10 border-slate-800/30' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-3xl text-indigo-500/20 absolute top-2 left-2 font-serif">“</span>
            <p className={`text-xs italic font-medium relative z-10 pl-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Excellent work on dashboard development. Commendable velocity and attention to detail during the calendar integration phase. Keep up the high standard.
            </p>
            <div className="mt-4 pl-2 flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-bold block ${isDark ? 'text-white' : 'text-slate-800'}`}>Ankit Sharma</span>
                <span className="text-[9px] text-slate-500 font-semibold block uppercase">Project Lead</span>
              </div>
              <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold uppercase">June 2026</span>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className={`p-6 rounded-2xl border flex flex-col ${
          isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-3 mb-4 flex items-center space-x-2 ${
            isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'
          }`}>
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Achievements & Badges</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {badges.map((badge, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border bg-gradient-to-br flex flex-col justify-between items-start transition-all hover:-translate-y-0.5 hover:shadow-lg ${badge.color}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{badge.icon}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide opacity-80 ${
                    isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-900/5 text-slate-600'
                  }`}>{badge.date}</span>
                </div>
                <div className="mt-2.5">
                  <h4 className={`text-[10px] font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{badge.title}</h4>
                  <p className={`text-[8px] leading-normal mt-0.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Performance;
