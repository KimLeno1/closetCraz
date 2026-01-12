
import React, { useState, useMemo } from 'react';
import { Sparkles, Loader2, BarChart3, Search, Target, Compass, ArrowRight, Zap } from 'lucide-react';
import { getFitAdvice } from '../services/geminiService';
import { TREND_REPORTS, ARCHIVE_PRODUCTS } from '../extraMockData';
import { PRODUCTS } from '../constants';
import { TrendReportCard } from './TrendReportCard';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FitFinderProps {
  onProductClick: (id: string) => void;
  onVaultToggle: (e: React.MouseEvent, id: string) => void;
  vault: string[];
}

export const FitFinder: React.FC<FitFinderProps> = ({ onProductClick, onVaultToggle, vault }) => {
  const [mood, setMood] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ mantra: string; category: string } | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const allProducts = useMemo(() => [...PRODUCTS, ...ARCHIVE_PRODUCTS], []);

  const handleDiscovery = async () => {
    if (!mood || !query) return;
    setLoading(true);
    
    // 1. Get AI Stylistic Advice
    const advice = await getFitAdvice(mood, query);
    setResult(advice);

    // 2. Perform Database Search
    // We search across name, description, style tags, and category
    const searchTerm = query.toLowerCase();
    const moodTerm = mood.toLowerCase();
    
    const matches = allProducts.filter(p => {
      const textMatch = 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.styleTag.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm);
      
      const moodMatch = p.mood.toLowerCase() === advice.category.toLowerCase();
      
      // We prioritize exact text matches, but also look for items that match the AI's mood recommendation
      return textMatch || (moodMatch && searchTerm.length < 3);
    });

    setSearchResults(matches);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-3">
            <Search size={16} className="text-stone-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Operation: Semantic Discovery</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif">Aesthetic <span className="italic">Trajectory</span></h2>
          <p className="text-stone-400 font-light max-w-xl text-lg italic leading-relaxed">
            Neural mapping for your next acquisition. Search the entire Archive and Local Stock via stylistic intent.
          </p>
        </header>
        
        {!result ? (
          <div className="space-y-20">
            <div className="space-y-8">
              <p className="text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">Step 01 // Define Intent</p>
              <div className="flex flex-wrap gap-4">
                {['Untouchable', 'Effortless', 'Architectural', 'Aggressive', 'Subtle', 'Luxe'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-10 py-5 text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                      mood === m ? 'bg-white text-black border-white' : 'border-white/5 text-stone-500 hover:border-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">Step 02 // Operational Query</p>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. 'Oversized heavy coat' or 'Tactical accessories'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-8 text-3xl font-serif italic focus:outline-none focus:border-white transition-colors placeholder:text-stone-800"
                />
                <div className="absolute right-0 bottom-4 text-stone-700 animate-pulse">
                   <Target size={24} />
                </div>
              </div>
            </div>

            <div className="pt-10">
              <button 
                onClick={handleDiscovery}
                disabled={loading || !mood || !query}
                className="group flex items-center gap-6 bg-white text-black px-16 py-8 text-xs font-bold uppercase tracking-[0.4em] hover:bg-stone-200 transition-all disabled:opacity-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                Initialize Search Protocol
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* AI Stylistic Directive */}
            <div className="p-16 border border-white/5 bg-[#0D0D0D] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Compass size={160} />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500 flex items-center gap-3">
                    <Zap size={14} /> Neural Style Mandate
                  </h4>
                  <h3 className="text-4xl md:text-6xl font-serif italic leading-tight text-white max-w-3xl">
                    "{result.mantra}"
                  </h3>
                </div>
                <div className="h-px bg-white/5 w-full" />
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] text-stone-600 uppercase tracking-widest">Recommended Frequency</p>
                    <p className="text-2xl font-serif text-stone-300">{result.category} Layering</p>
                  </div>
                  <button 
                    onClick={() => { setResult(null); setSearchResults([]); setQuery(''); }}
                    className="text-stone-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all border-b border-white/10 pb-2"
                  >
                    Reset Trajectory
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <section className="space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <Target size={18} className="text-stone-500" />
                  <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-500">Search Results // Matches Detected: {searchResults.length}</h4>
                </div>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => onProductClick(product.id)}
                      onVaultToggle={onVaultToggle}
                      isInVault={vault.includes(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-40 text-center border border-dashed border-white/5 bg-white/[0.01]">
                   <p className="text-stone-600 uppercase tracking-widest text-xs">No Direct Matches in Archive</p>
                   <p className="text-stone-500 text-xs mt-4 italic">Try adjusting your operational query for broader architectural compatibility.</p>
                </div>
              )}
            </section>

            {/* Market Relevance Section */}
            <section className="space-y-8 pt-12">
              <div className="flex items-center gap-3">
                <BarChart3 size={16} className="text-stone-600" />
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-600">Contextual Trend Synergy</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TREND_REPORTS.slice(0, 3).map((report) => (
                  <TrendReportCard key={report.id} report={report} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
