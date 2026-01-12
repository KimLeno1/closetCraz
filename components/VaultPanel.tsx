
import React, { useState, useEffect } from 'react';
import { Product, UserStatus } from '../types';
import { 
  Shield, 
  Trash2, 
  ShoppingBag, 
  Info, 
  Zap, 
  Sparkles, 
  Loader2, 
  Bookmark, 
  Plus, 
  Gem,
  Cpu,
  Lock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getExpansionNarrative } from '../services/geminiService';

interface VaultPanelProps {
  vaultItems: Product[];
  removeFromVault: (id: string) => void;
  moveToCart: (id: string) => void;
  userStatus: UserStatus;
  extraVaultSlots: number;
  diamonds: number;
  onBuySpace: (cost: number, slots: number) => void;
}

export const VaultPanel: React.FC<VaultPanelProps> = ({ 
  vaultItems, 
  removeFromVault, 
  moveToCart, 
  userStatus,
  extraVaultSlots,
  diamonds,
  onBuySpace
}) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expansionBrief, setExpansionBrief] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const totalValue = vaultItems.reduce((acc, item) => acc + item.price, 0);
  const baseCapacity = userStatus === UserStatus.ICON ? 24 : userStatus === UserStatus.TRENDSETTER ? 12 : 6;
  const totalCapacity = baseCapacity + extraVaultSlots;

  const expansionCost = 100; // 100 shards for 5 slots

  useEffect(() => {
    const fetchExpansionBrief = async () => {
      const brief = await getExpansionNarrative(userStatus);
      setExpansionBrief(brief);
    };
    fetchExpansionBrief();
  }, [userStatus]);

  const analyzeVault = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this fashion wish-list collection: ${vaultItems.map(i => i.name).join(', ')}. 
      Provide a 20-word "Collection Narrative" that explains why these items are worth desiring and how they fit together. 
      Speak in a high-end, exclusive tone.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAnalysis(response.text);
    } catch (err) {
      setAnalysis("Your desired collection represents a deliberate defiance of the mundane. An architectural statement in every thread.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExpand = () => {
    if (diamonds >= expansionCost) {
      setIsExpanding(true);
      // Simulate "Expansion Encryption"
      setTimeout(() => {
        onBuySpace(expansionCost, 5);
        setIsExpanding(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        {/* Vault Header Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bookmark size={16} className="text-stone-600" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Wishlist Strategy // Vault</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif">The Wishlist Vault</h2>
            <p className="text-stone-400 font-light max-w-lg">
              A private repository for items under surveillance. These pieces are prioritized for your eventual deployment into the real world.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Target Equity</p>
              <p className="text-2xl font-serif italic">GH₵{totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Vault Limit</p>
              <p className="text-2xl font-serif italic">{vaultItems.length}/{totalCapacity}</p>
            </div>
            <div className="flex flex-col items-end">
               <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Neural Shards</p>
               <div className="flex items-center gap-2">
                 <Gem size={14} className="text-amber-500" />
                 <p className="text-2xl font-mono">{diamonds}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Expansion Protocol */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 bg-[#0D0D0D] border border-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex gap-6 items-center">
              <div className="p-4 bg-white/5 rounded-full text-white group-hover:scale-110 transition-transform">
                <Cpu size={24} className="text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-serif mb-1 italic">Space Expansion Protocol</h4>
                <p className="text-sm text-stone-500 max-w-md italic">
                  {expansionBrief || "Authorizing neural sector expansion for increased asset portfolio storage."}
                </p>
              </div>
            </div>
            <button 
              onClick={handleExpand}
              disabled={isExpanding || diamonds < expansionCost}
              className={`px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-3 border ${
                diamonds >= expansionCost 
                ? 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400' 
                : 'border-white/5 text-stone-700 cursor-not-allowed'
              }`}
            >
              {isExpanding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Expand (+5 Slots) // {expansionCost} Shards
            </button>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col justify-center items-center text-center space-y-4">
             <Lock size={20} className="text-stone-700" />
             <div>
               <p className="text-[9px] uppercase tracking-[0.4em] text-stone-600 mb-1">Verification Status</p>
               <p className="text-xs font-bold uppercase tracking-widest text-white">Neural Links Optimized</p>
             </div>
          </div>
        </div>

        {vaultItems.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
            <Bookmark size={32} className="mx-auto text-stone-800 mb-6" strokeWidth={1} />
            <p className="text-stone-600 uppercase tracking-[0.3em] text-xs">No Targets Identified</p>
            <p className="text-stone-400 mt-4 font-light italic">Your wishlist is currently a blank canvas. Discover drops to secure your next silhouette.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* AI Analysis Hook */}
            <div className="bg-[#0D0D0D] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="flex gap-6 items-center">
                <div className="p-4 bg-white/5 rounded-full text-white group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-1 italic">Wishlist Synthesis</h4>
                  <p className="text-sm text-stone-500 max-w-md">
                    {analysis || "Allow Gemini to analyze the strategic logic of your desired collection."}
                  </p>
                </div>
              </div>
              <button 
                onClick={analyzeVault}
                disabled={isAnalyzing}
                className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-3"
              >
                {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Synthesize Targets
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {vaultItems.map((item) => (
                <div key={item.id} className="group space-y-6">
                  <div className="relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <button 
                      onClick={() => removeFromVault(item.id)}
                      className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md text-stone-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-4 px-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-serif">{item.name}</h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">GH₵{item.price}</p>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400">
                        <Info size={12} />
                        <span className="text-[9px] uppercase tracking-tighter">{item.fitConfidence}% Match</span>
                      </div>
                    </div>
                    
                    <p className="text-stone-500 text-xs italic font-light leading-relaxed">
                      "{item.statement}"
                    </p>

                    <button 
                      onClick={() => moveToCart(item.id)}
                      className="w-full border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <ShoppingBag size={14} />
                      Commit to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
