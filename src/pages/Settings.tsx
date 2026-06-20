import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Shield, Key, Bell, User, Sparkles, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, switchRole } = useAuth();
  
  // Custom local state to edit and apply updates
  const [name, setName] = useState(user?.name || 'Kavya Chopra');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.name = name;
      user.avatar = avatar;
      // Triggers quick switch-role to force reload changes globally
      switchRole(user.role);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure profile identifiers, layout theme presets, and security keys.</p>
      </div>

      <div className="max-w-2xl bg-[#101220] border border-slate-800/60 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-850 pb-4">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Preferences</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Profile Avatar URL</label>
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">System Theme Mode</label>
            <select className="w-full bg-[#141624] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
              <option>Dark Theme (Recommended)</option>
              <option>Light Theme</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-850">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Changes apply globally</span>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SettingsPage;
