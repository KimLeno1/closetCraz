
import React, { useState } from 'react';
import { Shield, Zap, Lock, Eye, EyeOff, ArrowRight, Cpu, Activity, Globe, Fingerprint, Loader2 } from 'lucide-react';
import { UserStatus } from '../types';

interface AuthPanelProps {
  onAuthorized: (userData: any) => void;
  userStatus: UserStatus;
}

type AuthMode = 'VERIFICATION' | 'ENROLLMENT';

export const AuthPanel: React.FC<AuthPanelProps> = ({ onAuthorized, userStatus }) => {
  const [mode, setMode] = useState<AuthMode>('VERIFICATION');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    status: userStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMessage("INITIALIZING NEURAL HANDSHAKE...");

    // Simulate high-stakes verification process
    setTimeout(() => setStatusMessage("BYPASSING STANDARD ENCRYPTION..."), 800);
    setTimeout(() => setStatusMessage("SYNCING IDENTITY SHARDS..."), 1600);
    setTimeout(() => {
      setIsProcessing(false);
      onAuthorized(formData);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#050505] text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background HUD Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-lg relative z-10 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center relative group">
              <div className="absolute inset-0 border border-amber-500/20 animate-ping group-hover:animate-none" />
              <Shield size={32} className="text-white group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">
              Identity Protocol // {mode}
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-none">
              {mode === 'VERIFICATION' ? 'Welcome Back' : 'Neural Enrollment'}
            </h1>
          </div>
        </header>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-[#0D0D0D] border border-white/5 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          
          <div className="space-y-8">
            {mode === 'ENROLLMENT' && (
              <div className="space-y-2 animate-in slide-in-from-left-4 duration-500">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-600">Identity Handle</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. V.Thorne"
                  className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-600">Communications Node</label>
              <input 
                required
                type="email"
                placeholder="node@network.ext"
                className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-600">Bio-Key Signature</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-b border-white/10 py-4 font-mono text-lg tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-4 text-stone-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'ENROLLMENT' && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-700">
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-600">Status Alignment</p>
                <div className="grid grid-cols-2 gap-4">
                  {[UserStatus.OBSERVER, UserStatus.INSIDER].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({...formData, status})}
                      className={`p-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                        formData.status === status ? 'bg-white text-black border-white' : 'border-white/10 text-stone-500 hover:border-white/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 space-y-6">
            <button 
              disabled={isProcessing}
              className="w-full py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-stone-200 transition-all flex items-center justify-center gap-4 group overflow-hidden relative"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === 'VERIFICATION' ? 'Verify Identity' : 'Enroll in Protocol'}
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'VERIFICATION' ? 'ENROLLMENT' : 'VERIFICATION');
                setFormData({...formData, username: '', email: '', password: ''});
              }}
              className="w-full text-center text-[9px] uppercase tracking-[0.3em] text-stone-600 hover:text-white transition-colors"
            >
              {mode === 'VERIFICATION' ? "Don't have a neural signature? Enroll." : "Already synchronized? Verify."}
            </button>
          </div>
        </form>

        {/* System Messages */}
        <div className="h-12 flex flex-col items-center justify-center">
          {statusMessage && (
            <div className="flex items-center gap-3 text-amber-500 font-mono text-[10px] tracking-widest animate-pulse">
              <Activity size={12} />
              {statusMessage}
            </div>
          )}
        </div>

        {/* Footer HUD elements */}
        <footer className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 opacity-40 font-mono text-[8px] uppercase tracking-[0.4em] text-center">
          <div className="flex items-center justify-center gap-2">
            <Lock size={10} /> Encrypted
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe size={10} /> Global Node
          </div>
          <div className="flex items-center justify-center gap-2">
            <Cpu size={10} /> Auth: AES-256
          </div>
        </footer>
      </div>

      {/* Decorative HUD Corners */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-12 right-12 w-24 h-24 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-b border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b border-r border-white/10 pointer-events-none" />
    </div>
  );
};
