
import React, { useState } from 'react';
import { 
  Activity, 
  Globe, 
  Radio, 
  RefreshCw, 
  Search,
  Eye,
  ServerCrash,
  Box,
  Binary,
  Terminal,
  Loader2
} from 'lucide-react';

interface DiagnosticsWorkspaceProps {
  addLog: (msg: string) => void;
}

export const DiagnosticsWorkspace: React.FC<DiagnosticsWorkspaceProps> = ({ addLog }) => {
  const [nodes, setNodes] = useState([
    { id: 'LDN-01', status: 'Online', latency: 42, load: 12, region: 'Europe', heat: 34 },
    { id: 'NYC-04', status: 'Online', latency: 18, load: 45, region: 'US-East', heat: 52 },
    { id: 'TOK-09', status: 'Warning', latency: 156, load: 88, region: 'Asia', heat: 78 },
    { id: 'GHA-02', status: 'Online', latency: 8, load: 22, region: 'West Africa', heat: 29 },
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const runSystemScan = () => {
    setIsScanning(true);
    addLog("DIAGNOSTICS: Initializing global node heartbeat verification...");
    
    setTimeout(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        latency: Math.max(2, n.latency + (Math.random() * 20 - 10)),
        load: Math.min(100, Math.max(0, n.load + (Math.random() * 10 - 5))),
        heat: Math.min(100, Math.max(20, n.heat + (Math.random() * 6 - 3))),
        status: Math.random() > 0.9 ? 'Warning' : 'Online'
      })));
      addLog("DIAGNOSTICS: Node health verified. Integrity consensus reached.");
      setIsScanning(false);
    }, 2000);
  };

  const handlePeek = (user: string) => {
    addLog(`SECURITY: Intercepting live session stream for user [${user}]...`);
    alert(`Live Peek: User ${user} is currently browsing the Vault cluster.`);
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Radio size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Network Telemetry // system_diagnostics</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Global <span className="not-italic text-amber-500">Pulse</span></h1>
        </div>
        <button 
          onClick={runSystemScan}
          disabled={isScanning}
          className="w-full md:w-auto px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:invert transition-all flex items-center justify-center gap-4 rounded-md shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
          Force Node Pulse
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {nodes.map(node => (
          <div key={node.id} className={`p-6 md:p-8 border rounded-lg bg-[#0a0a0c] transition-all group relative overflow-hidden ${node.status === 'Warning' ? 'border-red-500/30' : 'border-white/5 hover:border-amber-500/20'}`}>
            <div className="flex justify-between items-start mb-8 md:mb-10">
               <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-white tracking-tighter">{node.id}</h3>
                  <p className="text-[8px] uppercase tracking-widest text-stone-700 font-bold">{node.region}</p>
               </div>
               <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                 node.status === 'Online' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5 animate-pulse'
               }`}>
                 {node.status}
               </div>
            </div>

            <div className="space-y-4 md:space-y-6 relative z-10">
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-stone-700">Latency</span>
                  <span className="text-amber-500">{node.latency.toFixed(1)}ms</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(node.latency/200)*100}%` }} />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[7px] uppercase font-black text-stone-800">Load</p>
                     <p className="text-xs md:text-sm font-black text-white">{node.load.toFixed(0)}%</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[7px] uppercase font-black text-stone-800">C-Heat</p>
                     <p className={`text-xs md:text-sm font-black ${node.heat > 70 ? 'text-red-500' : 'text-stone-400'}`}>{node.heat}°C</p>
                  </div>
               </div>
            </div>

            {node.status === 'Warning' && (
              <div className="absolute top-2 right-2 opacity-20 text-red-500">
                <ServerCrash size={40} strokeWidth={1} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 md:p-10 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-8 md:space-y-10 relative group">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                  <Globe size={18} className="text-amber-500" /> Identity Flow Heatmap
                </h3>
                <p className="text-[8px] text-stone-800 font-bold uppercase tracking-widest italic">Visualizing neural packet routing across sectors</p>
             </div>
             <Box size={14} className="text-stone-800 hidden sm:block" />
          </div>

          <div 
            onClick={() => addLog("SYS: Visual heatmap buffer flushed.")}
            className="aspect-video sm:aspect-[21/9] bg-black/40 border border-white/5 rounded-lg relative flex items-center justify-center grayscale opacity-60 overflow-hidden cursor-crosshair"
          >
             <div className="absolute inset-0 flex flex-wrap opacity-5">
                {[...Array(100)].map((_, i) => <div key={i} className="w-12 h-12 border border-white" />)}
             </div>
             <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-stone-800 z-10 text-center">Neural_Lattice_Mapping...</p>
             <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-amber-500 rounded-full blur-[6px] animate-ping" />
             <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-red-500 rounded-full blur-[8px] animate-pulse" />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center text-[7px] font-black uppercase tracking-widest text-stone-700 gap-4">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-amber-500/20" /> Active Clusters: 42
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500/20" /> Cross-Sect_Sync: Optimized
             </div>
             <div className="font-mono text-amber-500">
               FREQ: 14.204 MHz
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-6 md:p-10 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-8 md:space-y-10">
             <div className="flex items-center gap-4 border-b border-white/5 pb-4">
               <Search size={18} className="text-amber-500" />
               <h3 className="text-xs font-black uppercase tracking-widest text-white">Live Session Peek</h3>
             </div>
             
             <div className="space-y-6">
               <div className="space-y-4">
                 {[
                   { user: 'V.Thorne', status: 'Icon', action: 'Registry_R', time: '2s ago' },
                   { user: 'M.Sterling', status: 'Trendsetter', action: 'Vault_W', time: '14s ago' },
                   { user: 'Operator_01', status: 'Root', action: 'Sys_Config', time: 'Active' },
                 ].map((u, i) => (
                   <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-md flex items-center gap-4 group hover:bg-white/[0.03] transition-all">
                      <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center text-[10px] font-black text-amber-500/40 bg-black shrink-0">
                        {u.user[0]}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-black text-white truncate">{u.user}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[7px] text-amber-500/40 font-bold uppercase">{u.action}</span>
                           <div className="w-1 h-1 bg-stone-900 rounded-full" />
                           <span className="text-[7px] text-stone-800 font-bold uppercase whitespace-nowrap">{u.time}</span>
                        </div>
                      </div>
                      <Eye 
                        size={14} 
                        className="text-stone-800 hover:text-white cursor-pointer transition-colors" 
                        onClick={() => handlePeek(u.user)}
                      />
                   </div>
                 ))}
               </div>
             </div>

             <div className="pt-8 border-t border-white/5">
                <button 
                  onClick={() => addLog("SYS: Telemetry log dump triggered. Processing history packets...")}
                  className="w-full py-4 border border-amber-500/10 text-stone-700 hover:text-white hover:border-amber-400 transition-all text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 rounded-md"
                >
                  <Terminal size={14} className="text-amber-500/50" /> Telemetry Log
                </button>
             </div>
           </div>

           <div 
            onClick={() => addLog("SYS: 0x99281 Entropy Key verified.")}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
           >
              <div className="space-y-1 overflow-hidden">
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-stone-800">Entropy Key</p>
                <p className="text-[11px] text-amber-500/40 font-mono tracking-tighter truncate w-32 group-hover:text-amber-500 transition-colors">0x99281-ZA11-X</p>
              </div>
              <Binary size={24} className="text-stone-900 group-hover:text-amber-500/20 transition-all shrink-0" />
           </div>
        </div>
      </div>
    </div>
  );
};
