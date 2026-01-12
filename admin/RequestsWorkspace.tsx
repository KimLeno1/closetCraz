
import React, { useState } from 'react';
import { 
  Inbox, 
  User, 
  Factory, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  MoreHorizontal, 
  Filter,
  Zap,
  Search,
  MessageSquare,
  Cpu,
  ChevronRight,
  ExternalLink,
  Activity,
  Download,
  Loader2
} from 'lucide-react';
import { EngagementRequest } from '../types';
import { db } from '../services/database';
import { GoogleGenAI } from "@google/genai";

interface RequestsWorkspaceProps {
  requests: EngagementRequest[];
  onUpdateStatus: (id: string, status: EngagementRequest['status']) => void;
  onPurge: (id: string) => void;
  addLog: (msg: string) => void;
}

export const RequestsWorkspace: React.FC<RequestsWorkspaceProps> = ({ 
  requests, onUpdateStatus, onPurge, addLog 
}) => {
  const [filter, setFilter] = useState<'ALL' | 'BESPOKE' | 'SUPPLY'>('ALL');
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const filteredRequests = requests.filter(req => filter === 'ALL' || req.type === filter);

  const getStatusStyle = (status: EngagementRequest['status']) => {
    switch (status) {
      case 'AUTHORIZED': return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'PURGED': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'FLAGGED': return 'text-amber-500 border-amber-500/20 bg-amber-500/5 animate-pulse';
      default: return 'text-stone-500 border-white/5 bg-white/5';
    }
  };

  const handleStatusUpdate = (id: string, status: EngagementRequest['status']) => {
    onUpdateStatus(id, status);
    addLog(`PROTOCOL: Request ${id} status updated to ${status} by root.`);
  };

  const runAudit = async (req: EngagementRequest) => {
    addLog(`NEURAL: Auditing ${req.type} request [${req.id}]...`);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Critique this fashion request: "${req.details}". 
      Does it fit a high-end brutalist aesthetic? 
      Answer in 10 words starting with "AUDIT: ".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      addLog(response.text || "AUDIT: Analysis inconclusive.");
      handleStatusUpdate(req.id, 'FLAGGED');
    } catch (err) {
      addLog("ERROR: Audit service collision.");
    }
  };

  const handleScrubber = async () => {
    setIsScrubbing(true);
    addLog("SCRUBBER: Initializing global request screening...");
    
    // Process top 3 pending requests
    const pending = requests.filter(r => r.status === 'PENDING').slice(0, 3);
    for (const req of pending) {
       await runAudit(req);
    }

    setTimeout(() => {
      setIsScrubbing(false);
      addLog("SCRUBBER: Pass complete. Aesthetics synchronized.");
    }, 1500);
  };

  const handleCsvExport = () => {
    addLog("EXTRACTION: Generating engagement stream snapshot (CSV).");
    const csv = db.generateCSV('requests');
    db.triggerDownload(csv, `cc_requests_${Date.now()}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Inbox size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Inbound Streams // Engagement_Protocols</p>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Request <span className="text-amber-500">Center</span></h1>
        </div>
        
        <div className="flex bg-white/[0.03] border border-white/5 rounded-md p-1">
          {['ALL', 'BESPOKE', 'SUPPLY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                filter === f ? 'bg-amber-500 text-black shadow-lg' : 'text-stone-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Active Requests</p>
               <p className="text-3xl font-black text-white">{requests.filter(r => r.status === 'PENDING').length}</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-500">
               <Activity size={20} />
            </div>
         </div>
         <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Supplier Velocity</p>
               <p className="text-3xl font-black text-white">4.2/day</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-500">
               <Factory size={20} />
            </div>
         </div>
         <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Bespoke Demand</p>
               <p className="text-3xl font-black text-white">High</p>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-500">
               <Zap size={20} />
            </div>
         </div>
      </div>

      <div className="flex justify-end px-2">
        <button 
          onClick={handleCsvExport}
          className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-stone-500 hover:text-amber-500 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="space-y-6">
        {filteredRequests.map((req) => (
          <div key={req.id} className="group p-8 bg-[#0a0a0c] border border-white/5 hover:border-amber-500/20 transition-all rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-stone-900 group-hover:bg-amber-500 transition-colors" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex gap-6 flex-1">
                <div className={`w-16 h-16 rounded border flex flex-col items-center justify-center shrink-0 ${
                  req.type === 'BESPOKE' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500' : 'border-blue-500/20 bg-blue-500/5 text-blue-500'
                }`}>
                  {req.type === 'BESPOKE' ? <User size={24} /> : <Factory size={24} />}
                  <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">{req.type}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xl font-black text-white tracking-tighter">{req.origin}</span>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <span className="text-[9px] font-mono text-stone-800 uppercase tracking-widest">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${getStatusStyle(req.status)}`}>
                       {req.status}
                    </span>
                    {req.priority === 'CRITICAL' && (
                      <span className="text-red-500 flex items-center gap-1 text-[7px] font-black uppercase tracking-widest">
                        <ShieldAlert size={10} /> Critical Priority
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {req.target && (
                       <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Target: {req.target}</p>
                    )}
                    <p className="text-sm font-serif italic text-stone-300 leading-relaxed group-hover:text-white transition-colors">
                      "{req.details}"
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-stone-800">
                       <Clock size={12} />
                       <span className="text-[8px] font-bold uppercase">{new Date(req.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <button 
                      onClick={() => addLog(`COMMS: Initializing encrypted channel for ${req.origin}...`)}
                      className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-stone-500 hover:text-amber-500 transition-colors"
                    >
                       <MessageSquare size={12} /> Open Comms Channel
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleStatusUpdate(req.id, 'AUTHORIZED')}
                  className="flex-1 lg:w-full px-6 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-green-500 transition-all flex items-center justify-center gap-2 rounded shadow-xl"
                >
                  <CheckCircle2 size={14} /> Authorize
                </button>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => runAudit(req)}
                    className="flex-1 p-3 bg-white/[0.03] border border-white/5 text-stone-600 hover:text-amber-500 hover:border-amber-500/20 transition-all rounded flex items-center justify-center"
                    title="Neural Audit"
                  >
                    <Cpu size={14} />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Purge this request?')) onPurge(req.id);
                    }}
                    className="flex-1 p-3 bg-white/[0.03] border border-white/5 text-stone-600 hover:text-red-500 hover:border-red-500/20 transition-all rounded flex items-center justify-center"
                    title="Purge Request"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="py-40 text-center space-y-6 opacity-10 border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
             <Inbox size={64} className="mx-auto" strokeWidth={1} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Inbound Streams Detected</p>
          </div>
        )}
      </div>

      <section className="p-10 border border-white/5 bg-[#0a0a0c] rounded-lg relative overflow-hidden group">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-800 group-hover:text-amber-500 transition-colors">
                  {isScrubbing ? <Loader2 size={32} className="animate-spin text-amber-500" /> : <Cpu size={32} strokeWidth={1} />}
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Automated Neural Scrub</h3>
                  <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-sm">
                     Enable AI to pre-screen bespoke requests for aesthetic alignment before human review.
                  </p>
               </div>
            </div>
            <button 
              onClick={handleScrubber}
              disabled={isScrubbing}
              className="px-10 py-5 bg-white/[0.03] border border-white/10 text-stone-500 hover:text-white hover:border-white transition-all text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-4 rounded-md"
            >
               {isScrubbing ? "Scrubbing State..." : "Initialize Scrubber Protocol"} <ChevronRight size={14} />
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
      </section>
    </div>
  );
};
