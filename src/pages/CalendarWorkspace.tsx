import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Video,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  X,
  CheckSquare,
  Sparkles,
  MessageSquare,
  ListTodo,
  Clock,
  Users,
  Link2,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  Edit3,
  Save,
  Download,
  Mail,
  MoreHorizontal,
  Tag,
  Globe,
  Lock,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────
// Types & Interfaces (integration-ready)
// ─────────────────────────────────────────────

export type MeetingType = 'one-one' | 'sprint-ceremony' | 'client-facing' | 'internal';
export type TranscriptStatus = 'unavailable' | 'processing' | 'ready' | 'error';
export type MomStatus = 'not-generated' | 'generating' | 'draft' | 'reviewing' | 'sent';
export type MeetingStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface Attendee {
  id?: string;                // backend user ID for Google Calendar integration
  name: string;
  email?: string;
  avatar: string;
  responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export interface ActionItem {
  id: string;
  item: string;
  ownerName: string;
  ownerEmail?: string;
  ownerAvatar: string;
  dueDate: string;
  completed?: boolean;
}

export interface TranscriptLine {
  id?: string;
  sender: string;
  speakerId?: string;         // Google Meet speaker diarization ID
  avatar: string;
  text: string;
  time: string;
  timestamp?: number;         // unix ms — backend uses for syncing
  confidence?: number;        // ASR confidence 0-1
}

export interface Meeting {
  id: string;
  googleCalendarEventId?: string;   // populated by backend on sync
  googleMeetId?: string;             // Google Meet conference ID
  title: string;
  description?: string;
  dayIndex: number;                  // 0=Mon … 4=Fri (week-relative)
  date?: string;                     // ISO date string — e.g. "2026-05-20"
  timeLabel: string;
  startHour: number;
  endHour: number;
  timezone?: string;                 // e.g. "Asia/Kolkata"
  type: MeetingType;
  project?: string;
  projectId?: string;
  meetLink: string;
  status: MeetingStatus;
  isRecurring?: boolean;
  recurrenceRule?: string;           // RRULE string
  attendees: Attendee[];
  agenda: { id: string; text: string; done: boolean }[];
  // transcript section — backend populates these
  transcriptStatus: TranscriptStatus;
  transcriptFetchedAt?: string;      // ISO datetime
  transcript: TranscriptLine[];
  // MoM section — AI generates from transcript
  momStatus: MomStatus;
  momGeneratedAt?: string;
  momSentAt?: string;
  discussionPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  // metadata
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const HOUR_HEIGHT = 72; // px per hour
const GRID_START_HOUR = 8;
const GRID_END_HOUR = 19;
const HOUR_ROWS = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR + 1 }, (_, i) => i + GRID_START_HOUR);

const MEETING_TYPE_STYLES_DARK: Record<MeetingType, { bg: string; border: string; text: string; badge: string; dot: string; label: string }> = {
  'one-one': { bg: 'bg-emerald-950/30', border: 'border-l-[3px] border-emerald-500', text: 'text-emerald-300', badge: 'bg-emerald-900/40 text-emerald-300', dot: 'bg-emerald-500', label: '1:1' },
  'sprint-ceremony': { bg: 'bg-indigo-950/30', border: 'border-l-[3px] border-indigo-500', text: 'text-indigo-300', badge: 'bg-indigo-900/40 text-indigo-300', dot: 'bg-indigo-500', label: 'Sprint' },
  'client-facing': { bg: 'bg-amber-950/30', border: 'border-l-[3px] border-amber-500', text: 'text-amber-300', badge: 'bg-amber-900/40 text-amber-300', dot: 'bg-amber-500', label: 'Client' },
  'internal': { bg: 'bg-purple-950/30', border: 'border-l-[3px] border-purple-500', text: 'text-purple-300', badge: 'bg-purple-900/40 text-purple-300', dot: 'bg-purple-500', label: 'Internal' },
};

const MEETING_TYPE_STYLES_LIGHT: Record<MeetingType, { bg: string; border: string; text: string; badge: string; dot: string; label: string }> = {
  'one-one': { bg: 'bg-emerald-50', border: 'border-l-[3px] border-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: '1:1' },
  'sprint-ceremony': { bg: 'bg-indigo-50', border: 'border-l-[3px] border-indigo-500', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', label: 'Sprint' },
  'client-facing': { bg: 'bg-amber-50', border: 'border-l-[3px] border-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Client' },
  'internal': { bg: 'bg-purple-50', border: 'border-l-[3px] border-purple-500', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', label: 'Internal' },
};

// ─────────────────────────────────────────────
// Seed Data
// ─────────────────────────────────────────────

const SEED_MEETINGS: Meeting[] = [
  {
    id: 'm-6',
    googleCalendarEventId: undefined, // will be set by backend
    title: 'Q2 Roadmap Review',
    description: 'Quarterly roadmap alignment and milestone review for PayGate Platform.',
    dayIndex: 1, date: '2026-05-20',
    timeLabel: '10:00 – 11:00 AM', startHour: 10, endHour: 11,
    timezone: 'Asia/Kolkata',
    type: 'sprint-ceremony', project: 'PayGate Platform', projectId: 'proj-001',
    meetLink: 'meet.google.com/xyz-abcd-efg',
    status: 'scheduled',
    isRecurring: false,
    attendees: [
      { name: 'Kavya Chopra', email: 'kavya@genessence.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' },
      { name: 'Aarav Rao', email: 'aarav@genessence.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' },
      { name: 'Rahul Sharma', email: 'rahul@genessence.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', responseStatus: 'tentative' },
      { name: 'Ankit Sharma', email: 'ankit@genessence.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' },
    ],
    agenda: [
      { id: 'ag-1', text: 'Review Q2 deliverables and milestone status', done: true },
      { id: 'ag-2', text: 'Prioritize Payment Gateway v2 integration tracks', done: true },
      { id: 'ag-3', text: 'Align timelines for mobile app redesign', done: false },
      { id: 'ag-4', text: 'Identify third-party dependencies and audit risks', done: false },
    ],
    transcriptStatus: 'ready',
    transcriptFetchedAt: '2026-05-20T11:05:00Z',
    transcript: [
      { id: 't-1', sender: 'Aarav Rao', speakerId: 'spk_001', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', text: "Welcome everyone. Let's start the Q2 roadmap review. Kavya, can you take us through the current deliverables status?", time: '10:02 AM', timestamp: 1716195720000, confidence: 0.97 },
      { id: 't-2', sender: 'Kavya Chopra', speakerId: 'spk_002', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: "Sure. We are targeting payment gateway integration as the primary milestone. We're currently at 72% completion. The main blocker is the third-party webhook reliability issue.", time: '10:04 AM', timestamp: 1716195840000, confidence: 0.98 },
      { id: 't-3', sender: 'Ankit Sharma', speakerId: 'spk_003', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', text: "I'm wrapping up the webhook handlers. The database conversion models should be completed by Thursday. I'll also need QA sign-off before pushing to staging.", time: '10:15 AM', timestamp: 1716196500000, confidence: 0.95 },
      { id: 't-4', sender: 'Rahul Sharma', speakerId: 'spk_004', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', text: "We need to provision a dedicated QA environment by May 25 for the payment pipeline security audit. I'll coordinate with the infra team on this.", time: '10:35 AM', timestamp: 1716197700000, confidence: 0.96 },
      { id: 't-5', sender: 'Aarav Rao', speakerId: 'spk_001', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', text: "Good. Let's also align on the mobile app redesign timeline. We have a board presentation on June 2nd and I'd like to show a working prototype.", time: '10:48 AM', timestamp: 1716198480000, confidence: 0.94 },
      { id: 't-6', sender: 'Kavya Chopra', speakerId: 'spk_002', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: "We can target a beta prototype by June 1st. The design system is 90% complete. I'll send over the Figma links after this call.", time: '10:52 AM', timestamp: 1716198720000, confidence: 0.97 },
    ],
    momStatus: 'draft',
    momGeneratedAt: '2026-05-20T11:10:00Z',
    discussionPoints: [
      'Q2 product roadmap reviewed — PayGate Platform at 72% completion.',
      'Third-party webhook reliability identified as primary blocker.',
      'Payment Gateway v2 integration prioritized for Q2 delivery.',
      'Mobile app redesign beta prototype targeted for June 1st.',
      'Dedicated QA environment to be provisioned by May 25.',
    ],
    decisions: [
      'Payment Gateway v2 integration confirmed as top Q2 priority.',
      'Mobile app redesign targets beta release by June 1st for June 2nd board presentation.',
      'Dedicated QA environment provisioned by May 25 for payment security audit.',
    ],
    actionItems: [
      { id: 'a1', item: 'Share updated API contract for webhook handlers', ownerName: 'Ankit Sharma', ownerEmail: 'ankit@genessence.com', ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', dueDate: '22 May 2026', completed: false },
      { id: 'a2', item: 'Confirm QA environment infrastructure requirements', ownerName: 'Rahul Sharma', ownerEmail: 'rahul@genessence.com', ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', dueDate: '23 May 2026', completed: false },
      { id: 'a3', item: 'Share Figma design system links with team', ownerName: 'Kavya Chopra', ownerEmail: 'kavya@genessence.com', ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', dueDate: '21 May 2026', completed: true },
      { id: 'a4', item: 'Prepare risk assessment document for third-party dependencies', ownerName: 'Aarav Rao', ownerEmail: 'aarav@genessence.com', ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', dueDate: '28 May 2026', completed: false },
    ],
  },
  {
    id: 'm-5',
    title: 'Client Check-in',
    dayIndex: 1, date: '2026-05-20',
    timeLabel: '9:00 – 9:30 AM', startHour: 9, endHour: 9.5,
    timezone: 'Asia/Kolkata',
    type: 'client-facing', project: 'Client Success',
    meetLink: 'meet.google.com/abc-defg-hij',
    status: 'ended',
    attendees: [
      { name: 'Kavya Chopra', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' },
      { name: 'Megan Li', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' },
    ],
    agenda: [
      { id: 'ag-5', text: 'Demo latest billing portal changes', done: true },
      { id: 'ag-6', text: 'Address client feedback from last session', done: true },
    ],
    transcriptStatus: 'ready',
    transcript: [
      { id: 't-7', sender: 'Megan Li', speakerId: 'spk_005', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'The client loved the card-less billing layout we presented. They want the same interaction pattern on mobile.', time: '9:12 AM', confidence: 0.95 },
      { id: 't-8', sender: 'Kavya Chopra', speakerId: 'spk_002', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: "Agreed. I'll pass this to Ankit for the mobile component spec. We can have a draft by end of week.", time: '9:18 AM', confidence: 0.97 },
    ],
    momStatus: 'sent',
    momSentAt: '2026-05-20T10:00:00Z',
    discussionPoints: ['Billing portal demo delivered successfully.', 'Client requested mobile parity for card-less billing layout.'],
    decisions: ['Mobile billing component to be specced out by end of week.'],
    actionItems: [
      { id: 'a5', item: 'Create mobile billing component spec', ownerName: 'Megan Li', ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', dueDate: '24 May 2026', completed: false },
    ],
  },
  {
    id: 'm-1',
    title: '1:1 with Neha',
    dayIndex: 0, date: '2026-05-19',
    timeLabel: '9:00 – 10:00 AM', startHour: 9, endHour: 10,
    type: 'one-one', meetLink: 'meet.google.com/111-2222-333',
    status: 'ended',
    attendees: [{ name: 'Neha Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' }],
    agenda: [{ id: 'ag-7', text: 'Sprint career milestones check', done: true }],
    transcriptStatus: 'ready',
    transcript: [{ id: 't-9', sender: 'Neha Patel', speakerId: 'spk_006', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', text: 'I want to focus more on security integration audits in Q3. I feel that area is undertapped.', time: '9:15 AM', confidence: 0.93 }],
    momStatus: 'sent',
    discussionPoints: ['Reviewed personal development goals for Q3.', 'Security integration audits identified as growth area.'],
    decisions: ['Approve security compliance training course enrollment.'],
    actionItems: [],
  },
  {
    id: 'm-2',
    title: 'Sprint Planning',
    dayIndex: 0, date: '2026-05-19',
    timeLabel: '11:00 AM – 12:00 PM', startHour: 11, endHour: 12,
    type: 'sprint-ceremony', meetLink: 'meet.google.com/spr-plan-mon',
    status: 'ended', attendees: [],
    agenda: [{ id: 'ag-8', text: 'Define sprint goals for week 21', done: false }],
    transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-3',
    title: 'Architecture Sync',
    dayIndex: 0, date: '2026-05-19',
    timeLabel: '2:00 – 3:00 PM', startHour: 14, endHour: 15,
    type: 'internal', meetLink: 'meet.google.com/arch-sync-mon',
    status: 'ended', attendees: [],
    agenda: [], transcriptStatus: 'processing', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-7',
    title: 'Data Model Review',
    dayIndex: 1, date: '2026-05-20',
    timeLabel: '3:00 – 4:00 PM', startHour: 15, endHour: 16,
    type: 'internal', meetLink: 'meet.google.com/data-model-tue',
    status: 'scheduled', attendees: [],
    agenda: [{ id: 'ag-9', text: 'Review revised entity schema for reporting module', done: false }],
    transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-8',
    title: '1:1 with Rahul',
    dayIndex: 2, date: '2026-05-21',
    timeLabel: '10:00 – 11:00 AM', startHour: 10, endHour: 11,
    type: 'one-one', meetLink: 'meet.google.com/one-rahul-wed',
    status: 'scheduled', attendees: [{ name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', responseStatus: 'accepted' }],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-9',
    title: 'Sprint Review',
    dayIndex: 2, date: '2026-05-21',
    timeLabel: '2:00 – 3:30 PM', startHour: 14, endHour: 15.5,
    type: 'sprint-ceremony', meetLink: 'meet.google.com/spr-review-wed',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-10',
    title: 'Mobile App Roadmap',
    dayIndex: 3, date: '2026-05-22',
    timeLabel: '9:00 – 10:00 AM', startHour: 9, endHour: 10,
    type: 'internal', meetLink: 'meet.google.com/mob-road-thu',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-11',
    title: 'Client Demo – Acme Corp',
    dayIndex: 3, date: '2026-05-22',
    timeLabel: '11:30 AM – 12:30 PM', startHour: 11.5, endHour: 12.5,
    type: 'client-facing', meetLink: 'meet.google.com/demo-acme-thu',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-12',
    title: 'Security Review',
    dayIndex: 3, date: '2026-05-22',
    timeLabel: '3:00 – 4:00 PM', startHour: 15, endHour: 16,
    type: 'internal', meetLink: 'meet.google.com/sec-rev-thu',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-13',
    title: '1:1 with Arjun',
    dayIndex: 4, date: '2026-05-23',
    timeLabel: '10:30 – 11:30 AM', startHour: 10.5, endHour: 11.5,
    type: 'one-one', meetLink: 'meet.google.com/one-arjun-fri',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-14',
    title: 'Sprint Retro',
    dayIndex: 4, date: '2026-05-23',
    timeLabel: '1:30 – 2:30 PM', startHour: 13.5, endHour: 14.5,
    type: 'sprint-ceremony', meetLink: 'meet.google.com/retro-fri',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
  {
    id: 'm-15',
    title: 'Stakeholder Update',
    dayIndex: 4, date: '2026-05-23',
    timeLabel: '4:30 – 5:30 PM', startHour: 16.5, endHour: 17.5,
    type: 'client-facing', meetLink: 'meet.google.com/stakeholder-fri',
    status: 'scheduled', attendees: [],
    agenda: [], transcriptStatus: 'unavailable', transcript: [],
    momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
  },
];

// ─────────────────────────────────────────────
// Helper components
// ─────────────────────────────────────────────

const TranscriptStatusBadge: React.FC<{ status: TranscriptStatus }> = ({ status }) => {
  const map: Record<TranscriptStatus, { label: string; cls: string; icon: React.ReactNode }> = {
    unavailable: { label: 'No transcript', cls: 'text-slate-500 bg-slate-800/50', icon: <MicOff className="w-3 h-3" /> },
    processing: { label: 'Processing…', cls: 'text-amber-400 bg-amber-900/30 animate-pulse', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    ready: { label: 'Transcript ready', cls: 'text-emerald-400 bg-emerald-900/30', icon: <Mic className="w-3 h-3" /> },
    error: { label: 'Fetch error', cls: 'text-rose-400 bg-rose-900/30', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const { label, cls, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {icon}{label}
    </span>
  );
};

const MomStatusBadge: React.FC<{ status: MomStatus }> = ({ status }) => {
  const map: Record<MomStatus, { label: string; cls: string }> = {
    'not-generated': { label: 'MoM pending', cls: 'text-slate-500 bg-slate-800/50' },
    'generating': { label: 'Generating…', cls: 'text-indigo-400 bg-indigo-900/30 animate-pulse' },
    'draft': { label: 'Draft', cls: 'text-purple-400 bg-purple-900/30' },
    'reviewing': { label: 'In review', cls: 'text-amber-400 bg-amber-900/30' },
    'sent': { label: 'MoM sent', cls: 'text-emerald-400 bg-emerald-900/30' },
  };
  const { label, cls } = map[status];
  return <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

const AttendeeResponseDot: React.FC<{ status?: Attendee['responseStatus'] }> = ({ status }) => {
  const cls = status === 'accepted' ? 'bg-emerald-500' : status === 'declined' ? 'bg-rose-500' : status === 'tentative' ? 'bg-amber-500' : 'bg-slate-500';
  return <span className={`w-1.5 h-1.5 rounded-full absolute bottom-0 right-0 border border-[#101220] ${cls}`} />;
};

function formatHourLabel(hour: number): string {
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

// ─────────────────────────────────────────────
// Create Meeting Modal
// ─────────────────────────────────────────────

interface CreateMeetingModalProps {
  onClose: () => void;
  onSave: (m: Meeting) => void;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-05-20');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [type, setType] = useState<MeetingType>('internal');
  const [project, setProject] = useState('');
  const [description, setDesc] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [autoMeet, setAutoMeet] = useState(true);
  const [agendaInput, setAgendaInput] = useState('');
  const [agendaItems, setAgendaItems] = useState<string[]>([]);

  const addAgenda = () => {
    if (agendaInput.trim()) {
      setAgendaItems(p => [...p, agendaInput.trim()]);
      setAgendaInput('');
    }
  };

  const dayNames = ['Mon May 19', 'Tue May 20', 'Wed May 21', 'Thu May 22', 'Fri May 23'];
  const dayIndexFromDate: Record<string, number> = {
    '2026-05-19': 0, '2026-05-20': 1, '2026-05-21': 2, '2026-05-22': 3, '2026-05-23': 4
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const parseHour = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    };
    const sh = parseHour(startTime);
    const eh = parseHour(endTime);
    const dIdx = dayIndexFromDate[date] ?? 1;
    const [sh12, em12] = [
      sh < 12 ? `${Math.floor(sh)}:${String(Math.round((sh % 1) * 60)).padStart(2, '0')} AM` : `${Math.floor(sh) - 12 || 12}:${String(Math.round((sh % 1) * 60)).padStart(2, '0')} PM`,
      eh < 12 ? `${Math.floor(eh)}:${String(Math.round((eh % 1) * 60)).padStart(2, '0')} AM` : `${Math.floor(eh) - 12 || 12}:${String(Math.round((eh % 1) * 60)).padStart(2, '0')} PM`,
    ];
    const newMeeting: Meeting = {
      id: `m-${Date.now()}`,
      title, description, date, dayIndex: dIdx,
      timeLabel: `${sh12} – ${em12}`, startHour: sh, endHour: Math.max(eh, sh + 0.5),
      timezone: 'Asia/Kolkata', type, project, projectId: undefined,
      meetLink: autoMeet ? `meet.google.com/new-${Math.random().toString(36).slice(2, 9)}` : meetLink,
      status: 'scheduled',
      attendees: [],
      agenda: agendaItems.map((text, i) => ({ id: `ag-new-${i}`, text, done: false })),
      transcriptStatus: 'unavailable', transcript: [],
      momStatus: 'not-generated', discussionPoints: [], decisions: [], actionItems: [],
      createdAt: new Date().toISOString(),
    };
    onSave(newMeeting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0f1022] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">New Meeting</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Meeting Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint Planning" className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600" />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
              <select value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#141624] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                {Object.entries(dayIndexFromDate).map(([d, idx]) => (
                  <option key={d} value={d}>{dayNames[idx]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-[#141624] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">End</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-[#141624] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* Type & Project */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value as MeetingType)} className="w-full bg-[#141624] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                <option value="internal">Internal</option>
                <option value="sprint-ceremony">Sprint Ceremony</option>
                <option value="one-one">1:1</option>
                <option value="client-facing">Client-facing</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project</label>
              <input value={project} onChange={e => setProject(e.target.value)} placeholder="Optional" className="w-full bg-[#141624] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600" />
            </div>
          </div>

          {/* Google Meet */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Google Meet</label>
            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${autoMeet ? 'border-indigo-500/40 bg-indigo-900/10' : 'border-slate-800'}`} onClick={() => setAutoMeet(p => !p)}>
              <div className={`w-8 h-4 rounded-full flex items-center transition-all ${autoMeet ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}>
                <div className="w-3 h-3 bg-white rounded-full mx-0.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Auto-generate Meet link</p>
                <p className="text-[10px] text-slate-500">Backend will create and attach a Google Meet conference</p>
              </div>
            </div>
            {!autoMeet && (
              <input value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="meet.google.com/xxx-xxxx-xxx" className="mt-2 w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600" />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="Meeting context and goals…" rows={2} className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600 resize-none" />
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Agenda Items</label>
            <div className="flex gap-2">
              <input value={agendaInput} onChange={e => setAgendaInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAgenda())} placeholder="Add an agenda item…" className="flex-1 bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600" />
              <button onClick={addAgenda} className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            {agendaItems.length > 0 && (
              <ul className="mt-2 space-y-1">
                {agendaItems.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-xs text-slate-300 bg-[#141624] px-3 py-2 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-500" />{item}</span>
                    <button onClick={() => setAgendaItems(p => p.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-rose-400"><X className="w-3 h-3" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-800/60 bg-[#0c0d14]">
          <button onClick={onClose} className="px-4 py-2 border border-slate-800 text-xs font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors">Create Meeting</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export const CalendarWorkspace: React.FC = () => {
  const { theme } = useAuth();

  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const [selectedMeetingId, setSelectedMeetingId] = useState('m-6');
  const [sidebarTab, setSidebarTab] = useState<'agenda' | 'transcript' | 'mom'>('mom');
  const [copied, setCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingMomSection, setEditingMomSection] = useState<'points' | 'decisions' | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(SEED_MEETINGS);

  const isDark = theme === 'dark';

  const MEETING_TYPE_STYLES = isDark ? MEETING_TYPE_STYLES_DARK : MEETING_TYPE_STYLES_LIGHT;

  // ── Resizable sidebar ──
  const [sidebarWidth, setSidebarWidth] = useState(390);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(390);

  const onResizeStart = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = startXRef.current - ev.clientX;
      setSidebarWidth(Math.min(580, Math.max(280, startWidthRef.current + delta)));
    };
    const onUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const tw = {
    pageBg: isDark ? 'bg-[#0c0d14] text-slate-100' : 'bg-slate-50 text-slate-900',
    panelBg: isDark ? 'bg-[#0f1022]' : 'bg-white',
    panelBg2: isDark ? 'bg-[#0c0d14]' : 'bg-slate-50',
    innerBg: isDark ? 'bg-[#141624]/50' : 'bg-slate-50',
    innerBg2: isDark ? 'bg-[#141624]' : 'bg-slate-100',
    gridBg: isDark ? 'bg-[#090a12]' : 'bg-white',
    border: isDark ? 'border-slate-800/60' : 'border-slate-200',
    borderDim: isDark ? 'border-slate-800/40' : 'border-slate-100',
    borderLine: isDark ? 'border-slate-900/80' : 'border-slate-100',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    textDim: isDark ? 'text-slate-500' : 'text-slate-400',
    textFaint: isDark ? 'text-slate-600' : 'text-slate-400',
    hover: isDark ? 'hover:bg-slate-800/10' : 'hover:bg-slate-50',
    hoverDark: isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-100',
    tabInactive: isDark ? 'border-transparent text-slate-500 hover:text-slate-300' : 'border-transparent text-slate-400 hover:text-slate-700',
    statusEnded: isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500',
    fetchBtn: isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    transcriptLine: isDark ? 'bg-[#141624] border-slate-800/50' : 'bg-slate-50 border-slate-200',
    actionRow: isDark ? 'bg-[#0c0d14] border-slate-800' : 'bg-slate-50 border-slate-200',
    momAiBadge: isDark ? 'bg-[#1c1630]/40 border-indigo-900/40' : 'bg-indigo-50/60 border-indigo-200',
    dropdownBg: isDark ? 'bg-[#0f1022] border-slate-800' : 'bg-white border-slate-200',
    meetLinkBg: isDark ? 'bg-[#141624] border-slate-800/60' : 'bg-slate-50 border-slate-200',
    agendaItem: isDark ? 'bg-[#141624]/50 border-slate-800/60 hover:bg-slate-800/20' : 'bg-white border-slate-200 hover:bg-slate-50',
    checkboxBg: isDark ? 'bg-[#0c0d14] border-slate-700' : 'bg-white border-slate-300',
    sidebarFooter: isDark ? 'bg-[#0c0d14]' : 'bg-slate-50',
    actionTableHdr: isDark ? 'bg-[#0c0d14] border-slate-800' : 'bg-slate-50 border-slate-200',
    actionTableRow: isDark ? 'divide-slate-800/40 hover:bg-slate-900/20' : 'divide-slate-100 hover:bg-slate-50',
    monthCell: isDark ? 'border-slate-800/40 bg-[#0f1022]/40 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300',
    monthCellActive: isDark ? 'border-indigo-500/60 bg-indigo-950/10' : 'border-indigo-400 bg-indigo-50/60',
    dayNum: isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100',
    momBadge: isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    transcriptBadge: isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-700',
  };

  const teamMembers = [
    { name: 'Kavya Chopra', email: 'kavya@genessence.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { name: 'Ankit Sharma', email: 'ankit@genessence.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    { name: 'Rahul Sharma', email: 'rahul@genessence.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
    { name: 'Aarav Rao', email: 'aarav@genessence.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80' },
    { name: 'Megan Li', email: 'megan@genessence.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { name: 'Neha Patel', email: 'neha@genessence.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
  ];

  const activeMeeting = useMemo(() => meetings.find(m => m.id === selectedMeetingId) || meetings[0], [meetings, selectedMeetingId]);

  const updateMeeting = useCallback((id: string, updater: (m: Meeting) => Meeting) => {
    setMeetings(prev => prev.map(m => m.id === id ? updater(m) : m));
  }, []);

  // ── Transcript: simulated fetch (backend integration point) ──
  const handleFetchTranscript = (meetingId: string) => {
    updateMeeting(meetingId, m => ({ ...m, transcriptStatus: 'processing' }));
    // TODO: replace with: await api.fetchTranscript(meeting.googleMeetId)
    setTimeout(() => {
      updateMeeting(meetingId, m => ({ ...m, transcriptStatus: m.transcript.length > 0 ? 'ready' : 'error' }));
    }, 2000);
  };

  // ── MoM: simulated AI generation from transcript ──
  const handleGenerateMom = (meetingId: string) => {
    updateMeeting(meetingId, m => ({ ...m, momStatus: 'generating' }));
    // TODO: replace with: await api.generateMom({ transcriptLines: meeting.transcript, meetingId })
    setTimeout(() => {
      updateMeeting(meetingId, m => {
        if (m.transcript.length === 0) return { ...m, momStatus: 'not-generated' };
        // Simulate AI-generated MoM from transcript
        const speakers = [...new Set(m.transcript.map(t => t.sender))];
        return {
          ...m,
          momStatus: 'draft',
          momGeneratedAt: new Date().toISOString(),
          discussionPoints: m.transcript.slice(0, 3).map(t => `${t.sender}: "${t.text.slice(0, 80)}${t.text.length > 80 ? '…' : ''}"`),
          decisions: ['Decision auto-extracted by AI — review and edit before sending.'],
          actionItems: speakers.slice(0, 2).map((name, i) => ({
            id: `ai-act-${i}`,
            item: 'Review and confirm action item from meeting',
            ownerName: name,
            ownerAvatar: m.transcript.find(t => t.sender === name)?.avatar || '',
            dueDate: 'TBD',
            completed: false,
          })),
        };
      });
    }, 2500);
  };

  // ── MoM: send to attendees ──
  const handleSendMom = (meetingId: string) => {
    updateMeeting(meetingId, m => ({ ...m, momStatus: 'sent', momSentAt: new Date().toISOString() }));
    // TODO: backend call: await api.sendMomEmail({ meetingId, attendees: meeting.attendees, mom: { ... } })
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(`https://${link}`).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleAgenda = (meetingId: string, idx: number) => {
    updateMeeting(meetingId, m => {
      const agenda = [...m.agenda];
      agenda[idx] = { ...agenda[idx], done: !agenda[idx].done };
      return { ...m, agenda };
    });
  };

  const handleAddActionItem = (meetingId: string) => {
    updateMeeting(meetingId, m => ({
      ...m,
      actionItems: [...m.actionItems, {
        id: `act-${Date.now()}`,
        item: 'New action item',
        ownerName: teamMembers[0].name,
        ownerAvatar: teamMembers[0].avatar,
        dueDate: 'TBD',
        completed: false,
      }],
    }));
  };

  const handleDeleteActionItem = (meetingId: string, itemId: string) => {
    updateMeeting(meetingId, m => ({ ...m, actionItems: m.actionItems.filter(a => a.id !== itemId) }));
  };

  const handleUpdateActionItem = (meetingId: string, itemId: string, patch: Partial<ActionItem>) => {
    updateMeeting(meetingId, m => ({
      ...m,
      actionItems: m.actionItems.map(a => a.id === itemId ? { ...a, ...patch } : a),
    }));
  };

  const handleAssignOwner = (meetingId: string, itemId: string, member: typeof teamMembers[0]) => {
    handleUpdateActionItem(meetingId, itemId, { ownerName: member.name, ownerAvatar: member.avatar, ownerEmail: member.email });
    setOpenDropdownId(null);
  };

  const dayHeaders = [
    { name: 'Mon', num: 19, index: 0 },
    { name: 'Tue', num: 20, index: 1 },
    { name: 'Wed', num: 21, index: 2 },
    { name: 'Thu', num: 22, index: 3 },
    { name: 'Fri', num: 23, index: 4 },
  ];

  // Month view weeks
  const monthWeeks = [
    [{ num: 28, month: false, di: 0 }, { num: 29, month: false, di: 1 }, { num: 30, month: false, di: 2 }, { num: 1, month: true, di: 3 }, { num: 2, month: true, di: 4 }],
    [{ num: 5, month: true, di: 0 }, { num: 6, month: true, di: 1 }, { num: 7, month: true, di: 2 }, { num: 8, month: true, di: 3 }, { num: 9, month: true, di: 4 }],
    [{ num: 12, month: true, di: 0 }, { num: 13, month: true, di: 1 }, { num: 14, month: true, di: 2 }, { num: 15, month: true, di: 3 }, { num: 16, month: true, di: 4 }],
    [{ num: 19, month: true, di: 0 }, { num: 20, month: true, di: 1, active: true }, { num: 21, month: true, di: 2 }, { num: 22, month: true, di: 3 }, { num: 23, month: true, di: 4 }],
    [{ num: 26, month: true, di: 0 }, { num: 27, month: true, di: 1 }, { num: 28, month: true, di: 2 }, { num: 29, month: true, di: 3 }, { num: 30, month: true, di: 4 }],
  ];

  // ── Meeting block layout (overlap detection) ──
  const getBlockLayout = (meet: Meeting): { left: string; width: string } => {
    const sameSlotMeetings = meetings.filter(m =>
      m.dayIndex === meet.dayIndex &&
      m.startHour < meet.endHour &&
      m.endHour > meet.startHour
    );
    const total = sameSlotMeetings.length;
    if (total <= 1) return { left: '1px', width: 'calc(100% - 2px)' };
    const idx = sameSlotMeetings.findIndex(m => m.id === meet.id);
    const pct = 100 / total;
    return { left: `calc(${idx * pct}% + 1px)`, width: `calc(${pct}% - 2px)` };
  };

  const renderMeetingBlock = (meet: Meeting, isWeekView = false) => {
    const s = MEETING_TYPE_STYLES[meet.type];
    const top = (meet.startHour - GRID_START_HOUR) * HOUR_HEIGHT;
    const height = Math.max((meet.endHour - meet.startHour) * HOUR_HEIGHT - 2, 24);
    const { left: leftOffset, width: blockWidth } = isWeekView
      ? (() => {
        const sameDay = meetings.filter(m => m.dayIndex === meet.dayIndex && m.startHour < meet.endHour && m.endHour > meet.startHour);
        if (sameDay.length <= 1) return { left: '1px', width: 'calc(100% - 2px)' };
        const i = sameDay.findIndex(m => m.id === meet.id);
        const pct = 100 / sameDay.length;
        return { left: `calc(${i * pct}% + 1px)`, width: `calc(${pct}% - 2px)` };
      })()
      : getBlockLayout(meet);
    const isSelected = meet.id === selectedMeetingId;

    return (
      <div
        key={meet.id}
        onClick={() => setSelectedMeetingId(meet.id)}
        className={`absolute px-2 py-1.5 rounded-[5px] cursor-pointer transition-all overflow-hidden group/blk ${s.bg} ${s.border} ${isSelected ? 'ring-2 ring-white/20 ring-offset-1 ring-offset-[#0c0d14]' : 'hover:brightness-125'}`}
        style={{ top, height, left: leftOffset, width: isWeekView ? undefined : blockWidth, zIndex: isSelected ? 2 : 1 }}
      >
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500">{meet.timeLabel.split('–')[0].trim()}</span>
            <a href={`https://${meet.meetLink}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              className="opacity-0 group-hover/blk:opacity-100 transition-opacity">
              <Video className="w-3 h-3 text-emerald-400" />
            </a>
          </div>
          <h4 className={`text-[11px] font-bold leading-tight truncate ${s.text}`}>{meet.title}</h4>
          {meet.project && height > 50 && <p className="text-[9px] text-slate-500 truncate">{meet.project}</p>}
          {height > 60 && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${s.badge}`}>{s.label}</span>
              {meet.momStatus === 'sent' && <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${tw.momBadge}`}>MoM sent</span>}
              {meet.transcriptStatus === 'ready' && meet.momStatus !== 'sent' && <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${tw.transcriptBadge}`}>Transcript</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // RIGHT SIDEBAR
  // ─────────────────────────────────────────────
  const renderSidebar = () => {
    const m = activeMeeting;
    const s = MEETING_TYPE_STYLES[m.type];

    return (
      <div className={`w-full flex-shrink-0 border-l flex flex-col h-full overflow-hidden transition-colors ${tw.panelBg} ${tw.border}`}>

        {/* Header */}
        <div className={`p-4 border-b space-y-3 flex-shrink-0 ${tw.border}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${s.text}`}>{s.label}</span>
                <MomStatusBadge status={m.momStatus} />
              </div>
              <h3 className={`text-sm font-bold leading-tight truncate ${tw.text}`}>{m.title}</h3>
              {m.project && <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${tw.textDim}`}><Tag className="w-2.5 h-2.5" />{m.project}</p>}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <TranscriptStatusBadge status={m.transcriptStatus} />
            </div>
          </div>

          {/* Date & time */}
          <div className={`flex items-center gap-4 text-[11px] font-medium ${tw.textMuted}`}>
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{m.date || 'May 20, 2026'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{m.timeLabel}</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" />{m.timezone || 'IST'}</span>
          </div>

          {/* Meet link */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${tw.meetLinkBg}`}>
            <a href={`https://${m.meetLink}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-[11px] text-emerald-500 font-semibold hover:text-emerald-400 transition-colors min-w-0">
              <Video className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{m.meetLink}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60" />
            </a>
            <button onClick={() => handleCopyLink(m.meetLink)} className={`p-1 transition-colors flex-shrink-0 ${tw.textDim} hover:text-indigo-500`}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Attendees */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {m.attendees.length > 0 ? (
                <>
                  <div className="flex -space-x-2">
                    {m.attendees.slice(0, 5).map((a, i) => (
                      <div key={i} className="relative" title={`${a.name} (${a.responseStatus || 'pending'})`}>
                        <img src={a.avatar} alt={a.name} className={`w-7 h-7 rounded-full object-cover border-2 ${isDark ? 'border-[#0f1022]' : 'border-white'}`} />
                        <AttendeeResponseDot status={a.responseStatus} />
                      </div>
                    ))}
                  </div>
                  {m.attendees.length > 5 && <span className={`text-[10px] ml-2 ${tw.textDim}`}>+{m.attendees.length - 5}</span>}
                  <span className={`text-[10px] ml-2 ${tw.textDim}`}>{m.attendees.length} attendees</span>
                </>
              ) : (
                <span className={`text-[10px] italic flex items-center gap-1 ${tw.textFaint}`}><Users className="w-3 h-3" />No attendees synced yet</span>
              )}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'live' ? 'bg-rose-500/20 text-rose-400 animate-pulse' :
              m.status === 'ended' ? tw.statusEnded :
                m.status === 'cancelled' ? 'bg-rose-900/30 text-rose-500' :
                  'bg-indigo-900/20 text-indigo-400'
              }`}>
              {m.status === 'live' ? '● LIVE' : m.status}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className={`flex border-b px-4 flex-shrink-0 ${tw.panelBg2} ${tw.border}`}>
          {([['agenda', <ListTodo className="w-3.5 h-3.5" />, 'Agenda'],
          ['transcript', <MessageSquare className="w-3.5 h-3.5" />, 'Transcript'],
          ['mom', <Sparkles className="w-3.5 h-3.5" />, 'MoM']] as const).map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setSidebarTab(tab as any)}
              className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 -mb-px transition-colors ${sidebarTab === tab
                ? 'border-indigo-500 text-indigo-400'
                : tw.tabInactive
                }`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── AGENDA TAB ── */}
          {sidebarTab === 'agenda' && (
            <>
              <div className="flex items-center justify-between">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tw.textMuted}`}>Agenda Checklist</h4>
                <span className={`text-[10px] ${tw.textDim}`}>{m.agenda.filter(a => a.done).length}/{m.agenda.length} done</span>
              </div>
              {m.agenda.length > 0 ? (
                <div className="space-y-2">
                  {m.agenda.map((item, idx) => (
                    <label key={item.id} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${tw.agendaItem}`}>
                      <input type="checkbox" checked={item.done} onChange={() => handleToggleAgenda(m.id, idx)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0" />
                      <span className={`text-xs leading-relaxed ${item.done ? `line-through ${tw.textFaint}` : `${tw.text} font-medium`}`}>{item.text}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className={`py-10 text-center text-xs italic ${tw.textFaint}`}>No agenda items added yet</div>
              )}
            </>
          )}

          {/* ── TRANSCRIPT TAB ── */}
          {sidebarTab === 'transcript' && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tw.textMuted}`}>Live Transcript</h4>
                  {m.transcriptFetchedAt && (
                    <p className={`text-[9px] ${tw.textFaint}`}>Last synced: {new Date(m.transcriptFetchedAt).toLocaleTimeString()}</p>
                  )}
                </div>
                {m.transcriptStatus !== 'ready' && (
                  <button
                    onClick={() => handleFetchTranscript(m.id)}
                    disabled={m.transcriptStatus === 'processing'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${tw.fetchBtn}`}
                  >
                    {m.transcriptStatus === 'processing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {m.transcriptStatus === 'processing' ? 'Fetching…' : 'Fetch Transcript'}
                  </button>
                )}
                {m.transcriptStatus === 'ready' && (
                  <button onClick={() => handleFetchTranscript(m.id)} className={`flex items-center gap-1 text-[10px] ${tw.textDim} hover:text-indigo-500`}>
                    <RefreshCw className="w-3 h-3" />Refresh
                  </button>
                )}
              </div>

              {m.transcriptStatus === 'unavailable' && (
                <div className="py-10 text-center space-y-3">
                  <MicOff className={`w-8 h-8 mx-auto ${tw.textFaint}`} />
                  <div>
                    <p className={`text-xs font-medium ${tw.textDim}`}>No transcript available</p>
                    <p className={`text-[10px] mt-1 ${tw.textFaint}`}>Transcripts are auto-fetched from Google Meet after the session ends. You can also fetch manually.</p>
                  </div>
                </div>
              )}
              {m.transcriptStatus === 'processing' && (
                <div className="py-10 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-500 mx-auto animate-spin" />
                  <p className={`text-xs ${tw.textMuted}`}>Processing transcript from Google Meet…</p>
                  <p className={`text-[10px] ${tw.textFaint}`}>This usually takes 1–2 minutes after the meeting ends.</p>
                </div>
              )}
              {m.transcriptStatus === 'error' && (
                <div className="py-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="text-xs text-rose-400 font-medium">Failed to fetch transcript</p>
                  <p className={`text-[10px] ${tw.textFaint}`}>Check Google Meet permissions or try again later.</p>
                </div>
              )}
              {m.transcriptStatus === 'ready' && (
                <div className="space-y-4">
                  {m.transcript.map(line => (
                    <div key={line.id} className="flex items-start gap-3">
                      <img src={line.avatar} alt={line.sender} className={`w-7 h-7 rounded-full object-cover ring-1 flex-shrink-0 mt-0.5 ${isDark ? 'ring-slate-800' : 'ring-slate-200'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-xs font-bold ${tw.text}`}>{line.sender}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {line.confidence !== undefined && (
                              <span className={`text-[9px] font-mono ${line.confidence > 0.95 ? 'text-emerald-600' : line.confidence > 0.85 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {Math.round(line.confidence * 100)}%
                              </span>
                            )}
                            <span className={`text-[9px] ${tw.textFaint}`}>{line.time}</span>
                          </div>
                        </div>
                        <p className={`text-[11px] leading-relaxed p-3 rounded-lg border ${isDark ? 'text-slate-300' : 'text-slate-700'} ${tw.transcriptLine}`}>{line.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MOM TAB ── */}
          {sidebarTab === 'mom' && (
            <>
              {m.transcriptStatus === 'ready' && m.momStatus === 'not-generated' && (
                <div className={`border border-dashed border-indigo-800/60 rounded-xl p-5 text-center space-y-3 ${isDark ? 'bg-indigo-950/10' : 'bg-indigo-50/50'}`}>
                  <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div>
                    <p className={`text-sm font-bold ${tw.text}`}>Generate MoM from Transcript</p>
                    <p className={`text-[11px] mt-1 leading-relaxed ${tw.textMuted}`}>AI will analyze the meeting transcript and generate discussion points, decisions, and action items automatically.</p>
                  </div>
                  <button onClick={() => handleGenerateMom(m.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 mx-auto">
                    <Sparkles className="w-3.5 h-3.5" />Generate MoM Draft
                  </button>
                </div>
              )}

              {m.momStatus === 'generating' && (
                <div className={`border border-indigo-800/30 rounded-xl p-6 text-center space-y-3 ${isDark ? 'bg-indigo-950/10' : 'bg-indigo-50/50'}`}>
                  <Loader2 className="w-8 h-8 text-indigo-500 mx-auto animate-spin" />
                  <p className="text-xs text-indigo-400 font-semibold">Generating MoM from transcript…</p>
                  <p className={`text-[10px] ${tw.textDim}`}>Analyzing speaker segments, extracting key decisions and action items.</p>
                </div>
              )}

              {m.transcriptStatus !== 'ready' && m.momStatus === 'not-generated' && (
                <div className={`border rounded-xl p-5 text-center space-y-3 ${tw.border}`}>
                  <FileText className={`w-7 h-7 mx-auto ${tw.textFaint}`} />
                  <div>
                    <p className={`text-xs font-semibold ${tw.textDim}`}>Transcript required</p>
                    <p className={`text-[10px] mt-1 ${tw.textFaint}`}>Fetch the meeting transcript first, then generate the MoM from it.</p>
                  </div>
                  <button onClick={() => setSidebarTab('transcript')} className="text-[11px] text-indigo-500 hover:text-indigo-400 font-semibold">
                    Go to Transcript →
                  </button>
                </div>
              )}

              {(m.momStatus === 'draft' || m.momStatus === 'reviewing' || m.momStatus === 'sent') && (
                <>
                  {/* AI badge */}
                  <div className={`flex items-center justify-between border p-3 rounded-xl ${tw.momAiBadge}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <div>
                        <p className={`text-xs font-bold ${tw.text}`}>AI-generated draft</p>
                        {m.momGeneratedAt && <p className={`text-[9px] ${tw.textDim}`}>{new Date(m.momGeneratedAt).toLocaleString()}</p>}
                      </div>
                    </div>
                    {m.momStatus !== 'sent' && (
                      <button onClick={() => handleGenerateMom(m.id)} className={`text-[10px] font-semibold border px-2.5 py-1 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white border-slate-800 bg-[#0c0d14]' : 'text-slate-600 hover:text-slate-900 border-slate-200 bg-white'}`}>
                        Regenerate
                      </button>
                    )}
                    {m.momStatus === 'sent' && m.momSentAt && (
                      <span className="text-[9px] text-emerald-400">Sent {new Date(m.momSentAt).toLocaleTimeString()}</span>
                    )}
                  </div>

                  {/* Discussion points */}
                  {m.discussionPoints.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tw.textMuted}`}>Discussion Points</h4>
                        {m.momStatus !== 'sent' && (
                          <button onClick={() => setEditingMomSection(editingMomSection === 'points' ? null : 'points')} className="text-[10px] text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />Edit
                          </button>
                        )}
                      </div>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        {m.discussionPoints.map((pt, i) => (
                          <li key={i} className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{pt}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Decisions */}
                  {m.decisions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tw.textMuted}`}>Decisions Made</h4>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        {m.decisions.map((dec, i) => (
                          <li key={i} className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{dec}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Action items table */}
                  <div className="space-y-2">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tw.textMuted}`}>Action Items</h4>
                    <div className={`border rounded-xl overflow-hidden ${tw.border}`}>
                      {/* Header */}
                      <div className={`grid grid-cols-12 border-b px-3 py-2 text-[9px] font-bold uppercase tracking-wider ${tw.actionTableHdr} ${tw.textDim}`}>
                        <div className="col-span-6">Item</div>
                        <div className="col-span-3 text-center">Owner</div>
                        <div className="col-span-3 text-right">Due</div>
                      </div>
                      {/* Rows */}
                      <div className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
                        {m.actionItems.map(act => (
                          <div key={act.id} className={`grid grid-cols-12 px-3 py-2.5 items-center group/row transition-colors ${tw.actionTableRow}`}>
                            <div className="col-span-6 flex items-center gap-2 pr-2">
                              {m.momStatus !== 'sent' && (
                                <input type="checkbox" checked={!!act.completed}
                                  onChange={() => handleUpdateActionItem(m.id, act.id, { completed: !act.completed })}
                                  className="rounded text-indigo-600 focus:ring-indigo-500 flex-shrink-0" />
                              )}
                              <input
                                type="text" value={act.item} readOnly={m.momStatus === 'sent'}
                                onChange={e => handleUpdateActionItem(m.id, act.id, { item: e.target.value })}
                                className={`bg-transparent border-0 outline-none text-xs w-full ${act.completed ? `line-through ${tw.textFaint}` : `${tw.text} font-medium`} ${m.momStatus === 'sent' ? 'cursor-default' : ''}`}
                              />
                            </div>
                            <div className="col-span-3 flex justify-center relative">
                              <button type="button"
                                disabled={m.momStatus === 'sent'}
                                onClick={() => setOpenDropdownId(openDropdownId === act.id ? null : act.id)}
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors disabled:cursor-default ${tw.hoverDark}`}>
                                <img src={act.ownerAvatar} alt={act.ownerName} className={`w-5 h-5 rounded-full object-cover ring-1 ${isDark ? 'ring-slate-800' : 'ring-slate-200'}`} title={act.ownerName} />
                                {m.momStatus !== 'sent' && <ChevronDown className={`w-2.5 h-2.5 ${tw.textFaint}`} />}
                              </button>
                              {openDropdownId === act.id && (
                                <div className={`absolute bottom-full mb-1 border rounded-xl p-1 z-40 shadow-xl w-44 left-1/2 -translate-x-1/2 ${tw.dropdownBg}`}>
                                  {teamMembers.map(member => (
                                    <button key={member.name} type="button"
                                      onClick={() => handleAssignOwner(m.id, act.id, member)}
                                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${tw.hoverDark}`}>
                                      <img src={member.avatar} alt={member.name} className="w-4 h-4 rounded-full object-cover" />
                                      <span className={`text-[11px] font-semibold truncate ${tw.text}`}>{member.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="col-span-3 flex items-center justify-end gap-1.5">
                              <input type="text" value={act.dueDate} readOnly={m.momStatus === 'sent'}
                                onChange={e => handleUpdateActionItem(m.id, act.id, { dueDate: e.target.value })}
                                className={`bg-transparent border-0 outline-none text-[10px] text-right w-full font-mono ${tw.textMuted} ${m.momStatus === 'sent' ? 'cursor-default' : ''}`} />
                              {m.momStatus !== 'sent' && (
                                <button onClick={() => handleDeleteActionItem(m.id, act.id)}
                                  className={`opacity-0 group-hover/row:opacity-100 transition-all flex-shrink-0 ${tw.textFaint} hover:text-rose-400`}>
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {m.actionItems.length === 0 && (
                          <div className={`py-6 text-center text-xs italic ${tw.textFaint}`}>No action items</div>
                        )}
                      </div>
                    </div>
                    {m.momStatus !== 'sent' && (
                      <button onClick={() => handleAddActionItem(m.id)} className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                        <Plus className="w-3.5 h-3.5" />Add action item
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}

        </div>

        {/* Footer actions */}
        {sidebarTab === 'mom' && (m.momStatus === 'draft' || m.momStatus === 'reviewing') && (
          <div className={`p-4 border-t space-y-2.5 flex-shrink-0 ${tw.sidebarFooter} ${tw.border}`}>
            <div className="flex gap-2">
              <button
                onClick={() => handleSendMom(m.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors">
                <Send className="w-3.5 h-3.5" />Send MoM to Attendees
              </button>
              <button
                onClick={() => { }}
                className={`px-3 py-2.5 border text-xs font-semibold rounded-xl transition-colors ${tw.border} ${tw.textMuted} ${tw.hoverDark}`}>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className={`text-[9px] text-center leading-relaxed ${tw.textFaint}`}>
              Sends a pre-filled email with meeting notes to all {m.attendees.length > 0 ? m.attendees.length : 'synced'} attendees.
            </p>
          </div>
        )}
        {sidebarTab === 'mom' && m.momStatus === 'sent' && (
          <div className={`p-4 border-t flex-shrink-0 ${tw.sidebarFooter} ${tw.border}`}>
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-500 font-semibold">
              <Check className="w-4 h-4" />MoM sent to all attendees
            </div>
          </div>
        )}
      </div>
    );
  };


  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className={`flex h-full w-full overflow-hidden font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0c0d14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          onSave={m => setMeetings(prev => [...prev, m])}
        />
      )}

      {/* ── Left: Calendar pane ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Toolbar */}
        <div className={`h-14 px-5 flex items-center justify-between border-b flex-shrink-0 transition-colors ${isDark ? 'border-slate-800/60 bg-[#0c0d14]' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveDayIndex(1); setCurrentView('week'); }}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
              Today
            </button>
            <div className={`flex border rounded-lg overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button onClick={() => currentView === 'day' && setActiveDayIndex(p => Math.max(0, p - 1))}
                className={`p-1.5 border-r transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-500 hover:text-white border-slate-800' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'}`}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => currentView === 'day' && setActiveDayIndex(p => Math.min(4, p + 1))}
                className={`p-1.5 transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-700'}`}>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className={`text-sm font-bold ${tw.text}`}>
              {currentView === 'day' ? `${dayHeaders[activeDayIndex].name} May ${dayHeaders[activeDayIndex].num}, 2026` : 'May 2026'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className={`hidden lg:flex items-center gap-4 text-[10px] font-semibold mr-2 ${tw.textDim}`}>
              {Object.values(MEETING_TYPE_STYLES).map(s => (
                <span key={s.label} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}</span>
              ))}
            </div>
            {/* View toggle */}
            <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {(['day', 'week', 'month'] as const).map(v => (
                <button key={v} onClick={() => setCurrentView(v)}
                  className={`px-3 py-1 text-[11px] font-bold capitalize rounded-md transition-all ${currentView === v
                    ? isDark ? 'bg-[#1c1e2e] text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                    }`}>{v}</button>
              ))}
            </div>
            <button onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
              <Plus className="w-3.5 h-3.5" />New Meeting
            </button>
          </div>
        </div>

        {/* Calendar grid area */}
        <div className={`flex-1 overflow-y-auto transition-colors ${theme === 'dark' ? 'bg-[#090a12]' : 'bg-slate-100'}`}>

          {/* ── WEEK VIEW ── */}
          {currentView === 'week' && (
            <div style={{ minHeight: `${HOUR_ROWS.length * HOUR_HEIGHT + 50}px` }}>
              {/* Day headers */}
              <div className={`flex sticky top-0 z-10 border-b ${theme === 'dark' ? 'border-slate-800/60 bg-[#0c0d14]' : 'border-slate-200 bg-white'}`}>
                <div className={`w-14 border-r py-3 text-[9px] font-mono text-right pr-2 ${theme === 'dark' ? 'border-slate-800/40 text-slate-600' : 'border-slate-200 text-slate-400'}`}>GMT+5:30</div>
                <div className="flex-1 grid grid-cols-5">
                  {dayHeaders.map(day => (
                    <div key={day.name}
                      onClick={() => { setActiveDayIndex(day.index); setCurrentView('day'); }}
                      className={`py-3 flex flex-col items-center border-r last:border-r-0 cursor-pointer transition-colors ${theme === 'dark' ? 'border-slate-800/40 hover:bg-slate-800/10' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{day.name}</span>
                      <span className={`text-xs font-bold mt-0.5 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${day.index === activeDayIndex ? 'bg-indigo-600 text-white' : theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                        }`}>{day.num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="flex">
                {/* Hour labels */}
                <div className={`w-14 flex-shrink-0 border-r ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200'}`}>
                  {HOUR_ROWS.map((hour, idx) => (
                    <div key={hour} className={`text-[9px] font-mono text-right pr-2 select-none ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}
                      style={{ height: HOUR_HEIGHT, paddingTop: idx === 0 ? 0 : 2 }}>
                      {idx > 0 && formatHourLabel(hour)}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                <div className="flex-1 grid grid-cols-5">
                  {dayHeaders.map(day => (
                    <div key={day.index} className={`relative border-r last:border-r-0 ${theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200'}`}>
                      {/* Hour lines */}
                      {HOUR_ROWS.map(hour => (
                        <div key={hour} className={`border-b ${theme === 'dark' ? 'border-slate-900/80' : 'border-slate-200/60'}`} style={{ height: HOUR_HEIGHT }} />
                      ))}
                      {/* Meeting blocks */}
                      <div className="absolute inset-0">
                        {meetings.filter(m => m.dayIndex === day.index).map(meet => {
                          const s = MEETING_TYPE_STYLES[meet.type];
                          const top = (meet.startHour - GRID_START_HOUR) * HOUR_HEIGHT;
                          const height = Math.max((meet.endHour - meet.startHour) * HOUR_HEIGHT - 2, 22);
                          const sameSlot = meetings.filter(m2 => m2.dayIndex === day.index && m2.startHour < meet.endHour && m2.endHour > meet.startHour);
                          const total = sameSlot.length;
                          const idx2 = sameSlot.findIndex(m2 => m2.id === meet.id);
                          const w = total > 1 ? `calc(${100 / total}% - 2px)` : 'calc(100% - 2px)';
                          const l = total > 1 ? `calc(${(idx2 * 100) / total}% + 1px)` : '1px';
                          const isSelected = meet.id === selectedMeetingId;

                          return (
                            <div key={meet.id}
                              onClick={() => setSelectedMeetingId(meet.id)}
                              className={`absolute px-2 py-1.5 rounded-[4px] cursor-pointer overflow-hidden group/blk transition-all ${s.bg} ${s.border} ${isSelected ? 'ring-1 ring-white/20' : 'hover:brightness-125'}`}
                              style={{ top, height, left: l, width: w, zIndex: isSelected ? 2 : 1 }}>
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-bold truncate ${s.text}`}>{meet.title}</span>
                                <a href={`https://${meet.meetLink}`} target="_blank" rel="noreferrer"
                                  onClick={e => e.stopPropagation()} className="opacity-0 group-hover/blk:opacity-100">
                                  <Video className="w-3 h-3 text-emerald-400" />
                                </a>
                              </div>
                              {height > 44 && <p className="text-[9px] text-slate-500 truncate">{meet.timeLabel}</p>}
                              {height > 60 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {meet.momStatus === 'sent' && <span className={`text-[8px] px-1 py-0.5 rounded ${tw.momBadge}`}>MoM</span>}
                                  {meet.transcriptStatus === 'ready' && <span className={`text-[8px] px-1 py-0.5 rounded ${tw.transcriptBadge}`}>Transcript</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {/* Current time line on Tuesday */}
                      {day.index === 1 && (
                        <div className="absolute flex items-center pointer-events-none z-10" style={{ top: (9.9 - GRID_START_HOUR) * HOUR_HEIGHT, left: 0, right: 0 }}>
                          <div className="w-2 h-2 bg-rose-500 rounded-full -ml-1 flex-shrink-0 border-2 border-[#090a12]" />
                          <div className="h-0.5 bg-rose-500 flex-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── DAY VIEW ── */}
          {currentView === 'day' && (
            <div>
              <div className={`flex sticky top-0 z-10 border-b ${isDark ? 'border-slate-800/60 bg-[#0c0d14]' : 'border-slate-200 bg-white'}`}>
                <div className={`w-14 border-r py-3 text-[9px] font-mono text-right pr-2 ${isDark ? 'border-slate-800/40 text-slate-600' : 'border-slate-200 text-slate-400'}`}>GMT+5:30</div>
                <div className="flex-1 py-3 flex items-center justify-center">
                  <span className={`text-xs font-bold ${tw.text}`}>
                    {dayHeaders[activeDayIndex].name}, {dayHeaders[activeDayIndex].num} May 2026
                  </span>
                </div>
              </div>
              <div className="flex">
                <div className={`w-14 flex-shrink-0 border-r ${isDark ? 'border-slate-800/40' : 'border-slate-200'}`}>
                  {HOUR_ROWS.map((hour, idx) => (
                    <div key={hour} className={`text-[9px] font-mono text-right pr-2 select-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
                      style={{ height: HOUR_HEIGHT, paddingTop: idx === 0 ? 0 : 2 }}>
                      {idx > 0 && formatHourLabel(hour)}
                    </div>
                  ))}
                </div>
                <div className="flex-1 relative">
                  {HOUR_ROWS.map(hour => (
                    <div key={hour} className={`border-b ${tw.borderLine}`} style={{ height: HOUR_HEIGHT }} />
                  ))}
                  <div className="absolute inset-0">
                    {meetings.filter(m => m.dayIndex === activeDayIndex).map(meet => {
                      const s = MEETING_TYPE_STYLES[meet.type];
                      const top = (meet.startHour - GRID_START_HOUR) * HOUR_HEIGHT;
                      const height = Math.max((meet.endHour - meet.startHour) * HOUR_HEIGHT - 2, 22);
                      const sameSlot = meetings.filter(m2 => m2.dayIndex === activeDayIndex && m2.startHour < meet.endHour && m2.endHour > meet.startHour);
                      const total = sameSlot.length;
                      const idx2 = sameSlot.findIndex(m2 => m2.id === meet.id);
                      const w = total > 1 ? `calc(${100 / total}% - 4px)` : 'calc(100% - 4px)';
                      const l = total > 1 ? `calc(${(idx2 * 100) / total}% + 2px)` : '2px';
                      const isSelected = meet.id === selectedMeetingId;
                      return (
                        <div key={meet.id}
                          onClick={() => setSelectedMeetingId(meet.id)}
                          className={`absolute px-4 py-2.5 rounded-[6px] cursor-pointer overflow-hidden group/blk transition-all ${s.bg} ${s.border} ${isSelected ? 'ring-2 ring-white/20' : 'hover:brightness-125'}`}
                          style={{ top, height, left: l, width: w, zIndex: isSelected ? 2 : 1 }}>
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold truncate ${s.text}`}>{meet.title}</h4>
                            <a href={`https://${meet.meetLink}`} target="_blank" rel="noreferrer"
                              onClick={e => e.stopPropagation()} className="hover:opacity-100 opacity-60"><Video className="w-3.5 h-3.5 text-emerald-400" /></a>
                          </div>
                          {height > 40 && <p className="text-[10px] text-slate-500 mt-0.5">{meet.timeLabel}</p>}
                          {height > 65 && meet.project && <p className="text-[10px] text-slate-500 mt-0.5">{meet.project}</p>}
                          {height > 80 && (
                            <div className="flex gap-1.5 mt-2">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${s.badge}`}>{s.label}</span>
                              {meet.momStatus === 'sent' && <span className={`text-[9px] px-1.5 py-0.5 rounded ${tw.momBadge}`}>MoM sent</span>}
                              {meet.transcriptStatus === 'ready' && <span className={`text-[9px] px-1.5 py-0.5 rounded ${tw.transcriptBadge}`}>Transcript ready</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {activeDayIndex === 1 && (
                    <div className="absolute flex items-center pointer-events-none z-10" style={{ top: (9.9 - GRID_START_HOUR) * HOUR_HEIGHT, left: 0, right: 0 }}>
                      <div className={`w-2 h-2 bg-rose-500 rounded-full -ml-1 flex-shrink-0 border-2 ${isDark ? 'border-[#090a12]' : 'border-slate-100'}`} />
                      <div className="h-0.5 bg-rose-500 flex-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── MONTH VIEW ── */}
          {currentView === 'month' && (
            <div className="p-4 h-full flex flex-col min-h-[600px]">
              <div className={`grid grid-cols-5 pb-2 border-b ${tw.borderDim}`}>
                {dayHeaders.map(d => (
                  <div key={d.name} className={`text-center text-[9px] font-bold uppercase tracking-wider py-1 ${tw.textDim}`}>{d.name}</div>
                ))}
              </div>
              <div className="flex-1 grid grid-rows-5 gap-1.5 mt-2">
                {monthWeeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-5 gap-1.5">
                    {week.map((cell, ci) => {
                      const cellMeetings = wi === 3 ? meetings.filter(m => m.dayIndex === cell.di) : [];
                      const isActive = (cell as any).active;
                      return (
                        <div key={ci}
                          onClick={() => { setActiveDayIndex(cell.di); setCurrentView('day'); }}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col min-h-[90px] ${isActive ? tw.monthCellActive : tw.monthCell} ${!cell.month ? 'opacity-30' : ''}`}>
                          <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full mb-1.5 ${isActive ? 'bg-indigo-600 text-white' : tw.dayNum}`}>{cell.num}</span>
                          <div className="flex-1 space-y-0.5 overflow-hidden">
                            {cellMeetings.slice(0, 3).map(meet => {
                              const s = MEETING_TYPE_STYLES[meet.type];
                              return (
                                <div key={meet.id}
                                  onClick={e => { e.stopPropagation(); setSelectedMeetingId(meet.id); }}
                                  className={`text-[8px] font-semibold px-1.5 py-0.5 rounded truncate cursor-pointer transition-all ${s.bg} ${s.text} border-l-2 ${meet.id === selectedMeetingId ? 'ring-1 ring-indigo-500' : ''}`}
                                  style={{ borderColor: s.dot.replace('bg-', '#').slice(0, 7) }}>
                                  {meet.title}
                                </div>
                              );
                            })}
                            {cellMeetings.length > 3 && (
                              <span className={`text-[8px] font-semibold pl-1 ${tw.textFaint}`}>+{cellMeetings.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Resize handle ── */}
      <div
        onMouseDown={onResizeStart}
        className={`w-1 flex-shrink-0 cursor-col-resize group relative z-20 transition-colors ${isDark ? 'hover:bg-indigo-500/40' : 'hover:bg-indigo-400/40'}`}
      >
        <div className={`absolute inset-y-0 -left-0.5 -right-0.5 group-hover:bg-indigo-500/20 rounded transition-colors`} />
      </div>

      {/* ── Right Sidebar ── */}
      <div style={{ width: sidebarWidth }} className="flex-shrink-0">
        {renderSidebar()}
      </div>
    </div>
  );
};

export default CalendarWorkspace;