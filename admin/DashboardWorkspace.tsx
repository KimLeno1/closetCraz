import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  RefreshCcw, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Users,
  Layers,
  ArrowUpRight,
  Fingerprint,
  MousePointer2,
  Clock
} from 'lucide-react';

interface DashboardWorkspaceProps {
  addLog: (msg: string) => void;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({ addLog }) => {
  const stats = [
    { label: 'Active Sessions', value: '1,204', delta: '+12%', icon: Users, status: 'Stable' },
    { label: 'Internal Latency', value: '14.2ms', delta: 'Optimal', icon: Activity, status: 'Verified' },
    { label: 'Network Consensus', value: '88.4%', delta: '+2.1%', icon: TrendingUp, status: 'Rising' },
    { label: 'Asset Capacity', value: '2,105', delta: 'Stable', icon: Layers, status: 'Limit' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Fingerprint size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Central Command // Global_Telemetry</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">System <span className="text-amber-500">Overview</span></h1>
        </div>
        <button className="w-full md:w-auto p-4 bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:text-white transition-all group flex items-center justify-center gap-4 rounded-md">
           <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
           <span className="text-[9px] font-black uppercase tracking-widest">Re-Sync Node</span>
        </button>
      </header>

      {/* High-Fidelity Tactical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 md:p-8 bg-[#0a0a0c] border border-white/5 hover:border-amber-500/20 transition-all group relative overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={60} />
            </div>
            
            <div className="flex justify-between items-start mb-6 md:mb-10">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-md text-amber-500/60 group-hover:text-amber-400 group-hover:scale-110 transition-all">
                <stat.icon size={18} />
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-[9px] font-black text-green-500 flex items-center gap-1 bg-green-500/5 px-2 py-1 rounded">
                   <ArrowUpRight size={10} /> {stat.delta}
                </span>
                <span className="text-[7px] text-stone-700 uppercase mt-2 font-bold tracking-widest">{stat.status}</span>
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-black">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Visualization Grid */}
        <div className="lg:col-span-2 p-6 md:p-10 bg-[#0a0a0c] border border-white/5 rounded-lg relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Neural Load Distribution</h3>
              <p className="text-[8px] text-stone-700 uppercase tracking-widest font-bold">Transaction throughput snapshots per temporal node</p>
            </div>
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md self-start">
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">LIVE_FEED</span>
            </div>
          </div>
          
          <div className="h-48 md:h-64 flex items-end gap-1.5 md:gap-2.5 px-2 relative mb-8">
            <div className="absolute inset-0 flex flex-col justify-between opacity-[0.05] pointer-events-none">
              {[...Array(5)].map((_, i) => <div key={i} className="h-px w-full bg-white" />)}
            </div>
            {[40, 70, 45, 90, 65, 80, 55, 95, 85, 100, 75, 90, 60, 45, 80, 70, 55, 40].map((h, i) => (
              <div key={i} className="flex-1 bg-white/[0.03] hover:bg-amber-500/60 transition-all rounded-sm group/bar relative" style={{ height: `${h}%` }}>
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all bg-white text-black text-[7px] font-black px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                   NODE_{i}: {h}.2%
                 </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-[7px] font-black uppercase text-stone-800 tracking-[0.3em] md:tracking-[0.6em] pt-6 border-t border-white/5">
            <span>00:00:00</span>
            <span className="hidden sm:inline">08:00:00</span>
            <span className="hidden sm:inline">16:00:00</span>
            <span>24:00:00</span>
          </div>
        </div>

        {/* Global System Matrix */}
        <div className="space-y-6">
           <div className="p-6 md:p-10 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-8 h-full">
             <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                  <ShieldCheck size={18} className="text-amber-500" /> Security Mesh
                </h3>
                <Clock size={14} className="text-stone-800" />
             </div>
             
             <div className="space-y-7">
               {[
                 { label: 'RSA Neural Vault', status: 'Gated', load: 12, color: 'bg-amber-500' },
                 { label: 'Blockchain Sync', status: 'Optimal', load: 45, color: 'bg-blue-500' },
                 { label: 'User Auth Cluster', status: 'Stable', load: 22, color: 'bg-green-500' },
                 { label: 'Edge Asset CDN', status: 'Ready', load: 8, color: 'bg-white' },
               ].map((node, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-end">
                     <span className="text-[9px] text-stone-600 uppercase font-black tracking-widest">{node.label}</span>
                     <span className="text-[7px] font-black text-white/40 uppercase bg-white/5 px-1.5 py-0.5 rounded">{node.status}</span>
                   </div>
                   <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className={`h-full ${node.color} opacity-40 transition-all duration-1000 ease-out`} style={{ width: `${node.load}%` }} />
                   </div>
                 </div>
               ))}
             </div>

             <div className="pt-8 border-t border-white/5">
               <button 
                 onClick={() => addLog("SYS: Manual infrastructure optimization triggered.")}
                 className="w-full py-4 border border-white/5 bg-white/[0.02] text-stone-500 hover:text-white hover:border-amber-500/20 transition-all text-[8px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 rounded-md"
               >
                 <Zap size={14} className="text-amber-500/50" /> Optimizing Clusters...
               </button>
             </div>
           </div>

           <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center gap-5 group cursor-help transition-all hover:bg-amber-500/10">
              <div className="w-12 h-12 rounded-md border border-amber-500/20 flex items-center justify-center text-amber-500/60 group-hover:text-amber-400 group-hover:rotate-12 transition-all shrink-0">
                 <MousePointer2 size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">Operator Priority: High</p>
                <p className="text-[8px] text-amber-500/40 font-bold uppercase tracking-tighter truncate">Awaiting consensus on drop #921</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};