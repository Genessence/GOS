import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Coffee, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WorkEntry {
  id: string;
  project: string;
  task: string;
  description: string;
  hours: number;
  date: string;
}

export const Timesheets: React.FC = () => {
  const { theme } = useAuth();
  
  // Timer States
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [breakTime, setBreakTime] = useState(0); // in seconds
  
  // Static work entries with default realistic logs
  const [entries, setEntries] = useState<WorkEntry[]>([
    {
      id: 'w-1',
      project: 'Integrations Hub',
      task: 'OAuth Client Setup',
      description: 'Completed OAuth client configurations, scopes, and token endpoints validation.',
      hours: 4.5,
      date: 'Today, Jun 24'
    },
    {
      id: 'w-2',
      project: 'Core Platform',
      task: 'Navigation Redesign',
      description: 'Polished navigation animations and fixed dynamic routes layout in GlobalLayout.',
      hours: 2.0,
      date: 'Today, Jun 24'
    },
    {
      id: 'w-3',
      project: 'Genessence Calendar',
      task: 'MoM Meeting Summary',
      description: 'Implemented Google Meet transcript parser and AI summarization trigger logic.',
      hours: 8.0,
      date: 'Yesterday, Jun 23'
    },
    {
      id: 'w-4',
      project: 'Core Platform',
      task: 'Auth Timeout Fix',
      description: 'Increased login session auth timeout to 30s to allow slower Render service spin-ups.',
      hours: 5.5,
      date: 'Mon, Jun 22'
    }
  ]);

  // Form States
  const [formProject, setFormProject] = useState('Core Platform');
  const [formTask, setFormTask] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formHours, setFormHours] = useState('2');

  // Elapsed Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (isClockedIn && isOnBreak) {
      interval = setInterval(() => {
        setBreakTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, isOnBreak]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      // Clocking out: reset timer and optionally add work log
      setIsClockedIn(false);
      setIsOnBreak(false);
      // Auto-populate hours in form for easy logging
      const hoursLogged = (elapsedTime / 3600).toFixed(1);
      setFormHours(hoursLogged === '0.0' ? '1' : hoursLogged);
      setFormTask('Work shift log');
      setFormDesc('Completed scheduled daily engineering activities.');
    } else {
      setIsClockedIn(true);
      setElapsedTime(0);
      setBreakTime(0);
    }
  };

  const handleBreakToggle = () => {
    if (isClockedIn) {
      setIsOnBreak(!isOnBreak);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: WorkEntry = {
      id: `w-${Date.now()}`,
      project: formProject,
      task: formTask,
      description: formDesc,
      hours: parseFloat(formHours) || 2,
      date: 'Today, Jun 24'
    };
    setEntries([newEntry, ...entries]);
    setFormTask('');
    setFormDesc('');
    setFormHours('2');
  };

  // Helper values for totals
  const totalLoggedHours = entries
    .filter(e => e.date.includes('Today') || e.date.includes('Jun 24'))
    .reduce((sum, e) => sum + e.hours, 0);

  const weeklyHours = entries.reduce((sum, e) => sum + e.hours, 0) + 18.0; // static base + logged
  const monthlyHours = weeklyHours + 112.5;
  const overtimeHours = weeklyHours > 40 ? (weeklyHours - 40).toFixed(1) : '0.0';

  const isDark = theme === 'dark';

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2.5">
            <Clock className="w-6 h-6 text-indigo-500" />
            <span>Timesheets Logger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log your daily project hours, manage active timers, and track weekly velocity metrics.
          </p>
        </div>
        <div className={`flex items-center space-x-2 text-xs border px-3.5 py-2 rounded-2xl ${
          isDark ? 'bg-[#101220] border-slate-850' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-slate-400">Payroll Cycle: Jun 15 - Jun 30</span>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Today's Hours", val: `${totalLoggedHours.toFixed(1)} hrs`, sub: "Goal: 8.0 hrs", color: "from-blue-500 to-indigo-600" },
          { title: "Weekly Hours", val: `${weeklyHours.toFixed(1)} hrs`, sub: "Goal: 40.0 hrs", color: "from-violet-500 to-purple-600" },
          { title: "Monthly Hours", val: `${monthlyHours.toFixed(1)} hrs`, sub: "15 days remaining", color: "from-fuchsia-500 to-pink-600" },
          { title: "Overtime Hours", val: `${overtimeHours} hrs`, sub: "1.5x payroll multiplier", color: "from-amber-500 to-orange-600" },
          { title: "Pending Approval", val: "2 entries", sub: "Manager review required", color: "from-teal-500 to-emerald-600" }
        ].map((card, idx) => (
          <div key={idx} className={`p-4.5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</h4>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-xl font-bold tracking-tight">{card.val}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Clock timer & log hours */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Clock In / Out Widget */}
          <div className={`p-6 rounded-2xl border relative overflow-hidden flex flex-col items-center text-center ${
            isDark 
              ? 'bg-[#101220] border-slate-800/60 shadow-xl' 
              : 'bg-white border-slate-200/80 shadow-md shadow-slate-100'
          }`}>
            {/* Visual background gradient pulse when active */}
            {isClockedIn && !isOnBreak && (
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse pointer-events-none" />
            )}
            
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shift Tracker</span>
            
            {/* Live Timer Display */}
            <div className="font-mono text-3xl font-extrabold tracking-tight mt-1 mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {formatTime(elapsedTime)}
            </div>

            {/* Break Indicator */}
            {isOnBreak ? (
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1 mb-4 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Coffee className="w-3 h-3" />
                <span>On Break ({formatTime(breakTime)})</span>
              </div>
            ) : isClockedIn ? (
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1 mb-4 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping mr-1" />
                <span>Active Duty</span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1 mb-4 bg-slate-150/10 px-2.5 py-1 rounded-full">
                <span>Not Clocked In</span>
              </div>
            )}

            {/* Actions Buttons */}
            <div className="flex w-full space-x-3 mt-2">
              <button 
                onClick={handleClockToggle}
                className={`flex-1 py-3 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  isClockedIn 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/15' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
              </button>

              {isClockedIn && (
                <button 
                  onClick={handleBreakToggle}
                  className={`px-4 py-3 text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                    isOnBreak 
                      ? 'bg-amber-600 hover:bg-amber-500 border-amber-600 text-white' 
                      : isDark
                        ? 'bg-slate-800 hover:bg-slate-750 border-slate-700/60 text-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                  }`}
                  title={isOnBreak ? 'Resume shift' : 'Take a break'}
                >
                  <Coffee className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Log Manual Hours</span>
            </h3>
            
            <form onSubmit={handleAddEntry} className="space-y-4.5 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
                <select 
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-805 focus:border-indigo-500'
                  }`}
                >
                  <option>Core Platform</option>
                  <option>Integrations Hub</option>
                  <option>Genessence Calendar</option>
                  <option>Timesheet Engine</option>
                  <option>Client Pitch deck</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Task Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Design review"
                  value={formTask}
                  onChange={(e) => setFormTask(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-805 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Describe your progress..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none resize-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-805 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hours Spent</label>
                <input 
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  required
                  value={formHours}
                  onChange={(e) => setFormHours(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-805 focus:border-indigo-500'
                  }`}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/15"
              >
                Log Entry
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Recent logs list */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-2xl border flex flex-col h-full ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daily Work Logs</h3>
                <p className="text-[10px] text-slate-400 mt-1">Review recently logged work entries for this cycle.</p>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-sync active</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all hover:translate-x-1 ${
                    isDark 
                      ? 'bg-[#141624]/40 border-slate-800/50 hover:bg-[#1b1e32]/40' 
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50 shadow-sm shadow-slate-100/50'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        {entry.project}
                      </span>
                      <span className="text-[10px] text-slate-455 font-medium">{entry.date}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{entry.task}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{entry.description}</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end md:flex-col gap-2">
                    <span className="text-xs font-bold text-white bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/30 whitespace-nowrap">
                      {entry.hours} hrs
                    </span>
                    <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider text-center">
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center border-t border-slate-850 pt-4 mt-auto">
              <button className="text-xs text-indigo-400 hover:text-indigo-350 font-bold flex items-center space-x-1 cursor-pointer">
                <span>View Full Timesheet History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default Timesheets;
