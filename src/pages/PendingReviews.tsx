import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  X,
  FileCheck,
  Clock,
  GitPullRequest,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileCode
} from 'lucide-react';

interface ReviewItem {
  id: string;
  type: 'PR' | 'Leave' | 'Timesheet' | 'Design';
  title: string;
  submitterName: string;
  submitterAvatar: string;
  details: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const PendingReviews: React.FC = () => {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      type: 'PR',
      title: 'PR #142: Inbound Webhook Handlers',
      submitterName: 'Ankit Sharma',
      submitterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      details: 'Implements secure decryption handshake for Paygate gateway callbacks. 12 files changed, +340 lines.',
      date: 'Today, 10:15 AM',
      status: 'pending'
    },
    {
      id: 'rev-2',
      type: 'Timesheet',
      title: 'Timesheet - Week 25',
      submitterName: 'Rahul Sharma',
      submitterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      details: 'Total Logged Time: 40 hrs (Core Platform development, Bug triage, security handshake specs).',
      date: 'Yesterday',
      status: 'pending'
    },
    {
      id: 'rev-3',
      type: 'Leave',
      title: 'Annual Leave Request (2 Days)',
      submitterName: 'Neha Patel',
      submitterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      details: 'Planned dates: June 29 – June 30, 2026. Handover complete to Megan Li.',
      date: 'Yesterday',
      status: 'pending'
    },
    {
      id: 'rev-4',
      type: 'Design',
      title: 'Figma Design Sign-off',
      submitterName: 'Megan Li',
      submitterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      details: 'Mobile billing view components redlines. Parity draft matching web dashboard user experience.',
      date: 'May 19, 2026',
      status: 'approved'
    }
  ]);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(item => item.id === id ? { ...item, status: action } : item));
  };

  const getIcon = (type: ReviewItem['type']) => {
    switch (type) {
      case 'PR':
        return <GitPullRequest className="w-5 h-5 text-purple-500" />;
      case 'Timesheet':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Leave':
        return <CheckCircle className="w-5 h-5 text-rose-500" />;
      case 'Design':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className={`p-8 flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0c0d14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Title */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Pending Reviews</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review, authorize, or request changes for tasks, leaves, and git merge PRs.</p>
        </div>
        <div className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
          Total Pending: {reviews.filter(r => r.status === 'pending').length} items
        </div>
      </div>

      {/* Reviews Table container */}
      <div className={`border rounded-2xl flex-1 overflow-y-auto ${isDark ? 'bg-[#0f1022] border-slate-800/60' : 'bg-white border-slate-200'}`}>
        <div className="divide-y divide-slate-800/40">

          {reviews.map(item => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/5 transition-colors">
              <div className="flex items-start gap-4">

                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  {getIcon(item.type)}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${item.type === 'PR' ? 'text-purple-500' : item.type === 'Timesheet' ? 'text-amber-500' : item.type === 'Leave' ? 'text-rose-500' : 'text-indigo-500'
                      }`}>
                      {item.type} Review
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{item.date}</span>
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-xl">{item.details}</p>

                  {/* Submitter */}
                  <div className="flex items-center gap-2 pt-1">
                    <img src={item.submitterAvatar} alt={item.submitterName} className="w-4 h-4 rounded-full object-cover" />
                    <span className="text-[11px] text-slate-400 font-semibold">{item.submitterName}</span>
                  </div>
                </div>

              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                {item.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'rejected')}
                      className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-semibold transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      <X className="w-3.5 h-3.5 text-rose-500" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  </>
                ) : (
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${item.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                    {item.status === 'approved' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Approved
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" /> Rejected
                      </>
                    )}
                  </span>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};
export default PendingReviews;
