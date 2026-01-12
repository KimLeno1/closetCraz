
import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  Database, 
  RefreshCcw, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  Plus, 
  Loader2,
  Trash2,
  Edit3
} from 'lucide-react';
import { PRODUCTS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

export const AdminPanel: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendSeed, setTrendSeed] = useState('Obsidian Minimalism');
  const [newAsset, setNewAsset] = useState<any>(null);
  const [surgeActive, setSurgeActive] = useState(false);

  const generateSyntheticAsset = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a new "Synthetic Fashion Asset" for the Closet Craze platform based on the trend seed: "${trendSeed}". 
      Include a technical name, a brutalist description, a price (GH₵), and a style archetype.
      Tone: Elitist, cold, architectural.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              style: { type: Type.STRING },
              statement: { type: Type.STRING }
            },
            required: ["name", "description", "price", "style", "statement"]
          }
        }
      });
      setNewAsset(JSON.parse(response.text));
    } catch (error) {
      console.error("Asset generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 bg-[#050505] text-amber-500 font-mono">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Terminal Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-amber-500/20 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Terminal size={20} className="animate-pulse" />
              <h1 className="text-3xl font-bold uppercase tracking-widest">Management Node // Root</h1>
            </div>
            <p className="text-amber-500/60 text-xs max-w-lg">
              SYSTEM STATUS: OPTIMIZED. ACCESSING GLOBAL SILHOUETTE REGISTRY. 
              ESTABLISHING NEURAL LINK TO ARCHIVE CLUSTER.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 border border-amber-500/30 text-[10px] bg-amber-500/5">
              UPTIME: 98.4%
            </div>
            <div className="px-4 py-2 border border-amber-500/30 text-[10px] bg-amber-500/5">
              LATENCY: 12ms
            </div>
          </div>
        </header>

        {/* Inventory Control Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
              <Database size={16} /> Asset Inventory Protocol
            </h2>
            <button 
              onClick={() => setSurgeActive(!surgeActive)}
              className={`px-6 py-2 text-[10px] font-bold uppercase border transition-all ${surgeActive ? 'bg-red-500 text-black border-red-500' : 'border-amber-500/30 text-amber-500/60 hover:border-amber-500'}`}
            >
              {surgeActive ? 'Surge Protocol: ACTIVE' : 'Toggle Global Surge'}
            </button>
          </div>

          <div className="overflow-x-auto border border-amber-500/10">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-amber-500/10 border-b border-amber-500/20">
                  <th className="p-4 uppercase tracking-tighter">ID</th>
                  <th className="p-4 uppercase tracking-tighter">Asset Name</th>
                  <th className="p-4 uppercase tracking-tighter">Valuation (GH₵)</th>
                  <th className="p-4 uppercase tracking-tighter">Leverage</th>
                  <th className="p-4 uppercase tracking-tighter">Velocity</th>
                  <th className="p-4 uppercase tracking-tighter">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
                {PRODUCTS.map(p => (
                  <tr key={p.id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-4 text-amber-500/40">#{p.id}</td>
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4">{p.price}</td>
                    <td className="p-4 text-green-500">
                      {p.originalPrice ? `-${Math.round((1 - p.price / p.originalPrice) * 100)}%` : '0%'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-amber-500/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${(p.scarcityCount / 20) * 100}%` }} />
                        </div>
                        <span className="text-[9px]">{p.scarcityCount} Units</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button className="hover:text-white"><Edit3 size={14} /></button>
                        <button className="hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Synthetic Generation Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="p-10 border border-amber-500/20 bg-amber-500/5 space-y-8">
            <div className="flex items-center gap-4">
              <Cpu size={24} className="text-amber-500" />
              <h2 className="text-xl font-bold uppercase">Asset Synthesis Engine</h2>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] uppercase text-amber-500/60 block">Trend Seed Input</label>
              <input 
                type="text" 
                value={trendSeed}
                onChange={(e) => setTrendSeed(e.target.value)}
                className="w-full bg-black border border-amber-500/20 p-4 text-amber-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button 
              onClick={generateSyntheticAsset}
              disabled={isGenerating}
              className="w-full py-6 border border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-3"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
              Execute Asset Synthesis
            </button>
          </section>

          <section className="p-10 border border-amber-500/20 bg-black min-h-[300px] flex flex-col justify-center relative overflow-hidden">
            {newAsset ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold uppercase">{newAsset.name}</h3>
                  <p className="text-[10px] text-amber-500/60">{newAsset.style} // {newAsset.price} GH₵</p>
                </div>
                <p className="text-xs leading-relaxed italic border-l-2 border-amber-500 pl-6">
                  "{newAsset.description}"
                </p>
                <div className="pt-4 flex gap-4">
                  <button className="px-6 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase">Deploy to Registry</button>
                  <button className="px-6 py-2 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase">Discard Data</button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-30">
                <ShieldAlert size={40} className="mx-auto" />
                <p className="text-[10px] uppercase tracking-widest">Waiting for Synthesis Signature...</p>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-around">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className="h-px w-full bg-amber-500" />
               ))}
            </div>
          </section>
        </div>

        {/* Global Analytics Monitor */}
        <section className="p-10 border border-amber-500/10 bg-[#080808] grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <p className="text-[9px] uppercase text-amber-500/40">Network Traffic</p>
            <div className="flex items-center gap-3">
              <Activity size={20} />
              <p className="text-2xl font-bold tracking-tighter">14,204 Hz</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] uppercase text-amber-500/40">Status Recalibrations</p>
            <div className="flex items-center gap-3">
              <RefreshCcw size={20} />
              <p className="text-2xl font-bold tracking-tighter">412 Units</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] uppercase text-amber-500/40">Identity Conversions</p>
            <div className="flex items-center gap-3">
              <TrendingUp size={20} />
              <p className="text-2xl font-bold tracking-tighter">88.4%</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] uppercase text-amber-500/40">Registry Depth</p>
            <div className="flex items-center gap-3">
              <BarChart3 size={20} />
              <p className="text-2xl font-bold tracking-tighter">2,105 assets</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
