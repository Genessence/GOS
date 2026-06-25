import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  Hash,
  MessageSquare,
  Search,
  Users,
  Video,
  Phone,
  Info,
  CheckCheck,
  Plus,
  ArrowLeft,
  CircleDot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isWhatsApp?: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  isWhatsApp: boolean;
  unreadCount?: number;
  avatar?: string;
  phone?: string;
}

export const TeamChat: React.FC = () => {
  const { theme, user } = useAuth();
  const isDark = theme === 'dark';

  const [activeChannelId, setActiveChannelId] = useState('c-1');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resizable sidebar states & logic
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(256);

  const onResizeStart = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = ev.clientX - startXRef.current;
      setSidebarWidth(Math.min(450, Math.max(180, startWidthRef.current + delta)));
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

  const [channels, setChannels] = useState<ChatChannel[]>([
    { id: 'c-1', name: 'general', isWhatsApp: false },
    { id: 'c-2', name: 'sprint-planning', isWhatsApp: false },
    { id: 'c-3', name: 'paygate-system', isWhatsApp: false },
    { id: 'c-4', name: 'design-feedback', isWhatsApp: false },
    { id: 'wa-1', name: 'Aarav Rao', isWhatsApp: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', phone: '+91 98765 43210' },
    { id: 'wa-2', name: 'Megan Li', isWhatsApp: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', phone: '+91 87654 32109', unreadCount: 2 },
    { id: 'wa-3', name: 'Rahul Sharma', isWhatsApp: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', phone: '+91 76543 21098' },
  ]);

  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    'c-1': [
      { id: 'm1', senderName: 'Aarav Rao', senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', text: 'Hey team, welcome to the G-OS workspace chat!', timestamp: '10:00 AM' },
      { id: 'm2', senderName: 'Kavya Chopra', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'Thanks Aarav. Let\'s make sure we post roadmap updates here.', timestamp: '10:02 AM' },
      { id: 'm3', senderName: 'Ankit Sharma', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', text: 'Webhooks are ready for initial reviews. See the #paygate-system channel.', timestamp: '10:15 AM' }
    ],
    'c-2': [
      { id: 'm4', senderName: 'Rahul Sharma', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', text: 'Sprint 6 planning starts at 11 AM today.', timestamp: '09:00 AM' },
      { id: 'm5', senderName: 'Megan Li', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'I\'ll bring the latest user telemetry data sheets.', timestamp: '09:12 AM' }
    ],
    'c-3': [
      { id: 'm6', senderName: 'Ankit Sharma', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', text: 'I updated the security schema for transaction handshakes.', timestamp: 'Yesterday' },
      { id: 'm7', senderName: 'Aarav Rao', senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', text: 'Awesome. Did we double check the decryption speeds?', timestamp: 'Yesterday' }
    ],
    'c-4': [
      { id: 'm8', senderName: 'Kavya Chopra', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'Shared the final Figma redlines for mobile invoicing.', timestamp: 'May 18' }
    ],
    'wa-1': [
      { id: 'm9', senderName: 'Aarav Rao', senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', text: 'Hi Kavya, sent the budget presentation over WhatsApp for quick review.', timestamp: '12:30 PM', isWhatsApp: true },
      { id: 'm10', senderName: 'Kavya Chopra', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'Got it Aarav, reviewing it right now on my phone.', timestamp: '12:32 PM' }
    ],
    'wa-2': [
      { id: 'm11', senderName: 'Megan Li', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'Hey, are we still meeting the client this afternoon?', timestamp: '11:15 AM', isWhatsApp: true },
      { id: 'm12', senderName: 'Megan Li', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', text: 'They asked if we could bring the contract draft.', timestamp: '11:17 AM', isWhatsApp: true }
    ],
    'wa-3': [
      { id: 'm13', senderName: 'Rahul Sharma', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', text: 'Applied for leave tomorrow, sync logs updated.', timestamp: 'May 19', isWhatsApp: true }
    ]
  });

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const activeMessages = chatHistories[activeChannel.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-new-${Date.now()}`,
      senderName: user?.name || 'Kavya Chopra',
      senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isWhatsApp: activeChannel.isWhatsApp
    };

    setChatHistories(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMsg]
    }));

    setMessageInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    if (activeChannel.unreadCount) {
      setChannels(prev => prev.map(c => c.id === activeChannel.id ? { ...c, unreadCount: undefined } : c));
    }
  }, [activeChannelId]);

  useEffect(() => {
    const pending = localStorage.getItem('gos_pending_chat_msg');
    if (pending) {
      setMessageInput(pending);
      localStorage.removeItem('gos_pending_chat_msg');
    }
  }, []);

  return (
    <div className={`flex h-[calc(100vh-4rem)] w-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0c0d14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Sidebar Channels List */}
      <div style={{ width: sidebarWidth }} className={`border-r flex flex-col h-full flex-shrink-0 transition-colors ${isDark ? 'bg-[#0f1022] border-slate-800/60' : 'bg-white border-slate-200'}`}>

        {/* Search */}
        <div className={`p-4 border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
          <div className={`flex items-center space-x-2 border rounded-xl px-3 py-2 ${isDark ? 'bg-[#141624]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Search className="w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search chats..." className={`bg-transparent border-0 outline-none text-xs w-full placeholder-slate-500 ${isDark ? 'text-slate-200' : 'text-slate-800'}`} />
          </div>
        </div>

        {/* Channels/Chats list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">

          {/* Slack Channels */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-2">Workspace Channels</span>
            {channels.filter(c => !c.isWhatsApp).map(c => {
              const isActive = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChannelId(c.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? 'bg-indigo-600 text-white'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <Hash className="w-4 h-4 opacity-60 flex-shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* WhatsApp Chats */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-500 uppercase">WhatsApp Sync</span>
              <CircleDot className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            </div>
            {channels.filter(c => c.isWhatsApp).map(c => {
              const isActive = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChannelId(c.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? 'bg-emerald-600 text-white'
                      : isDark
                        ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.unreadCount && (
                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onResizeStart}
        className={`w-1 flex-shrink-0 cursor-col-resize group relative z-20 transition-colors ${isDark ? 'hover:bg-indigo-500/40 hover:bg-slate-800/60' : 'hover:bg-indigo-400/40 hover:bg-slate-200/60'
          }`}
      >
        <div className="absolute inset-y-0 -left-0.5 -right-0.5 group-hover:bg-indigo-500/20 rounded transition-colors" />
      </div>

      {/* Chat Window Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Header */}
        <div className={`h-16 px-6 border-b flex items-center justify-between flex-shrink-0 transition-colors ${isDark ? 'bg-[#0f1022] border-slate-800/60' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3 min-w-0">
            {activeChannel.isWhatsApp ? (
              <img src={activeChannel.avatar} alt={activeChannel.name} className="w-9 h-9 rounded-full object-cover border border-emerald-500" />
            ) : (
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'}`}>
                <Hash className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {activeChannel.isWhatsApp ? activeChannel.name : `#${activeChannel.name}`}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold truncate">
                {activeChannel.isWhatsApp ? `WhatsApp Sync • ${activeChannel.phone}` : 'G-OS Team Channel'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <button type="button" className="p-2 hover:text-indigo-500 hover:bg-slate-800/20 rounded-lg transition-colors"><Phone className="w-4 h-4" /></button>
            <button type="button" className="p-2 hover:text-indigo-500 hover:bg-slate-800/20 rounded-lg transition-colors"><Video className="w-4 h-4" /></button>
            <button type="button" className="p-2 hover:text-indigo-500 hover:bg-slate-800/20 rounded-lg transition-colors"><Info className="w-4 h-4" /></button>
          </div>
        </div>

        {/* WhatsApp Banner */}
        {activeChannel.isWhatsApp && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              WhatsApp Business API active — message status synchronized in real time
            </span>
            <span className="text-[10px] opacity-75">End-to-End Encrypted</span>
          </div>
        )}

        {/* Chat Feed */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDark ? 'bg-[#090a12]' : 'bg-slate-50/50'}`}>
          {activeMessages.map((msg) => {
            const isMe = msg.senderName === (user?.name || 'Kavya Chopra');
            return (
              <div key={msg.id} className={`flex items-start gap-3 max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="space-y-1">
                  <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10.5px] font-bold text-slate-400">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isMe
                      ? activeChannel.isWhatsApp
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                      : isDark
                        ? 'bg-[#101220] border border-slate-800/60 text-slate-200 rounded-tl-none'
                        : 'bg-white border border-slate-200 text-slate-700 shadow-xs rounded-tl-none'
                    }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {isMe && activeChannel.isWhatsApp && (
                      <div className="flex justify-end gap-1 mt-1 opacity-70">
                        <span className="text-[8px] font-medium font-mono">WhatsApp Send</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Panel */}
        <form onSubmit={handleSendMessage} className={`p-4 border-t transition-colors ${isDark ? 'bg-[#0f1022] border-slate-800/60' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 focus-within:border-indigo-500 transition-colors ${isDark ? 'bg-[#141624]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button type="button" className="p-1 text-slate-500 hover:text-indigo-500 transition-colors"><Plus className="w-4 h-4" /></button>
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder={activeChannel.isWhatsApp ? `Send message over WhatsApp to ${activeChannel.name}...` : `Message #${activeChannel.name}`}
              className={`flex-1 bg-transparent border-0 outline-none text-xs placeholder-slate-500 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            />
            <button type="submit" className={`p-2 rounded-lg text-white transition-colors ${activeChannel.isWhatsApp ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
export default TeamChat;
