import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Check,
  Filter,
  ArrowLeft,
  ArrowRight,
  Star,
  UserCheck,
  UserX,
  ChevronLeft
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: 'Director' | 'Project Lead' | 'Engineer';
  status: 'Active' | 'On Leave' | 'Onboarding';
  email: string;
  department: string;
}

interface OnboardingTask {
  id: string;
  title: string;
  completed: boolean;
}

interface JobOpening {
  id: string;
  title: string;
  dept: string;
  status: 'Sourcing' | 'Interviewing' | 'Offer Phase' | 'Closed';
  applicants: number;
  type: 'Full-time' | 'Contract' | 'Remote';
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: string;
  roleId: string;
  stage: 'Sourcing' | 'Screening' | 'Technical' | 'Executive' | 'Offer';
  rating: number;
}

export const Team: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'hiring' | 'stats'>('directory');

  // Directory State
  const [members, setMembers] = useState<Member[]>([
    { id: 'm-1', name: 'Kavya Chopra', role: 'Director', status: 'Active', email: 'kavya.chopra@genessence.com', department: 'Executive' },
    { id: 'm-2', name: 'Ankit Sharma', role: 'Project Lead', status: 'Active', email: 'ankit.sharma@genessence.com', department: 'Core Engineering' },
    { id: 'm-3', name: 'Rahul Sharma', role: 'Engineer', status: 'Active', email: 'rahul.sharma@genessence.com', department: 'Core Engineering' },
    { id: 'm-4', name: 'Kavya Chopra', role: 'Engineer', status: 'Onboarding', email: 'kavya.chopra.dev@genessence.com', department: 'Core Engineering' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  
  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Director' | 'Project Lead' | 'Engineer'>('Engineer');
  const [inviteDept, setInviteDept] = useState('Core Engineering');

  // Onboarding Checklist State
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([
    { id: 'o-1', title: 'Sign legal compliance documents', completed: true },
    { id: 'o-2', title: 'Complete G-OS Slack synchronization onboarding configuration', completed: false },
    { id: 'o-3', title: 'Setup local development environments & database clones', completed: false },
    { id: 'o-4', title: 'Schedule introductory team synchronization call', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Hiring Tab State
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([
    { id: 'job-1', title: 'Senior Full Stack Engineer', dept: 'Core Engineering', status: 'Interviewing', applicants: 4, type: 'Full-time' },
    { id: 'job-2', title: 'AI Infrastructure Architect', dept: 'Research & Dev', status: 'Sourcing', applicants: 1, type: 'Full-time' },
    { id: 'job-3', title: 'Technical QA Lead', dept: 'Core Engineering', status: 'Offer Phase', applicants: 1, type: 'Full-time' },
    { id: 'job-4', title: 'Talent Acquisition Partner', dept: 'People Operations', status: 'Closed', applicants: 0, type: 'Contract' }
  ]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Core Engineering');
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Remote'>('Full-time');

  // Kanban Hiring Pipeline States
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 'c-1', name: 'Amit Patel', email: 'amit.patel@gmail.com', experience: '6 years', roleId: 'job-1', stage: 'Technical', rating: 5 },
    { id: 'c-2', name: 'Sarah Jenkins', email: 'sarah.j@outlook.com', experience: '4 years', roleId: 'job-1', stage: 'Screening', rating: 4 },
    { id: 'c-3', name: 'Rohan Das', email: 'rohan.das@yahoo.com', experience: '5 years', roleId: 'job-1', stage: 'Sourcing', rating: 4 },
    { id: 'c-4', name: 'Priya Sharma', email: 'priya.s@gmail.com', experience: '8 years', roleId: 'job-2', stage: 'Executive', rating: 5 },
    { id: 'c-5', name: 'Vikram Malhotra', email: 'vikram.m@techcorp.com', experience: '7 years', roleId: 'job-3', stage: 'Offer', rating: 5 },
    { id: 'c-6', name: 'Deepika Rao', email: 'deepika.rao@gmail.com', experience: '3 years', roleId: 'job-1', stage: 'Offer', rating: 4 }
  ]);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candExp, setCandExp] = useState('');
  const [candRating, setCandRating] = useState<number>(4);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatically dismiss toast notifications
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Directory filter logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    
    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Onboarding',
      department: inviteDept
    };

    setMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setShowInviteForm(false);
    setToastMessage(`Invitation sent to ${inviteName}!`);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      dept: jobDept,
      status: 'Sourcing',
      applicants: 0,
      type: jobType
    };

    setJobOpenings([newJob, ...jobOpenings]);
    setJobTitle('');
    setShowJobForm(false);
    setToastMessage(`Position "${jobTitle}" posted successfully!`);
  };

  const toggleOnboarding = (id: string) => {
    setOnboardingTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddOnboardingTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: OnboardingTask = {
      id: `o-${Date.now()}`,
      title: newTaskTitle,
      completed: false
    };

    setOnboardingTasks([...onboardingTasks, newTask]);
    setNewTaskTitle('');
    setToastMessage("Onboarding task added.");
  };

  // Pipeline transitions & actions
  const STAGES: ('Sourcing' | 'Screening' | 'Technical' | 'Executive' | 'Offer')[] = 
    ['Sourcing', 'Screening', 'Technical', 'Executive', 'Offer'];

  const handleAdvanceCandidate = (candId: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        const currIndex = STAGES.indexOf(c.stage);
        if (currIndex < STAGES.length - 1) {
          const nextStage = STAGES[currIndex + 1];
          return { ...c, stage: nextStage };
        }
      }
      return c;
    }));
  };

  const handleRegressCandidate = (candId: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candId) {
        const currIndex = STAGES.indexOf(c.stage);
        if (currIndex > 0) {
          const prevStage = STAGES[currIndex - 1];
          return { ...c, stage: prevStage };
        }
      }
      return c;
    }));
  };

  const handleRejectCandidate = (candId: string) => {
    const cand = candidates.find(c => c.id === candId);
    if (!cand) return;
    setCandidates(prev => prev.filter(c => c.id !== candId));
    
    // Decrement applicant count
    setJobOpenings(prev => prev.map(j => {
      if (j.id === cand.roleId) {
        return { ...j, applicants: Math.max(0, j.applicants - 1) };
      }
      return j;
    }));
    setToastMessage(`Candidate ${cand.name} has been rejected and removed.`);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail || !selectedJobId) return;

    const newCandidate: Candidate = {
      id: `c-${Date.now()}`,
      name: candName,
      email: candEmail,
      experience: candExp || 'Not specified',
      roleId: selectedJobId,
      stage: 'Sourcing',
      rating: candRating
    };

    setCandidates([...candidates, newCandidate]);
    
    // Increment applicant count
    setJobOpenings(prev => prev.map(j => {
      if (j.id === selectedJobId) {
        return { ...j, applicants: j.applicants + 1 };
      }
      return j;
    }));

    setCandName('');
    setCandEmail('');
    setCandExp('');
    setCandRating(4);
    setShowCandidateForm(false);
    setToastMessage(`Added candidate ${candName} to the sourcing board.`);
  };

  const handleHireCandidate = (candId: string) => {
    const candidate = candidates.find(c => c.id === candId);
    if (!candidate) return;

    const job = jobOpenings.find(j => j.id === candidate.roleId);
    const department = job ? job.dept : 'Core Engineering';

    // 1. Create a new member in active personnel directory
    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: candidate.name,
      email: candidate.email,
      role: 'Engineer', 
      status: 'Onboarding',
      department: department
    };

    setMembers([...members, newMember]);

    // 2. Remove candidate from pipeline
    setCandidates(prev => prev.filter(c => c.id !== candId));

    // 3. Update job statistics / status
    setJobOpenings(prev => prev.map(j => {
      if (j.id === candidate.roleId) {
        return {
          ...j,
          status: 'Closed', // Mark job as closed since candidate is hired
          applicants: Math.max(0, j.applicants - 1)
        };
      }
      return j;
    }));

    setToastMessage(`Congratulations! ${candidate.name} has been hired & added to the onboarding workforce.`);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Director':
        return isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Project Lead':
        return isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10';
      case 'On Leave':
        return 'bg-rose-500/10 text-rose-550 dark:text-rose-400 border-rose-500/10';
      default:
        return 'bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 border-indigo-500/10';
    }
  };

  const onboardingProgress = Math.round(
    (onboardingTasks.filter(t => t.completed).length / onboardingTasks.length) * 100
  ) || 0;

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900 dark:bg-[#101220] border border-indigo-500/30 text-white dark:text-slate-100 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-medium max-w-sm transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-indigo-500" />
            <span className={isDark ? 'text-white' : 'text-slate-900'}>HR & People Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage employee records, oversee candidate pipeline tracks, and monitor onboarding progressions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b text-xs overflow-x-auto gap-2 pb-0.5 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        {[
          { id: 'directory', name: 'People Directory' },
          { id: 'onboarding', name: 'Onboarding Checklist' },
          { id: 'hiring', name: 'Job Board & Hiring' },
          { id: 'stats', name: 'Workforce Statistics' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* TAB 1: People Directory View */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          
          {/* Filters & Actions bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search inputs */}
            <div className="flex flex-1 gap-2.5 max-w-md">
              <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2 flex-grow ${
                isDark ? 'bg-[#101220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full text-xs bg-transparent outline-none border-none text-inherit placeholder-slate-500"
                />
              </div>

              {/* Role filter dropdown */}
              <div className={`flex items-center space-x-1.5 border rounded-xl px-2.5 py-2 shrink-0 ${
                isDark ? 'bg-[#101220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs outline-none border-none text-inherit font-semibold cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Director">Directors</option>
                  <option value="Project Lead">Project Leads</option>
                  <option value="Engineer">Engineers</option>
                </select>
              </div>
            </div>

            {/* Invite button */}
            <button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-650/10 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Employee</span>
            </button>
          </div>

          {/* Dynamic Invite Form (collapsible) */}
          {showInviteForm && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Invite New Teammate</h3>
              <form onSubmit={handleInviteMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Sanjay Patel"
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`} 
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. sanjay@genessence.com"
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`} 
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Role Type</label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all cursor-pointer ${
                      isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`}
                  >
                    <option value="Engineer">Engineer</option>
                    <option value="Project Lead">Project Lead</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Send Invitation
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className={`px-3 py-2 border rounded-xl text-xs font-medium cursor-pointer ${
                      isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-850'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Directory Employee list card */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Active Personnel ({filteredMembers.length})</h3>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800/40">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.id} className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all ${
                    isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-center space-x-3.5">
                      {/* Circle Initials Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-550 dark:text-indigo-400 text-xs shrink-0 select-none">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{member.name}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-5 mt-2 sm:mt-0 justify-between sm:justify-end">
                      <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-lg uppercase tracking-wide ${getRoleBadgeStyle(member.role)}`}>
                        {member.role}
                      </span>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">No employees match the filters.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Onboarding Tracks */}
      {activeTab === 'onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Progress summary & task add form */}
          <div className="space-y-6 lg:col-span-1">
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-2 ${isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'}`}>Onboarding Stats</h3>
              
              <div className="space-y-4 font-sans text-xs">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Task Completion</span>
                    <span>{onboardingProgress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${onboardingProgress}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Tasks Completed</span>
                  <span>{onboardingTasks.filter(t => t.completed).length} of {onboardingTasks.length}</span>
                </div>
              </div>
            </div>

            {/* Add Task Form */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-2 flex items-center space-x-2 ${
                isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'
              }`}>
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Onboarding Task</span>
              </h3>
              
              <form onSubmit={handleAddOnboardingTask} className="space-y-4 mt-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Task Description</label>
                  <input 
                    type="text" 
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Schedule hardware shipping"
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                      isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`} 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Checklist */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-2 ${isDark ? 'text-white border-slate-800/60' : 'text-slate-800 border-slate-200'}`}>My Onboarding checklist</h3>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {onboardingTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleOnboarding(task.id)}
                  className={`flex items-center space-x-3.5 p-4 border rounded-xl cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-[#141624]/40 border-slate-800/50 hover:bg-[#1b1e32]/45' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/50 shadow-sm shadow-slate-100/50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => {}} // Swapped inside parent click handler
                    className="rounded border-slate-350 dark:border-slate-800 bg-[#0c0d14] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer w-4 h-4" 
                  />
                  <span className={`text-xs font-medium leading-relaxed ${
                    task.completed 
                      ? 'line-through text-slate-500 font-semibold' 
                      : isDark ? 'text-slate-200' : 'text-slate-750'
                  }`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Job Openings & Hiring */}
      {activeTab === 'hiring' && (
        <div className="space-y-6">
          {selectedJobId === null ? (
            // VIEW A: Job openings dashboard & list
            <div className="space-y-6">
              {/* Dashboard Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Openings</h4>
                    <span className="text-xl font-bold tracking-tight block mt-2">
                      {jobOpenings.filter(j => j.status !== 'Closed').length}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Positions actively recruiting</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#141624]/60 border border-slate-800/40' : 'bg-slate-50 border border-slate-200'}`}>
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Candidates</h4>
                    <span className="text-xl font-bold tracking-tight block mt-2">
                      {candidates.length}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Candidates in active screening</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#141624]/60 border border-slate-800/40' : 'bg-slate-50 border border-slate-200'}`}>
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200/80 shadow-sm'
                }`}>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Closed (Filled)</h4>
                    <span className="text-xl font-bold tracking-tight block mt-2">
                      {jobOpenings.filter(j => j.status === 'Closed').length}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Vacancies successfully resolved</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#141624]/60 border border-slate-800/40' : 'bg-slate-50 border border-slate-200'}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Sub-Header bar */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recruitment Pipeline Boards</span>
                <button 
                  onClick={() => setShowJobForm(!showJobForm)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/10 animate-pulse-subtle"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Vacancy</span>
                </button>
              </div>

              {/* Add Job Form */}
              {showJobForm && (
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Post Open Position</h3>
                  <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Job Title</label>
                      <input 
                        type="text" 
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Lead Devops Architect"
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                          isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Department</label>
                      <select 
                        value={jobDept}
                        onChange={(e) => setJobDept(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all cursor-pointer ${
                          isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option>Core Engineering</option>
                        <option>Research & Dev</option>
                        <option>People Operations</option>
                        <option>Product & Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Employment Type</label>
                      <select 
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value as any)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all cursor-pointer ${
                          isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Post Role
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowJobForm(false)}
                        className={`px-3 py-2.5 border rounded-xl text-xs font-medium cursor-pointer ${
                          isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Vacancy Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobOpenings.map((job) => {
                  const jobCandidates = candidates.filter(c => c.roleId === job.id);
                  return (
                    <div 
                      key={job.id} 
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                        isDark 
                          ? 'bg-[#101220] border-slate-800/60 hover:border-slate-700' 
                          : 'bg-white border-slate-200 hover:shadow-md shadow-sm'
                      }`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {job.dept}
                          </span>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            job.status === 'Closed'
                              ? 'bg-rose-500/10 text-rose-550 dark:text-rose-450 border-rose-500/20'
                              : job.status === 'Offer Phase'
                                ? 'bg-emerald-500/10 text-emerald-550 dark:text-emerald-450 border-emerald-500/20'
                                : 'bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 border-indigo-500/20'
                          }`}>
                            {job.status}
                          </span>
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{job.title}</h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">{job.type} Position</span>
                        </div>

                        {/* Candidate Pipeline Progress Stats */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-1.5">
                            <span>Pipeline Volume</span>
                            <span>{jobCandidates.length} Active</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                            <div 
                              className={`h-full transition-all duration-300 ${
                                job.status === 'Closed' ? 'bg-rose-500' : 'bg-indigo-500'
                              }`} 
                              style={{ width: `${Math.min(100, (jobCandidates.length / 5) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedJobId(job.id)}
                        className={`w-full mt-5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white'
                            : 'bg-slate-50 border-slate-200 hover:border-indigo-405 text-slate-600 hover:text-indigo-650 shadow-sm'
                        }`}
                      >
                        <span>Manage Pipeline</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // VIEW B: Interactive candidate Kanban pipeline
            (() => {
              const activeJob = jobOpenings.find(j => j.id === selectedJobId);
              const jobCandidates = candidates.filter(c => c.roleId === selectedJobId);
              
              return (
                <div className="space-y-5">
                  {/* Pipeline Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4 dark:border-slate-800/60 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedJobId(null);
                          setShowCandidateForm(false);
                        }}
                        className={`p-2 border rounded-xl transition-all cursor-pointer ${
                          isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50' : 'border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          <span>Pipeline:</span>
                          <span className="text-indigo-500">{activeJob?.title}</span>
                        </h2>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {activeJob?.dept} • {activeJob?.type} • {jobCandidates.length} Active Applicants
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowCandidateForm(!showCandidateForm)}
                      className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Candidate</span>
                    </button>
                  </div>

                  {/* Add Candidate Form (Collapsible) */}
                  {showCandidateForm && (
                    <div className={`p-5 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Add New Candidate</h3>
                      <form onSubmit={handleCreateCandidate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Candidate Name</label>
                          <input 
                            type="text" 
                            required
                            value={candName}
                            onChange={(e) => setCandName(e.target.value)}
                            placeholder="e.g. Liam Patel"
                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                              isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                            }`} 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={candEmail}
                            onChange={(e) => setCandEmail(e.target.value)}
                            placeholder="e.g. liam@gmail.com"
                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                              isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                            }`} 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Experience Level</label>
                          <input 
                            type="text" 
                            required
                            value={candExp}
                            onChange={(e) => setCandExp(e.target.value)}
                            placeholder="e.g. 5 years"
                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                              isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                            }`} 
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Rating Evaluation</label>
                          <select 
                            value={candRating}
                            onChange={(e) => setCandRating(Number(e.target.value))}
                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-all cursor-pointer ${
                              isDark ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                            }`}
                          >
                            <option value={5}>5 Stars (Exceptional)</option>
                            <option value={4}>4 Stars (Strong)</option>
                            <option value={3}>3 Stars (Average)</option>
                            <option value={2}>2 Stars (Weak)</option>
                            <option value={1}>1 Star (Poor)</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            Add to Pipeline
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowCandidateForm(false)}
                            className={`px-3 py-2.5 border rounded-xl text-xs font-medium cursor-pointer ${
                              isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Kanban Grid columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4 items-stretch">
                    {STAGES.map((stage) => {
                      const stageCandidates = jobCandidates.filter(c => c.stage === stage);
                      return (
                        <div 
                          key={stage} 
                          className={`p-4 rounded-2xl border flex flex-col space-y-4 shrink-0 w-72 md:w-auto min-h-[480px] ${
                            isDark ? 'bg-[#101220]/60 border-slate-800/60' : 'bg-slate-50/70 border-slate-200 shadow-sm'
                          }`}
                        >
                          {/* Column Header */}
                          <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800/40 border-slate-200">
                            <span className="text-[9px] font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider">
                              {stage === 'Technical' ? 'Tech Interview' : stage === 'Executive' ? 'Exec Round' : stage === 'Offer' ? 'Offer Extended' : stage}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isDark ? 'bg-[#141624] text-slate-400' : 'bg-white text-slate-500 shadow-sm border border-slate-100'
                            }`}>
                              {stageCandidates.length}
                            </span>
                          </div>

                          {/* Column Cards Container */}
                          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
                            {stageCandidates.map((cand) => (
                              <div 
                                key={cand.id} 
                                className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${
                                  isDark 
                                    ? 'bg-[#141624]/50 border-slate-800/60 hover:border-slate-700 hover:bg-[#1b1e32]/50' 
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="space-y-2">
                                  {/* Avatar Header */}
                                  <div className="flex items-center space-x-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-550 dark:text-indigo-400 text-[10px] shrink-0">
                                      {cand.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="overflow-hidden">
                                      <h5 className={`text-[11px] font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cand.name}</h5>
                                      <span className="text-[9px] text-slate-500 truncate block">{cand.email}</span>
                                    </div>
                                  </div>

                                  {/* Experience tag */}
                                  <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-slate-500 dark:text-slate-400">Exp: {cand.experience}</span>
                                    {/* Star Rating display */}
                                    <div className="flex items-center space-x-0.5">
                                      {[1, 2, 3, 4, 5].map((val) => (
                                        <Star 
                                          key={val} 
                                          className={`w-2.5 h-2.5 ${
                                            val <= cand.rating 
                                              ? 'text-amber-400 fill-amber-400' 
                                              : 'text-slate-300 dark:text-slate-700'
                                          }`} 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions Grid */}
                                <div className="mt-3.5 pt-2.5 border-t dark:border-slate-800/40 border-slate-200 flex flex-col gap-2">
                                  <div className="flex justify-between items-center gap-1.5">
                                    {/* Regress arrow */}
                                    <button 
                                      disabled={stage === 'Sourcing'}
                                      onClick={() => handleRegressCandidate(cand.id)}
                                      className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                        stage === 'Sourcing' 
                                          ? 'opacity-40 cursor-not-allowed' 
                                          : isDark 
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50' 
                                            : 'border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50'
                                      }`}
                                      title="Move back"
                                    >
                                      <ArrowLeft className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Reject Button */}
                                    <button 
                                      onClick={() => handleRejectCandidate(cand.id)}
                                      className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all border-rose-500/20 text-rose-500 hover:bg-rose-550 dark:hover:bg-rose-500/15`}
                                      title="Reject candidate"
                                    >
                                      <UserX className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Advance arrow */}
                                    <button 
                                      disabled={stage === 'Offer'}
                                      onClick={() => handleAdvanceCandidate(cand.id)}
                                      className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                        stage === 'Offer' 
                                          ? 'opacity-40 cursor-not-allowed' 
                                          : isDark 
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50' 
                                            : 'border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50'
                                      }`}
                                      title="Advance stage"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Hire Promotion Button */}
                                  {stage === 'Offer' && (
                                    <button 
                                      onClick={() => handleHireCandidate(cand.id)}
                                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center space-x-1 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-emerald-600/10"
                                    >
                                      <UserCheck className="w-3 h-3" />
                                      <span>Hire & Onboard</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {stageCandidates.length === 0 && (
                              <div className="flex-1 flex items-center justify-center text-center p-4 border border-dashed rounded-xl border-slate-350 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 text-[10px]">
                                No candidates in {stage === 'Technical' ? 'Tech Interview' : stage === 'Executive' ? 'Exec Round' : stage === 'Offer' ? 'Offer Extended' : stage}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* TAB 4: Workforce Stats */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Box 1: Headcount */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Headcount</span>
            <div className="flex items-baseline space-x-2 mt-3">
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{members.length}</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Active Workforce</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">1 invited member onboarding</p>
          </div>

          {/* Stat Box 2: Job Openings */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Openings</span>
            <div className="flex items-baseline space-x-2 mt-3">
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{jobOpenings.filter(j => j.status !== 'Closed').length}</span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase">Sourcing Phase</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Total applicants: {jobOpenings.reduce((sum, j) => sum + j.applicants, 0)}</p>
          </div>

          {/* Stat Box 3: Org Health */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Workforce Distribution</span>
            <div className="space-y-1.5 mt-3 text-[10px] font-medium leading-normal">
              <div className="flex justify-between"><span>Core Engineering</span><span>75%</span></div>
              <div className="flex justify-between"><span>Executive</span><span>25%</span></div>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden flex mt-2.5 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <div className="h-full bg-indigo-500" style={{ width: '75%' }} />
              <div className="h-full bg-amber-500" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Team;
