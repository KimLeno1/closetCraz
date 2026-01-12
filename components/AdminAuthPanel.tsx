import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Lock, Zap, ArrowRight, Loader2, Activity, Terminal, User, Factory, Key } from 'lucide-react';

interface AdminAuthPanelProps {
  onSuccess: (role: 'admin' | 'supplier') => void;
  onCancel: () => void;
}

type AuthMode = 'ADMIN' | 'SUPPLIER';

export const AdminAuthPanel: React.FC<AdminAuthPanelProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('ADMIN');
  const [key, setKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      if (mode === 'ADMIN') {
        const storedKey = localStorage.getItem('cc_admin_key') || '1234';
        if (key === storedKey) {
          onSuccess('admin');
        } else {
          setError("NEURAL SIGNATURE MISMATCH. UNAUTHORIZED ACCESS DETECTED.");
          setIsVerifying(false);
          setKey('');
          setTimeout(() => setError(null), 3000);
        }
      } else {
        // Mock Supplier Logic: Any non-empty credentials for demo or specific ones
        if (username.toLowerCase() === 'supplier' && password === 'supply') {
          onSuccess('supplier');
        } else {
          setError("CREDENTIAL REJECTION. STUDIO NOT REGISTERED IN CLUSTER.");
          setIsVerifying(false);
          setTimeout(() => setError(null), 3000);
        }
      }
    }, 1500);
  };

  const themeColor = mode === 'ADMIN' ? 'red' : 'blue';

  return (
    <div className={`fixed inset-0 z-[200] bg-black text-${themeColor}-500 flex items-center justify-center p-6 font-mono overflow-hidden transition-colors duration-700`}>
      {/* Glitchy Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className={`w-full h-full border-[20px] border-${themeColor}-900/20`} />
      </div>

      <div className="w-full max-w-lg space-y-12 relative z-10">
        <header className="text-center space-y-8">
          <div className="flex justify-center">
            <div className={`w-20 h-20 border-2 border-${themeColor}-500/30 rounded-full flex items-center justify-center relative animate-pulse`}>
              {mode === 'ADMIN' ? <ShieldAlert size={40} /> : <Factory size={40} />}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-sm max-w-[320px] mx-auto">
              <button 
                onClick={() => { setMode('ADMIN'); setError(null); }}
                className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${mode === 'ADMIN' ? 'bg-red-600 text-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                Root Override
              </button>
              <button 
                onClick={() => { setMode('SUPPLIER'); setError(null); }}
                className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${mode === 'SUPPLIER' ? 'bg-blue-600 text-white' : 'text-stone-600 hover:text-stone-400'}`}
              >
                Supplier Node
              </button>
            </div>
            
            <div className="space-y-2">
              <h2 className={`text-[10px] font-bold uppercase tracking-[0.5em] text-${themeColor}-500/60`}>
                {mode === 'ADMIN' ? 'System Override // Restricted' : 'Studio Engagement // Gated'}
              </h2>
              <h1 className="text-4xl font-serif italic text-white tracking-tighter">
                {mode === 'ADMIN' ? 'Neural Key Required' : 'Collective Entry'}
              </h1>
            </div>
          </div>
        </header>

        <form onSubmit={handleVerify} className={`space-y-8 p-10 bg-${themeColor}-950/10 border border-${themeColor}-500/20 backdrop-blur-md rounded-sm`}>
          {mode === 'ADMIN' ? (
            <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-widest text-red-500/40 block font-black">Secure Override Signature</label>
              <div className="relative">
                <input 
                  ref={inputRef}
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  disabled={isVerifying}
                  placeholder="PROMPT KEY"
                  className="w-full bg-transparent border-b border-red-500/20 py-4 text-2xl tracking-[0.3em] focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-900/30 text-red-500"
                />
                <div className="absolute right-0 bottom-4 text-red-900/40">
                  <Terminal size={18} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-widest text-blue-500/40 block font-black">Studio Identifier</label>
                <div className="relative">
                  <input 
                    ref={inputRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isVerifying}
                    placeholder="USERNAME"
                    className="w-full bg-transparent border-b border-blue-500/20 py-4 text-xl tracking-[0.2em] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-blue-900/30 text-blue-500"
                  />
                  <div className="absolute right-0 bottom-4 text-blue-900/40">
                    <User size={18} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-widest text-blue-500/40 block font-black">Access Encryption</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isVerifying}
                    placeholder="PASSWORD"
                    className="w-full bg-transparent border-b border-blue-500/20 py-4 text-xl tracking-[0.2em] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-blue-900/30 text-blue-500"
                  />
                  <div className="absolute right-0 bottom-4 text-blue-900/40">
                    <Key size={18} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button 
              disabled={isVerifying || (mode === 'ADMIN' ? !key : (!username || !password))}
              className={`w-full py-6 bg-${themeColor}-600 text-white text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-${themeColor}-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-30 shadow-2xl`}
            >
              {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {isVerifying ? 'Authenticating...' : mode === 'ADMIN' ? 'Authorize Override' : 'Connect Node'}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className={`w-full text-center text-[9px] uppercase tracking-[0.4em] text-${themeColor}-900/60 hover:text-${themeColor}-500 transition-colors`}
            >
              Disconnect Node
            </button>
          </div>
        </form>

        <div className="h-8 flex items-center justify-center">
          {error && (
            <div className={`text-[10px] uppercase tracking-[0.2em] animate-bounce text-${themeColor}-500 flex items-center gap-3 font-black`}>
              <Activity size={12} />
              {error}
            </div>
          )}
        </div>

        {/* HUD Elements */}
        <footer className={`grid grid-cols-2 gap-8 pt-8 border-t border-${themeColor}-500/10 opacity-30 text-[8px] uppercase tracking-[0.4em]`}>
          <div className="flex items-center gap-2">
            <Zap size={10} className="text-amber-500" /> Latency: 4ms
          </div>
          <div className="text-right">
            Protocol: {mode === 'ADMIN' ? '0x99A-SEC' : '0x44B-SUP'}
          </div>
        </footer>
      </div>

      {/* Full screen scanline overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,${mode === 'ADMIN' ? 'rgba(255,0,0,0.06)' : 'rgba(0,0,255,0.06)'},rgba(0,255,0,0.02),${mode === 'ADMIN' ? 'rgba(0,0,255,0.06)' : 'rgba(255,0,0,0.06)'})] bg-[length:100%_2px,3px_100%]`} />
    </div>
  );
};