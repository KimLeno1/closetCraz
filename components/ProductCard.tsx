
import React from 'react';
import { Product } from '../types';
import { Users, AlertCircle, Bookmark, Zap, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onVaultToggle?: (e: React.MouseEvent, id: string) => void;
  isInVault?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onVaultToggle, isInVault = false }) => {
  // Logic to detect if we should fake scarcity
  const isStale = (product.lastMonthSales || 0) < 5 && (product.scarcityCount || 0) > 10;
  const fakeRequests = isStale ? 1240 + Math.floor(Math.random() * 500) : null;
  
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative bg-[#111] overflow-hidden rounded-sm transition-all duration-500 hover:shadow-2xl"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
        
        {/* Scarcity Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <AlertCircle size={12} className="text-stone-400" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-white">
              Only {product.scarcityCount} left
            </span>
          </div>
          
          {discountPercent > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/50">
              <Zap size={12} className="text-black fill-black" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-black">
                Status Leverage: -{discountPercent}%
              </span>
            </div>
          )}

          {/* FAKE SCARCITY INDICATOR */}
          {isStale && (
            <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-400/50 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Zap size={12} className="text-white fill-white" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white">
                Signal: Surge Detected
              </span>
            </div>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onVaultToggle?.(e, product.id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all z-20 ${
            isInVault ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'
          }`}
        >
          <Bookmark size={14} fill={isInVault ? "currentColor" : "none"} />
        </button>

        {/* Social Proof + Fake Requests */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-stone-300" />
            <span className="text-xs text-stone-300 font-light">
              {product.socialCount} curated this
            </span>
          </div>
          {isStale && (
            <div className="flex items-center gap-2 text-red-400">
              <TrendingUp size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">+{fakeRequests} Requests (24h)</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-black">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-2xl group-hover:text-white transition-colors">{product.name}</h3>
          <div className="flex flex-col items-end">
            <span className="text-stone-300 font-light">GH₵{product.price}</span>
            {product.originalPrice && (
              <span className="text-stone-600 text-[10px] line-through">GH₵{product.originalPrice}</span>
            )}
          </div>
        </div>
        <p className="text-stone-500 text-sm font-light italic mb-4 line-clamp-1">"{product.statement}"</p>
        
        <div className="w-full h-[1px] bg-white/5 mb-4" />
        
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-500">
          <span>{product.mood}</span>
          <span className={isStale ? 'text-amber-500 font-bold' : ''}>
            {isStale ? 'HIGH VELOCITY MATCH' : `${product.fitConfidence}% Confidence`}
          </span>
        </div>
      </div>
    </div>
  );
};
