import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings, 
  Shield, 
  Key, 
  Bell, 
  User, 
  Sparkles, 
  Check, 
  Layers, 
  RefreshCw, 
  Link2, 
  Unlink,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Monitor,
  Laptop,
  Building,
  CreditCard,
  Sliders,
  Trash2,
  Globe,
  DollarSign,
  Terminal,
  Lock,
  Mail,
  Phone,
  FileText,
  UserCheck
} from 'lucide-react';

interface IntegrationNode {
  id: string;
  name: string;
  desc: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  color: string;
  bg: string;
}

interface ApiKeyNode {
  id: string;
  name: string;
  key: string;
  created: string;
  revealed: boolean;
}

interface InvoiceNode {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

export const SettingsPage: React.FC = () => {
  const { user, switchRole, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';
  
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // Profile preferences state
  const [name, setName] = useState(user?.name || 'Kavya Chopra');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [email, setEmail] = useState(user?.email || 'kavya.chopra@genessence.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [bio, setBio] = useState('Full stack software director pushing the boundaries of AI agentic coding in G-OS.');
  const [profileSaved, setProfileSaved] = useState(false);

  // Localization settings state
  const [lang, setLang] = useState('English (US)');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [localSaved, setLocalSaved] = useState(false);

  // Change Password state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passReveal, setPassReveal] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Organization Preferences state
  const [orgName, setOrgName] = useState('Genessence Corp');
  const [orgSlug, setOrgSlug] = useState('genessence-main');
  const [orgTimezone, setOrgTimezone] = useState('GMT+05:30 (India Standard Time)');
  const [orgSaved, setOrgSaved] = useState(false);

  // Sync tab search param to state
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Profile update save handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.name = name;
      user.avatar = avatar;
      user.email = email;
      switchRole(user.role); // Force refresh app header state
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  // Localization save handler
  const handleSaveLocal = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSaved(true);
    setTimeout(() => setLocalSaved(false), 2000);
  };

  // Password save handler
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  // Org save handler
  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 2000);
  };

  // Theme dropdown change handler
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value === 'Light Theme' ? 'light' : 'dark';
    if (selectedTheme !== theme) {
      toggleTheme();
    }
  };

  // Shifted Integrations state
  const [platforms, setPlatforms] = useState<IntegrationNode[]>([
    { id: 'gmail', name: 'Gmail Workspace Sync', status: 'Connected', desc: 'Sync mail prioritization, keywords, and draft alerts.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'calendar', name: 'Google Calendar Sync', status: 'Connected', desc: 'Stream transcripts, event timings, and AI Minutes generated.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'github', name: 'GitHub Integration', status: 'Connected', desc: 'Sync PR states, merge notifications, and commit streams.', color: 'text-indigo-400 dark:text-slate-200', bg: 'bg-slate-500/10' },
    { id: 'slack', name: 'Slack Integration', status: 'Connected', desc: 'Broadcast updates, alert signals, and direct messages.', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10' }
  ]);

  const toggleConnection = (id: string) => {
    setPlatforms(prev => prev.map(node => {
      if (node.id === id) {
        const nextStatus = node.status === 'Connected' ? 'Disconnected' : 'Connected';
        return { ...node, status: nextStatus };
      }
      return node;
    }));
  };

  const syncAll = () => {
    setPlatforms(prev => prev.map(n => n.status === 'Connected' ? { ...n, status: 'Syncing' } : n));
    setTimeout(() => {
      setPlatforms(prev => prev.map(n => n.status === 'Syncing' ? { ...n, status: 'Connected' } : n));
    }, 1500);
  };

  // Security Tab state
  const [mfaActive, setMfaActive] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyNode[]>([
    { id: 'key-1', name: 'Production Dashboard Key', key: 'g-os_sk_live_948f2c81d39ea', created: 'Jun 10, 2026', revealed: false },
    { id: 'key-2', name: 'Development Webhook Client', key: 'g-os_sk_test_30b91e92d71fa', created: 'Jun 22, 2026', revealed: false }
  ]);

  const toggleKeyReveal = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, revealed: !k.revealed } : k));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const generateNewKey = () => {
    const randomHex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey: ApiKeyNode = {
      id: `key-${Date.now()}`,
      name: 'Custom User Key',
      key: `g-os_sk_live_${randomHex}`,
      created: 'Today',
      revealed: false
    };
    setApiKeys([...apiKeys, newKey]);
  };

  // Notifications state
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(false);
  const [frequency, setFrequency] = useState('Daily');

  // Billing Tab state
  const invoices: InvoiceNode[] = [
    { id: 'inv-394', date: 'Jun 15, 2026', amount: '$288.00', status: 'Paid' },
    { id: 'inv-382', date: 'May 15, 2026', amount: '$288.00', status: 'Paid' },
    { id: 'inv-371', date: 'Apr 15, 2026', amount: '$288.00', status: 'Paid' }
  ];

  // Advanced Tab state
  const [verboseLogs, setVerboseLogs] = useState(false);
  const [aiMoM, setAiMoM] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.genessence.ai/webhooks/gos-sync');
  const [advSaved, setAdvSaved] = useState(false);

  const handleSaveAdvanced = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvSaved(true);
    setTimeout(() => setAdvSaved(false), 2000);
  };

  const handleResetWorkspace = () => {
    if (confirm('WARNING: Are you sure you want to purge all synced cache and metrics? This action is permanent.')) {
      alert('Workspace reset successful.');
    }
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2.5">
          <Settings className="w-6 h-6 text-indigo-500" />
          <span className={isDark ? 'text-white' : 'text-slate-900'}>System Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure profile preferences, manage active integrations, update security keys, and alert preferences.
        </p>
      </div>

      {/* Settings Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Tabs Control */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-4 border-slate-200 dark:border-slate-800">
          {[
            { id: 'profile', name: 'User Profile', icon: <User className="w-4 h-4" /> },
            { id: 'organization', name: 'Organization', icon: <Building className="w-4 h-4" /> },
            { id: 'integrations', name: 'Integrations Hub', icon: <Layers className="w-4 h-4" /> },
            { id: 'security', name: 'Security & Keys', icon: <Key className="w-4 h-4" /> },
            { id: 'billing', name: 'Billing & Usage', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'advanced', name: 'Advanced Dev', icon: <Sliders className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? isDark 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-500'
                  : isDark
                    ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: User Profile Preferences */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Details Card */}
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <User className="w-5 h-5 text-indigo-400" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Public Profile</h3>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 mt-5">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Inputs */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                              isDark 
                                ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                            }`} 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Job Title / Role</label>
                          <input 
                            type="text" 
                            value={user?.role || 'Director'} 
                            disabled
                            className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all cursor-not-allowed ${
                              isDark 
                                ? 'bg-slate-900 border-slate-800 text-slate-500' 
                                : 'bg-slate-100 border-slate-200 text-slate-550'
                            }`} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                          <div className="flex rounded-xl overflow-hidden border border-slate-800">
                            <span className={`px-3 py-2.5 text-xs shrink-0 flex items-center ${
                              isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-500' : 'bg-slate-100 border-r border-slate-205 text-slate-600'
                            }`}>
                              <Mail className="w-3.5 h-3.5" />
                            </span>
                            <input 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className={`w-full px-4 py-2.5 text-xs outline-none transition-all ${
                                isDark ? 'bg-[#141624]/60 text-white focus:border-indigo-500' : 'bg-slate-50 text-slate-800 focus:border-indigo-500'
                              }`} 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                          <div className="flex rounded-xl overflow-hidden border border-slate-800">
                            <span className={`px-3 py-2.5 text-xs shrink-0 flex items-center ${
                              isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-500' : 'bg-slate-100 border-r border-slate-205 text-slate-600'
                            }`}>
                              <Phone className="w-3.5 h-3.5" />
                            </span>
                            <input 
                              type="text" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)}
                              className={`w-full px-4 py-2.5 text-xs outline-none transition-all ${
                                isDark ? 'bg-[#141624]/60 text-white focus:border-indigo-500' : 'bg-slate-50 text-slate-800 focus:border-indigo-500'
                              }`} 
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Avatar URL</label>
                        <input 
                          type="text" 
                          value={avatar} 
                          onChange={(e) => setAvatar(e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                            isDark 
                              ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                          }`} 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Biography</label>
                        <textarea 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          rows={2.5}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none resize-none transition-all ${
                            isDark 
                              ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                          }`} 
                        />
                      </div>
                    </div>

                    {/* Right: Avatar Preview */}
                    <div className="w-full md:w-36 flex flex-col items-center justify-center space-y-3 shrink-0">
                      <div className="relative">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt="Avatar Preview" 
                            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500" 
                          />
                        ) : (
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold uppercase ${
                            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#101220]" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Avatar Preview</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Changes apply dynamically</span>
                    </div>
                    
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-700"
                    >
                      {profileSaved ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span>Preferences Saved!</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Localization & Preferences Card */}
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Localization & Interface</h3>
                </div>

                <form onSubmit={handleSaveLocal} className="space-y-4 mt-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Language</label>
                      <select 
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish (ES)</option>
                        <option>Japanese (JP)</option>
                        <option>German (DE)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Time Format</label>
                      <select 
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option>12-hour (e.g. 4:30 PM)</option>
                        <option>24-hour (e.g. 16:30)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date Format</label>
                      <select 
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System Theme Mode</label>
                    <select 
                      value={theme === 'dark' ? 'Dark Theme (Recommended)' : 'Light Theme'}
                      onChange={handleThemeChange}
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                        isDark 
                          ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                      }`}
                    >
                      <option>Dark Theme (Recommended)</option>
                      <option>Light Theme</option>
                    </select>
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Sets locale preferences</span>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-700"
                    >
                      {localSaved ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span>Locales Saved!</span>
                        </>
                      ) : (
                        <span>Save Interface Locales</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password Card */}
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <Lock className="w-5 h-5 text-indigo-400" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Change Password</h3>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4.5 mt-5">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
                    <input 
                      type={passReveal ? 'text' : 'password'}
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                        isDark 
                          ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                      }`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setPassReveal(!passReveal)}
                      className="absolute right-4 top-8.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {passReveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Create new password"
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Verify new password"
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                          isDark 
                            ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Password Strength bar */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Password Strength</span>
                        <span className={newPassword.length > 8 ? 'text-emerald-555' : 'text-amber-555'}>
                          {newPassword.length > 8 ? 'Strong' : 'Moderate (Min 8 chars)'}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${newPassword.length > 8 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: newPassword.length > 8 ? '100%' : '50%' }} />
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Requires valid current credentials</span>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-700"
                    >
                      {passwordSaved ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span>Password Updated!</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Connected SSO Accounts Card */}
              <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>SSO Connected Accounts</h3>
                </div>

                <div className="space-y-4 mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-rose-400' : 'bg-rose-50 border border-rose-100 text-rose-600'
                      }`}>
                        G
                      </div>
                      <div>
                        <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Google Auth Account</span>
                        <span className="text-[9px] text-slate-500 font-medium block">Linked: kavya.chopra@genessence.com</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Connected</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-slate-100 border border-slate-205 text-slate-700'
                      }`}>
                        GH
                      </div>
                      <div>
                        <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>GitHub Developer ID</span>
                        <span className="text-[9px] text-slate-500 font-medium block">Linked: kavyaChopra-dev</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Connected</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Organization Profile */}
          {activeTab === 'organization' && (
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <Building className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Organization Settings</h3>
              </div>

              <form onSubmit={handleSaveOrg} className="space-y-5 mt-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Organization Name</label>
                  <input 
                    type="text" 
                    value={orgName} 
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Workspace URL Slug</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-800">
                    <span className={`px-4 py-2.5 text-xs font-mono shrink-0 flex items-center ${
                      isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-500' : 'bg-slate-100 border-r border-slate-205 text-slate-600'
                    }`}>
                      gos.genessence.ai/
                    </span>
                    <input 
                      type="text" 
                      value={orgSlug} 
                      onChange={(e) => setOrgSlug(e.target.value)}
                      required
                      className={`w-full px-4 py-2.5 text-xs outline-none transition-all ${
                        isDark ? 'bg-[#141624]/60 text-white focus:border-indigo-500' : 'bg-slate-50 text-slate-800 focus:border-indigo-500'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Default Team Timezone</label>
                  <select 
                    value={orgTimezone}
                    onChange={(e) => setOrgTimezone(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`}
                  >
                    <option>GMT+05:30 (India Standard Time)</option>
                    <option>GMT-08:00 (Pacific Standard Time)</option>
                    <option>GMT+00:00 (Greenwich Mean Time)</option>
                    <option>GMT+09:00 (Japan Standard Time)</option>
                  </select>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">Affects shared workspace calendars</span>
                  </div>
                  
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-700"
                  >
                    {orgSaved ? (
                      <>
                        <Check className="w-4 h-4 text-white animate-bounce" />
                        <span>Workspace Saved!</span>
                      </>
                    ) : (
                      <span>Save Workspace Settings</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Shifted Integrations Hub */}
          {activeTab === 'integrations' && (
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <div className="flex items-center space-x-3">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Integrations Hub</h3>
                </div>
                
                <button 
                  onClick={syncAll}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-[#141624] border-slate-800 text-slate-300 hover:text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  <span>Sync Status</span>
                </button>
              </div>

              <div className="space-y-4">
                {platforms.map((plat) => (
                  <div 
                    key={plat.id} 
                    className={`border p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                      isDark 
                        ? 'bg-[#141624]/30 border-slate-800/80 hover:border-slate-700/80' 
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-350/80'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl ${plat.bg} ${plat.color} flex items-center justify-center shrink-0`}>
                        <Link2 className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{plat.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{plat.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0 sm:justify-end">
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        plat.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-555' :
                        plat.status === 'Syncing' ? 'bg-indigo-500/10 text-indigo-555 dark:text-indigo-400 animate-pulse' :
                        isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {plat.status}
                      </span>

                      <button
                        onClick={() => toggleConnection(plat.id)}
                        className={`flex items-center space-x-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          plat.status === 'Connected'
                            ? 'border-rose-900/30 text-rose-500 hover:bg-rose-500/10'
                            : 'border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10'
                        }`}
                      >
                        {plat.status === 'Connected' ? (
                          <>
                            <Unlink className="w-3.5 h-3.5" />
                            <span>Disconnect</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Security & API Keys */}
          {activeTab === 'security' && (
            <div className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {/* API Keys section */}
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-indigo-400" />
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>System API Keys</h3>
                  </div>
                  <button 
                    onClick={generateNewKey}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer border border-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate Key</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {apiKeys.map((k) => (
                    <div 
                      key={k.id}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                        isDark ? 'bg-[#141624]/40 border-slate-800/50' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold block ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>{k.name}</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <code className="text-xs font-mono text-indigo-400 tracking-wider">
                            {k.revealed ? k.key : '•••••••••••••••••••••••••••••'}
                          </code>
                          <button 
                            onClick={() => toggleKeyReveal(k.id)}
                            className="text-slate-400 hover:text-slate-200 transition-all cursor-pointer font-semibold"
                          >
                            {k.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:justify-end">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Created: {k.created}</span>
                        <button 
                          onClick={() => copyToClipboard(k.key, k.id)}
                          className={`flex items-center space-x-1 text-[9px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            copiedKeyId === k.id
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : isDark
                                ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                : 'border-slate-250 hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedKeyId === k.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MFA Multi-Factor Section */}
              <div className={`pt-6 border-t space-y-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Multi-Factor Authentication (MFA)</h4>
                    <p className="text-[10px] text-slate-400 max-w-sm">Secure your developer account by signing in with dynamic OTP codes.</p>
                  </div>
                  <button 
                    onClick={() => setMfaActive(!mfaActive)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      mfaActive ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      mfaActive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Session list */}
              <div className={`pt-6 border-t space-y-3.5 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-4.5 h-4.5 text-indigo-400" />
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Active Login Sessions</h4>
                </div>

                <div className="space-y-2 font-sans">
                  {[
                    { id: 1, name: 'Safari on macOS Sequoia', location: 'New Delhi, India', state: 'Current session', current: true, icon: <Laptop className="w-4 h-4 text-indigo-500" /> },
                    { id: 2, name: 'Chrome on Google Pixel 8', location: 'Noida, India', state: 'Active 2 hours ago', current: false, icon: <Monitor className="w-4 h-4 text-slate-500" /> }
                  ].map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-slate-900/40 border border-slate-800/50' : 'bg-slate-100 border border-slate-205'
                        }`}>
                          {s.icon}
                        </div>
                        <div>
                          <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-750'}`}>{s.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">{s.location}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        s.current 
                          ? 'bg-emerald-500/10 text-emerald-550' 
                          : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-600'
                      }`}>{s.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Billing & Usage */}
          {activeTab === 'billing' && (
            <div className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Billing & Subscription</h3>
              </div>

              {/* Premium Plan Card */}
              <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                isDark ? 'bg-[#141624]/40 border-slate-800/60' : 'bg-slate-50 border-slate-200/80 shadow-sm shadow-slate-100'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold uppercase bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2.5 py-0.5 rounded-md border border-indigo-500/10">Active Tier</span>
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>G-OS Developer Pro</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Enterprise seat subscription for team collaboration tools.</p>
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>$288.00</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">/ month (12 seats)</span>
                  </div>
                </div>

                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0">
                  Manage Seats
                </button>
              </div>

              {/* Usage Stats visual metrics */}
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Workspace Usage Stats</h4>
                <div className="space-y-3 font-sans">
                  {/* Seat meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Seats Allocated</span>
                      <span>12 / 50 seats used</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className="h-full bg-indigo-500" style={{ width: '24%' }} />
                    </div>
                  </div>
                  {/* API Call meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Monthly API Transactions</span>
                      <span>82.4K / 100K calls</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className="h-full bg-indigo-550" style={{ width: '82.4%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className={`pt-5 border-t space-y-3 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <h4 className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Payment Method</h4>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-9 h-6 rounded flex items-center justify-center font-bold text-[9px] border ${
                      isDark ? 'bg-slate-900/60 border-slate-800 text-indigo-400' : 'bg-slate-100 border-slate-200 text-indigo-600'
                    }`}>
                      VISA
                    </div>
                    <div>
                      <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Visa ending in 4242</span>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Expires: 08/2028</span>
                    </div>
                  </div>
                  <button className="text-xs text-indigo-550 dark:text-indigo-400 hover:underline font-semibold cursor-pointer">Edit</button>
                </div>
              </div>

              {/* Past invoices table */}
              <div className={`pt-5 border-t space-y-3.5 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <h4 className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">Invoice History</h4>
                <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={isDark ? 'bg-[#141624]/60 text-slate-400 font-bold' : 'bg-slate-50 text-slate-600 font-bold'}>
                        <th className="p-3 border-b border-inherit">Invoice ID</th>
                        <th className="p-3 border-b border-inherit">Billing Date</th>
                        <th className="p-3 border-b border-inherit">Amount</th>
                        <th className="p-3 border-b border-inherit text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className={isDark ? 'divide-slate-800 hover:bg-[#141624]/20' : 'divide-slate-200 hover:bg-slate-50/50'}>
                          <td className="p-3 font-mono font-bold text-indigo-400">{inv.id}</td>
                          <td className="p-3 font-medium text-slate-500">{inv.date}</td>
                          <td className="p-3 font-semibold">{inv.amount}</td>
                          <td className="p-3 text-right">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-550 uppercase tracking-wide">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Notifications Alerts */}
          {activeTab === 'notifications' && (
            <div className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Notification Preferences</h3>
              </div>

              <div className="space-y-5">
                {/* Email Digest */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold uppercase block tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Email Activity Digest</span>
                    <span className="text-[10px] text-slate-400 block">Weekly performance scores and leave workflow alerts.</span>
                  </div>
                  <button 
                    onClick={() => setEmailDigest(!emailDigest)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      emailDigest ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      emailDigest ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Slack notification */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold uppercase block tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Slack Ping Broadcasts</span>
                    <span className="text-[10px] text-slate-400 block">Receive instant Slack pings when timesheet status transitions.</span>
                  </div>
                  <button 
                    onClick={() => setSlackAlerts(!slackAlerts)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      slackAlerts ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      slackAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Push alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold uppercase block tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Browser Push Messages</span>
                    <span className="text-[10px] text-slate-400 block">Permit the dashboard shell to send real-time browser push logs.</span>
                  </div>
                  <button 
                    onClick={() => setPushNotes(!pushNotes)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      pushNotes ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      pushNotes ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Digest dropdown frequency */}
                <div className={`pt-5 border-t space-y-2.5 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Digest Delivery Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                      isDark 
                        ? 'bg-[#141624]/60 border-slate-800 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                    }`}
                  >
                    <option>Daily Summaries</option>
                    <option>Weekly Digest</option>
                    <option>Bi-weekly Review</option>
                    <option>Monthly Report</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Advanced Developer Settings */}
          {activeTab === 'advanced' && (
            <div className={`p-6 rounded-2xl border space-y-6 ${
              isDark ? 'bg-[#101220] border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`flex items-center space-x-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Advanced Dev Controls</h3>
              </div>

              <form onSubmit={handleSaveAdvanced} className="space-y-5">
                {/* Verbose Logs Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold uppercase block tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Verbose Console Logger</span>
                    <span className="text-[10px] text-slate-400 block">Print detailed network and FFI hooks trace in browser logs.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setVerboseLogs(!verboseLogs)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      verboseLogs ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      verboseLogs ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* AI MoM Automator */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold uppercase block tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>AI MoM Automator</span>
                    <span className="text-[10px] text-slate-400 block">Enable Google Antigravity SDK to summarize calendar voice channels.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAiMoM(!aiMoM)}
                    className={`w-11 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      aiMoM ? 'bg-indigo-600' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                      aiMoM ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Webhook endpoint URL */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Webhook Endpoint</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-800">
                    <span className={`px-3 py-2.5 text-xs font-mono shrink-0 flex items-center ${
                      isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-500' : 'bg-slate-100 border-r border-slate-205 text-slate-600'
                    }`}>
                      POST
                    </span>
                    <input 
                      type="url" 
                      value={webhookUrl} 
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className={`w-full px-4 py-2.5 text-xs outline-none transition-all ${
                        isDark ? 'bg-[#141624]/60 text-white focus:border-indigo-500' : 'bg-slate-50 text-slate-800 focus:border-indigo-500'
                      }`} 
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase font-mono">Payload: application/json</span>
                  </div>
                  
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-700"
                  >
                    {advSaved ? (
                      <>
                        <Check className="w-4 h-4 text-white animate-bounce" />
                        <span>Controls Saved!</span>
                      </>
                    ) : (
                      <span>Save Advanced Controls</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Danger Purge Zone */}
              <div className={`pt-6 border-t space-y-4 ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Danger Zone</h4>
                  <p className="text-[10px] text-slate-400">Purging data will clean local caches and active session tokens instantly.</p>
                </div>

                <button 
                  onClick={handleResetWorkspace}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-rose-700 shadow-md shadow-rose-600/15"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Workspace Cache</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
