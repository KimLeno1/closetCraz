
import React, { useState, useEffect } from 'react';
import { Product, Bundle, UserStatus } from '../types';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  MapPin, 
  Zap, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  Activity,
  Cpu,
  Gem
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CheckoutPanelProps {
  cartItems: (Product | Bundle)[];
  onBack: () => void;
  onComplete: (details: any) => void;
  userStatus: UserStatus;
}

export const CheckoutPanel: React.FC<CheckoutPanelProps> = ({ cartItems, onBack, onComplete, userStatus }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    card: '',
    expiry: '',
    cvv: ''
  });

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const earnedDiamonds = Math.floor(total / 10);
  const points = Math.floor(total * 0.15);

  const runAudit = async () => {
    setIsVerifying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const items = cartItems.map(i => i.name).join(', ');
      const prompt = `Perform a "Neural Transaction Audit" for a user with ${userStatus} status acquiring: ${items}. 
      Explain why this specific acquisition protocol is "architecturally sound" for their current status trajectory. 
      Tone: High-end, elite, cold, brutalist. Max 25 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const text = response.text;
      setAuditResult(text);
    } catch (err) {
      setAuditResult("Acquisition validated. Silhouette synergy matches status requirements for immediate identity deployment.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditResult && !isVerifying) {
      runAudit();
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 flex justify-between items-center border-b border-white/5 pb-12">
          <button onClick={onBack} className="flex items-center gap-3 text-stone-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Return to Bag</span>
          </button>
          <div className="flex items-center gap-3">
            <Lock size={14} className="text-stone-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-600">Secure Protocol // Level 4</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-16">
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-white" />
                <h3 className="text-2xl font-serif italic">Deployment Point</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-stone-600">Identity Signature (Full Name)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                      placeholder="e.g. Julian Thorne"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-stone-600">Geographic Coordinate (Address)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <CreditCard size={20} className="text-white" />
                <h3 className="text-2xl font-serif italic">Financial Signature</h3>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-stone-600">Card Assets</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b border-white/10 py-4 font-mono text-lg tracking-widest focus:outline-none focus:border-white transition-colors"
                    placeholder="0000 0000 0000 0000"
                    value={formData.card}
                    onChange={(e) => setFormData({...formData, card: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-stone-600">Expiry</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b border-white/10 py-4 font-mono text-lg focus:outline-none focus:border-white transition-colors"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-stone-600">Security Hash (CVV)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b border-white/10 py-4 font-mono text-lg focus:outline-none focus:border-white transition-colors"
                      placeholder="000"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-10">
              <button 
                type="submit"
                className={`w-full py-8 text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all ${
                  auditResult ? 'bg-white text-black hover:invert' : 'bg-[#111] text-stone-500 border border-white/5 hover:border-white/20'
                }`}
              >
                {isVerifying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : auditResult ? (
                  <>Finalize Acquisition Protocol <ChevronRight size={16} /></>
                ) : (
                  <>Initiate Neural Audit <Zap size={16} /></>
                )}
              </button>
            </div>
          </form>

          {/* Summary Sidebar */}
          <aside className="space-y-12">
            <div className="p-10 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-12 sticky top-32">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-600">Obligation Summary</h4>
                <div className="space-y-6 pt-6">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-200">{item.name}</span>
                        {'products' in item && <span className="text-[8px] text-indigo-400 uppercase tracking-widest">Ensemble Logic</span>}
                      </div>
                      <span className="text-sm font-light italic text-stone-500">GH₵{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/5 w-full my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">Total Obligation</span>
                    <span className="text-5xl font-serif italic text-white">GH₵{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Impacts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Activity size={12} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Status Gain</span>
                  </div>
                  <p className="text-2xl font-serif italic">+{points} Pts</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Gem size={12} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Shards</span>
                  </div>
                  <p className="text-2xl font-serif italic">+{earnedDiamonds}</p>
                </div>
              </div>

              {/* Neural Audit Display */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100" />
                <div className={`relative p-8 border border-dashed rounded-sm transition-all duration-700 ${
                  auditResult ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className={isVerifying ? 'animate-spin text-amber-500' : 'text-stone-700'} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Audit Status: {isVerifying ? 'Scanning' : auditResult ? 'Verified' : 'Pending'}</span>
                    </div>
                    {auditResult && <ShieldCheck size={16} className="text-amber-500" />}
                  </div>
                  <p className="text-xs font-serif italic text-stone-400 leading-relaxed min-h-[40px]">
                    {isVerifying ? "Parsing aesthetic logic across your current status trajectory..." : auditResult ? `"${auditResult}"` : "Neural audit required to authorize this level of acquisition."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-20 text-[8px] uppercase tracking-[0.4em] justify-center">
                 <span>Encryption: 256-Bit</span>
                 <div className="w-1 h-1 bg-white rounded-full" />
                 <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
