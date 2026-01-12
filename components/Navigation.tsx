
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Zap, Search, User, History, MoreHorizontal, X, Bookmark, 
  Globe, Star, Camera, Layers, Timer, Dice5, Package, Settings, 
  Terminal, Factory, ChevronRight, Fingerprint, Command, Shield 
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const primaryNav = [
    { path: '/home', icon: Home, label: 'Core' },
    { path: '/drops', icon: Zap, label: 'Drops' },
    { path: '/categories', icon: ArchiveIcon, label: 'Archive' },
    { path: '/profile', icon: User, label: 'Identity' },
  ];

  const extendedNav = [
    { path: '/ensembles', icon: Package, label: 'Coordination' },
    { path: '/game-room', icon: Dice5, label: 'Probability' },
    { path: '/flash-sale', icon: Timer, label: 'Extraction' },
    { path: '/custom-request', icon: Settings, label: 'Specialized' },
    { path: '/try-on', icon: Camera, label: 'Try On' },
    { path: '/famous-products', icon: Star, label: 'Icons' },
    { path: '/orders', icon: History, label: 'Deployments' },
    { path: '/vault', icon: Bookmark, label: 'The Vault' },
    { path: '/collections', icon: Globe, label: 'Manifesto' },
    { path: '/fit-finder', icon: Search, label: 'Search' },
    { path: '/admin', icon: Terminal, label: 'Terminal' },
    { path: '/supply', icon: Factory, label: 'Supply' },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[100] animate-in fade-in duration-500"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Tactical Side Drawer */}
      <aside 
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-[#050505] border-r border-white/10 z-[110] transition-transform duration-700 ease-out transform flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Fingerprint size={18} className="text-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Registry_Access</span>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-stone-600 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
           <section className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-800 font-bold px-2">Primary Nodes</p>
              <div className="space-y-1">
                {primaryNav.map((item, idx) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={({ isActive }) => `
                      stagger-item flex items-center gap-4 px-4 py-4 rounded-sm transition-all border
                      ${isActive ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-transparent text-stone-500 hover:bg-white/5 hover:text-white'}
                    `}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <item.icon size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </NavLink>
                ))}
              </div>
           </section>

           <section className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-800 font-bold px-2">Cluster Protocols</p>
              <div className="grid grid-cols-1 gap-1">
                {extendedNav.map((item, idx) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={({ isActive }) => `
                      stagger-item flex items-center justify-between px-4 py-4 rounded-sm transition-all border group
                      ${isActive ? 'bg-amber-500 text-black border-amber-500' : 'border-transparent text-stone-500 hover:bg-white/5 hover:text-stone-300'}
                    `}
                    style={{ animationDelay: `${(idx + primaryNav.length) * 0.05}s` }}
                  >
                    {/* Fixed: Wrapped NavLink children in a function to access 'isActive' */}
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                          <item.icon size={18} className={isActive ? 'text-black' : 'text-stone-700 group-hover:text-stone-500'} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                        </div>
                        <ChevronRight size={12} className="opacity-30" />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
           </section>
        </div>

        <footer className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
           <div className="flex items-center gap-4 text-stone-700">
             <Shield size={16} />
             <p className="text-[8px] uppercase tracking-[0.4em] leading-relaxed">System identity secured via RSA-4096_GCM</p>
           </div>
           <div className="flex justify-between items-center opacity-20">
             <span className="text-[7px] font-mono">v4.2.1-STABLE</span>
             <Command size={10} />
           </div>
        </footer>
      </aside>

      {/* Mobile Bottom Bar (Minimized Nav) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 z-[90] flex justify-around items-center px-4 h-20 pb-4">
        {primaryNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center transition-all duration-300 
              ${isActive ? 'text-white scale-110' : 'text-stone-500 hover:text-stone-300'}
            `}
          >
            <item.icon size={22} strokeWidth={1.5} />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.2em]">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center text-stone-500 hover:text-white transition-all"
        >
          <MoreHorizontal size={22} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.2em]">Protocols</span>
        </button>
      </nav>

      {/* Desktop Left Rail (Standard for world-class feel) */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 bg-black border-r border-white/5 flex-col items-center py-12 z-50">
        <div 
          className="text-xl font-serif mb-20 tracking-tighter cursor-pointer group flex flex-col items-center transition-all duration-700" 
          onClick={() => navigate('/home')}
        >
          <div className="relative flex flex-col items-center group-hover:items-start group-hover:pl-2 transition-all duration-700 overflow-hidden text-white">
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
        
        <div className="flex-1 flex flex-col gap-8 custom-scrollbar overflow-y-auto px-4 w-full items-center">
          {[...primaryNav, ...extendedNav].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group relative p-3 transition-all duration-300 rounded-md
                ${isActive ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-stone-600 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={26} strokeWidth={1.5} />
              <span className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-[10px] font-black rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-[0.2em] whitespace-nowrap shadow-2xl z-[60]">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

// Custom Archive Icon (Layers alias)
const ArchiveIcon = Layers;
