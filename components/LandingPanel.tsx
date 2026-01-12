import React, { useState, useEffect } from 'react';
import { Shield, Zap, ArrowRight, Fingerprint, Activity, Lock, Eye } from 'lucide-react';
import { UserStatus } from '../types';

interface LandingPanelProps {
  onEnter: () => void;
  onAdminRequest: () => void;
  userStatus: UserStatus;
}

export const LandingPanel: React.FC<LandingPanelProps> = ({ onEnter, onAdminRequest, userStatus }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [showSecretShield, setShowSecretShield] = useState(false);
  const [cClickCount, setCClickCount] = useState(0);

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => setScanProgress(prev => prev + 1), 20);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100) {
      setTimeout(() => setAuthorized(true), 500);
    }
  }, [isScanning, scanProgress]);

  const handleCClick = () => {
    if (showSecretShield) return;
    setCClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowSecretShield(true);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex items-center justify-center font-serif">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 grayscale scale-110 blur-[2px]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-34241-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        {/* Animated Grid lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 text-center space-y-16">
        <header className="space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="flex justify-center mb-8 relative">
            <div className="text-5xl font-serif tracking-tighter flex items-center">
              <span 
                onClick={handleCClick} 
                className={`cursor-pointer transition-colors duration-500 ${cClickCount > 0 && !showSecretShield ? 'text-amber-500/60' : 'hover:text-amber-500'}`}
              >C</span>
              <span className="italic ml-0.5">L</span>
              <span>OSET</span>
              <span className="mx-4 text-stone-800 text-3xl font-light">/</span>
              <span>C</span>
              <span className="italic ml-0.5">R</span>
              <span>AZE</span>
            </div>

            {/* Secret Admin Shield */}
            {showSecretShield && (
              <div className="absolute -top-12 left-1/2 -translate-x-[110%] animate-in zoom-in-50 fade-in duration-500">
                <button 
                  onClick={onAdminRequest}
                  className="p-3 bg-red-600/20 border border-red-500 rounded-full text-red-500 hover:bg-red-500 hover:text-black transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] group"
                >
                  <Shield size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] italic">
            Identity is the <br /> 
            <span className="not-italic text-stone-400">ultimate architecture.</span>
          </h1>
          <p className="text-stone-500 font-sans uppercase tracking-[0.5em] text-[10px] font-bold">
            Neural Synchronization Required // Protocol 001
          </p>
        </header>

        <div className="flex flex-col items-center gap-12">
          {!isScanning && !authorized && (
            <button 
              onClick={() => setIsScanning(true)}
              className="group relative px-16 py-8 border border-white/20 hover:border-white transition-all duration-700 bg-white/5 backdrop-blur-md overflow-hidden"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              <div className="relative z-10 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] group-hover:text-black transition-colors">
                <Fingerprint size={20} className="group-hover:animate-pulse" />
                Initialize Identity Scan
              </div>
            </button>
          )}

          {isScanning && !authorized && (
            <div className="w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-end font-sans">
                <span className="text-[10px] uppercase tracking-widest text-stone-500">Verifying Status: {userStatus}</span>
                <span className="text-xs font-bold text-amber-500">{scanProgress}%</span>
              </div>
              <div className="h-0.5 w-full bg-stone-900 overflow-hidden relative">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_15px_#fff]" 
                  style={{ width: `${scanProgress}%` }} 
                />
              </div>
              <p className="text-[9px] font-sans uppercase tracking-widest text-stone-600 animate-pulse text-center">
                Accessing Aesthetic History... Synchronizing Neural Shards...
              </p>
            </div>
          )}

          {authorized && (
            <button 
              onClick={onEnter}
              className="group px-20 py-10 bg-white text-black text-xs font-bold uppercase tracking-[0.6em] hover:bg-stone-200 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 flex items-center gap-6"
            >
              <span>Enter Protocol</span>
              <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-700" />
            </button>
          )}
        </div>

        <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 opacity-40 font-sans text-[8px] uppercase tracking-[0.4em]">
          <div className="flex items-center justify-center gap-3">
            <Lock size={12} /> Secure Connection Established
          </div>
          <div className="flex items-center justify-center gap-3">
            <Activity size={12} className="text-amber-500" /> System Velocity: Optimal
          </div>
          <div className="flex items-center justify-center gap-3">
            <Shield size={12} /> Status: {userStatus} // Verified
          </div>
        </footer>
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-12 left-12 w-32 h-32 border-t border-l border-white/10" />
      <div className="absolute top-12 right-12 w-32 h-32 border-t border-r border-white/10" />
      <div className="absolute bottom-12 left-12 w-32 h-32 border-b border-l border-white/10" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-b border-r border-white/10" />

      {/* Floating Meta Info */}
      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-2 text-stone-700 font-sans text-[8px] uppercase tracking-widest leading-relaxed">
        <p>Aesthetic Recalibration v4.2.0</p>
        <p>Neural Lattice: Active</p>
        <p>Citations: {Math.floor(Math.random() * 100000).toLocaleString()} Verified</p>
      </div>
    </div>
  );
};
