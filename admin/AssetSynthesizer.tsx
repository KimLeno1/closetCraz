
import React, { useState } from 'react';
import { Cpu, RefreshCcw, Loader2, ShieldAlert } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AssetSynthesizerProps {
  onDeploy: (asset: any) => void;
}

export const AssetSynthesizer: React.FC<AssetSynthesizerProps> = ({ onDeploy }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendSeed, setTrendSeed] = useState('Obsidian Minimalism');
  const [newAsset, setNewAsset] = useState<any>(null);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="p-10 border border-amber-500/20 bg-amber-500/5 space-y-8">
        <div className="flex items-center gap-4">
          <Cpu size={24} className="text-amber-500" />
          <h2 className="text-xl font-bold uppercase">Asset Synthesis Engine</h2>
        </div>
        
        <div className="space-y-4">
          <label className="text-[10px] uppercase text-amber-500/60 block font-mono">Trend Seed Input</label>
          <input 
            type="text" 
            value={trendSeed}
            onChange={(e) => setTrendSeed(e.target.value)}
            className="w-full bg-black border border-amber-500/20 p-4 text-amber-500 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <button 
          onClick={generateSyntheticAsset}
          disabled={isGenerating}
          className="w-full py-6 border border-amber-500 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-3 font-mono"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
          Execute Asset Synthesis
        </button>
      </section>

      <section className="p-10 border border-amber-500/20 bg-black min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        {newAsset ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 font-mono">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase text-amber-500">{newAsset.name}</h3>
              <p className="text-[10px] text-amber-500/60">{newAsset.style} // {newAsset.price} GH₵</p>
            </div>
            <p className="text-xs leading-relaxed italic border-l-2 border-amber-500 pl-6 text-amber-400">
              "{newAsset.description}"
            </p>
            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => onDeploy(newAsset)}
                className="px-6 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase hover:bg-amber-400 transition-all"
              >
                Deploy to Registry
              </button>
              <button 
                onClick={() => setNewAsset(null)}
                className="px-6 py-2 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase hover:border-amber-500 transition-all"
              >
                Discard Data
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 opacity-30">
            <ShieldAlert size={40} className="mx-auto text-amber-500" />
            <p className="text-[10px] uppercase tracking-widest font-mono text-amber-500">Waiting for Synthesis Signature...</p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex flex-col justify-around">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="h-px w-full bg-amber-500" />
           ))}
        </div>
      </section>
    </div>
  );
};
