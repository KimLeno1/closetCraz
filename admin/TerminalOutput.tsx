import React from 'react';
import { Activity, Cpu, ShieldCheck, Terminal as TerminalIcon, Hash } from 'lucide-react';

interface TerminalOutputProps {
  logs: string[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg border border-white/5">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <div className="bg-[#020203] p-8 font-mono text-[10px] space-y-4 h-64 overflow-y-auto custom-scrollbar relative shadow-inner">
        {/* Sticky Terminal Header */}
        <div className="flex items-center justify-between mb-8 text-amber-500/40 border-b border-white/5 pb-5 sticky top-0 bg-[#020203]/80 backdrop-blur-md z-20 -mx-8 px-8">
          <div className="flex items-center gap-4">
            <TerminalIcon size={14} className="text-amber-500" />
            <span className="uppercase tracking-[0.5em] font-black text-[9px]">Root_Access_Log // Node_Feed</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Cpu size={10} className="text-stone-800" />
                <span className="text-[8px] font-black">LOAD_AVG: 1.04</span>
             </div>
             <div className="flex items-center gap-2">
                <Hash size={10} className="text-stone-800" />
                <span className="text-[8px] font-black">PROC: 412</span>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          {logs.map((log, i) => {
            const isError = log.includes("ERROR") || log.includes("FAILED");
            const isAuth = log.includes("AUTH") || log.includes("SECURITY") || log.includes("authorized");
            const isNeural = log.includes("Neural") || log.includes("Gemini") || log.includes("Cluster");

            return (
              <div key={i} className="flex gap-8 group/log animate-in slide-in-from-left-2 duration-300">
                <span className="text-stone-800 font-black shrink-0 text-[8px] mt-0.5">[{new Date().toLocaleTimeString()}]</span>
                <span className={`tracking-wider leading-relaxed ${
                  isError ? 'text-red-500 font-black bg-red-500/5 px-2 -mx-2 rounded' : 
                  isAuth ? 'text-blue-400 font-bold' : 
                  isNeural ? 'text-amber-400' :
                  'text-stone-500 group-hover/log:text-white transition-colors'
                }`}>
                  <span className="mr-3 opacity-30 text-white">#</span>
                  {log}
                </span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="py-20 text-center space-y-6 opacity-10">
               <Activity size={40} className="mx-auto animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Cluster Triggers...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Corner Tab */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
      <div className="absolute bottom-4 right-4 text-stone-900 pointer-events-none">
         <TerminalIcon size={40} strokeWidth={1} />
      </div>
    </div>
  );
};