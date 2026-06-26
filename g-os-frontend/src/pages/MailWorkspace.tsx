import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Search,
  Send,
  Star,
  Inbox,
  Tag,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Archive,
  Trash2,
  Clock,
  FolderOpen,
  MoreVertical,
  Edit3,
  Settings,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  X,
  Reply,
  Forward,
  Minimize2,
  Maximize2,
  ExternalLink,
  Paperclip,
  Image,
  Link2,
  Smile,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  AlignCenter,
  Strikethrough,
  RotateCcw,
  CheckSquare,
  AlertCircle,
  RefreshCw,
  Filter,
  HelpCircle,
  Info,
  Flag,
} from "lucide-react";
import { useAuth } from '../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "primary" | "promotions" | "updates";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface RelatedTask {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: "In Progress" | "Done" | "Todo";
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface ThreadEntry {
  id: string;
  senderInitials: string;
  senderName: string;
  senderColor: string;
  time: string;
  snippet: string;
  expanded?: boolean;
}

interface Email {
  id: string;
  sender: string;
  senderInitials: string;
  senderColor: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  bodyLines: string[];
  bodyList?: string[];
  date: string;
  starred: boolean;
  category: Category;
  labels: Label[];
  attachments?: Attachment[];
  relatedTask?: RelatedTask;
  thread?: ThreadEntry[];
  to?: string[];
  cc?: string[];
  isSelected?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LABELS: Label[] = [
  { id: "paygate", name: "PayGate Platform", color: "#4f8ef7" },
  { id: "mobile", name: "Mobile App Revamp", color: "#f59e0b" },
  { id: "data", name: "Data Insights Dashboard", color: "#10b981" },
  { id: "internal", name: "Internal", color: "#8b5cf6" },
];

const INITIAL_EMAILS: Email[] = [
  {
    id: "1",
    sender: "Priya Mehta",
    senderInitials: "PM",
    senderColor: "#6366f1",
    senderEmail: "priya.mehta@globex.com",
    subject: "Project Phoenix – API contract changes",
    snippet: "Hi team, Please find the updated API contract...",
    bodyLines: [
      "Hi team,",
      "",
      "Please find the updated API contract with the latest changes we discussed in yesterday's call.",
      "",
      "Key updates:",
    ],
    bodyList: [
      "Added pagination for transaction list",
      "Updated error codes for validation failures",
      "New webhook for payout status",
    ],
    date: "9:15 AM",
    starred: false,
    category: "primary",
    labels: [LABELS[0]],
    attachments: [{ name: "API_Contract_v2.1.pdf", type: "pdf", size: "2.4 MB" }],
    relatedTask: {
      id: "PHX-1287",
      title: "Update API contract for transactions",
      project: "PayGate Platform",
      assignee: "Arjun Kumar",
      status: "In Progress",
    },
    to: ["me", "Rohit Sharma", "Arjun Kumar"],
    thread: [
      {
        id: "t1",
        senderInitials: "AR",
        senderName: "Aarav Rao",
        senderColor: "#3b82f6",
        time: "9:25 AM (50 mins ago)",
        snippet: "Thanks Priya, reviewing this now. Will share feedback shortly.",
      },
    ],
  },
  {
    id: "2",
    sender: "Rohit Sharma",
    senderInitials: "RS",
    senderColor: "#f59e0b",
    senderEmail: "rohit.sharma@globex.com",
    subject: "Re: UI changes for dashboard filters",
    snippet: "Thanks Aarav, looks good. A couple of comments...",
    bodyLines: ["Thanks Aarav, looks good. A couple of comments about the filter drawer width on mobile."],
    date: "8:02 AM",
    starred: false,
    category: "primary",
    labels: [LABELS[1]],
    to: ["me"],
  },
  {
    id: "3",
    sender: "Client Success Team",
    senderInitials: "CS",
    senderColor: "#10b981",
    senderEmail: "success@clientteam.com",
    subject: "Weekly Client Status – PayGate Redesign",
    snippet: "Please find attached the latest status report...",
    bodyLines: ["Please find attached the latest status report for the PayGate Redesign project."],
    date: "Yesterday",
    starred: false,
    category: "primary",
    labels: [LABELS[0]],
    attachments: [{ name: "Status_Report_W21.pdf", type: "pdf", size: "1.1 MB" }],
    to: ["me"],
  },
  {
    id: "4",
    sender: "Neha Iyer",
    senderInitials: "NI",
    senderColor: "#8b5cf6",
    senderEmail: "neha.iyer@globex.com",
    subject: "MoM: Sprint Planning – 19 May 2025",
    snippet: "Minutes of Meeting from today's sprint planning...",
    bodyLines: ["Minutes of Meeting from today's sprint planning session are attached."],
    date: "Yesterday",
    starred: false,
    category: "primary",
    labels: [LABELS[2]],
    attachments: [{ name: "MoM_SprintPlanning_May19.docx", type: "doc", size: "340 KB" }],
    to: ["me"],
  },
  {
    id: "5",
    sender: "Vikram Singh",
    senderInitials: "VS",
    senderColor: "#ef4444",
    senderEmail: "vikram.singh@globex.com",
    subject: "Data export issue in staging",
    snippet: "We're facing intermittent failures while exporting...",
    bodyLines: ["We're facing intermittent failures while exporting data from staging. Logs attached."],
    date: "Yesterday",
    starred: false,
    category: "primary",
    labels: [LABELS[1]],
    to: ["me"],
  },
  {
    id: "6",
    sender: "Arjun Kumar",
    senderInitials: "AK",
    senderColor: "#06b6d4",
    senderEmail: "arjun.kumar@globex.com",
    subject: "Access request for QA environment",
    snippet: "Hi, please grant access to the QA environment...",
    bodyLines: ["Hi, please grant access to the QA environment for the new contractor joining Monday."],
    date: "18 May",
    starred: false,
    category: "primary",
    labels: [{ id: "internal", name: "Internal", color: "#8b5cf6" }],
    to: ["me"],
  },
  {
    id: "7",
    sender: "PayGate Automation",
    senderInitials: "PA",
    senderColor: "#f97316",
    senderEmail: "automation@paygate.com",
    subject: "Build #4821 failed in CI",
    snippet: "The latest build failed. View details.",
    bodyLines: ["The latest build failed. View details in the CI dashboard."],
    date: "18 May",
    starred: false,
    category: "updates",
    labels: [LABELS[0]],
    to: ["me"],
  },
  {
    id: "8",
    sender: "Megan Li",
    senderInitials: "ML",
    senderColor: "#ec4899",
    senderEmail: "megan.li@globex.com",
    subject: "Design handoff – User profile module",
    snippet: "Figma links and assets for the profile module...",
    bodyLines: ["Figma links and assets for the profile module are ready for dev handoff."],
    date: "17 May",
    starred: false,
    category: "primary",
    labels: [LABELS[1]],
    to: ["me"],
  },
  {
    id: "9",
    sender: "Riya Singh",
    senderInitials: "RI",
    senderColor: "#14b8a6",
    senderEmail: "riya.singh@globex.com",
    subject: "Re: API performance concerns",
    snippet: "We've optimised the endpoints. Please test...",
    bodyLines: ["We've optimised the endpoints. Please test the updated staging URL."],
    date: "17 May",
    starred: false,
    category: "primary",
    labels: [LABELS[0]],
    to: ["me"],
  },
  {
    id: "10",
    sender: "Zoom",
    senderInitials: "ZM",
    senderColor: "#2563eb",
    senderEmail: "noreply@zoom.us",
    subject: "Your meeting summary is ready",
    snippet: 'Summary for "Sprint Review – 16 May 2025"...',
    bodyLines: ['Your meeting summary for "Sprint Review – 16 May 2025" is now available.'],
    date: "17 May",
    starred: false,
    category: "updates",
    labels: [{ id: "internal", name: "Internal", color: "#8b5cf6" }],
    to: ["me"],
  },
  {
    id: "11",
    sender: "Ankit Patel",
    senderInitials: "AP",
    senderColor: "#7c3aed",
    senderEmail: "ankit.patel@globex.com",
    subject: "Leave request for 22–24 May",
    snippet: "Hi Priya, requesting leave for personal work...",
    bodyLines: ["Hi Priya, requesting leave for personal work from 22 to 24 May."],
    date: "16 May",
    starred: false,
    category: "primary",
    labels: [{ id: "internal", name: "Internal", color: "#8b5cf6" }],
    to: ["me"],
  },
  {
    id: "12",
    sender: "Security Team",
    senderInitials: "ST",
    senderColor: "#dc2626",
    senderEmail: "security@globex.com",
    subject: "Password policy update",
    snippet: "We are updating the password security policy...",
    bodyLines: ["We are updating the password security policy effective June 1. Please review."],
    date: "16 May",
    starred: false,
    category: "updates",
    labels: [{ id: "internal", name: "Internal", color: "#8b5cf6" }],
    to: ["me"],
  },
];

const NAV_ITEMS = [
  { icon: Inbox, label: "Inbox", count: 238 },
  { icon: Star, label: "Starred" },
  { icon: Clock, label: "Snoozed" },
  { icon: Flag, label: "Important" },
  { icon: Send, label: "Sent" },
  { icon: Edit3, label: "Drafts", count: 12 },
  { icon: Clock, label: "Scheduled" },
  { icon: Mail, label: "All Mail" },
  { icon: AlertCircle, label: "Spam", count: 8 },
  { icon: Trash2, label: "Bin" },
];

const SHORTCUTS = [
  { label: "PayGate Platform", color: "#4f8ef7" },
  { label: "Mobile App Revamp", color: "#f59e0b" },
  { label: "Data Insights Dashboard", color: "#10b981" },
  { label: "Internal", color: "#8b5cf6" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string; color: string; size?: "sm" | "md" | "lg" }> = ({
  initials,
  color,
  size = "md",
}) => {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-10 h-10 text-sm" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

const LabelBadge: React.FC<{ label: Label }> = ({ label }) => (
  <span
    className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-white mt-1"
    style={{ backgroundColor: label.color + "33", color: label.color, border: `1px solid ${label.color}44` }}
  >
    {label.name}
  </span>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    "In Progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Done: "bg-green-500/20 text-green-400 border-green-500/30",
    Todo: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors[status] || colors["Todo"]}`}>
      {status}
    </span>
  );
};

// ─── Resize Handle ────────────────────────────────────────────────────────────

const ResizeHandle: React.FC<{ onMouseDown: (e: React.MouseEvent) => void; isDark: boolean }> = ({
  onMouseDown,
  isDark,
}) => (
  <div
    onMouseDown={onMouseDown}
    className={`group relative w-[3px] flex-shrink-0 cursor-col-resize z-10 ${isDark ? "bg-slate-800/60" : "bg-slate-200"}`}
  >
    <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
    <div className="absolute inset-y-0 left-0 w-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

// ─── Compose Overlay ──────────────────────────────────────────────────────────

interface ComposeProps {
  onClose: () => void;
  onMinimize: () => void;
  minimized: boolean;
  onSend: (to: string, subject: string, body: string) => void;
}

const ComposeOverlay: React.FC<ComposeProps> = ({ onClose, onMinimize, minimized, onSend }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (minimized) {
    return (
      <div
        className="fixed bottom-0 right-20 w-72 bg-[#1a1b2e] border border-slate-700 rounded-t-xl shadow-2xl z-50 cursor-pointer"
        onClick={onMinimize}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-white">New Message</span>
          <div className="flex items-center space-x-2">
            <Minimize2 className="w-4 h-4 text-slate-400 hover:text-white" />
            <X
              className="w-4 h-4 text-slate-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-20 w-[560px] bg-[#1a1b2e] border border-slate-700 rounded-t-2xl shadow-2xl z-50 flex flex-col max-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141625] rounded-t-2xl flex-shrink-0">
        <span className="text-sm font-semibold text-white">New Message</span>
        <div className="flex items-center space-x-2 text-slate-400">
          <Minimize2 className="w-4 h-4 hover:text-white cursor-pointer" onClick={onMinimize} />
          <Maximize2 className="w-4 h-4 hover:text-white cursor-pointer" />
          <X className="w-4 h-4 hover:text-white cursor-pointer" onClick={onClose} />
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b border-slate-700/60">
          <div className="flex items-center px-4 py-2">
            <span className="text-xs text-slate-400 w-8 flex-shrink-0">To</span>
            <input
              autoFocus
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-slate-600"
              placeholder=""
            />
            <button className="text-xs text-slate-400 hover:text-white ml-2" onClick={() => setShowCc(!showCc)}>
              Cc Bcc
            </button>
          </div>
        </div>

        {showCc && (
          <div className="border-b border-slate-700/60">
            <div className="flex items-center px-4 py-2">
              <span className="text-xs text-slate-400 w-8 flex-shrink-0">Cc</span>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none"
                placeholder=""
              />
            </div>
          </div>
        )}

        <div className="border-b border-slate-700/60">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none px-4 py-2 placeholder-slate-600"
            placeholder="Subject"
          />
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white outline-none px-4 py-3 resize-none placeholder-slate-600 min-h-[160px]"
          placeholder=""
        />

        {/* Toolbar */}
        <div className="border-t border-slate-700/60 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-1">
            {/* Send button */}
            <button
              onClick={() => onSend(to, subject, body)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
            >
              <span>Send</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1 ml-2 text-slate-400">
              {[AlignLeft, Bold, Italic, Underline, Strikethrough].map((Icon, i) => (
                <button key={i} className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="w-px h-4 bg-slate-600 mx-1" />
              {[ListOrdered, List, AlignCenter].map((Icon, i) => (
                <button key={i} className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="w-px h-4 bg-slate-600 mx-1" />
              {[Link2, Image, Smile, Paperclip].map((Icon, i) => (
                <button key={i} className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MailWorkspace: React.FC = () => {
  const { theme, user } = useAuth();
  const isDark = theme === 'dark';

  // Theme-aware class helpers
  const tw = {
    pageBg: isDark ? 'bg-[#0d0e1a] text-white' : 'bg-slate-50 text-slate-900',
    sidebarBg: isDark ? 'bg-[#0a0b18]' : 'bg-white',
    headerBg: isDark ? 'bg-[#0d0e1a]' : 'bg-white',
    detailBg: isDark ? 'bg-[#0c0d1a]' : 'bg-white',
    cardBg: isDark ? 'bg-[#0f1023]' : 'bg-slate-50',
    innerCard: isDark ? 'bg-[#13142a]' : 'bg-white',
    inputBg: isDark ? 'bg-[#1e1f33] border-slate-700/50 placeholder-slate-500' : 'bg-slate-100 border-slate-200 placeholder-slate-400',
    composeBg: isDark ? 'bg-[#1a1b2e]' : 'bg-white',
    composeHdr: isDark ? 'bg-[#141625]' : 'bg-slate-100',
    border: isDark ? 'border-slate-800/60' : 'border-slate-200',
    borderFull: isDark ? 'border-slate-800/60' : 'border-slate-200',
    borderDim: isDark ? 'border-slate-700/60' : 'border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    textDim: isDark ? 'text-slate-500' : 'text-slate-400',
    hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    hoverText: isDark ? 'hover:text-white' : 'hover:text-slate-900',
    navActive: isDark ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'bg-blue-50 text-blue-600 font-semibold',
    navInactive: isDark ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    divider: isDark ? 'border-slate-700/60' : 'border-slate-200',
    selEmail: isDark ? 'bg-blue-600/10 border-l-blue-500' : 'bg-blue-50 border-l-blue-500',
    txBtn: isDark ? 'bg-[#13142a] border-slate-700/60 hover:bg-slate-800/60 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700',
    replyBox: isDark ? 'bg-[#0f1023] border-slate-700/60' : 'bg-slate-50 border-slate-200',
    replyHdr: isDark ? 'border-slate-700/60' : 'border-slate-200',
    relatedBox: isDark ? 'bg-[#0f1023] border-slate-700/60' : 'bg-slate-50 border-slate-200',
    threadItem: isDark ? 'bg-[#0f1023] border-slate-700/60' : 'bg-slate-50 border-slate-200',
    toolbarBtn: isDark ? 'hover:bg-slate-800 rounded-lg' : 'hover:bg-slate-100 rounded-lg',
    searchInput: isDark ? 'bg-[#1e1f33] border border-slate-700/50 text-white focus:border-blue-500/60 placeholder-slate-500' : 'bg-slate-100 border border-slate-200 text-slate-900 focus:border-blue-400 placeholder-slate-400',
    footerBorder: isDark ? 'border-slate-700/60' : 'border-slate-200',
    categoryTab: isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800',
  };

  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(INITIAL_EMAILS[0]);
  const [activeCategory, setActiveCategory] = useState<Category>("primary");
  const [activeNav, setActiveNav] = useState("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeMinimized, setComposeMinimized] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Resizable panel widths ──
  const SIDEBAR_MIN = 160;
  const SIDEBAR_MAX = 360;
  const LIST_MIN = 260;
  const LIST_MAX = 640;

  const [sidebarWidth, setSidebarWidth] = useState(208);
  const [listWidth, setListWidth] = useState(340);
  const sidebarWidthRef = useRef(sidebarWidth);
  const listWidthRef = useRef(listWidth);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingPanelRef = useRef<null | "sidebar" | "list">(null);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);

  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    listWidthRef.current = listWidth;
  }, [listWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const panel = draggingPanelRef.current;
      if (!panel) return;
      const delta = e.clientX - dragStartXRef.current;
      if (panel === "sidebar") {
        const next = Math.min(Math.max(dragStartWidthRef.current + delta, SIDEBAR_MIN), SIDEBAR_MAX);
        setSidebarWidth(next);
      } else if (panel === "list") {
        const next = Math.min(Math.max(dragStartWidthRef.current + delta, LIST_MIN), LIST_MAX);
        setListWidth(next);
      }
    };
    const handleMouseUp = () => {
      if (draggingPanelRef.current) {
        draggingPanelRef.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = (panel: "sidebar" | "list") => (e: React.MouseEvent) => {
    e.preventDefault();
    draggingPanelRef.current = panel;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = panel === "sidebar" ? sidebarWidthRef.current : listWidthRef.current;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
    if (selectedEmail?.id === id) {
      setSelectedEmail((prev) => (prev ? { ...prev, starred: !prev.starred } : null));
    }
  };

  const handleSend = (to: string, subject: string, body: string) => {
    if (!to.trim()) return;
    const newEmail: Email = {
      id: Math.random().toString(36).slice(2),
      sender: `${user?.name || 'Aarav Rao'} (You)`,
      senderInitials: user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AR',
      senderColor: "#3b82f6",
      senderEmail: user?.email || "aarav.rao@genessence.com",
      subject: subject || "(No Subject)",
      snippet: body.slice(0, 80) + "...",
      bodyLines: [body],
      date: "Just now",
      starred: false,
      category: "primary",
      labels: [],
      to: [to],
    };
    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmail(newEmail);
    setShowCompose(false);
  };

  const filteredEmails = emails.filter((m) => {
    const matchCat = activeNav === "Starred" ? m.starred : m.category === activeCategory;
    const q = searchQuery.toLowerCase();
    return matchCat && (m.sender.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.snippet.toLowerCase().includes(q));
  });

  const categoryTabs: { key: Category; label: string; icon: React.ElementType }[] = [
    { key: "primary", label: "Primary", icon: Inbox },
    { key: "promotions", label: "Promotions", icon: Tag },
    { key: "updates", label: "Updates", icon: Bell },
  ];

  return (
    <div className={`h-full flex flex-col font-sans overflow-hidden transition-colors duration-300 ${tw.pageBg}`}>
      {/* ── Top Nav Bar ── */}
      <header className={`h-14 flex items-center px-4 border-b flex-shrink-0 gap-4 ${tw.headerBg} ${tw.border}`}>
        <div className="w-52 flex-shrink-0">
          <h1 className={`text-lg font-semibold ${tw.text}`}>
            Mail Workspace
          </h1>
        </div>
        {/* Search */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search mail"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none transition-colors ${tw.searchInput}`}
            />
            <button className={`absolute right-3 top-1/2 -translate-y-1/2 ${tw.textMuted} ${tw.hoverText}`}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2 ml-auto flex-shrink-0">
          <button className={`p-2 rounded-full transition-colors ${tw.textMuted} ${tw.hover} ${tw.hoverText}`}>
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className={`relative p-2 rounded-full transition-colors ${tw.textMuted} ${tw.hover} ${tw.hoverText}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className={`flex items-center space-x-2 pl-2 border-l ml-1 ${tw.divider}`}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
            ) : (
              <Avatar initials={user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AR'} color="#3b82f6" size="sm" />
            )}
            <div className="leading-tight">
              <div className={`text-xs font-semibold ${tw.text}`}>{user?.name || 'Aarav Rao'}</div>
              <div className={`text-[10px] ${tw.textMuted}`}>{user?.role || 'Engineer'}</div>
            </div>
            <ChevronDown className={`w-4 h-4 ${tw.textMuted}`} />
          </div>
        </div>
      </header>

      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar ── */}
        <aside
          style={{ width: sidebarCollapsed ? 56 : sidebarWidth }}
          className={`flex-shrink-0 border-r flex flex-col overflow-hidden transition-[width] duration-150 ${tw.sidebarBg} ${tw.border}`}
        >
          {/* Compose */}
          <div className="p-3">
            <button
              onClick={() => { setShowCompose(true); setComposeMinimized(false); }}
              className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl w-full transition-all"
            >
              <Edit3 className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>Compose</span>}
              {!sidebarCollapsed && <ChevronDown className="w-3 h-3 ml-auto opacity-60" />}
            </button>
          </div>

          {/* Nav items */}
          <nav className="px-2 space-y-0.5 flex-1 overflow-y-auto">
            {NAV_ITEMS.map(({ icon: Icon, label, count }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-all ${activeNav === label ? tw.navActive : tw.navInactive}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </div>
                {!sidebarCollapsed && count && (
                  <span className={`text-[10px] font-medium ${tw.textMuted}`}>{count}</span>
                )}
              </button>
            ))}

            {/* More */}
            {!sidebarCollapsed && (
              <button className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${tw.textDim} ${tw.hoverText}`}>
                <ChevronDown className="w-4 h-4" />
                <span>More</span>
              </button>
            )}

            {/* Shortcuts */}
            {!sidebarCollapsed && (
              <div className="pt-3">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className={`text-[10px] font-bold tracking-wider ${tw.textDim}`}>Shortcuts</span>
                  <Plus className={`w-3.5 h-3.5 cursor-pointer ${tw.textDim} ${tw.hoverText}`} />
                </div>
                {SHORTCUTS.map((s) => (
                  <button
                    key={s.label}
                    className={`w-full flex items-center space-x-2.5 px-3 py-1.5 text-xs transition-colors ${tw.textMuted} ${tw.hoverText}`}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </nav>

          {/* Sidebar footer */}
          <div className={`p-3 border-t flex items-center justify-between ${tw.border}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                {[
                  { Icon: Users, label: "People" },
                  { Icon: Settings, label: "Settings" },
                ].map(({ Icon, label }) => (
                  <button key={label} className={`flex items-center space-x-1.5 text-xs transition-colors ${tw.textMuted} ${tw.hoverText}`}>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className={`p-1.5 rounded-lg transition-colors ${tw.textMuted} ${tw.hover} ${tw.hoverText}`}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {!sidebarCollapsed && <ResizeHandle isDark={isDark} onMouseDown={startDrag("sidebar")} />}

        {/* ── Email List ── */}
        <section
          style={{ width: listWidth }}
          className={`flex-shrink-0 border-r flex flex-col overflow-hidden ${tw.sidebarBg} ${tw.border}`}
        >
          {/* Toolbar */}
          <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 ${tw.border}`}>
            <div className="flex items-center space-x-2">
              <span className={`text-base font-bold ${tw.text}`}>Inbox</span>
              <span className={`text-xs ${tw.textMuted}`}>1–50 of {emails.length * 4}</span>
            </div>
            <div className={`flex items-center space-x-1 ${tw.textMuted}`}>
              <button className={`p-1.5 rounded-lg transition-colors ${tw.hover}`}>
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className={`p-1.5 rounded-lg transition-colors ${tw.hover}`}>
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className={`flex border-b flex-shrink-0 ${tw.border}`}>
            {categoryTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${activeCategory === key
                  ? "border-blue-500 text-blue-400"
                  : tw.categoryTab
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Email rows */}
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => setSelectedEmail(mail)}
                className={`relative px-4 py-3 border-b cursor-pointer transition-all ${isDark ? 'border-slate-800/40 hover:bg-slate-800/20' : 'border-slate-100 hover:bg-slate-50'} ${selectedEmail?.id === mail.id
                  ? `bg-blue-600/10 border-l-2 border-l-blue-500`
                  : "border-l-2 border-l-transparent"
                  }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      className={`w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 absolute ${isDark ? 'border-slate-600 bg-transparent' : 'border-slate-300'}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar initials={mail.senderInitials} color={mail.senderColor} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-semibold truncate ${tw.text}`}>{mail.sender}</span>
                      <span className={`text-[10px] flex-shrink-0 ml-2 ${tw.textDim}`}>{mail.date}</span>
                    </div>
                    <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mail.subject}</p>
                    <div className="flex items-center mt-0.5 space-x-1.5 flex-wrap">
                      {mail.labels.map((l) => (
                        <LabelBadge key={l.id} label={l} />
                      ))}
                    </div>
                    <p className={`text-[11px] truncate mt-1 ${tw.textDim}`}>{mail.snippet}</p>
                  </div>
                  <button
                    onClick={(e) => toggleStar(mail.id, e)}
                    className={`flex-shrink-0 mt-1 transition-colors ${isDark ? 'text-slate-600' : 'text-slate-300'} hover:text-amber-400`}
                  >
                    <Star className={`w-3.5 h-3.5 ${mail.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
            {filteredEmails.length === 0 && (
              <div className={`py-16 text-center text-sm ${tw.textDim}`}>No emails in this category</div>
            )}
          </div>
        </section>

        <ResizeHandle isDark={isDark} onMouseDown={startDrag("list")} />

        {/* ── Email Detail ── */}
        <main className={`flex-1 overflow-y-auto flex flex-col min-w-0 ${tw.detailBg}`}>
          {selectedEmail ? (
            <>
              {/* Detail toolbar */}
              <div className={`px-6 py-3 border-b flex items-center justify-between flex-shrink-0 sticky top-0 z-10 ${tw.detailBg} ${tw.border}`}>
                <div className={`flex items-center space-x-1 ${tw.textMuted}`}>
                  {[ChevronLeft, Archive, Info, Trash2, Mail, Clock, FolderOpen, ChevronDown, MoreVertical].map((Icon, i) => (
                    <button key={i} className={`p-2 rounded-lg transition-colors ${tw.hover}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <div className={`flex items-center space-x-2 text-xs ${tw.textMuted}`}>
                  <span>1 of {filteredEmails.length}</span>
                  <button className={`p-1.5 rounded-lg transition-colors ${tw.hover}`}><ChevronLeft className="w-4 h-4" /></button>
                  <button className={`p-1.5 rounded-lg transition-colors ${tw.hover}`}><ChevronRight className="w-4 h-4" /></button>
                  <button className={`p-1.5 rounded-lg transition-colors ml-1 ${tw.hover}`}><Maximize2 className="w-4 h-4" /></button>
                  <button className={`p-1.5 rounded-lg transition-colors ${tw.hover}`}><ExternalLink className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="px-6 py-5 flex-1">
                {/* Subject + labels */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <h2 className={`text-xl font-bold ${tw.text}`}>{selectedEmail.subject}</h2>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-semibold rounded">
                      External
                    </span>
                    {selectedEmail.labels.map((l) => (
                      <LabelBadge key={l.id} label={l} />
                    ))}
                  </div>
                </div>

                {/* Sender row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start space-x-3">
                    <Avatar initials={selectedEmail.senderInitials} color={selectedEmail.senderColor} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${tw.text}`}>{selectedEmail.sender}</span>
                        <span className={`text-xs ${tw.textMuted}`}>&lt;{selectedEmail.senderEmail}&gt;</span>
                        {selectedEmail.labels[0] && <LabelBadge label={selectedEmail.labels[0]} />}
                      </div>
                      <div className={`flex items-center space-x-1 text-xs mt-0.5 ${tw.textDim}`}>
                        <span>to {selectedEmail.to?.join(", ") || "me"}</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-3 ${tw.textMuted}`}>
                    <span className={`text-xs ${tw.textDim}`}>{selectedEmail.date} (1 hour ago)</span>
                    <button onClick={(e) => toggleStar(selectedEmail.id, e)}>
                      <Star className={`w-4 h-4 ${selectedEmail.starred ? "fill-amber-400 text-amber-400" : "hover:text-amber-400"} transition-colors`} />
                    </button>
                    <button className={`p-1 rounded-lg transition-colors ${tw.hover}`}><Reply className="w-4 h-4" /></button>
                    <button className={`p-1 rounded-lg transition-colors ${tw.hover}`}><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Body */}
                <div className={`text-sm leading-relaxed space-y-2 mb-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedEmail.bodyLines.map((line, i) =>
                    line === "" ? <br key={i} /> : <p key={i}>{line}</p>
                  )}
                  {selectedEmail.bodyList && (
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      {selectedEmail.bodyList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {selectedEmail.bodyLines.length > 2 && (
                    <div className="mt-3">
                      <p>Let us know if you have any questions.</p>
                      <p className="mt-2">Thanks,</p>
                      <p>{selectedEmail.sender}</p>
                    </div>
                  )}
                </div>

                {/* Attachment */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {selectedEmail.attachments.map((att) => (
                      <div
                        key={att.name}
                        className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 cursor-pointer transition-colors group ${tw.innerCard} ${tw.borderDim} ${tw.hover}`}
                      >
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold group-hover:text-blue-400 transition-colors ${tw.text}`}>{att.name}</div>
                          <div className={`text-[10px] ${tw.textDim}`}>{att.type.toUpperCase()} · {att.size}</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 ml-1 transition-colors ${tw.textDim}`} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center space-x-2 mb-6">
                  {[
                    { icon: CheckSquare, label: "Create Task", color: "text-blue-400" },
                    { icon: AlertCircle, label: "Raise CR", color: "text-amber-400" },
                    { icon: MessageSquare, label: "Log Client Communication", color: "text-green-400" },
                  ].map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      className={`flex items-center space-x-1.5 px-3 py-2 border rounded-xl text-xs font-medium transition-all ${tw.txBtn}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span>{label}</span>
                    </button>
                  ))}
                  <button className={`p-2 border rounded-xl transition-colors ${tw.txBtn}`}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Related task */}
                {selectedEmail.relatedTask && (
                  <div className={`mb-6 border rounded-2xl p-4 ${tw.relatedBox}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${tw.textDim}`}>Related to</div>
                    <div className="space-y-3">
                      <div>
                        <div className={`text-[10px] mb-1 ${tw.textDim}`}>Task</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-blue-400">{selectedEmail.relatedTask.id}</span>
                            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>– {selectedEmail.relatedTask.title}</span>
                          </div>
                          <StatusBadge status={selectedEmail.relatedTask.status} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`text-[10px] mb-1 ${tw.textDim}`}>Project</div>
                          <div className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selectedEmail.relatedTask.project}</div>
                        </div>
                        <div>
                          <div className={`text-[10px] mb-1 ${tw.textDim}`}>Assignee</div>
                          <div className="flex items-center space-x-1.5">
                            <Avatar initials="AK" color="#06b6d4" size="sm" />
                            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selectedEmail.relatedTask.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        <span>Open in Projects</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Thread */}
                {selectedEmail.thread && selectedEmail.thread.length > 0 && (
                  <div className="mb-6">
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${tw.textDim}`}>Thread</div>
                    {selectedEmail.thread.map((t) => (
                      <div key={t.id} className={`flex items-start space-x-3 border rounded-xl p-3 mb-2 ${tw.threadItem}`}>
                        <Avatar initials={t.senderInitials} color={t.senderColor} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold ${tw.text}`}>{t.senderName}</span>
                            <span className={`text-[10px] ${tw.textDim}`}>{t.time}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${tw.textMuted}`}>{t.snippet}</p>
                        </div>
                        <button className={`transition-colors ${tw.textDim} ${tw.hoverText}`}>
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply box */}
                <div className={`border rounded-2xl overflow-hidden ${tw.replyBox}`}>
                  {!replyOpen ? (
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${tw.hover}`}
                      onClick={() => setReplyOpen(true)}
                    >
                      <Avatar initials="AR" color="#3b82f6" size="sm" />
                      <span className={`text-sm ${tw.textDim}`}>Reply to {selectedEmail.sender}…</span>
                    </div>
                  ) : (
                    <div>
                      {/* Reply header */}
                      <div className={`flex items-center justify-between px-4 py-3 border-b ${tw.replyHdr}`}>
                        <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className={tw.textDim}>To</span>
                          <span className={`font-medium ${tw.text}`}>
                            {selectedEmail.sender} &lt;{selectedEmail.senderEmail}&gt;
                          </span>
                          <ChevronDown className={`w-3 h-3 ${tw.textMuted}`} />
                        </div>
                        <span className={`text-xs ${tw.textMuted}`}>Cc Bcc</span>
                      </div>
                      <div className="px-4 pt-3 pb-1">
                        <div className="flex items-start space-x-3">
                          <Avatar initials="AR" color="#3b82f6" size="sm" />
                          <textarea
                            autoFocus
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            rows={4}
                            className={`flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed ${tw.text} placeholder-slate-400`}
                            placeholder={`Hi ${selectedEmail.sender.split(" ")[0]},`}
                          />
                        </div>
                        <div className={`text-xs mt-2 ml-10 ${tw.textDim}`}>
                          -- <br />
                          <span className="text-blue-400 font-medium">{user?.name || 'Aarav Rao'}</span>
                          <br />{user?.role || 'Software Engineer'}<br />Genessence Solutions
                        </div>
                      </div>
                      {/* Reply toolbar */}
                      <div className={`px-4 py-3 border-t flex items-center justify-between ${tw.replyHdr}`}>
                        <div className="flex items-center space-x-1">
                          <button className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                            <span>Send</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <div className={`flex items-center space-x-0.5 ml-2 ${tw.textMuted}`}>
                            {[AlignLeft, Bold, Italic, Underline, Strikethrough, ListOrdered, List, AlignCenter, Link2, Image, Smile, Paperclip, CheckSquare].map((Icon, i) => (
                              <button key={i} className={`p-1.5 rounded transition-colors ${tw.hover}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 ${tw.textMuted}`}>
                          <button className={`p-1.5 rounded transition-colors ${tw.hover}`}><MoreVertical className="w-4 h-4" /></button>
                          <button className={`p-1.5 rounded transition-colors ${tw.hover}`} onClick={() => setReplyOpen(false)}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={`h-full flex items-center justify-center text-sm ${tw.textDim}`}>
              Select an email to read
            </div>
          )}
        </main>
      </div>

      {/* Compose overlay */}
      {showCompose && (
        <ComposeOverlay
          onClose={() => setShowCompose(false)}
          onMinimize={() => setComposeMinimized(!composeMinimized)}
          minimized={composeMinimized}
          onSend={handleSend}
        />
      )}
    </div>
  );
};

export default MailWorkspace;