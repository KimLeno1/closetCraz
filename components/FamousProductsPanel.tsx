
import React, { useState } from 'react';
import { Star, Zap, Shield, Sparkles, Loader2, Award, ArrowUpRight, History } from 'lucide-react';
import { ARCHIVE_PRODUCTS } from '../extraMockData';
import { UserStatus, Product } from '../types';
import { GoogleGenAI } from "@google/genai";

interface FamousProductsPanelProps {
  userStatus: UserStatus;
  onProductClick: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export const FamousProductsPanel: React.FC<FamousProductsPanelProps> = ({ userStatus, onProductClick, onAddToCart }) => {
  const [activeHeritage, setActiveHeritage] = useState<{ [key: string]: string }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchHeritage = async (product: Product) => {
    setLoadingId(product.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide a fictional "Aesthetic Heritage" for the famous fashion piece: "${product.name}". 
      Explain its significance in the "Protocol Collective". Mention a famous (fictional) event it was worn at. 
      Tone: Prestigious, secret society, high-fashion. Max 40 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setActiveHeritage(prev => ({ ...prev, [product.id]: response.text }));
    } catch (err) {
      setActiveHeritage(prev => ({ 
        ...prev, 
        [product.id]: "This piece was famously deployed during the Neo-Symmetry Gala. It remains a cornerstone of the architectural silhouette movement." 
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 border-b border-white/5 pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Hall of Icons // Archival</p>
            </div>
            <h1 className="text-6xl md:text-9xl font-serif leading-tight">Famous <br /><span className="italic">Silhouettes</span></h1>
            <p className="text-stone-400 font-light text-xl max-w-xl">
              The pieces that defined the collective. These are not just garments; they are artifacts of cultural leverage.
            </p>
          </div>
          
          <div className="bg-[#111] p-6 border border-white/5 rounded-sm">
            <div className="flex items-center gap-4 mb-2">
              <Award size={20} className="text-stone-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Legendary Status</span>
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Available to Status: {UserStatus.TRENDSETTER}+</p>
          </div>
        </header>

        <div className="space-y-40">
          {ARCHIVE_PRODUCTS.map((product, index) => (
            <div 
              key={product.id} 
              className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Product Visual */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="aspect-[4/5] bg-stone-900 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
                
                {/* Floating Rank */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-white text-black flex items-center justify-center rounded-full font-serif text-4xl italic shadow-2xl z-10 border-[8px] border-black">
                  0{index + 1}
                </div>
              </div>

              {/* Product Info */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Tier: Immortal</span>
                    <div className="h-px w-12 bg-white/10" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">{product.socialCount} Social Citations</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif">{product.name}</h2>
                  <p className="text-stone-400 text-lg font-light leading-relaxed italic">
                    "{product.statement}"
                  </p>
                </div>

                <div className="p-8 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-6">
                  {activeHeritage[product.id] ? (
                    <div className="animate-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-2 mb-4 text-stone-500">
                        <History size={14} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Heritage Log</span>
                      </div>
                      <p className="text-stone-300 font-serif text-xl leading-relaxed italic">
                        {activeHeritage[product.id]}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-stone-500 uppercase tracking-widest font-light">History currently encrypted.</p>
                      <button 
                        onClick={() => fetchHeritage(product)}
                        disabled={loadingId === product.id}
                        className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-amber-500 flex items-center gap-2 transition-all underline underline-offset-8"
                      >
                        {loadingId === product.id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                        Decrypt Heritage
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => onAddToCart(product.id)}
                    className="flex-1 bg-white text-black py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-200 transition-all flex items-center justify-center gap-3"
                  >
                    Request Allocation
                  </button>
                  <button 
                    onClick={() => onProductClick(product.id)}
                    className="p-6 border border-white/10 text-white hover:border-white transition-all flex items-center justify-center"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
