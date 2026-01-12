
import React, { useState, useEffect } from 'react';
import { 
  Factory, 
  PenTool, 
  FlaskConical, 
  LineChart, 
  Zap, 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  Activity,
  Cpu,
  RefreshCcw,
  Target,
  Maximize2,
  Info
} from 'lucide-react';
import { evaluateSupplyProtocol, analyzeMaterialSynergy, getSupplierMarketIntel } from '../services/geminiService';

type SupplyTab = 'blueprint' | 'lab' | 'intel';

export const SupplyPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SupplyTab>('blueprint');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditResult, setAuditResult] = useState<{score: number, justification: string} | null>(null);
  const [marketIntel, setMarketIntel] = useState<string | null>(null);
  
  const [matA, setMatA] = useState('Technical Wool');
  const [matB, setMatB] = useState('Bio-Polymer Mesh');
  const [synergyResult, setSynergyResult] = useState<{index: number, breakdown: string} | null>(null);
  const [isAnalyzingSynergy, setIsAnalyzingSynergy] = useState(false);

  const [formData, setFormData] = useState({
    studioName: '',
    philosophy: '',
    materials: '',
    assetName: '',
    params: { rigidity: 75, opacity: 90, breathability: 40 }
  });

  useEffect(() => {
    if (activeTab === 'intel' && !marketIntel) {
      fetchMarketIntel();
    }
  }, [activeTab]);

  const fetchMarketIntel = async () => {
    setMarketIntel(null);
    const report = await getSupplierMarketIntel();
    setMarketIntel(report);
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuditResult(null);
    const result = await evaluateSupplyProtocol(formData.studioName, formData.philosophy, formData.materials, formData.params);
    setAuditResult(result);
    setIsSubmitting(false);
  };

  const handleSynergyTest = async () => {
    setIsAnalyzingSynergy(true);
    const result = await analyzeMaterialSynergy(matA, matB);
    setSynergyResult(result);
    setIsAnalyzingSynergy(false);
  };

  const materialOptions = [
    'Technical Wool', 'Bio-Polymer Mesh', 'Titanium Weave', 'Liquid Silk', 
    'Recycled Carbon', 'Photo-Reactive Hide', 'Aerogel Insulation'
  ];

  const NavButton = ({ id, icon: Icon, label }: { id: SupplyTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-3 py-6 transition-all border-b-2 ${
        activeTab === id ? 'border-amber-500 text-white bg-white/5' : 'border-transparent text-stone-600 hover:text-stone-400'
      }`}
    >
      <Icon size={18} />
      <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pt-20 pb-40 px-6 md:px-24 bg-[#080808] text-stone-300">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-600">
              <Factory size={16} />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Supplier Node // Prime Studio</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-white">Supply <span className="italic font-light">Studio</span></h1>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="px-6 py-3 border border-white/5 bg-black/40 rounded-sm">
              <p className="text-[8px] uppercase tracking-widest text-stone-600 mb-1">Status</p>
              <p className="text-sm font-bold text-green-500">OPERATIONAL</p>
            </div>
            <div className="px-6 py-3 border border-white/5 bg-black/40 rounded-sm">
              <p className="text-[8px] uppercase tracking-widest text-stone-600 mb-1">Network Capacity</p>
              <p className="text-sm font-bold text-white">98.4%</p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex bg-black border border-white/5 rounded-sm overflow-hidden">
          <NavButton id="blueprint" icon={PenTool} label="Blueprint" />
          <NavButton id="lab" icon={FlaskConical} label="Material Lab" />
          <NavButton id="intel" icon={LineChart} label="Network Intel" />
        </nav>

        {/* Workspace Area */}
        <div className="bg-[#0c0c0e] border border-white/5 rounded-sm p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Cpu size={300} strokeWidth={1} />
          </div>

          <div className="relative z-10">
            {/* BLUEPRINT WORKSPACE */}
            {activeTab === 'blueprint' && (
              <form onSubmit={handleAudit} className="space-y-16 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-white italic">Design Entry</h3>
                    <p className="text-[10px] text-stone-600 uppercase tracking-widest">Dossier Access // Silhouette Mapping</p>
                  </div>
                  <Maximize2 size={16} className="text-stone-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Studio Handle</label>
                      <input 
                        required type="text" 
                        placeholder="e.g. THORN_COLLECTIVE"
                        className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:border-white outline-none transition-all placeholder:text-stone-800"
                        value={formData.studioName}
                        onChange={(e) => setFormData({...formData, studioName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Asset Designation</label>
                      <input 
                        required type="text"
                        placeholder="e.g. MONOLITH_II"
                        className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-xl focus:border-white outline-none transition-all placeholder:text-stone-800"
                        value={formData.assetName}
                        onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">Philosophical Narrative</label>
                      <textarea 
                        required rows={3}
                        placeholder="Define the structural intent of this silhouette..."
                        className="w-full bg-transparent border-b border-white/10 py-4 font-serif text-lg italic focus:border-white outline-none transition-all resize-none placeholder:text-stone-800"
                        value={formData.philosophy}
                        onChange={(e) => setFormData({...formData, philosophy: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-10 p-10 bg-black/40 border border-white/5 rounded-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mb-4 flex items-center gap-2">
                      <Target size={14} /> Structural DNA
                    </h4>
                    {Object.entries(formData.params).map(([key, val]) => (
                      <div key={key} className="space-y-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                          <span className="text-stone-500">{key} Index</span>
                          <span className="text-white">{val}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" 
                          className="w-full accent-white h-1 bg-white/5 rounded-full"
                          value={val}
                          onChange={(e) => setFormData({...formData, params: {...formData.params, [key]: parseInt(e.target.value)}})}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4 text-stone-500 max-w-sm">
                    <Info size={16} className="shrink-0" />
                    <p className="text-[9px] uppercase tracking-widest leading-relaxed">Submissions are subjected to an immediate neural audit for status-gate compatibility.</p>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-white text-black px-12 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:invert transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                    Commit to Registry
                  </button>
                </div>

                {auditResult && (
                  <div className="p-10 bg-amber-500/[0.03] border border-amber-500/20 animate-in zoom-in-95 duration-700">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-amber-500" />
                        <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-500">Audit Protocol Feedback</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-stone-600 uppercase tracking-widest mb-1">Integrity Score</p>
                        <p className="text-3xl font-serif text-white">{auditResult.score}%</p>
                      </div>
                    </div>
                    <p className="text-lg italic font-light leading-relaxed text-stone-200 font-serif border-l border-amber-500/40 pl-8">
                      "{auditResult.justification}"
                    </p>
                  </div>
                )}
              </form>
            )}

            {/* MATERIAL LAB WORKSPACE */}
            {activeTab === 'lab' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-white italic">Synergy Simulator</h3>
                  <p className="text-[10px] text-stone-600 uppercase tracking-widest">Experimental Node // Collision Analysis</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'Primary Matrix', value: matA, setter: setMatA },
                        { label: 'Secondary Overlay', value: matB, setter: setMatB }
                      ].map((field, i) => (
                        <div key={i} className="space-y-4">
                          <label className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">{field.label}</label>
                          <select 
                            className="w-full bg-black/40 border border-white/10 p-5 text-white focus:border-white outline-none appearance-none cursor-pointer text-xs tracking-widest uppercase font-bold"
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                          >
                            {materialOptions.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleSynergyTest}
                      disabled={isAnalyzingSynergy}
                      className="w-full py-8 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4"
                    >
                      {isAnalyzingSynergy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                      Run Synergy Extraction
                    </button>
                  </div>

                  <div className="h-full min-h-[400px] border border-white/5 bg-black/40 flex flex-col justify-center items-center p-12 text-center relative rounded-sm">
                    {synergyResult ? (
                      <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-40 h-40 rounded-full border border-amber-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(245,158,11,0.05)]">
                          <div className="text-5xl font-serif text-amber-500">{synergyResult.index}%</div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white">Neural Match Index</h4>
                          <p className="text-lg italic text-stone-400 font-serif leading-relaxed max-w-sm mx-auto">
                            "{synergyResult.breakdown}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 opacity-10">
                        <FlaskConical size={80} strokeWidth={1} />
                        <p className="text-xs uppercase tracking-[0.5em]">Awaiting Input Collision</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK INTEL WORKSPACE */}
            {activeTab === 'intel' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-white italic">Intelligence Feed</h3>
                    <p className="text-[10px] text-stone-600 uppercase tracking-widest">Global Node // Real-time Demand Signals</p>
                  </div>
                  <button onClick={fetchMarketIntel} className="p-3 bg-white/5 text-stone-400 hover:text-white transition-colors">
                    <RefreshCcw size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="p-10 bg-black/40 border border-white/5 space-y-10 lg:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-amber-500">
                      <Zap size={20} />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.4em]">Strategic Forecast</h4>
                    </div>
                    {marketIntel ? (
                      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <p className="text-3xl font-serif italic text-stone-200 leading-relaxed max-w-xl">
                          "{marketIntel}"
                        </p>
                        <div className="flex gap-8 opacity-40 text-[9px] uppercase tracking-widest font-bold">
                           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Confidence 92%</span>
                           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full" /> Window: 14 Days</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 flex justify-center">
                        <Loader2 size={32} className="animate-spin text-stone-800" />
                      </div>
                    )}
                  </div>

                  <div className="p-10 bg-white/[0.02] border border-white/5 flex flex-col justify-between group">
                    <div className="space-y-8">
                      <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest border-b border-white/5 pb-4">Demand Hotspots</p>
                      <div className="space-y-6">
                        {[
                          { tag: 'Monolithic Coats', status: 'CRITICAL', color: 'text-red-500' },
                          { tag: 'Cyber-Knitwear', status: 'STABLE', color: 'text-stone-500' },
                          { tag: 'Transparent Boots', status: 'SURGING', color: 'text-amber-500' },
                        ].map(item => (
                          <div key={item.tag} className="flex justify-between items-center group/item cursor-default">
                             <span className="text-[11px] font-bold text-stone-400 group-hover/item:text-white transition-colors">{item.tag}</span>
                             <span className={`text-[8px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-10 flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-all">
                       <Activity size={14} className="text-amber-500" />
                       <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Network Pulse Locked</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 border-t border-white/5 opacity-30">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Protocol Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Synced with Archive</span>
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-[0.4em] uppercase">Auth Token: 0x99A_SUPPLY_NODE</span>
        </footer>
      </div>
    </div>
  );
};
