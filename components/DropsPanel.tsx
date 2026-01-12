
import React, { useState, useEffect } from 'react';
import { Clock, Zap, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';
import { ProductCard } from './ProductCard';
import { UserStatus } from '../types';

interface DropsPanelProps {
  userStatus: UserStatus;
  onVaultToggle: (e: React.MouseEvent, id: string) => void;
  vault: string[];
  onProductClick: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export const DropsPanel: React.FC<DropsPanelProps> = ({ userStatus, onVaultToggle, vault, onProductClick, onAddToCart }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 42, s: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-700">
      {/* Header / Protocol Status */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Protocol: 004 // LIVE</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif">The Midnight Drop</h2>
            <p className="text-stone-400 font-light max-w-lg">
              Status-gated archival pieces. Quantities strictly limited to single digits. 
              {userStatus === UserStatus.ICON ? ' Your Icon status grants instant checkout.' : ' Early access enabled for Insiders.'}
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 p-8 rounded-sm min-w-[300px]">
            <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-4 flex items-center gap-2">
              <Clock size={12} />
              Reservations Closing In
            </p>
            <div className="flex gap-4 text-4xl font-serif italic">
              <span>{formatUnit(timeLeft.h)}</span>
              <span className="opacity-30">:</span>
              <span>{formatUnit(timeLeft.m)}</span>
              <span className="opacity-30">:</span>
              <span>{formatUnit(timeLeft.s)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Drop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
        {PRODUCTS.map(p => (
          <div key={p.id} className="space-y-4">
            <ProductCard 
              product={p} 
              onClick={() => onProductClick(p.id)} 
              onVaultToggle={onVaultToggle}
              isInVault={vault.includes(p.id)}
            />
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div className="h-1 w-24 bg-stone-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-400" 
                    style={{ width: `${(p.scarcityCount / 15) * 100}%` }} 
                  />
                </div>
                <span className="text-[9px] uppercase tracking-tighter text-stone-500">Velocity: High</span>
              </div>
              <button 
                onClick={() => onAddToCart(p.id)}
                className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:text-white text-stone-400 transition-colors"
              >
                Quick Claim <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Archive / Status Locked Section */}
      <section className="bg-stone-900/20 border border-white/5 p-12 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Zap size={20} className="text-amber-500" />
            <h3 className="text-3xl font-serif italic">The Archive Vault</h3>
          </div>

          {userStatus === UserStatus.ICON || userStatus === UserStatus.TRENDSETTER ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {ARCHIVE_PRODUCTS.map(p => (
                <div key={p.id} className="group cursor-pointer">
                  <div 
                    className="aspect-[16/9] mb-6 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
                    onClick={() => onProductClick(p.id)}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-serif mb-1">{p.name}</h4>
                      <p className="text-xs text-stone-500 uppercase tracking-widest">GH₵{p.price} — Curated Access Only</p>
                    </div>
                    <button 
                      onClick={() => onAddToCart(p.id)}
                      className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle size={48} className="text-stone-700 mb-6" />
              <h4 className="text-xl font-serif mb-4">Identity Verification Required</h4>
              <p className="text-stone-500 max-w-md text-sm leading-relaxed mb-8">
                Archive access is restricted to Trendsetters and Icons. 
                Continue building your progression to unlock the 1-of-1 vault.
              </p>
              <div className="h-px w-24 bg-stone-800" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
