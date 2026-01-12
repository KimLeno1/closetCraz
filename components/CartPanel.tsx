
import React, { useState } from 'react';
import { Product, UserStatus } from '../types';
import { Trash2, Bookmark, ShoppingBag, Clock, ShieldCheck, ArrowRight, Zap, Loader2, AlertCircle, Timer } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CartPanelProps {
  cartItems: Product[];
  removeFromCart: (id: string) => void;
  moveToVault: (id: string) => void;
  onCheckout: () => void;
  timeLeft: number;
  userStatus: UserStatus;
}

export const CartPanel: React.FC<CartPanelProps> = ({ 
  cartItems, 
  removeFromCart, 
  moveToVault, 
  onCheckout, 
  timeLeft,
  userStatus
}) => {
  const [riskAnalysis, setRiskAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price), 0);
  const savings = originalTotal - total;
  
  const containsPreOrder = cartItems.some(i => i.isPreOrder);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runRiskAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const items = cartItems.map(i => i.name).join(', ');
      const prompt = `User status: ${userStatus}. Items in bag: ${items}. 
      Perform a "Tactical Risk Analysis". Explain in 20 words why releasing these items back to the vault would cause "Aesthetic Regression" or "Status Decay". 
      Tone: High-end, cold, architectural, urgent.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setRiskAnalysis(response.text);
    } catch (err) {
      setRiskAnalysis("Relinquishing these silhouettes will result in immediate identity dilution. The current market window is closing.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={16} className="text-stone-600" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Acquisition Protocol</p>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif">The Deployment Bag</h2>
          </div>

          <div className="flex items-center gap-6 bg-[#111] px-8 py-5 rounded-sm border border-white/5 relative overflow-hidden">
            {timeLeft < 120 && <div className="absolute inset-0 bg-red-500/10 animate-pulse" />}
            <Clock size={16} className={timeLeft < 120 ? 'text-red-500' : 'text-amber-500'} />
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest text-stone-600">Inventory Lock Remaining</p>
              <p className={`text-2xl font-serif italic ${timeLeft < 120 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
            <ShoppingBag size={32} className="mx-auto text-stone-800 mb-6" strokeWidth={1} />
            <p className="text-stone-600 uppercase tracking-[0.3em] text-xs">Deployment Bag Empty</p>
            <p className="text-stone-400 mt-4 font-light max-w-xs mx-auto">
              Your identity reinforcements are currently unassigned. Explore the latest drops to secure your silhouette.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {/* Tactical Risk Analysis (Gemini) */}
              <div className="bg-[#0D0D0D] border border-white/5 p-8 rounded-sm group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                  <AlertCircle size={80} />
                </div>
                <div className="relative z-10">
                  {riskAnalysis ? (
                    <div className="animate-in slide-in-from-left-4 duration-500">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500 mb-3 flex items-center gap-2">
                        <Zap size={12} /> Tactical Risk Assessment
                      </h4>
                      <p className="text-xl font-serif italic text-stone-200 leading-relaxed">
                        "{riskAnalysis}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-stone-500 uppercase tracking-widest">Run Gemini Protocol Analysis on these selections?</p>
                      <button 
                        onClick={runRiskAnalysis}
                        disabled={isAnalyzing}
                        className="text-[10px] font-bold uppercase tracking-widest text-white hover:underline underline-offset-8 flex items-center gap-2 transition-all"
                      >
                        {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                        Execute Risk Scan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-8 group pb-10 border-b border-white/5 last:border-0">
                    <div className="w-32 md:w-44 aspect-[3/4] bg-stone-900 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                      {item.isPreOrder && (
                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-500/80 backdrop-blur-md py-1.5 flex justify-center items-center gap-2">
                           <Timer size={10} className="text-white" />
                           <span className="text-[8px] font-bold uppercase tracking-widest text-white">Pre-order Protocol</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">{item.mood} // Logic</p>
                            <h3 className="text-3xl font-serif">{item.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-white">GH₵{item.price}</p>
                            {item.originalPrice && (
                              <p className="text-sm font-light text-stone-600 line-through">GH₵{item.originalPrice}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-stone-400 text-sm font-light italic leading-relaxed max-w-sm">
                          "{item.statement}"
                        </p>
                      </div>

                      <div className="flex gap-8 pt-6">
                        <button 
                          onClick={() => moveToVault(item.id)}
                          className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white flex items-center gap-2 transition-colors group/btn"
                        >
                          <Bookmark size={12} className="group-hover/btn:fill-current" />
                          Secure in Vault
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600 hover:text-red-400 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={12} />
                          Discard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="space-y-8">
              <div className="p-10 bg-[#0D0D0D] border border-white/5 rounded-sm sticky top-32">
                <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-600 mb-10">Final Commitment</h4>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-stone-500">MSRP Valuation</span>
                    <span className="text-stone-300">GH₵{originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-amber-500">Status Leverage</span>
                    <span className="text-amber-500">-GH₵{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-stone-500">Order Protocol</span>
                    <span className={`uppercase text-[10px] font-bold tracking-widest ${containsPreOrder ? 'text-indigo-400' : 'text-green-500'}`}>
                      {containsPreOrder ? 'Archival Allocation' : 'Local Stock Deployment'}
                    </span>
                  </div>
                  <div className="h-px bg-white/5 w-full my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">Total Obligation</span>
                    <span className="text-4xl font-serif italic text-white">GH₵{total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={onCheckout}
                  className={`w-full py-6 text-xs font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group overflow-hidden relative ${containsPreOrder ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-black hover:bg-stone-200'}`}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {containsPreOrder ? 'Initialize Pre-order' : 'Finalize Deployment'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-[600s] ease-linear" style={{ width: `${(timeLeft/600)*100}%` }} />
                </button>

                <div className="mt-8 flex items-center gap-4 text-stone-600">
                  <ShieldCheck size={18} className="shrink-0" />
                  <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                    {containsPreOrder 
                      ? "Pre-orders involve external archive fulfillment and may require extended temporal windows for deployment."
                      : "By finalizing, you acknowledge the scarcity and commit to the chosen silhouette legacy."}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
