
import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Zap, ShieldAlert, ShoppingBag, ArrowRight, Activity, Lock, TrendingDown } from 'lucide-react';
import { Product, UserStatus } from '../types';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';

interface FlashSalePanelProps {
  userStatus: UserStatus;
  onAddToCart: (id: string, customPrice?: number) => void;
  onProductClick: (id: string) => void;
}

export const FlashSalePanel: React.FC<FlashSalePanelProps> = ({ userStatus, onAddToCart, onProductClick }) => {
  // Persistence for the day: normally would come from a backend or localStorage
  const [saleData, setSaleData] = useState<{
    product: Product;
    discount: number;
    initialSeconds: number;
    currentSeconds: number;
  } | null>(null);

  useEffect(() => {
    // Generate sale data if not present (simulate daily random)
    const allItems = [...PRODUCTS, ...ARCHIVE_PRODUCTS];
    const randomProduct = allItems[Math.floor(Math.random() * allItems.length)];
    
    // Time range: 1 min (60s) to 3 hours (10800s)
    const minSecs = 60;
    const maxSecs = 10800;
    const randomInitialSecs = Math.floor(Math.random() * (maxSecs - minSecs + 1)) + minSecs;
    
    // Discount range: 50% (at 1 min) to 12% (at 3 hours)
    // Formula: d = 50 - ((t - 60) / (10800 - 60)) * (50 - 12)
    const t = randomInitialSecs;
    const discount = 50 - ((t - 60) / (10800 - 60)) * (50 - 12);
    
    setSaleData({
      product: randomProduct,
      discount: Math.round(discount),
      initialSeconds: randomInitialSecs,
      currentSeconds: randomInitialSecs
    });
  }, []);

  useEffect(() => {
    if (!saleData || saleData.currentSeconds <= 0) return;

    const timer = setInterval(() => {
      setSaleData(prev => prev ? { ...prev, currentSeconds: prev.currentSeconds - 1 } : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [saleData?.currentSeconds]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!saleData) return null;

  const { product, discount, currentSeconds, initialSeconds } = saleData;
  const isExpired = currentSeconds <= 0;
  const salePrice = product.price * (1 - discount / 100);
  const progress = (currentSeconds / initialSeconds) * 100;

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-3">
            <Timer size={16} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Operation: Rapid Extraction</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-tight">Timed <span className="italic">Acquisition</span></h1>
          <p className="text-stone-400 font-light max-w-xl text-lg italic leading-relaxed">
            Your status permits a singular high-velocity extraction window. The faster the protocol, the higher the leverage.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Visual Asset */}
          <div className="relative group cursor-pointer" onClick={() => onProductClick(product.id)}>
            <div className="aspect-[3/4] overflow-hidden bg-stone-900 border border-white/5 rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
            
            <div className="absolute top-8 left-8">
              <div className="bg-amber-500 text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                -{discount}% Status Leverage
              </div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 space-y-4">
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-none">{product.name}</h2>
              <p className="text-stone-400 text-sm font-light uppercase tracking-[0.2em]">{product.category} // {product.styleTag}</p>
            </div>
          </div>

          {/* Tactical Controls */}
          <div className="space-y-12 py-4">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Market Valuation</p>
                  <p className="text-4xl font-light text-stone-600 line-through">GH₵{product.price.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Extraction Price</p>
                  <p className="text-6xl font-serif italic text-white">GH₵{Math.floor(salePrice).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-10 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <TrendingDown size={120} />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Window Closes In</p>
                    <span className={`text-xs font-mono font-bold ${currentSeconds < 300 ? 'text-red-500 animate-pulse' : 'text-stone-300'}`}>
                      {isExpired ? 'SIGNAL LOST' : 'ACTIVE'}
                    </span>
                  </div>
                  <p className={`text-7xl font-mono tracking-tighter ${currentSeconds < 300 ? 'text-red-500' : 'text-white'}`}>
                    {isExpired ? '00:00:00' : formatTime(currentSeconds)}
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest text-stone-600">
                    <span>Protocol Initialized</span>
                    <span>Termination Threshold</span>
                  </div>
                  <div className="h-1 w-full bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${currentSeconds < 300 ? 'bg-red-500' : 'bg-amber-500'}`} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-stone-500">
                <ShieldAlert size={16} />
                <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                  Extraction protocols are non-transferable. This 1-of-1 allocation will be permanently purged upon timer expiration.
                </p>
              </div>

              <button 
                onClick={() => !isExpired && onAddToCart(product.id, Math.floor(salePrice))}
                disabled={isExpired}
                className={`w-full py-8 text-xs font-bold uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 group ${
                  isExpired 
                    ? 'border border-white/5 text-stone-700 cursor-not-allowed' 
                    : 'bg-white text-black hover:invert'
                }`}
              >
                <ShoppingBag size={18} />
                {isExpired ? 'Extraction Failed' : 'Commit to Extraction'}
                {!isExpired && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-[8px] text-stone-600 uppercase tracking-widest">Aesthetic Match</p>
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-amber-500" />
                  <span className="text-xl font-serif italic">{product.fitConfidence}%</span>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-[8px] text-stone-600 uppercase tracking-widest">Network Sociality</p>
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-stone-500" />
                  <span className="text-xl font-serif italic">Restricted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
