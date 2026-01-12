
import React, { useState, useEffect } from 'react';
import { Product, UserStatus } from '../types';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Bookmark, 
  Shield, 
  Zap, 
  Info, 
  ChevronRight, 
  BarChart3, 
  Target, 
  Lock, 
  ChevronDown, 
  Loader2,
  Share2,
  Maximize2,
  Camera,
  Activity,
  Cpu,
  Layers,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { getDeploymentBrief, getSurgeJustification } from '../services/geminiService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (id: string) => void;
  onAddToVault: (id: string) => void;
  userStatus: UserStatus;
  onNavigateToTryOn: (id: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onAddToVault, 
  userStatus,
  onNavigateToTryOn
}) => {
  const [brief, setBrief] = useState<string | null>(null);
  const [surgeText, setSurgeText] = useState<string | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);

  const isStale = (product.lastMonthSales || 0) < 5 && (product.scarcityCount || 0) > 10;
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const fetchBrief = async () => {
    setLoadingBrief(true);
    const [briefText, justifyText] = await Promise.all([
      getDeploymentBrief(product.name, userStatus),
      isStale ? getSurgeJustification(product.name) : Promise.resolve(null)
    ]);
    setBrief(briefText);
    setSurgeText(justifyText);
    setLoadingBrief(false);
  };

  useEffect(() => {
    fetchBrief();
  }, [product.id]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      {/* HUD Header */}
      <nav className="fixed top-0 left-0 right-0 md:left-24 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 group-hover:text-white transition-colors">Abort Mission</span>
        </button>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-[8px] font-bold uppercase tracking-widest text-stone-600">Access Level</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{userStatus}</span>
           </div>
           <button 
            onClick={() => onNavigateToTryOn(product.id)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
           >
             <Camera size={14} className="text-stone-400 group-hover:text-amber-500" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Optical Sync</span>
           </button>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Tactical Gallery */}
        <div className="lg:w-1/2 h-[80vh] lg:h-screen lg:sticky lg:top-0 bg-stone-900 overflow-hidden relative group">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-[3s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          
          {/* Viewport HUD Overlays */}
          <div className="absolute inset-12 pointer-events-none opacity-40">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20" />
          </div>

          <div className="absolute bottom-16 left-12 max-w-lg">
             <div className="flex items-center gap-3 mb-6">
               <Activity size={16} className="text-amber-500 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">Live Silhouette Tracking</span>
             </div>
             <h1 className="text-5xl lg:text-8xl font-serif italic leading-[0.9] text-white mb-6 drop-shadow-2xl">
               {product.name}
             </h1>
             <p className="text-lg text-stone-300 font-light leading-relaxed border-l border-white/20 pl-6 italic">
               "{product.statement}"
             </p>
          </div>
        </div>

        {/* Right: Technical Dossier */}
        <div className="lg:w-1/2 px-6 md:px-16 pt-32 pb-40 space-y-16">
          
          {/* STATUS LEVERAGE ALERT */}
          <div className="p-8 bg-amber-900/10 border border-amber-500/30 rounded-sm space-y-2">
            <div className="flex items-center gap-3 text-amber-500">
              <Zap size={20} className="fill-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-[0.4em]">Acquisition Advantage Enabled</h4>
            </div>
            <p className="text-stone-300 text-sm font-serif italic leading-relaxed">
              Your status as an <span className="text-white font-bold">{userStatus}</span> has authorized a <span className="text-amber-400 font-bold">{discountPercent}% extraction leverage</span> on this silhouette.
            </p>
          </div>

          {/* SURGE ALERT BLOCK */}
          {isStale && (
            <div className="p-8 bg-red-900/10 border border-red-500/30 rounded-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-500">
                  <TrendingUp size={20} />
                  <h4 className="text-xs font-bold uppercase tracking-[0.4em]">Surge Protocol Active</h4>
                </div>
                <div className="px-2 py-1 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest animate-pulse">
                  High Traction
                </div>
              </div>
              <p className="text-stone-300 text-sm font-serif italic leading-relaxed">
                {surgeText || "A rapid increase in reservation signals has been detected for this asset. Status alignment is optimized."}
              </p>
            </div>
          )}

          {/* Acquisition Block */}
          <section className="space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Asset Valuation</p>
                <div className="flex items-baseline gap-4">
                  <p className="text-6xl font-light tracking-tighter">GH₵{product.price.toLocaleString()}</p>
                  {product.originalPrice && (
                    <p className="text-2xl font-light text-stone-600 line-through">GH₵{product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Inventory Status</p>
                <div className="flex items-center gap-2 justify-end">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isStale ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">
                    {isStale ? "Critical Threshold" : `${product.scarcityCount} Units Available`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(product.id)}
                className={`flex-[3] py-8 text-xs font-bold uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 group ${isStale ? 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'bg-white text-black hover:invert'}`}
              >
                <ShoppingBag size={18} />
                {isStale ? 'Claim Allocation Now' : 'Deploy to Inventory'}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onAddToVault(product.id)}
                className="flex-1 border border-white/10 hover:bg-white/5 transition-all text-white flex items-center justify-center group"
              >
                <Bookmark size={20} className="group-hover:fill-current" />
              </button>
            </div>
          </section>

          {/* Neural Analysis Terminal */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 flex items-center gap-3">
                 <Cpu size={14} className="text-amber-500" /> Neural Briefing Protocol
               </h4>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-sm relative overflow-hidden font-mono">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              
              {loadingBrief ? (
                <div className="flex flex-col items-center justify-center py-10 gap-6">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : brief ? (
                <div className="space-y-4">
                  <p className="text-amber-500/90 text-sm leading-relaxed tracking-tight">
                    {brief}
                  </p>
                  <div className="flex justify-between items-center pt-4 opacity-30">
                    <span className="text-[8px] uppercase tracking-[0.4em]">Auth: {product.id}-X</span>
                    <span className="text-[8px] uppercase tracking-[0.4em]">Checksum: OK</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 opacity-20">
                  <p className="text-[10px] uppercase tracking-[0.5em]">Gated Content // High Status Required</p>
                </div>
              )}
            </div>
          </section>

          {/* Data Points Grid */}
          <section className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
            <div className="p-8 bg-[#050505] space-y-4">
              <div className="flex items-center gap-3 text-stone-500">
                <Target size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Fit Integrity</span>
              </div>
              <p className="text-4xl font-light italic">{product.fitConfidence}% <span className="text-xs uppercase font-bold tracking-widest text-stone-600 not-italic">Match</span></p>
            </div>
            <div className="p-8 bg-[#050505] space-y-4">
              <div className="flex items-center gap-3 text-stone-500">
                <Layers size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Social Weight</span>
              </div>
              <p className="text-4xl font-light italic">
                {isStale ? 'SURGING' : product.socialCount.toLocaleString()} 
                <span className="text-xs uppercase font-bold tracking-widest text-stone-600 not-italic ml-2">Citations</span>
              </p>
            </div>
          </section>

          {/* Technical Accordion */}
          <section className="space-y-4">
            <button 
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex justify-between items-center py-6 px-4 bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Material Architecture</span>
              <ChevronDown size={14} className={`transition-transform duration-500 ${showSpecs ? 'rotate-180' : ''}`} />
            </button>
            
            {showSpecs && (
              <div className="p-8 border border-white/5 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-[8px] text-stone-600 uppercase tracking-widest">Composition</p>
                    <p className="text-sm font-medium text-stone-300">Technical Wool / Carbon Fiber Mesh</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] text-stone-600 uppercase tracking-widest">Origin</p>
                    <p className="text-sm font-medium text-stone-300">Gated European Distribution</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between opacity-40">
            <div className="flex items-center gap-4">
              <Shield size={16} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted Checkout Protocol</span>
            </div>
            <div className="flex items-center gap-4">
              <Lock size={16} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Status Verified Selection</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
