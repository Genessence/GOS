import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Upload, 
  ChevronRight, 
  User, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  attachment?: string;
  workflowStep: 'Manager' | 'Director' | 'Completed';
}

interface CalendarDay {
  dayNum: number;
  onLeave?: { name: string; type: string; color: string }[];
}

export const Leaves: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  // Leave balances
  const balances = {
    casual: { used: 6, total: 12 },
    sick: { used: 4, total: 10 },
    earned: { used: 10, total: 15 }
  };

  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([
    {
      id: 'l-1',
      type: 'Earned Leave',
      startDate: '2026-07-10',
      endDate: '2026-07-15',
      duration: 5,
      reason: 'Family wedding out of town.',
      status: 'Pending',
      workflowStep: 'Director'
    },
    {
      id: 'l-2',
      type: 'Sick Leave',
      startDate: '2026-06-08',
      endDate: '2026-06-09',
      duration: 2,
      reason: 'Dental wisdom tooth extraction recovery.',
      status: 'Approved',
      workflowStep: 'Completed',
      attachment: 'medical_cert.pdf'
    },
    {
      id: 'l-3',
      type: 'Work From Home',
      startDate: '2026-05-18',
      endDate: '2026-05-18',
      duration: 1,
      reason: 'Home router maintenance schedule.',
      status: 'Approved',
      workflowStep: 'Completed'
    }
  ]);

  // Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  // Stats
  const pendingCount = leaveHistory.filter(l => l.status === 'Pending').length;
  const totalAvailable = (balances.casual.total - balances.casual.used) +
                         (balances.sick.total - balances.sick.used) +
                         (balances.earned.total - balances.earned.used);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const duration = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: `l-${Date.now()}`,
      type: leaveType,
      startDate,
      endDate,
      duration,
      reason,
      status: 'Pending',
      workflowStep: 'Manager',
      attachment: fileName || undefined
    };

    setLeaveHistory([newRequest, ...leaveHistory]);
    setStartDate('');
    setEndDate('');
    setReason('');
    setFileName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Static Leaves Calendar Data for June 2026
  const juneCalendarDays: CalendarDay[] = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    let onLeave = undefined;
    if (dayNum === 12) {
      onLeave = [{ name: 'Ankit Sharma', type: 'Casual', color: 'bg-indigo-500' }];
    } else if (dayNum === 24 || dayNum === 25) {
      onLeave = [{ name: 'Rahul Sharma', type: 'WFH', color: 'bg-emerald-500' }];
    } else if (dayNum === 19) {
      onLeave = [{ name: 'Kavya Chopra', type: 'Earned', color: 'bg-rose-500' }];
    }
    return { dayNum, onLeave };
  });

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2.5">
            <FileText className="w-6 h-6 text-indigo-500" />
            <span>Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track leave balances, submit leave requests, view approvals, and see who is out of office.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { title: "Available Leaves", val: `${totalAvailable} days`, sub: "Total balance remaining", style: "from-blue-500 to-indigo-600" },
          { title: "Casual Leaves", val: `${balances.casual.total - balances.casual.used} / ${balances.casual.total}`, sub: "Used: 6 days", style: "from-violet-500 to-purple-600" },
          { title: "Sick Leaves", val: `${balances.sick.total - balances.sick.used} / ${balances.sick.total}`, sub: "Used: 4 days", style: "from-rose-500 to-pink-600" },
          { title: "Earned Leaves", val: `${balances.earned.total - balances.earned.used} / ${balances.earned.total}`, sub: "Used: 10 days", style: "from-amber-500 to-orange-600" },
          { title: "Pending Requests", val: `${pendingCount} pending`, sub: "Manager workflow loop", style: "from-teal-500 to-emerald-600" }
        ].map((card, idx) => (
          <div key={idx} className={`p-4 sm:p-5 rounded-2xl border transition-all ${
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

      {/* Balance tracker & Application form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Apply Form & Balances */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Leave Balances Circular Tracker */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <h3 className={`text-xs font-bold ${isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'} uppercase tracking-wider border-b pb-2 mb-4 flex items-center space-x-2`}>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Leave Balance Tracker</span>
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Casual Leave", val: `${balances.casual.total - balances.casual.used}/${balances.casual.total}`, percent: ((balances.casual.total - balances.casual.used) / balances.casual.total) * 100, barColor: "bg-indigo-500", info: "Short notice/personal work" },
                { name: "Sick Leave", val: `${balances.sick.total - balances.sick.used}/${balances.sick.total}`, percent: ((balances.sick.total - balances.sick.used) / balances.sick.total) * 100, barColor: "bg-rose-500", info: "Medical emergencies" },
                { name: "Earned Leave", val: `${balances.earned.total - balances.earned.used}/${balances.earned.total}`, percent: ((balances.earned.total - balances.earned.used) / balances.earned.total) * 100, barColor: "bg-emerald-500", info: "Accrued vacation balance" }
              ].map((bal, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-900/10 border border-slate-800/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{bal.name}</span>
                    <span className="font-bold text-indigo-400 font-mono">{bal.val} left</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${bal.barColor}`} style={{ width: `${bal.percent}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block font-medium mt-1">{bal.info}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Application Form */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <h3 className={`text-xs font-bold ${isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'} uppercase tracking-wider border-b pb-2 mb-4 flex items-center space-x-2`}>
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Request Leave</span>
            </h3>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Leave Type</label>
                <select 
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Work From Home</option>
                  <option>Maternity Leave</option>
                  <option>Paternity Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                  <input 
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reason</label>
                <textarea 
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for leave request..."
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none resize-none transition-all ${
                    isDark 
                      ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attachment (Optional)</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition-all relative ${
                  isDark ? 'border-slate-800 hover:bg-slate-900/10' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 block font-medium truncate">
                    {fileName ? fileName : 'Upload medical certificate or documents'}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/15"
              >
                Submit Leave Request
              </button>
            </form>

          </div>

        </div>

        {/* Right Column: Leave Calendar & Leave History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* June 2026 Leave Calendar */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <div>
                <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'} uppercase tracking-wider`}>Leave Calendar</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">June 2026 Out of Office schedule</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-bold">
                <div className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span>Casual</span></div>
                <div className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /><span>Sick</span></div>
                <div className="flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>WFH</span></div>
              </div>
            </div>

            {/* Calendar Grid (30 Days) */}
            <div className="grid grid-cols-7 gap-1 text-center border-t border-l border-slate-800/20">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
                <div key={w} className="py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/10 border-r border-b border-slate-800/20">{w}</div>
              ))}
              {juneCalendarDays.map((day, idx) => (
                <div key={idx} className={`h-11 p-1 flex flex-col items-start justify-between border-r border-b border-slate-800/20 relative ${
                  day.onLeave ? (isDark ? 'bg-slate-900/10' : 'bg-slate-50/50') : ''
                }`}>
                  <span className="text-[9px] font-mono text-slate-500 font-bold">{day.dayNum}</span>
                  {day.onLeave && (
                    <div className="w-full space-y-0.5 mt-0.5">
                      {day.onLeave.map((l, lIdx) => (
                        <div 
                          key={lIdx} 
                          className={`text-[8px] font-semibold text-white px-1 py-0.25 rounded truncate text-left flex items-center space-x-1 ${l.color} shadow-sm`}
                          title={`${l.name} - ${l.type}`}
                        >
                          <User className="w-1.5 h-1.5" />
                          <span className="truncate">{l.name.split(' ')[0]} ({l.type})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leave History Table */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
          }`}>
            <h3 className={`text-xs font-bold ${isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'} uppercase tracking-wider border-b pb-3 mb-4`}>Leave Request History</h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {leaveHistory.map((req) => (
                <div 
                  key={req.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all hover:bg-slate-900/5 ${
                    isDark ? 'bg-[#141624]/40 border-slate-800/50' : 'bg-slate-50 border-slate-200/65'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        {req.type}
                      </span>
                      <span className="text-[10px] text-slate-455 font-mono">
                        {req.startDate} to {req.endDate} ({req.duration} {req.duration === 1 ? 'day' : 'days'})
                      </span>
                    </div>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{req.reason}"</p>
                    
                    {/* Workflow status stepper */}
                    {req.status === 'Pending' && (
                      <div className={`flex items-center space-x-1 text-[9px] font-bold mt-2 p-2 rounded-lg border w-fit ${
                        isDark 
                          ? 'text-slate-400 bg-slate-900/20 border-slate-800/40' 
                          : 'text-slate-600 bg-slate-50 border-slate-200'
                      }`}>
                        <span>Workflow:</span>
                        <span className="text-indigo-400">Employee</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        <span className={req.workflowStep === 'Manager' ? 'text-indigo-400 font-bold underline' : 'text-slate-500'}>Manager</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        <span className={req.workflowStep === 'Director' ? 'text-indigo-400 font-bold underline' : 'text-slate-500'}>Director</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end md:flex-col gap-2.5">
                    {req.status === 'Approved' ? (
                      <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 border border-emerald-500/10">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                      </span>
                    ) : req.status === 'Pending' ? (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 border border-indigo-500/10">
                        <Clock className="w-3 h-3 mr-1 animate-pulse" /> Pending
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-450 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 border border-rose-500/10">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                      </span>
                    )}
                    {req.attachment && (
                      <span className="text-[8px] font-semibold text-slate-455 hover:text-indigo-400 cursor-pointer underline flex items-center">
                        <Info className="w-2.5 h-2.5 mr-0.5" /> {req.attachment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
export default Leaves;
