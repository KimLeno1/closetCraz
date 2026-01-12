
import React from 'react';
import { 
  Activity, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowUpRight,
  Factory,
  MousePointer2,
  Binary
} from 'lucide-react';
import { Supplier, Product } from '../types';

interface SupplierOverviewWorkspaceProps {
  studio: Supplier;
  products: Product[];
  addLog: (msg: string) => void;
}

export const SupplierOverviewWorkspace: React.FC<SupplierOverviewWorkspaceProps> = ({ studio, products, addLog }) => {
  const stats = [
    { label: 'Active Silhouettes', value: products.length, delta: '+1', icon: Layers, status: 'Synced' },
    { label: 'Production Velocity', value: '4.2/wk', delta: 'Optimal', icon: Activity, status: 'Verified' },
    { label: 'Market Resonance', value: '92%', delta: '+4.5%', icon: TrendingUp, status: 'High' },
    { label: 'Resilience Score', value: `${studio.resilienceScore}%`, delta: 'Stable', icon: ShieldCheck, status: 'Locked' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Binary size={16} className="text-blue-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Studio Telemetry // Node_{studio.id}</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Studio <span className="text-blue-500">Hub</span></h1>
        </div>
        <div className="px-6 py-3 bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 rounded-sm">
           <Zap size={14} className="text-blue-500 animate-pulse" /> Status: {studio.status}
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-[#0a0a0c] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={60} />
            </div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-md text-blue-500/60 group-hover:text-blue-400 transition-all">
                <stat.icon size={18} />
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-[9px] font-black text-green-500 flex items-center gap-1 bg-green-500/5 px-2 py-1 rounded">
                   <ArrowUpRight size={10} /> {stat.delta}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-black">{stat.label}</p>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Load Distribution */}
        <div className="lg:col-span-2 p-10 bg-[#0a0a0c] border border-white/5 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Silhouette Resonance Feed</h3>
              <p className="text-[8px] text-stone-700 uppercase tracking-widest font-bold">Real-time demand signals detected across the network</p>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2.5 px-2 relative mb-8">
            {[45, 60, 40, 85, 70, 95, 55, 100, 80, 65, 90, 75, 50, 40, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/10 hover:bg-blue-500/40 transition-all rounded-sm group relative" style={{ height: `${h}%` }}>
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[7px] font-black px-2 py-1 rounded whitespace-nowrap z-20">
                   SIGNAL_{i}: {h}%
                 </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-[7px] font-black uppercase text-stone-800 tracking-[0.6em] pt-6 border-t border-white/5">
            <span>START_SHIFT</span>
            <span>NODE_PEAK</span>
            <span>END_SHIFT</span>
          </div>
        </div>

        {/* Studio Specs */}
        <div className="space-y-6">
           <div className="p-10 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-8 h-full">
             <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Node Specifications</h3>
                <Factory size={14} className="text-stone-800" />
             </div>
             
             <div className="space-y-6">
               <div>
                  <p className="text-[8px] text-stone-700 uppercase font-black tracking-widest mb-2">Primary Region</p>
                  <p className="text-sm font-black text-white uppercase">{studio.region}</p>
               </div>
               <div>
                  <p className="text-[8px] text-stone-700 uppercase font-black tracking-widest mb-2">Specialization</p>
                  <p className="text-sm font-black text-white uppercase">{studio.specialty}</p>
               </div>
               <div>
                  <p className="text-[8px] text-stone-700 uppercase font-black tracking-widest mb-2">Resilience Protocol</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-[2s]" style={{ width: `${studio.resilienceScore}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500">{studio.resilienceScore}%</span>
                  </div>
               </div>
             </div>

             <div className="pt-8 border-t border-white/5">
               <button 
                 onClick={() => addLog("STUDIO_OPS: Initializing local production audit...")}
                 className="w-full py-4 border border-blue-500/20 bg-blue-500/5 text-blue-500 hover:bg-blue-500 hover:text-black transition-all text-[8px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 rounded-md"
               >
                 <ShieldCheck size={14} /> Audit Node Integrity
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
