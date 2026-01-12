
import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  UserCheck, 
  Bell, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Filter,
  Search,
  X,
  Plus,
  Save,
  Radio,
  Cpu,
  Loader2
} from 'lucide-react';
import { AppNotification, UserStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MessagesWorkspaceProps {
  notifications: AppNotification[];
  onAdd: (note: AppNotification) => void;
  onEdit: (note: AppNotification) => void;
  onDelete: (id: string) => void;
  addLog: (msg: string) => void;
}

export const MessagesWorkspace: React.FC<MessagesWorkspaceProps> = ({ 
  notifications, onAdd, onEdit, onDelete, addLog 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<AppNotification | null>(null);
  const [isAutoDispatching, setIsAutoDispatching] = useState(false);
  
  const initialFormState: Partial<AppNotification> = {
    title: '',
    content: '',
    type: 'INFO',
    targetTier: 'ALL',
    read: false
  };

  const [formData, setFormData] = useState<Partial<AppNotification>>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      onEdit({ ...editingNote, ...formData } as AppNotification);
      addLog(`COMMS: Signal [${formData.title}] recalibrated in transmission log.`);
    } else {
      const newNote: AppNotification = {
        ...formData,
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      } as AppNotification;
      onAdd(newNote);
      addLog(`COMMS: New Signal [${formData.title}] dispatched to neural network.`);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingNote(null);
    setShowForm(false);
  };

  const startEdit = (note: AppNotification) => {
    setFormData(note);
    setEditingNote(note);
    setShowForm(true);
  };

  const getTypeStyle = (type: AppNotification['type']) => {
    switch (type) {
      case 'PROTOCOL': return 'text-amber-500 bg-amber-500/5 border-amber-500/20';
      case 'ALERT': return 'text-red-500 bg-red-500/5 border-red-500/20';
      case 'STATUS': return 'text-indigo-400 bg-indigo-400/5 border-indigo-400/20';
      default: return 'text-stone-500 bg-white/5 border-white/10';
    }
  };

  const handleAutoDispatch = async () => {
    setIsAutoDispatching(true);
    addLog("COMMS: Analysis of collective volatility initiated...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate an urgent high-fashion system notification for a brutalist fashion app. 
      Topic: New status protocol or archival drop. 
      Tone: Elitist, cold. 
      Max 20 words for content, max 4 words for title.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "PROTOCOL: Aesthetic alignment required. Access granted.";
      const title = text.split('\n')[0].substring(0, 30);
      const content = text.split('\n').slice(1).join(' ') || text;

      onAdd({
        id: `auto-${Date.now()}`,
        title: title.toUpperCase(),
        content: content,
        type: 'PROTOCOL',
        timestamp: new Date().toISOString(),
        read: false,
        targetTier: 'ALL'
      });
      addLog(`COMMS: AI-Synthesized signal [${title}] broadcasted.`);
    } catch (err) {
      addLog("ERROR: Neural broadcast collision.");
    } finally {
      setIsAutoDispatching(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Radio size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Network Comms // Signal_Dispatch</p>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Signal <span className="text-amber-500">Center</span></h1>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-500 transition-all flex items-center gap-4 rounded-sm shadow-2xl"
        >
          <Plus size={14} /> Compose New Signal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-8 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-4">
            <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Active Signals</p>
            <p className="text-4xl font-black text-white">{notifications.length}</p>
         </div>
         <div className="p-8 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-4">
            <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Network Reach</p>
            <p className="text-4xl font-black text-amber-500">100%</p>
         </div>
         <div className="p-8 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-4">
            <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Neural Resonance</p>
            <p className="text-4xl font-black text-indigo-400">High</p>
         </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#0D0D0F] border border-amber-500/20 p-12 max-w-2xl w-full relative shadow-2xl rounded-sm">
             <button onClick={resetForm} className="absolute top-8 right-8 text-stone-600 hover:text-white transition-colors">
               <X size={24} />
             </button>

             <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-500">
                  <Send size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
                  {editingNote ? 'Recalibrate Signal' : 'Initialize Transmission'}
                </h2>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8 font-mono">
                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Signal Header (Title)</label>
                   <input required type="text" className="w-full bg-black border border-white/10 p-5 text-white focus:border-amber-500 outline-none transition-all uppercase font-bold tracking-widest" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Signal Type</label>
                      <select className="w-full bg-black border border-white/10 p-5 text-white focus:border-amber-500 outline-none transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                         <option value="INFO">Information</option>
                         <option value="ALERT">Status Alert</option>
                         <option value="PROTOCOL">System Protocol</option>
                         <option value="STATUS">Identity Status</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Target Audience</label>
                      <select className="w-full bg-black border border-white/10 p-5 text-white focus:border-amber-500 outline-none transition-all" value={formData.targetTier} onChange={e => setFormData({...formData, targetTier: e.target.value as any})}>
                         <option value="ALL">All Nodes</option>
                         <option value={UserStatus.OBSERVER}>{UserStatus.OBSERVER} Only</option>
                         <option value={UserStatus.INSIDER}>{UserStatus.INSIDER} Only</option>
                         <option value={UserStatus.TRENDSETTER}>{UserStatus.TRENDSETTER} Only</option>
                         <option value={UserStatus.ICON}>{UserStatus.ICON} Only</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Neural Payload (Content)</label>
                   <textarea required rows={4} className="w-full bg-black border border-white/10 p-5 text-white focus:border-amber-500 outline-none transition-all text-sm leading-relaxed" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                </div>

                <div className="pt-6 flex gap-4">
                   <button type="submit" className="flex-1 bg-amber-500 text-black py-6 text-xs font-black uppercase tracking-[0.5em] hover:bg-white transition-all flex items-center justify-center gap-4">
                      <Save size={16} /> {editingNote ? 'Authorize Modification' : 'Broadcast to Network'}
                   </button>
                   <button type="button" onClick={resetForm} className="px-10 border border-white/10 text-stone-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em]">
                      Abort
                   </button>
                </div>
             </form>
           </div>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-500 flex items-center gap-3">
             <Bell size={14} className="text-amber-500" /> Transmission Log
           </h3>
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-mono text-stone-700">GHOST_FREQ: 99.4MHz</span>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {notifications.map((note) => (
            <div key={note.id} className="group p-8 bg-[#0a0a0c] border border-white/5 hover:border-amber-500/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-lg relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-stone-900 group-hover:bg-amber-500 transition-colors" />
               
               <div className="flex gap-8 flex-1">
                  <div className={`w-14 h-14 rounded border flex items-center justify-center shrink-0 ${getTypeStyle(note.type)}`}>
                     <Bell size={20} />
                  </div>
                  <div className="space-y-2 flex-1">
                     <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-lg font-black text-white uppercase tracking-widest">{note.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${getTypeStyle(note.type)}`}>
                           {note.type}
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[8px] font-bold text-stone-700 uppercase tracking-widest">Target: {note.targetTier}</span>
                     </div>
                     <p className="text-sm text-stone-400 font-serif italic max-w-2xl leading-relaxed group-hover:text-white transition-colors">
                        "{note.content}"
                     </p>
                     <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-stone-800 uppercase tracking-widest">
                           <Clock size={10} /> {new Date(note.timestamp).toLocaleTimeString()} // {new Date(note.timestamp).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(note)}
                    className="p-4 border border-white/10 hover:bg-white hover:text-black transition-all rounded"
                    title="Recalibrate Signal"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Purge this signal from the network?')) {
                        onDelete(note.id);
                        addLog(`WARN: Signal [${note.title}] purged from registry by root.`);
                      }
                    }}
                    className="p-4 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white transition-all rounded"
                    title="Purge Signal"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-40 text-center space-y-6 opacity-10 border border-dashed border-white/10 rounded-lg">
               <Radio size={64} className="mx-auto" strokeWidth={1} />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Outbound Signals Logged</p>
            </div>
          )}
        </div>
      </section>

      <section className="p-10 border border-white/5 bg-[#0a0a0c] rounded-lg flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-800 group-hover:text-amber-500 transition-colors">
               {isAutoDispatching ? <Loader2 size={32} className="animate-spin text-amber-500" /> : <Cpu size={32} strokeWidth={1} />}
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Signal Automation Node</h3>
               <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-sm">
                  Enable algorithmic signal generation based on collective status evolution and market volatility.
               </p>
            </div>
         </div>
         <button 
          onClick={handleAutoDispatch}
          disabled={isAutoDispatching}
          className="px-10 py-5 border border-white/5 bg-white/[0.02] text-stone-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] rounded relative z-10"
         >
            {isAutoDispatching ? "Dispatching..." : "Initialize Auto-Dispatch"}
         </button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] pointer-events-none" />
      </section>
    </div>
  );
};
