
import React, { useState } from 'react';
import { 
  Send, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  Cpu, 
  Database, 
  PenTool,
  Trophy,
  ArrowLeft,
  // Added Zap to the import list to fix the "Cannot find name 'Zap'" error
  Zap
} from 'lucide-react';
import { UserStatus, Product } from '../types';
import { PRODUCTS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface CustomRequestPanelProps {
  userStatus: UserStatus;
  onBack: () => void;
}

type Mode = 'bespoke' | 'supply';

export const CustomRequestPanel: React.FC<CustomRequestPanelProps> = ({ userStatus, onBack }) => {
  const [mode, setMode] = useState<Mode>('bespoke');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [bespokeData, setBespokeData] = useState({
    baseItem: PRODUCTS[0].id,
    modification: '',
    intent: ''
  });

  const [supplyData, setSupplyData] = useState({
    studio: '',
    philosophy: '',
    materials: '',
    portfolio: ''
  });

  const runAudit = async () => {
    setIsSubmitting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = '';
      
      if (mode === 'bespoke') {
        const item = PRODUCTS.find(p => p.id === bespokeData.baseItem)?.name;
        prompt = `Analyze a custom fashion request for the item "${item}". 
        Request: "${bespokeData.modification}". User Intent: "${bespokeData.intent}". 
        Evaluate if this aligns with a "High-End Brutalist Tactical" aesthetic for a ${userStatus} status user. 
        Tone: Cold, expert, architectural. Max 25 words.`;
      } else {
        prompt = `Analyze a supply proposition from "${supplyData.studio}". 
        Philosophy: "${supplyData.philosophy}". Materials: "${supplyData.materials}". 
        Evaluate if this studio belongs in an elite, status-driven fashion collective. 
        Tone: Elitist, judgmental, expert. Max 25 words.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAuditResult(response.text);
      setSubmitted(true);
    } catch (err) {
      setAuditResult("Protocol received. Internal logic gates have authorized the preliminary review of your engagement proposition.");
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setAuditResult(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 px-6 md:px-24 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
        <div className="max-w-2xl w-full p-12 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative">
              <ShieldCheck size={32} className="text-amber-500" />
              <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif italic text-white">Engagement Authorized</h2>
            <div className="p-6 bg-black border border-white/5 font-mono text-xs text-stone-400 italic leading-relaxed">
              "{auditResult}"
            </div>
            <p className="text-stone-500 text-sm uppercase tracking-[0.2em]">Reference Hash: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <button 
            onClick={onBack}
            className="w-full py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:invert transition-all"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
            <Settings size={16} className="text-stone-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Protocol: Specialized Engagement</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-6xl md:text-8xl font-serif">Request <span className="italic">Specialization</span></h1>
            <div className="flex border border-white/10 rounded-sm overflow-hidden p-1 bg-white/[0.02]">
              <button 
                onClick={() => setMode('bespoke')}
                className={`px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${mode === 'bespoke' ? 'bg-white text-black' : 'text-stone-500 hover:text-white'}`}
              >
                <PenTool size={12} /> Bespoke
              </button>
              <button 
                onClick={() => setMode('supply')}
                className={`px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${mode === 'supply' ? 'bg-white text-black' : 'text-stone-500 hover:text-white'}`}
              >
                <Database size={12} /> Supply
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Form Section */}
          <div className="space-y-12">
            {mode === 'bespoke' ? (
              <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Core Asset Reference</label>
                  <select 
                    value={bespokeData.baseItem}
                    onChange={(e) => setBespokeData({...bespokeData, baseItem: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id} className="bg-black text-white">{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Architectural Modification</label>
                  <textarea 
                    rows={4}
                    placeholder="Specify color shifts, structural alterations, or material swaps..."
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors resize-none placeholder:text-stone-800"
                    value={bespokeData.modification}
                    onChange={(e) => setBespokeData({...bespokeData, modification: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Status Justification</label>
                  <input 
                    type="text"
                    placeholder="Why does this modification serve your identity trajectory?"
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                    value={bespokeData.intent}
                    onChange={(e) => setBespokeData({...bespokeData, intent: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Studio Identity</label>
                  <input 
                    type="text"
                    placeholder="Legal or Creative Studio Name"
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                    value={supplyData.studio}
                    onChange={(e) => setSupplyData({...supplyData, studio: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Design Philosophy</label>
                  <textarea 
                    rows={3}
                    placeholder="Define your architectural intent in three sentences..."
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors resize-none placeholder:text-stone-800"
                    value={supplyData.philosophy}
                    onChange={(e) => setSupplyData({...supplyData, philosophy: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Material Integrity</label>
                  <input 
                    type="text"
                    placeholder="Primary technical materials used in construction"
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                    value={supplyData.materials}
                    onChange={(e) => setSupplyData({...supplyData, materials: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-stone-600 block">Neural Portfolio Link</label>
                  <input 
                    type="text"
                    placeholder="URL to your manifesto or portfolio"
                    className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                    value={supplyData.portfolio}
                    onChange={(e) => setSupplyData({...supplyData, portfolio: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="pt-10">
              <button 
                onClick={runAudit}
                disabled={isSubmitting}
                className="w-full py-8 bg-white text-black text-xs font-bold uppercase tracking-[0.5em] hover:invert transition-all flex items-center justify-center gap-4 group"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {isSubmitting ? 'Running Neural Audit...' : 'Submit Engagement Protocol'}
                {!isSubmitting && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>

          {/* Contextual Sidebar */}
          <aside className="space-y-12">
            <div className="p-10 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-12 sticky top-32">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-stone-500">
                  <Cpu size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Engagement Standards</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.02] border border-white/5 flex items-start gap-4">
                    <Trophy size={16} className="text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Status Gated</p>
                      <p className="text-[10px] text-stone-600 leading-relaxed uppercase">Only Trendsetters and Icons receive priority bespoke analysis.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 flex items-start gap-4">
                    <ShieldCheck size={16} className="text-stone-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Curation Policy</p>
                      <p className="text-[10px] text-stone-600 leading-relaxed uppercase">All supply propositions are audited for material ethics and aesthetic alignment.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-stone-600 text-center">Neural Shard Cost: 25</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <p className="text-[10px] font-serif italic text-stone-500 leading-relaxed text-center">
                  "Specialization is not a request; it is a collaborative evolution of the collective silhouette."
                </p>
              </div>

              <div className="opacity-10 pointer-events-none select-none">
                <div className="text-[8px] font-mono mb-2">AUTH_ID: {Math.random().toString(36).substr(2, 5).toUpperCase()}</div>
                <div className="text-[8px] font-mono">ENCRYPTION: AES_256_GCM</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
