
import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Sparkles, 
  Loader2, 
  Terminal, 
  Settings2, 
  RefreshCcw,
  Target,
  FileText,
  Workflow,
  FlaskConical,
  Binary
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface NeuralWorkspaceProps {
  addLog: (msg: string) => void;
}

export const NeuralWorkspace: React.FC<NeuralWorkspaceProps> = ({ addLog }) => {
  const [activeModel, setActiveModel] = useState('gemini-3-flash-preview');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState('Generate a brutalist fashion manifesto for a user with "Icon" status.');
  const [temp, setTemp] = useState(0.8);

  const runNeuralTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    addLog(`Neural Test: Initiating ${activeModel} handshake.`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: testPrompt,
        config: { temperature: temp }
      });
      setTestResult(response.text);
      addLog("Neural Test: Synthesis complete. Checksum valid.");
    } catch (err) {
      addLog("ERROR: Neural cluster collision detected.");
      setTestResult("Protocol Error: Connection to neural cluster interrupted.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-amber-500/40">
           <Binary size={16} />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Protocol // Gemini_Cluster_09</p>
        </div>
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Neural <span className="not-italic text-amber-500">Core</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Model Controller */}
        <section className="p-10 border border-amber-500/10 bg-[#050505] space-y-10 rounded-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FlaskConical size={20} className="text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">Prompt Laboratory</h2>
            </div>
            <select 
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-black border border-amber-500/20 text-[9px] uppercase tracking-widest p-3 focus:outline-none focus:border-amber-500 text-amber-500"
            >
              <option value="gemini-3-flash-preview">3-Flash (Default)</option>
              <option value="gemini-3-pro-preview">3-Pro (Architect)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] uppercase tracking-widest text-stone-600 block italic">// System Input Signal</label>
            <textarea 
              rows={6}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full bg-amber-500/5 border border-amber-500/10 p-6 text-xs text-amber-500 font-mono focus:outline-none focus:border-amber-500 resize-none transition-all placeholder:text-stone-900"
              placeholder="ENTER PROMPT SEQUENCE..."
            />
          </div>

          <div className="space-y-4">
             <div className="flex justify-between text-[9px] uppercase text-stone-600">
               <span>Entropy Variance (Temperature)</span>
               <span>{temp}</span>
             </div>
             <input 
               type="range" min="0" max="1" step="0.1" 
               className="w-full accent-amber-500"
               value={temp}
               onChange={(e) => setTemp(parseFloat(e.target.value))}
             />
          </div>

          <button 
            onClick={runNeuralTest}
            disabled={isTesting}
            className="w-full py-6 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all flex items-center justify-center gap-4 group"
          >
            {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Initialize Neural Synthesis
          </button>
        </section>

        {/* Synthesis Result Buffer */}
        <section className="p-10 border border-amber-500/10 bg-[#080808] flex flex-col justify-center relative overflow-hidden rounded-sm min-h-[400px]">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles size={160} className="text-amber-500" />
           </div>
           
           {testResult ? (
             <div className="space-y-8 animate-in zoom-in-95 duration-500 relative z-10">
                <div className="flex items-center gap-2 mb-2 text-amber-500/60 font-bold uppercase text-[9px] tracking-widest">
                  <Terminal size={14} /> Synthesized Feed // 0x221
                </div>
                <div className="p-10 bg-black border border-amber-500/10 font-mono text-xs leading-relaxed text-amber-200 italic shadow-2xl">
                  "{testResult}"
                </div>
                <div className="flex gap-4">
                  <button onClick={() => addLog("Neural: Snapshot committed to archive.")} className="px-6 py-3 border border-amber-500/20 text-amber-500 text-[8px] font-bold uppercase hover:bg-amber-500/10 transition-all">Commit to Archive</button>
                  <button onClick={() => setTestResult(null)} className="px-6 py-3 text-[8px] font-bold uppercase text-stone-700 hover:text-white transition-all">Purge Buffer</button>
                </div>
             </div>
           ) : (
             <div className="text-center space-y-6 opacity-10 relative z-10 group cursor-default">
                <RefreshCcw size={48} className="mx-auto group-hover:rotate-180 transition-transform duration-700" />
                <p className="text-[10px] uppercase tracking-[0.5em]">Awaiting Cluster Handshake...</p>
             </div>
           )}
        </section>
      </div>

      {/* Logic Gates Configuration */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Settings2, label: 'Hyperparameters', desc: 'Adjust Top-P, Top-K, and frequency penalties per node.' },
          { icon: Target, label: 'Linguistic Lenses', desc: 'Fine-tune the brutality-to-elegance resonance coefficient.' },
          { icon: Workflow, label: 'Chain of Logic', desc: 'Manage multi-step reasoning protocols for elite users.' },
        ].map((item, i) => (
          <div key={i} className="p-8 border border-amber-500/10 bg-black group hover:border-amber-500/30 transition-all cursor-pointer rounded-sm">
            <div className="p-4 border border-amber-500/10 bg-amber-500/5 rounded-sm w-fit mb-6">
              <item.icon size={20} className="text-amber-500" />
            </div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-white">{item.label}</h4>
            <p className="text-[9px] text-stone-600 leading-relaxed uppercase tracking-widest">
              {item.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};
