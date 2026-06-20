import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, FileCheck, CheckCircle2, Clock, Calendar, CheckSquare, Plus, Sparkles, LogIn } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  status: string;
  email: string;
}

interface OnboardingTask {
  id: string;
  title: string;
  completed: boolean;
}

interface TimesheetEntry {
  project: string;
  hours: number;
  description: string;
  date: string;
}

export const Team: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'timesheets' | 'kpis'>('directory');

  // Directory state
  const [members, setMembers] = useState<Member[]>([
    { name: 'Kavya Chopra', role: 'Director', status: 'Active', email: 'kavya.chopra@genessence.com' },
    { name: 'Ankit Sharma', role: 'Project Lead', status: 'Active', email: 'ankit.sharma@genessence.com' },
    { name: 'Rahul Sharma', role: 'Engineer', status: 'Active', email: 'rahul.sharma@genessence.com' }
  ]);

  // Onboarding state
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([
    { id: 'o-1', title: 'Complete compliance documents onboarding', completed: true },
    { id: 'o-2', title: 'Configure G-OS Slack syncing node client', completed: false },
    { id: 'o-3', title: 'Verify repository access tokens', completed: false }
  ]);

  // Timesheets state
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([
    { project: 'Integrations Hub', hours: 4, description: 'Created OAuth client configurations and endpoints', date: 'May 20, 2025' },
    { project: 'Core Layer', hours: 4, description: 'Configured folder boilerplate structure', date: 'May 19, 2025' }
  ]);
  const [newProject, setNewProject] = useState('Core Layer');
  const [newHours, setNewHours] = useState('4');
  const [newDesc, setNewDesc] = useState('');

  const toggleOnboarding = (id: string) => {
    setOnboardingTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: TimesheetEntry = {
      project: newProject,
      hours: Number(newHours) || 4,
      description: newDesc,
      date: 'Today'
    };
    setTimesheets([entry, ...timesheets]);
    setNewDesc('');
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>HR, People & Culture</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure Onboarding checklists, log timesheets, and review target KPIs.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/60 text-xs">
        <button 
          onClick={() => setActiveTab('directory')}
          className={`pb-3 px-4 font-semibold border-b-2 transition-all ${activeTab === 'directory' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          People Directory
        </button>
        <button 
          onClick={() => setActiveTab('onboarding')}
          className={`pb-3 px-4 font-semibold border-b-2 transition-all ${activeTab === 'onboarding' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Onboarding Tracks
        </button>
        <button 
          onClick={() => setActiveTab('timesheets')}
          className={`pb-3 px-4 font-semibold border-b-2 transition-all ${activeTab === 'timesheets' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Timesheets Logger
        </button>
        <button 
          onClick={() => setActiveTab('kpis')}
          className={`pb-3 px-4 font-semibold border-b-2 transition-all ${activeTab === 'kpis' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Performance KPIs
        </button>
      </div>

      {/* Directory Tab View */}
      {activeTab === 'directory' && (
        <div className="bg-[#101220] border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-850 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Employee Directory</h3>
            <button className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer">
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/40">
            {members.map((member, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-900/10 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-sm">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{member.name}</h4>
                    <span className="text-[10px] text-slate-400 block">{member.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-3 sm:mt-0 justify-between sm:justify-end">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{member.role}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding Tab View */}
      {activeTab === 'onboarding' && (
        <div className="bg-[#101220] border border-slate-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">My Onboarding Track</h3>
            <span className="text-xs text-indigo-400 font-semibold">
              Progress: {onboardingTasks.filter(t => t.completed).length}/{onboardingTasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {onboardingTasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => toggleOnboarding(task.id)}
                className="flex items-center space-x-3 p-4 bg-[#141624]/40 border border-slate-800/50 rounded-xl cursor-pointer hover:bg-[#1b1e32]/45 transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => {}} // Done inside parent click
                  className="rounded border-slate-800 bg-[#0c0d14] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" 
                />
                <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timesheets Logger Tab */}
      {activeTab === 'timesheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#101220] border border-slate-800/60 p-6 rounded-2xl space-y-4 h-fit">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Log Hours</h3>
            <form onSubmit={handleAddTimesheet} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project</label>
                <select 
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option>Core Layer</option>
                  <option>Integrations Hub</option>
                  <option>Frontend UI</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hours Worked</label>
                <input 
                  type="number"
                  required
                  min={1}
                  max={24}
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What tasks were completed..."
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Log Entry
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#101220] border border-slate-800/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Recent Logs</h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {timesheets.map((entry, idx) => (
                <div key={idx} className="p-4 bg-[#141624]/40 border border-slate-800/50 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{entry.project}</span>
                    <h4 className="text-xs font-semibold text-white">{entry.description}</h4>
                    <span className="text-[10px] text-slate-500 block">{entry.date}</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/40">
                    {entry.hours} hrs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance KPIs Tab View */}
      {activeTab === 'kpis' && (
        <div className="bg-[#101220] border border-slate-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Performance metrics</h3>
            <span className="text-xs text-indigo-400 font-semibold">Q2 Target Cycle</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#141624]/30 border border-slate-800/40 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 font-mono">Code Integration Rate</span>
                <span className="font-bold text-emerald-450">92%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="bg-[#141624]/30 border border-slate-800/40 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 font-mono">MoM Transcription Accuracy</span>
                <span className="font-bold text-indigo-400">98%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Team;
