import React, { useState } from 'react';
import { Layers, RefreshCw, Link2, Unlink } from 'lucide-react';

interface IntegrationNode {
  id: string;
  name: string;
  desc: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  color: string;
  bg: string;
}

export const Integrations: React.FC = () => {
  const [platforms, setPlatforms] = useState<IntegrationNode[]>([
    { id: 'gmail', name: 'Gmail Workspace Sync', status: 'Connected', desc: 'Sync mail prioritization, keywords, and draft alerts.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'calendar', name: 'Google Calendar Sync', status: 'Connected', desc: 'Stream transcripts, event timings, and AI Minutes generated.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'github', name: 'GitHub Integration', status: 'Connected', desc: 'Sync PR states, merge notifications, and commit streams.', color: 'text-slate-200', bg: 'bg-slate-500/10' },
    { id: 'slack', name: 'Slack Integration', status: 'Connected', desc: 'Broadcast updates, alert signals, and direct messages.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
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
    // Set all connected elements to Syncing, then back to Connected after delay
    setPlatforms(prev => prev.map(n => n.status === 'Connected' ? { ...n, status: 'Syncing' } : n));
    setTimeout(() => {
      setPlatforms(prev => prev.map(n => n.status === 'Syncing' ? { ...n, status: 'Connected' } : n));
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Integrations Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage single-sign-on credentials and platform syncing nodes.</p>
        </div>
        <button 
          onClick={syncAll}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((plat) => (
          <div key={plat.id} className="bg-[#101220] border border-slate-800/60 p-5 rounded-2xl space-y-4 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${plat.bg} ${plat.color} flex items-center justify-center`}>
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{plat.name}</h3>
                  <span className="text-[10px] text-slate-500 block max-w-xs">{plat.desc}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  plat.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' :
                  plat.status === 'Syncing' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {plat.status}
                </span>

                <button
                  onClick={() => toggleConnection(plat.id)}
                  className={`flex items-center space-x-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    plat.status === 'Connected'
                      ? 'border-rose-900/40 text-rose-400 hover:bg-rose-500/10'
                      : 'border-indigo-900/40 text-indigo-400 hover:bg-indigo-500/10'
                  }`}
                >
                  {plat.status === 'Connected' ? (
                    <>
                      <Unlink className="w-3 h-3" />
                      <span>Disconnect</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3 h-3" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Integrations;
