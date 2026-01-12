
import React, { useState } from 'react';
import { Globe, Zap, Shield, Sparkles, Loader2, ArrowRight, Layers, Target, Eye } from 'lucide-react';
import { UserStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ManifestoPanelProps {
  userStatus: UserStatus;
}

export const ManifestoPanel: React.FC<ManifestoPanelProps> = ({ userStatus }) => {
  const [creed, setCreed] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCreed = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `User status is ${userStatus}. Write a "Style Manifesto Creed" for them. 
      Theme: Your closet is an external brain. Your clothes are identity reinforcements. 
      Tone: Brutalist, high-end fashion, cold, philosophical, powerful. Max 30 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setCreed(response.text);
    } catch (err) {
      setCreed("Your silhouette is the only truth in a world of noise. Engineering excellence is not a choice, but a requirement of status.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24 border-b border-white/5 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={16} className="text-stone-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Protocol 001 // The Foundation</p>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif mb-8 leading-tight">The <br /><span className="italic">Manifesto</span></h1>
          <p className="text-stone-400 font-light text-xl md:text-2xl max-w-2xl leading-relaxed">
            We do not sell clothing. We engineer the architectural layers of your identity.
          </p>
        </header>

        {/* Core Philosophy Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-40">
          <div className="space-y-8">
            <div className="aspect-[4/5] bg-stone-900 overflow-hidden rounded-sm grayscale">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                alt="Architecture" 
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-700"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-white" />
                <h3 className="text-2xl font-serif uppercase tracking-widest">Closet Engineering</h3>
              </div>
              <p className="text-stone-500 font-light leading-relaxed">
                Most closets are collections of accidents. Ours is a deliberate assembly of power. Each piece is selected to reinforce a specific aspect of your brand—strength, mystery, or architectural dominance.
              </p>
            </div>
          </div>

          <div className="space-y-8 md:pt-32">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target size={18} className="text-white" />
                <h3 className="text-2xl font-serif uppercase tracking-widest">Identity Reinforcement</h3>
              </div>
              <p className="text-stone-500 font-light leading-relaxed">
                Clothing is the first thing a room knows about you. We believe in high-stakes silhouettes that demand attention without begging for it. Your style is not about following trends; it's about setting the frequency.
              </p>
            </div>
            <div className="aspect-[4/5] bg-stone-900 overflow-hidden rounded-sm grayscale">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071&auto=format&fit=crop" 
                alt="Style" 
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-700"
              />
            </div>
          </div>
        </section>

        {/* Gemini Creed Generator */}
        <section className="bg-[#0D0D0D] border border-white/5 p-12 md:p-20 rounded-sm relative overflow-hidden group mb-40">
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Shield size={240} />
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-12">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-500">The Neural Protocol</h4>
              <h2 className="text-4xl md:text-5xl font-serif italic text-white">Synthesize Your Personal Identity Creed</h2>
            </div>

            {creed ? (
              <div className="p-8 border-x border-white/10 animate-in zoom-in-95 duration-700">
                <p className="text-2xl md:text-3xl font-serif leading-tight text-stone-200">
                  "{creed}"
                </p>
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setCreed(null)}
                    className="text-[9px] uppercase tracking-widest text-stone-600 hover:text-white transition-colors"
                  >
                    Reset Synthesis
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-stone-400 font-light">
                  Based on your current status as an <span className="text-white font-bold">{userStatus}</span>, our intelligence can define the core philosophy of your next evolution.
                </p>
                <button 
                  onClick={generateCreed}
                  disabled={isGenerating}
                  className="bg-white text-black px-12 py-6 text-xs font-bold uppercase tracking-[0.3em] hover:bg-stone-200 transition-all flex items-center justify-center gap-4 mx-auto"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate My Creed
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16">
          <div className="space-y-4">
            <Eye size={24} className="text-stone-700" />
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-white">Visual Clarity</h5>
            <p className="text-xs text-stone-500 leading-relaxed font-light">We strip away the noise. Only the core remains. Your look is your brand.</p>
          </div>
          <div className="space-y-4">
            <Zap size={24} className="text-stone-700" />
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-white">Status Acceleration</h5>
            <p className="text-xs text-stone-500 leading-relaxed font-light">Progression is built through consistent, high-impact acquisitions.</p>
          </div>
          <div className="space-y-4">
            <Shield size={24} className="text-stone-700" />
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-white">Protocol Gated</h5>
            <p className="text-xs text-stone-500 leading-relaxed font-light">Exclusivity isn't about cruelty; it's about preserving the integrity of the collective.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
