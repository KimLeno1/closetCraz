import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Save, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Activity, 
  Download, 
  Database, 
  FileText,
  Binary,
  Zap,
  Cpu
} from 'lucide-react';
import { db } from '../services/database';

interface SettingsWorkspaceProps {
  addLog: (msg: string) => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({ addLog }) => {
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleUpdateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newKey !== confirmKey) {
      setMessage({ type: 'error', text: 'NEURAL SIGNATURE MISMATCH.' });
      return;
    }

    if (newKey.length < 4) {
      setMessage({ type: 'error', text: 'SIGNATURE DEPTH INSUFFICIENT.' });
      return;
    }

    setIsUpdating(true);
    addLog("SECURITY: Root access recalibration initialized.");

    setTimeout(() => {
      localStorage.setItem('cc_admin_key', newKey);
      addLog("SECURITY: Admin Override Signature updated successfully.");
      setMessage({ type: 'success', text: 'OVERRIDE KEY RECALIBRATED.' });
      setIsUpdating(false);
      setNewKey('');
      setConfirmKey('');
    }, 2000);
  };

  const handleExport = (collection: 'products' | 'requests', format: 'csv' | 'sql') => {
    addLog(`EXTRACTION: Initiating ${format.toUpperCase()} dump of ${collection} cluster.`);
    const content = format === 'csv' ? db.generateCSV(collection) : db.generateSQL(collection);
    const fileName = `cc_${collection}_${new Date().getTime()}.${format}`;
    const mime = format === 'csv' ? 'text/csv' : 'text/plain';
    
    db.triggerDownload(content, fileName, mime);
    addLog(`EXTRACTION: Data packets for ${collection} successfully deployed to local storage.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-red-500/40">
           <ShieldCheck size={16} />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Security Protocol // Core_Override</p>
        </div>
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Root <span className="not-italic text-red-600">Config</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Root Access Management */}
        <section className="p-12 border border-red-500/20 bg-red-500/[0.02] space-y-12 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 pointer-events-none">
            <Lock size={200} />
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-sm text-red-500">
               <Key size={28} />
            </div>
            <div className="space-y-1">
               <h2 className="text-xl font-bold uppercase text-white tracking-widest">Root Access Key</h2>
               <p className="text-[9px] text-stone-600 uppercase tracking-widest italic">// Modify high-stakes admin credentials</p>
            </div>
          </div>

          <form onSubmit={handleUpdateKey} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-stone-700 font-bold">New Security Signature</label>
              <div className="relative">
                <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/40" />
                <input 
                  type="password"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full bg-black border border-red-500/20 p-5 pl-12 text-red-500 font-mono focus:outline-none focus:border-red-500 placeholder:text-red-950 transition-all text-xl tracking-[0.4em]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-widest text-stone-700 font-bold">Confirm Signature</label>
              <div className="relative">
                <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/40" />
                <input 
                  type="password"
                  value={confirmKey}
                  onChange={(e) => setConfirmKey(e.target.value)}
                  className="w-full bg-black border border-red-500/20 p-5 pl-12 text-red-500 font-mono focus:outline-none focus:border-red-500 placeholder:text-red-950 transition-all text-xl tracking-[0.4em]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {message && (
              <div className={`p-5 border text-[9px] font-bold uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-left-2 ${
                message.type === 'success' ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-red-500/20 bg-red-500/5 text-red-600'
              }`}>
                {message.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={isUpdating || !newKey}
              className="w-full py-8 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-red-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-30"
            >
              {isUpdating ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              Commit Override Signature
            </button>
          </form>
        </section>

        {/* Data Extraction Section */}
        <section className="space-y-10">
          <div className="p-10 border border-amber-500/10 bg-[#080808] space-y-10 rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white flex items-center gap-3">
              <Database size={18} className="text-amber-500" /> Data Extraction Protocols
            </h3>
            
            <div className="space-y-8">
              {/* Products Cluster */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <p className="text-[9px] text-stone-600 uppercase font-bold tracking-widest">Asset Cluster [Products]</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleExport('products', 'csv')}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-amber-500/80 hover:bg-amber-500 hover:text-black transition-all"
                    >
                      <FileText size={14} /> Export CSV
                    </button>
                    <button 
                      onClick={() => handleExport('products', 'sql')}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-amber-500/80 hover:bg-amber-500 hover:text-black transition-all"
                    >
                      <Binary size={14} /> Export SQL
                    </button>
                 </div>
              </div>

              {/* Requests Cluster */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <p className="text-[9px] text-stone-600 uppercase font-bold tracking-widest">Engagement Cluster [Requests]</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleExport('requests', 'csv')}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-amber-500/80 hover:bg-amber-500 hover:text-black transition-all"
                    >
                      <FileText size={14} /> Export CSV
                    </button>
                    <button 
                      onClick={() => handleExport('requests', 'sql')}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-amber-500/80 hover:bg-amber-500 hover:text-black transition-all"
                    >
                      <Binary size={14} /> Export SQL
                    </button>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-10 border border-white/5 bg-black rounded-sm flex flex-col items-center justify-center text-center space-y-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
             <Zap size={48} className="text-amber-500" strokeWidth={1} />
             <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em]">High-Velocity Data Streaming</p>
                <p className="text-[8px] uppercase tracking-widest">Authorized Extraction Node: 0x99A-EXTRACTION</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};
