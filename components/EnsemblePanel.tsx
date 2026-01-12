
import React, { useState } from 'react';
import { Package, Zap, ChevronRight, ShoppingBag, ShieldCheck, Info, Sparkles, Loader2, Target } from 'lucide-react';
import { Bundle, UserStatus } from '../types';
import { BUNDLES } from '../bundlesData';
import { GoogleGenAI } from "@google/genai";

interface EnsemblePanelProps {
  userStatus: UserStatus;
  onAddBundleToCart: (bundle: Bundle) => void;
  onProductClick: (id: string) => void;
}

export const EnsemblePanel: React.FC<EnsemblePanelProps> = ({ userStatus, onAddBundleToCart, onProductClick }) => {
  const [synergyAnalysis, setSynergyAnalysis] = useState<{ [key: string]: string }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const analyzeSynergy = async (bundle: Bundle) => {
    setLoadingId(bundle.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a "Strategic Synergy Analysis" for the fashion ensemble: "${bundle.name}" which includes ${bundle.products.map(p => p.name).join(', ')}. 
      Explain why these specific items coordinated together maximize the wearer's status and psychological dominance.
      Tone: Brutalist, high-fashion, tactical. Max 30 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const text = response.text;
      setSynergyAnalysis(prev => ({ ...prev, [bundle.id]: text }));
    } catch (err) {
      setSynergyAnalysis(prev => ({ 
        ...prev, 
        [bundle.id]: "Coordinated silhouette layers create a unified field of aesthetic authority, reinforcing status through deliberate architectural alignment." 
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 space-y-4">
          <div className="flex items-center gap-3">
            <Package size={16} className="text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Operation: Coordination Protocol</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif">Ensemble <span className="italic">Protocols</span></h1>
          <p className="text-stone-400 font-light max-w-xl text-lg italic leading-relaxed">
            Admin-curated deployments. Single-unit coordination designed to bypass individual selection friction while maximizing status leverage.
          </p>
        </header>

        <div className="space-y-40">
          {BUNDLES.map((bundle) => {
            const discountPercent = Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100);
            
            return (
              <div key={bundle.id} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                {/* Hero Asset */}
                <div className="relative group">
                  <div className="aspect-[16/9] overflow-hidden bg-stone-900 border border-white/5 rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    <div className="bg-amber-500 text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-2xl self-start">
                      -{discountPercent}% Synergy Discount
                    </div>
                    <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 self-start">
                      Tier: {bundle.tier}
                    </div>
                  </div>

                  <div className="absolute bottom-12 left-12 right-12 space-y-4">
                    <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-none">{bundle.name}</h2>
                    <p className="text-stone-400 text-sm font-light uppercase tracking-[0.2em]">{bundle.statement}</p>
                  </div>
                </div>

                {/* Tactical Configuration */}
                <div className="space-y-12 py-4">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Cumulative Value</p>
                        <p className="text-3xl font-light text-stone-600 line-through">GH₵{bundle.originalPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Coordination Price</p>
                        <p className="text-6xl font-serif italic text-white">GH₵{bundle.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600">Included Assets</p>
                      <div className="grid grid-cols-1 gap-4">
                        {bundle.products.map(p => (
                          <div 
                            key={p.id} 
                            onClick={() => onProductClick(p.id)}
                            className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                          >
                            <div className="w-16 h-20 bg-stone-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                              <img src={p.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium uppercase tracking-widest">{p.name}</h4>
                              <p className="text-[9px] text-stone-500 uppercase">{p.category} // {p.styleTag}</p>
                            </div>
                            <ChevronRight size={16} className="text-stone-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Synergy Section */}
                  <div className="p-10 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Target size={80} />
                    </div>
                    {synergyAnalysis[bundle.id] ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-700 relative z-10">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-amber-500" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-500">Synergy Analysis: Decrypted</span>
                        </div>
                        <p className="text-xl font-serif italic text-stone-300 leading-relaxed">
                          "{synergyAnalysis[bundle.id]}"
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => analyzeSynergy(bundle)}
                        disabled={loadingId === bundle.id}
                        className="w-full flex items-center justify-between text-stone-500 hover:text-white transition-all relative z-10 group/btn"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                          {loadingId === bundle.id ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                          Run Strategic Synergy Scan
                        </span>
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={() => onAddBundleToCart(bundle)}
                      className="w-full py-8 text-xs font-bold uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 bg-white text-black hover:invert"
                    >
                      <ShoppingBag size={18} />
                      Commit Coordination Protocol
                    </button>
                    <div className="flex items-center gap-4 text-stone-500">
                      <ShieldCheck size={16} />
                      <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                        Bundled deployments are pre-authenticated for status progression. Full ensemble acquisition yields bonus neural shards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
