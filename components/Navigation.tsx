
import React, { useState } from 'react';
import { Home, Zap, Search, User, History, MoreHorizontal, X, Bookmark, Globe, Star, Camera, Layers, Timer, Dice5, Package, Settings, Terminal, Factory } from 'lucide-react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'drops', icon: Zap, label: 'Drops' },
    { id: 'categories', icon: Layers, label: 'Archive' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const menuItems = [
    { id: 'ensembles', icon: Package, label: 'Coordination' },
    { id: 'game-room', icon: Dice5, label: 'Probability' },
    { id: 'flash-sale', icon: Timer, label: 'Extraction' },
    { id: 'custom-request', icon: Settings, label: 'Specialized' },
    { id: 'supply', icon: Factory, label: 'Supply' },
    { id: 'try-on', icon: Camera, label: 'Try On' },
    { id: 'famous-products', icon: Star, label: 'Famous' },
    { id: 'orders', icon: History, label: 'History' },
    { id: 'vault', icon: Bookmark, label: 'Vault' },
    { id: 'collections', icon: Globe, label: 'Manifesto' },
    { id: 'fit-finder', icon: Search, label: 'Fit Finder' },
    { id: 'admin', icon: Terminal, label: 'Terminal' },
  ];

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drop-up Menu */}
      <div 
        className={`md:hidden fixed bottom-24 left-4 right-4 z-50 transition-all duration-500 ease-out transform ${
          isMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-2 overflow-y-auto max-h-[60vh] scrollbar-hide">
          <p className="sticky top-0 bg-[#111] z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-600 px-4 py-2 border-b border-white/5 mb-2">Extended Protocol</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as View)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                  isActive ? 'bg-white text-black' : 'text-stone-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 z-50 flex justify-around items-center px-4 h-20 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as View)}
              className={`flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? 'text-white scale-110' : 'text-stone-500'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          );
        })}
        
        {/* Toggle Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            isMenuOpen ? 'text-white rotate-90 scale-110' : 'text-stone-500'
          }`}
        >
          {isMenuOpen ? <X size={22} /> : <MoreHorizontal size={22} />}
          <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.2em]">{isMenuOpen ? 'Close' : 'More'}</span>
        </button>
      </nav>

      {/* Desktop Left Rail */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 bg-black border-r border-white/5 flex-col items-center py-12 z-50">
        <div 
          className="text-xl font-serif mb-20 tracking-tighter cursor-pointer group flex flex-col items-center transition-all duration-700" 
          onClick={() => setView('home')}
        >
          <div className="relative flex flex-col items-center group-hover:items-start group-hover:pl-2 transition-all duration-700 overflow-hidden">
            <div className="flex items-center">
              <span>C</span>
              <span className="max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-0.5 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden text-sm">loset</span>
            </div>
            <div className="flex items-center -mt-1">
              <span>C</span>
              <span className="max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-0.5 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden text-sm">raze</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {[...navItems, ...menuItems].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`group relative p-3 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-stone-600 hover:text-stone-400'
                }`}
              >
                <Icon size={28} />
                <span className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
