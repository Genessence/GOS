import React, { useState, useMemo } from 'react';
import {
  Kanban, Plus, ArrowRight, ArrowLeft, Trash2, X, RefreshCw,
  Filter, Calendar, Pencil, Link2, GitBranch, GitMerge,
  GitPullRequest, ChevronDown, ChevronRight, Search,
  AlertTriangle, CheckCircle2, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── GitHub SVG icon (not in lucide-react v1.x) ──────────────────────────────
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface KanbanTask {
  id: string;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
  dueDate?: string;
  githubIssueNumber?: number;
  githubPRNumber?: number;
  githubState?: 'open' | 'closed' | 'merged';
  githubRepo?: string;
  githubUrl?: string;
  githubLabels?: string[];
  githubAssignee?: string;
  githubAssigneeAvatar?: string;
}

interface KanbanColumn {
  id: 'todo' | 'progress' | 'done';
  title: string;
  tasks: KanbanTask[];
}

interface MockGithubIssue {
  number: number;
  title: string;
  type: 'issue' | 'pr';
  state: 'open' | 'closed' | 'merged';
  labels: string[];
  repo: string;
  url: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: 't-1',
        title: 'Fix OAuth token refresh loop',
        project: 'Integrations Hub',
        priority: 'High',
        description: 'Users are getting logged out every 15 minutes due to a broken refresh cycle.',
        githubIssueNumber: 201,
        githubState: 'open',
        githubRepo: 'genessence/g-os-frontend',
        githubUrl: 'https://github.com/genessence/g-os-frontend/issues/201',
        githubLabels: ['bug', 'critical'],
        githubAssignee: 'kavya.chopra',
        githubAssigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&auto=format&fit=crop&q=80',
        dueDate: '2026-06-30',
      },
      {
        id: 't-2',
        title: 'Design sidebar collapse animation',
        project: 'Frontend UI',
        priority: 'Medium',
        description: 'Smooth the sidebar collapse transition with spring physics.',
      },
    ],
  },
  {
    id: 'progress',
    title: 'In Progress',
    tasks: [
      {
        id: 't-3',
        title: 'Add pagination to issues feed',
        project: 'Core Layer',
        priority: 'High',
        githubIssueNumber: 195,
        githubState: 'open',
        githubRepo: 'genessence/g-os-frontend',
        githubUrl: 'https://github.com/genessence/g-os-frontend/issues/195',
        githubLabels: ['enhancement'],
        dueDate: '2026-07-05',
      },
      {
        id: 't-4',
        title: 'Integrate Stripe webhook listener',
        project: 'Payments',
        priority: 'High',
        githubPRNumber: 134,
        githubState: 'merged',
        githubRepo: 'genessence/g-os-backend',
        githubUrl: 'https://github.com/genessence/g-os-backend/pull/134',
        githubLabels: ['feature'],
        githubAssignee: 'ankit.sharma',
        githubAssigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 't-5',
        title: 'Scaffold React folder structure',
        project: 'Core Layer',
        priority: 'Low',
        githubIssueNumber: 189,
        githubState: 'closed',
        githubRepo: 'genessence/g-os-frontend',
        githubUrl: 'https://github.com/genessence/g-os-frontend/issues/189',
        githubLabels: ['refactor'],
      },
      {
        id: 't-6',
        title: 'Initialize Git workflow docs',
        project: 'Repository Setup',
        priority: 'Low',
        description: 'Bootstrapped branching strategy and PR conventions.',
      },
    ],
  },
];

const MOCK_GITHUB_ISSUES: MockGithubIssue[] = [
  { number: 201, title: 'Fix OAuth token refresh loop', type: 'issue', state: 'open', labels: ['bug', 'critical'], repo: 'genessence/g-os-frontend', url: 'https://github.com/genessence/g-os-frontend/issues/201' },
  { number: 195, title: 'Add pagination to issues feed', type: 'issue', state: 'open', labels: ['enhancement'], repo: 'genessence/g-os-frontend', url: 'https://github.com/genessence/g-os-frontend/issues/195' },
  { number: 189, title: 'Refactor webhook handler', type: 'issue', state: 'closed', labels: ['refactor'], repo: 'genessence/g-os-frontend', url: 'https://github.com/genessence/g-os-frontend/issues/189' },
  { number: 134, title: 'Integrate Stripe webhook listener', type: 'pr', state: 'merged', labels: ['feature'], repo: 'genessence/g-os-backend', url: 'https://github.com/genessence/g-os-backend/pull/134' },
  { number: 178, title: 'Dashboard load time > 3s on slow connection', type: 'issue', state: 'open', labels: ['performance', 'bug'], repo: 'genessence/g-os-frontend', url: 'https://github.com/genessence/g-os-frontend/issues/178' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const GithubStatePill: React.FC<{ state: 'open' | 'closed' | 'merged' }> = ({ state }) => {
  const styles = {
    open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-slate-700/60 text-slate-400 border-slate-600/30',
    merged: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  const icons = {
    open: <GitBranch className="w-2.5 h-2.5" />,
    closed: <CheckCircle2 className="w-2.5 h-2.5" />,
    merged: <GitMerge className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${styles[state]}`}>
      {icons[state]}{state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  );
};

const LabelPill: React.FC<{ label: string; theme: string }> = ({ label, theme }) => (
  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${theme === 'dark'
      ? 'bg-slate-800 text-slate-300 border-slate-700/40'
      : 'bg-slate-100 text-slate-600 border-slate-200'
    }`}>
    {label}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const Projects: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  // ── State ──
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);

  // GitHub connection
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectedRepo, setConnectedRepo] = useState('genessence/g-os-frontend');
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  // Filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'github' | 'local' | 'High' | 'Medium' | 'Low'>('all');

  // Modals
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthRepo, setOauthRepo] = useState('genessence/g-os-frontend');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkSearch, setLinkSearch] = useState('');
  const [linkingIssue, setLinkingIssue] = useState<MockGithubIssue | null>(null);
  const [linkTargetTaskId, setLinkTargetTaskId] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<{ task: KanbanTask; colId: string } | null>(null);
  const [showGithubSection, setShowGithubSection] = useState(false);

  // Task form
  const [formTitle, setFormTitle] = useState('');
  const [formProject, setFormProject] = useState('Core Layer');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formGithubNum, setFormGithubNum] = useState('');
  const [formGithubRepo, setFormGithubRepo] = useState('genessence/g-os-frontend');
  const [formGithubState, setFormGithubState] = useState<'open' | 'closed' | 'merged'>('open');

  // Skeleton shimmer
  const [showSkeleton, setShowSkeleton] = useState(false);

  // ── Derived ──
  const allTasks = columns.flatMap(c => c.tasks);
  const totalTasks = allTasks.length;

  const filteredColumns = useMemo(() => {
    if (filterMode === 'all') return columns;
    return columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => {
        if (filterMode === 'github') return !!t.githubIssueNumber || !!t.githubPRNumber;
        if (filterMode === 'local') return !t.githubIssueNumber && !t.githubPRNumber;
        return t.priority === filterMode;
      }),
    }));
  }, [columns, filterMode]);

  // ── Handlers ──
  const moveTask = (taskId: string, colId: string, dir: 'forward' | 'backward') => {
    const order: KanbanColumn['id'][] = ['todo', 'progress', 'done'];
    const curIdx = order.indexOf(colId as KanbanColumn['id']);
    const targetId = dir === 'forward' ? order[curIdx + 1] : order[curIdx - 1];
    if (!targetId) return;
    let found: KanbanTask | null = null;
    const updated = columns.map(c => {
      if (c.id === colId) { found = c.tasks.find(t => t.id === taskId) || null; return { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }; }
      return c;
    });
    if (!found) return;
    setColumns(updated.map(c => c.id === targetId ? { ...c, tasks: [...c.tasks, found!] } : c));
  };

  const deleteTask = (taskId: string, colId: string) => {
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle(''); setFormProject('Core Layer'); setFormPriority('Medium');
    setFormDescription(''); setFormDueDate(''); setFormGithubNum('');
    setFormGithubRepo('genessence/g-os-frontend'); setFormGithubState('open');
    setShowGithubSection(false);
    setShowTaskModal(true);
  };

  const openEditModal = (task: KanbanTask, colId: string) => {
    setEditingTask({ task, colId });
    setFormTitle(task.title); setFormProject(task.project); setFormPriority(task.priority);
    setFormDescription(task.description || ''); setFormDueDate(task.dueDate || '');
    const num = task.githubIssueNumber || task.githubPRNumber || 0;
    setFormGithubNum(num ? String(num) : '');
    setFormGithubRepo(task.githubRepo || 'genessence/g-os-frontend');
    setFormGithubState(task.githubState || 'open');
    setShowGithubSection(!!(task.githubIssueNumber || task.githubPRNumber));
    setShowTaskModal(true);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const githubNum = formGithubNum ? parseInt(formGithubNum) : undefined;
    const isGithubLinked = showGithubSection && githubNum;
    const taskData: Partial<KanbanTask> = {
      title: formTitle, project: formProject, priority: formPriority,
      description: formDescription || undefined, dueDate: formDueDate || undefined,
      githubIssueNumber: isGithubLinked ? githubNum : undefined,
      githubState: isGithubLinked ? formGithubState : undefined,
      githubRepo: isGithubLinked ? formGithubRepo : undefined,
      githubUrl: isGithubLinked ? `https://github.com/${formGithubRepo}/issues/${githubNum}` : undefined,
    };

    if (editingTask) {
      setColumns(prev => prev.map(c => c.id === editingTask.colId ? {
        ...c, tasks: c.tasks.map(t => t.id === editingTask.task.id ? { ...t, ...taskData } : t)
      } : c));
    } else {
      const newTask: KanbanTask = { id: `t-${Date.now()}`, ...taskData } as KanbanTask;
      setColumns(prev => prev.map(c => c.id === 'todo' ? { ...c, tasks: [...c.tasks, newTask] } : c));
    }
    setShowTaskModal(false);
  };

  const handleOAuth = () => {
    setOauthLoading(true);
    setTimeout(() => {
      setOauthLoading(false);
      setGithubConnected(true);
      setConnectedRepo(oauthRepo);
      setSyncedAt('Just now');
      setShowOAuthModal(false);
    }, 2000);
  };

  const handleSync = () => {
    setSyncing(true);
    setShowSkeleton(true);
    setTimeout(() => {
      setSyncing(false);
      setShowSkeleton(false);
      setSyncedAt('Just now');
    }, 1500);
  };

  const filteredIssues = MOCK_GITHUB_ISSUES.filter(i =>
    i.title.toLowerCase().includes(linkSearch.toLowerCase()) ||
    String(i.number).includes(linkSearch)
  );

  const handleLinkIssue = () => {
    if (!linkingIssue || !linkTargetTaskId) return;
    setColumns(prev => prev.map(c => ({
      ...c,
      tasks: c.tasks.map(t => t.id === linkTargetTaskId ? {
        ...t,
        githubIssueNumber: linkingIssue.type === 'issue' ? linkingIssue.number : undefined,
        githubPRNumber: linkingIssue.type === 'pr' ? linkingIssue.number : undefined,
        githubState: linkingIssue.state,
        githubRepo: linkingIssue.repo,
        githubUrl: linkingIssue.url,
        githubLabels: linkingIssue.labels,
      } : t),
    })));
    setLinkingIssue(null);
    setLinkTargetTaskId('');
    setShowLinkModal(false);
  };

  // ── Theme tokens ──
  const bg = isDark ? 'bg-[#0a0b10]' : 'bg-slate-50';
  const card = isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm';
  const cardInner = isDark ? 'bg-[#141624]/60 border-slate-800/80' : 'bg-white border-slate-200';
  const cardInnerHover = isDark ? 'hover:border-slate-700/80 hover:shadow-md hover:shadow-indigo-500/5' : 'hover:border-indigo-300 hover:shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textSub = isDark ? 'text-slate-500' : 'text-slate-400';
  const inputCls = isDark
    ? 'bg-[#141624] border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500';
  const modalBg = isDark ? 'bg-[#101220] border-slate-800' : 'bg-white border-slate-200';
  const modalHeader = isDark ? 'bg-[#0c0d14] border-slate-800/60' : 'bg-slate-50 border-slate-200';
  const colBg = isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-slate-100/80 border-slate-200';
  const filterDropBg = isDark ? 'bg-[#0f111a] border-slate-800' : 'bg-white border-slate-200';
  const divider = isDark ? 'border-slate-800/60' : 'border-slate-200';
  const badgeBg = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600';
  const skeletonCls = isDark ? 'bg-slate-800/60 animate-pulse rounded-lg' : 'bg-slate-200/80 animate-pulse rounded-lg';

  // ── Empty state copy ──
  const emptyMessages: Record<string, string> = {
    todo: 'Nothing planned yet — add a task or link a GitHub issue',
    progress: 'No active work — move tasks here when you start',
    done: 'No completed tasks — ship something!',
  };

  return (
    <div className={`min-h-screen p-6 space-y-5 font-sans ${bg}`}>

      {/* ── GitHub Connection Banner ── */}
      {!githubConnected ? (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className={`text-xs font-semibold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              GitHub not connected — link your repository to sync issues and PRs
            </span>
          </div>
          <button
            onClick={() => setShowOAuthModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400 transition-all cursor-pointer"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            Connect GitHub
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <GithubIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">{connectedRepo}</span>
            </div>
            <span className={`text-[10px] font-medium ${textMuted}`}>
              {syncedAt ? `Synced ${syncedAt}` : 'Ready to sync'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-xs font-bold text-emerald-400 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing…' : 'Sync Now'}
            </button>
            <button
              onClick={() => { setGithubConnected(false); setSyncedAt(null); }}
              className={`text-[10px] font-medium hover:text-rose-400 transition-colors cursor-pointer ${textSub}`}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold m-0 flex items-center gap-2 ${textPrimary}`}>
            <Kanban className="w-5 h-5 text-indigo-400" />
            Projects &amp; Kanban Board
          </h2>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Manage project boards and sync GitHub issues and PRs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-medium hidden md:inline ${textSub}`}>
            {totalTasks} task{totalTasks !== 1 ? 's' : ''} · 3 columns
          </span>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${isDark
                  ? 'bg-[#141624] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {filterMode === 'all' ? 'Filter' : filterMode}
              <ChevronDown className="w-3 h-3" />
            </button>
            {filterOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-44 border rounded-xl shadow-xl z-30 p-1 ${filterDropBg}`}>
                {(['all', 'github', 'local', 'High', 'Medium', 'Low'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterMode(opt); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filterMode === opt
                        ? 'bg-indigo-600/10 text-indigo-400'
                        : `${textMuted} ${isDark ? 'hover:bg-slate-800/50 hover:text-slate-200' : 'hover:bg-slate-50 hover:text-slate-800'}`
                      }`}
                  >
                    {opt === 'all' ? 'All tasks' : opt === 'github' ? 'GitHub linked' : opt === 'local' ? 'Local only' : `Priority: ${opt}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Link Issue */}
          <div className="relative group/link">
            <button
              onClick={() => githubConnected && setShowLinkModal(true)}
              disabled={!githubConnected}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${githubConnected
                  ? `cursor-pointer ${isDark ? 'bg-[#141624] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`
                  : 'opacity-50 cursor-not-allowed border-slate-700 text-slate-500 bg-transparent'
                }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Link Issue
            </button>
            {!githubConnected && (
              <div className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold px-2 py-1 rounded-lg border invisible group-hover/link:visible z-40 ${isDark ? 'bg-[#0f111a] border-slate-700 text-slate-300' : 'bg-slate-800 border-slate-700 text-white'
                }`}>
                Connect GitHub first
              </div>
            )}
          </div>

          {/* New Task */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* ── Kanban Columns ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredColumns.map(col => (
          <div key={col.id} className={`border p-4 rounded-2xl space-y-3 ${colBg}`}>
            <div className={`flex items-center justify-between border-b pb-2.5 ${divider}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{col.title}</h3>
              <span className={`text-[10px] rounded-full px-2 py-0.5 font-semibold ${badgeBg}`}>{col.tasks.length}</span>
            </div>

            <div className="space-y-3 min-h-[80px]">
              {showSkeleton ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className={`h-20 ${skeletonCls}`} />
                ))
              ) : col.tasks.length === 0 ? (
                <div className={`border border-dashed rounded-xl py-10 text-center text-xs ${textSub} ${isDark ? 'border-slate-800/40' : 'border-slate-300/60'}`}>
                  {emptyMessages[col.id]}
                </div>
              ) : (
                col.tasks.map(task => {
                  const isGithubLinked = !!(task.githubIssueNumber || task.githubPRNumber);
                  return (
                    <div
                      key={task.id}
                      className={`border p-3.5 rounded-xl space-y-2.5 transition-all ${cardInner} ${cardInnerHover} ${isGithubLinked ? (isDark ? 'border-l-2 border-l-indigo-500/60' : 'border-l-2 border-l-indigo-400') : ''
                        }`}
                    >
                      {/* Header */}
                      <div>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{task.project}</span>
                        <h4 className={`text-xs font-semibold mt-0.5 leading-tight ${textPrimary}`}>{task.title}</h4>
                        {task.description && (
                          <p className={`text-[10px] mt-1 leading-relaxed line-clamp-2 ${textMuted}`}>{task.description}</p>
                        )}
                      </div>

                      {/* GitHub link row */}
                      {isGithubLinked && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={task.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-1 text-[10px] font-medium hover:text-indigo-400 transition-colors ${textMuted}`}
                          >
                            {task.githubPRNumber ? <GitPullRequest className="w-3 h-3" /> : <GithubIcon className="w-3 h-3" />}
                            #{task.githubIssueNumber || task.githubPRNumber} · {task.githubRepo}
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                          {task.githubState && <GithubStatePill state={task.githubState} />}
                        </div>
                      )}

                      {/* Labels */}
                      {task.githubLabels && task.githubLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.githubLabels.slice(0, 2).map(l => (
                            <LabelPill key={l} label={l} theme={theme} />
                          ))}
                        </div>
                      )}

                      {/* Footer row */}
                      <div className={`flex items-center justify-between pt-2 border-t ${divider}`}>
                        <div className="flex items-center gap-2">
                          {/* Priority */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-400'
                              : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400'
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {task.priority}
                          </span>
                          {/* Due date */}
                          {task.dueDate && (
                            <span className={`flex items-center gap-0.5 text-[9px] font-medium ${textSub}`}>
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5">
                          {/* Assignee avatar */}
                          {task.githubAssigneeAvatar && (
                            <img
                              src={task.githubAssigneeAvatar}
                              alt={task.githubAssignee}
                              title={task.githubAssignee}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700 mr-1"
                            />
                          )}
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(task, col.id)}
                            className={`p-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer ${textSub} hover:text-indigo-400`}
                            title="Edit task"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          {/* Move left */}
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => moveTask(task.id, col.id, 'backward')}
                              className={`p-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer ${textSub} hover:text-white`}
                              title="Move left"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {/* Delete */}
                          <button
                            onClick={() => deleteTask(task.id, col.id)}
                            className={`p-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer ${textSub} hover:text-rose-400`}
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {/* Move right */}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => moveTask(task.id, col.id, 'forward')}
                              className={`p-1 rounded hover:bg-slate-800/50 transition-colors cursor-pointer ${textSub} hover:text-white`}
                              title="Move right"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL: GitHub OAuth
      ══════════════════════════════════════════════════ */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md border rounded-2xl overflow-hidden shadow-2xl ${modalBg}`}>
            <div className={`p-4 border-b flex items-center justify-between ${modalHeader}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>Connect GitHub</span>
              <button onClick={() => setShowOAuthModal(false)} className={`p-1 rounded-lg transition-colors cursor-pointer ${textMuted} hover:text-white hover:bg-slate-800/40`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Logos */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <Link2 className={`w-5 h-5 ${textMuted}`} />
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                  <GithubIcon className={`w-6 h-6 ${textPrimary}`} />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className={`text-sm font-bold ${textPrimary}`}>Connect GitHub</h3>
                <p className={`text-xs leading-relaxed ${textMuted}`}>
                  Link your GitHub account to sync issues, PRs, and labels directly into your Kanban boards.
                </p>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Repository</label>
                <input
                  type="text"
                  value={oauthRepo}
                  onChange={e => setOauthRepo(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors ${inputCls}`}
                  placeholder="owner/repo"
                />
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleOAuth}
                  disabled={oauthLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60"
                >
                  {oauthLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating…</>
                  ) : (
                    <><GithubIcon className="w-4 h-4" /> Authorize with GitHub</>
                  )}
                </button>
                <button
                  onClick={() => setShowOAuthModal(false)}
                  className={`w-full py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
              </div>

              <p className={`text-[10px] text-center ${textSub}`}>
                G-OS requests read/write access to Issues and Pull Requests only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL: Link Issue
      ══════════════════════════════════════════════════ */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg border rounded-2xl overflow-hidden shadow-2xl ${modalBg}`}>
            <div className={`p-4 border-b flex items-center justify-between ${modalHeader}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>Link GitHub Issue / PR</span>
              <button onClick={() => { setShowLinkModal(false); setLinkingIssue(null); setLinkTargetTaskId(''); }} className={`p-1 rounded-lg transition-colors cursor-pointer ${textMuted} hover:text-white hover:bg-slate-800/40`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="Search issues and PRs…"
                  value={linkSearch}
                  onChange={e => setLinkSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none transition-colors ${inputCls}`}
                />
              </div>

              {/* Issues list */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredIssues.map(issue => (
                  <div key={issue.number} className={`border rounded-xl p-3 space-y-2 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {issue.type === 'pr' ? <GitPullRequest className="w-3 h-3 text-purple-400 flex-shrink-0" /> : <GithubIcon className={`w-3 h-3 flex-shrink-0 ${textMuted}`} />}
                          <span className={`text-[10px] font-semibold ${textMuted}`}>#{issue.number}</span>
                          <GithubStatePill state={issue.state} />
                        </div>
                        <p className={`text-xs font-semibold leading-snug ${textPrimary}`}>{issue.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {issue.labels.map(l => <LabelPill key={l} label={l} theme={theme} />)}
                        </div>
                      </div>
                      <button
                        onClick={() => setLinkingIssue(linkingIssue?.number === issue.number ? null : issue)}
                        className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${linkingIssue?.number === issue.number
                            ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                            : isDark
                              ? 'border-slate-700 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-400'
                              : 'border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                          }`}
                      >
                        {linkingIssue?.number === issue.number ? '✓ Selected' : 'Select'}
                      </button>
                    </div>

                    {/* Task selector sub-step */}
                    {linkingIssue?.number === issue.number && (
                      <div className={`pt-2 border-t space-y-2 ${divider}`}>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Link to task</label>
                        <select
                          value={linkTargetTaskId}
                          onChange={e => setLinkTargetTaskId(e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
                        >
                          <option value="">Select a task…</option>
                          {allTasks.map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
                {filteredIssues.length === 0 && (
                  <div className={`py-8 text-center text-xs ${textSub}`}>No issues match your search</div>
                )}
              </div>
            </div>

            <div className={`p-4 border-t flex justify-end gap-2 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
              <button
                onClick={() => { setShowLinkModal(false); setLinkingIssue(null); setLinkTargetTaskId(''); }}
                className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleLinkIssue}
                disabled={!linkingIssue || !linkTargetTaskId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Link Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL: Create / Edit Task
      ══════════════════════════════════════════════════ */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md border rounded-2xl overflow-hidden shadow-2xl ${modalBg}`}>
            <div className={`p-4 border-b flex items-center justify-between ${modalHeader}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </span>
              <button onClick={() => setShowTaskModal(false)} className={`p-1 rounded-lg transition-colors cursor-pointer ${textMuted} hover:text-white hover:bg-slate-800/40`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Task Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors ${inputCls}`}
                />
              </div>

              {/* Project */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Project</label>
                <input
                  type="text"
                  required
                  value={formProject}
                  onChange={e => setFormProject(e.target.value)}
                  placeholder="Core Layer, Frontend UI…"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors ${inputCls}`}
                />
              </div>

              {/* Priority */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPriority(p)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${formPriority === p
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : isDark ? 'border-slate-800 text-slate-400 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Optional context or details…"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none resize-none transition-colors ${inputCls}`}
                />
              </div>

              {/* Due date */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={e => setFormDueDate(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors ${inputCls}`}
                />
              </div>

              {/* GitHub Link section */}
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setShowGithubSection(v => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${isDark ? 'bg-[#141624]/60 text-slate-300 hover:bg-[#1b1e32]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                    GitHub Link
                    {showGithubSection && formGithubNum && (
                      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">#{formGithubNum}</span>
                    )}
                  </div>
                  {showGithubSection ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {showGithubSection && (
                  <div className={`p-4 space-y-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${textMuted}`}>Issue / PR #</label>
                        <input
                          type="number"
                          value={formGithubNum}
                          onChange={e => setFormGithubNum(e.target.value)}
                          placeholder="e.g. 128"
                          className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${textMuted}`}>Status</label>
                        <select
                          value={formGithubState}
                          onChange={e => setFormGithubState(e.target.value as 'open' | 'closed' | 'merged')}
                          className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="merged">Merged</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${textMuted}`}>Repository</label>
                      <input
                        type="text"
                        value={formGithubRepo}
                        onChange={e => setFormGithubRepo(e.target.value)}
                        placeholder="owner/repo"
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backdrop click-away for filter dropdown */}
      {filterOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setFilterOpen(false)} />
      )}
    </div>
  );
};

export default Projects;