
import React from 'react';
import { View } from '../types';

interface HeroProps {
  onNavigate: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: 'brightness(0.6)' }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-34241-large.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 md:pb-32">
        <div className="max-w-4xl space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] font-medium text-stone-400">Personalized for you</p>
          <h1 className="text-5xl md:text-8xl font-serif leading-tight">
            Designed for those who <br /><span className="italic">don’t blend in.</span>
          </h1>
          <p className="text-stone-300 max-w-lg text-lg font-light leading-relaxed">
            Curated pieces engineered for identity. 
            <span className="block mt-2 font-medium text-white underline decoration-stone-500 underline-offset-8">
              Trending among Icons like you.
            </span>
          </p>
          
          <div className="pt-8 flex gap-4">
            <button 
              onClick={() => onNavigate('famous-products')}
              className="bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors duration-300"
            >
              Unlock This Look
            </button>
            <button 
              onClick={() => onNavigate('drops')}
              className="border border-white/20 bg-black/20 backdrop-blur-md text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:border-white transition-colors duration-300"
            >
              View Drops
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
