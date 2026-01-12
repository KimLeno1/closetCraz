
import React, { useState, useMemo } from 'react';
import { Product, CategoryType, StyleType, EmotionType } from '../types';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';
import { MAIN_CATEGORIES, STYLE_LENSES, EMOTION_LENSES } from '../categoriesData';
import { ProductCard } from './ProductCard';
import { Layers, Sparkles, Filter, ChevronRight, Zap, Loader2, Info, Compass } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CategoryPanelProps {
  onProductClick: (id: string) => void;
  onVaultToggle: (e: React.MouseEvent, id: string) => void;
  vault: string[];
}

type FilterLens = 'Style' | 'Emotion';

export const CategoryPanel: React.FC<CategoryPanelProps> = ({ onProductClick, onVaultToggle, vault }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Apparel');
  const [activeLens, setActiveLens] = useState<FilterLens>('Style');
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [curation, setCuration] = useState<string | null>(null);
  const [isLoadingCuration, setIsLoadingCuration] = useState(false);

  const allProducts = useMemo(() => [...PRODUCTS, ...ARCHIVE_PRODUCTS] as Product[], []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat = p.category === activeCategory;
      if (!matchCat) return false;
      if (!activeSub) return true;
      if (activeLens === 'Style') return p.styleTag === activeSub;
      return p.emotionTag === activeSub;
    });
  }, [activeCategory, activeLens, activeSub, allProducts]);

  const fetchCuration = async () => {
    setIsLoadingCuration(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide a high-fashion curation note for ${activeCategory} filtered by ${activeLens}: ${activeSub || 'All'}. 
      Explain the psychological and aesthetic power of this combination in the context of status. 
      Tone: Brutalist, elite, technical. Max 35 words.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setCuration(response.text);
    } catch (err) {
      setCuration("This silhouette intersection dictates the environment through precise geometric intent and unyielding aesthetic authority.");
    } finally {
      setIsLoadingCuration(false);
    }
  };

  const handleLensChange = (lens: FilterLens) => {
    setActiveLens(lens);
    setActiveSub(null);
    setCuration(null);
  };

  const handleSubChange = (sub: string) => {
    setActiveSub(sub === activeSub ? null : sub);
    setCuration(null);
  };

  const activeCategoryData = MAIN_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-6">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-stone-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Inventory // Architecture</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif">Catalog <span className="italic">Lenses</span></h1>
          {activeCategoryData && (
            <p className="text-stone-500 max-w-xl text-lg font-light italic leading-relaxed">
              {activeCategoryData.description}
            </p>
          )}
        </header>

        {/* Level 1: Main Category */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-white/5 pb-8">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveSub(null); setCuration(null); }}
              className={`px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all border ${
                activeCategory === cat.id ? 'bg-white text-black border-white' : 'border-white/10 text-stone-500 hover:border-white/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-12 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-stone-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Filter Lens</p>
              </div>
              <div className="flex border border-white/10 rounded-sm overflow-hidden">
                <button 
                  onClick={() => handleLensChange('Style')}
                  className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-all ${activeLens === 'Style' ? 'bg-white/10 text-white' : 'text-stone-600'}`}
                >
                  Style
                </button>
                <button 
                  onClick={() => handleLensChange('Emotion')}
                  className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-all ${activeLens === 'Emotion' ? 'bg-white/10 text-white' : 'text-stone-600'}`}
                >
                  Emotion
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
                {activeLens === 'Style' ? 'Aesthetic Directions' : 'Psychological States'}
              </p>
              <div className="flex flex-col gap-2">
                {(activeLens === 'Style' ? STYLE_LENSES : EMOTION_LENSES).map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => handleSubChange(lens.id)}
                    className={`flex justify-between items-center px-4 py-4 border rounded-sm transition-all group ${
                      activeSub === lens.id ? 'border-white bg-white/5 text-white' : 'border-white/5 text-stone-500 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">{lens.label}</span>
                    <ChevronRight size={14} className={`transition-transform ${activeSub === lens.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Curator Component */}
            <div className={`p-8 border border-white/5 rounded-sm transition-all duration-700 ${curation ? 'bg-[#0D0D0D] border-amber-500/10' : 'bg-transparent'}`}>
              {!curation ? (
                <button 
                  onClick={fetchCuration}
                  disabled={isLoadingCuration}
                  className="w-full py-4 text-[9px] font-bold uppercase tracking-widest text-stone-500 flex items-center justify-center gap-3 border border-dashed border-white/10 hover:border-white/30 transition-all"
                >
                  {isLoadingCuration ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                  Consult Linguistic Curator
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-700">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-stone-600">Curator's Note</span>
                  </div>
                  <p className="text-sm font-serif italic text-stone-300 leading-relaxed">
                    "{curation}"
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 space-y-12">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Displaying Results</p>
                <h4 className="text-2xl font-serif italic">
                  {activeSub ? `${activeSub} ${activeCategory}` : `All ${activeCategory}`}
                </h4>
              </div>
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-bold text-stone-600">{filteredProducts.length} Pieces Detected</span>
                 <div className="h-4 w-px bg-white/10" />
                 <Compass size={14} className="text-stone-700" />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onClick={() => onProductClick(p.id)} 
                    onVaultToggle={onVaultToggle}
                    isInVault={vault.includes(p.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm bg-white/[0.01]">
                <div className="p-6 rounded-full bg-white/[0.02] mb-6">
                  <Info size={32} className="text-stone-800" />
                </div>
                <p className="text-xs uppercase tracking-widest text-stone-600">No Silhouettes Matched</p>
                <p className="text-stone-500 text-xs mt-2 italic max-w-xs text-center">
                  The requested intersection of category, lens, and status is currently out of rotation.
                </p>
                <button 
                  onClick={() => { setActiveSub(null); setCuration(null); }}
                  className="mt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-white transition-colors"
                >
                  Clear Lens
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
