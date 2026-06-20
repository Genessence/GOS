import React, { useState } from 'react';
import { Mail, Search, Send, Star, AlertCircle, RefreshCw, Eye, Sparkles, Plus, X, Inbox, ArrowRight } from 'lucide-react';

interface MockEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  starred: boolean;
  category: 'primary' | 'updates' | 'social';
}

export const MailWorkspace: React.FC = () => {
  const [emails, setEmails] = useState<MockEmail[]>([
    { 
      id: '1', 
      sender: 'GitHub Notifications', 
      senderEmail: 'noreply@github.com',
      subject: '[Merged] Pull Request #412: Integrations Core updates', 
      snippet: 'Your pull request has been merged into main. All checks passed successfully...', 
      body: 'Hi Kavya,\n\nYour pull request #412 (Integrations Core updates) has been successfully merged into main by Ankit Sharma.\n\nAll 14 integration workflow test checks passed. The deployment is active on the G-OS staging environment.\n\nBest,\nGitHub Integration Hub',
      date: '10:42 AM', 
      starred: true, 
      category: 'primary' 
    },
    { 
      id: '2', 
      sender: 'Google Calendar', 
      senderEmail: 'calendar-noreply@google.com',
      subject: 'Updated invitation: Project Alpha Sync @ Thu May 21 10am', 
      snippet: 'The time of this event has been changed. New time: 10:00 AM - 10:30 AM...', 
      body: 'You are receiving this email because the owner of Project Alpha Sync has rescheduled the meeting.\n\nNew Time: Thursday, May 21, 2026, 10:00 AM - 10:30 AM (IST)\nAttendees: Kavya Chopra, Ankit Sharma, Rahul Sharma.\n\nClick Join to stream translation audio directly in G-OS Workspace.',
      date: '9:15 AM', 
      starred: false, 
      category: 'primary' 
    },
    { 
      id: '3', 
      sender: 'Slack Notifications', 
      senderEmail: 'notification@slack.com',
      subject: 'Notification: Kavya mentioned you in #general', 
      snippet: '@kavya: Let\'s review the pipeline outputs during the morning meeting today...', 
      body: 'Slack Notification:\n\nKavya Chopra mentioned you in channel #general:\n"@kavya: Let\'s review the pipeline outputs during the morning meeting today to make sure git syncer resolves correctly."',
      date: 'Yesterday', 
      starred: true, 
      category: 'updates' 
    }
  ]);

  const [selectedMail, setSelectedMail] = useState<MockEmail | null>(emails[0]);
  const [activeCategory, setActiveCategory] = useState<'primary' | 'updates' | 'social'>('primary');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compose modal states
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    if (selectedMail?.id === id) {
      setSelectedMail(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const newMail: MockEmail = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'Kavya Chopra (You)',
      senderEmail: 'kavya.chopra@genessence.com',
      subject: composeSubject || '(No Subject)',
      snippet: composeBody.substring(0, 60) + '...',
      body: composeBody,
      date: 'Just now',
      starred: false,
      category: 'primary'
    };
    setEmails([newMail, ...emails]);
    setSelectedMail(newMail);
    setShowCompose(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  // Filter emails by category and search query
  const filteredEmails = emails.filter(mail => {
    const matchesCategory = mail.category === activeCategory;
    const matchesSearch = 
      mail.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header bar */}
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between flex-shrink-0 bg-[#0c0d14]">
        <div>
          <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span>Mail Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Aggregated workplace communications with intelligent prioritization.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCompose(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Email Navigation Sidebar */}
        <div className="w-56 border-r border-slate-800/60 bg-[#0a0b10] p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider px-3 block mb-2">CATEGORIES</span>
            {(['primary', 'updates', 'social'] as const).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left capitalize transition-all ${
                  activeCategory === category 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Inbox className="w-4 h-4" />
                  <span>{category}</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {emails.filter(m => m.category === category).length}
                </span>
              </button>
            ))}
          </div>

          {/* Quick search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#141624]/60 border border-slate-800 text-xs rounded-xl text-white outline-none focus:border-indigo-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Email List Panel */}
        <div className="w-[35%] border-r border-slate-800/60 overflow-y-auto bg-[#0a0b10]">
          {filteredEmails.map((mail) => (
            <div
              key={mail.id}
              onClick={() => setSelectedMail(mail)}
              className={`p-4 border-b border-slate-800/40 cursor-pointer transition-all hover:bg-slate-900/40 relative ${
                selectedMail?.id === mail.id ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-indigo-400">{mail.sender}</span>
                <span className="text-[10px] text-slate-500">{mail.date}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{mail.subject}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-1">{mail.snippet}</p>
              
              <button 
                onClick={(e) => toggleStar(mail.id, e)}
                className="absolute right-4 bottom-4 text-slate-500 hover:text-amber-400 transition-colors"
              >
                <Star className={`w-3.5 h-3.5 ${mail.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
              </button>
            </div>
          ))}

          {filteredEmails.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No emails found in this category
            </div>
          )}
        </div>

        {/* Email Detail Panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0c0d14] flex flex-col">
          {selectedMail ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-slate-800/40 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedMail.subject}</h3>
                    <span className="text-xs text-indigo-400 mt-1 block">From: {selectedMail.sender} &lt;{selectedMail.senderEmail}&gt;</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] text-slate-500">{selectedMail.date}</span>
                    <button 
                      onClick={(e) => toggleStar(selectedMail.id, e)}
                      className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/20 text-slate-400 transition-all"
                    >
                      <Star className={`w-4 h-4 ${selectedMail.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Priority recommendation */}
                <div className="bg-[#101220] border border-slate-800/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">G-OS Context Intelligence</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-indigo-600/5 border border-indigo-500/10 p-3 rounded-lg">
                    This email is marked as highly relevant because it relates to deployment streams and workspace integration configs. Recommended Action: Verify local structure before running next command sequence.
                  </p>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-slate-900/20 p-4 rounded-xl border border-slate-800/40">
                  {selectedMail.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an email to view content details
            </div>
          )}
        </div>
      </div>

      {/* Compose Dialog Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#101220] border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-[#0c0d14]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">New Message</span>
              <button 
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">To</label>
                <input
                  type="email"
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@genessence.com"
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Project update details..."
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</label>
                <textarea
                  required
                  rows={6}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Draft your mail content here..."
                  className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800/40 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MailWorkspace;
