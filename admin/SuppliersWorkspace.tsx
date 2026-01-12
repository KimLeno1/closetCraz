
import React, { useState, useMemo } from 'react';
import { 
  Factory, 
  Plus, 
  Search, 
  Activity, 
  ShieldAlert, 
  Globe, 
  ArrowUpRight, 
  Filter, 
  Trash2, 
  Edit3, 
  Maximize2,
  X,
  Save,
  Loader2,
  ShieldCheck,
  Zap,
  MoreVertical,
  Activity as StatusIcon,
  Layers,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Supplier, Product } from '../types';
import { db } from '../services/database';

interface SuppliersWorkspaceProps {
  addLog: (msg: string) => void;
}

export const SuppliersWorkspace: React.FC<SuppliersWorkspaceProps> = ({ addLog }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.getAllSuppliers());
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const initialForm: Partial<Supplier> = {
    name: '',
    region: '',
    specialty: '',
    status: 'PENDING',
    resilienceScore: 50,
    activeAssets: 0
  };
  const [formData, setFormData] = useState<Partial<Supplier>>(initialForm);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.specialty.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const supplierAssets = useMemo(() => {
    if (!selectedSupplier) return [];
    return db.getAllProducts().filter(p => p.supplierId === selectedSupplier.id);
  }, [selectedSupplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    addLog(`SECURITY: Initializing studio onboarding protocol for ${formData.name}.`);

    setTimeout(() => {
      const newSupplier: Supplier = {
        ...formData,
        id: `SUP-${Date.now().toString().slice(-4)}`,
        onboardedDate: new Date().toISOString().split('T')[0],
      } as Supplier;

      db.addSupplier(newSupplier);
      setSuppliers(db.getAllSuppliers());
      addLog(`ADMIN: Node ${newSupplier.id} established in collective registry with status [${newSupplier.status}].`);
      
      setIsProcessing(false);
      setShowForm(false);
      setFormData(initialForm);
    }, 1500);
  };

  const updateStatus = (id: string, status: Supplier['status']) => {
    db.updateSupplierStatus(id, status);
    setSuppliers(db.getAllSuppliers());
    addLog(`PROTOCOL: Node ${id} status recalibrated to ${status}.`);
  };

  const deleteSupplier = (id: string) => {
    if (!confirm(`CRITICAL: Permanent disconnect of node ${id}?`)) return;
    db.deleteSupplier(id);
    setSuppliers(db.getAllSuppliers());
    addLog(`WARN: Node ${id} purged from registry by root.`);
  };

  if (selectedSupplier) {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
        <header className="space-y-6">
          <button 
            onClick={() => setSelectedSupplier(null)}
            className="flex items-center gap-3 text-stone-600 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Return to Studio Registry</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${
                    selectedSupplier.status === 'OPERATIONAL' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                    selectedSupplier.status === 'RESTRICTED' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                    'text-stone-500 border-white/10 bg-white/5'
                  }`}>
                    {selectedSupplier.status}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-800">Node_Inspection // {selectedSupplier.id}</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">
                {selectedSupplier.name.split('_')[0]} <span className="not-italic text-blue-500">{selectedSupplier.name.split('_')[1] || 'COLLECTIVE'}</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Resilience</p>
                  <p className="text-xl font-black text-blue-500">{selectedSupplier.resilienceScore}%</p>
               </div>
               <div className="h-10 w-px bg-white/5" />
               <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">Region</p>
                  <p className="text-xl font-black text-white">{selectedSupplier.region.toUpperCase()}</p>
               </div>
            </div>
          </div>
        </header>

        <section className="space-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-500 flex items-center gap-3">
                <Layers size={14} className="text-blue-500" /> Authorized Asset Portfolio
              </h3>
              <p className="text-[10px] font-bold text-stone-800 uppercase tracking-widest">Found: {supplierAssets.length} Nodes</p>
           </div>

           {supplierAssets.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierAssets.map(asset => (
                  <div key={asset.id} className="bg-[#0a0a0c] border border-white/5 p-6 rounded-sm group hover:border-blue-500/30 transition-all">
                     <div className="aspect-[3/4] overflow-hidden mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src={asset.assetName ? (asset as any).image : asset.image} alt={asset.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-blue-500/20" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <h4 className="text-lg font-black uppercase tracking-tighter text-white">{asset.name}</h4>
                              <p className="text-[8px] text-stone-600 uppercase font-black tracking-widest">{asset.category} // {asset.styleTag}</p>
                           </div>
                           <p className="text-sm font-bold text-blue-500">GH₵{asset.price}</p>
                        </div>
                        <p className="text-[10px] text-stone-500 font-serif italic line-clamp-2">"{asset.statement}"</p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                           <span className="text-[8px] font-black uppercase text-stone-800">STOCK: {asset.scarcityCount}</span>
                           <button className="text-[8px] font-black uppercase text-blue-500 hover:text-white transition-colors">Edit Asset</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm bg-white/[0.01]">
                <div className="p-6 rounded-full bg-white/[0.02] mb-6">
                  <Info size={32} className="text-stone-800" />
                </div>
                <p className="text-xs uppercase tracking-widest text-stone-600">No Assets Deployed</p>
                <p className="text-stone-500 text-xs mt-2 italic max-w-xs text-center">
                  This studio has not yet established any silhouettes within the collective registry.
                </p>
             </div>
           )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Factory size={16} className="text-blue-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Studio Registry // Supply_Network</p>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Studio <span className="not-italic text-blue-500">Registry</span></h1>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 transition-all flex items-center gap-4 rounded-sm shadow-2xl"
        >
          <Plus size={14} /> Onboard New Studio
        </button>
      </header>

      {/* Onboarding Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0D0D0F] border border-blue-500/20 p-12 max-w-2xl w-full relative shadow-2xl rounded-sm">
             <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-stone-600 hover:text-white transition-colors">
               <X size={24} />
             </button>

             <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-blue-500">
                  <Factory size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">
                  Establish New Node
                </h2>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8 font-mono">
                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Studio Handle</label>
                   <input 
                    required 
                    type="text" 
                    placeholder="e.g. THORN_WORKS"
                    className="w-full bg-black border border-white/10 p-5 text-white focus:border-blue-500 outline-none transition-all uppercase font-bold tracking-widest" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                   />
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Region Sector</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. NORTHERN_SPIRE"
                        className="w-full bg-black border border-white/10 p-5 text-white focus:border-blue-500 outline-none transition-all uppercase font-bold tracking-widest" 
                        value={formData.region} 
                        onChange={e => setFormData({...formData, region: e.target.value})} 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Design Specialty</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. MONOLITHIC_OUTERWEAR"
                        className="w-full bg-black border border-white/10 p-5 text-white focus:border-blue-500 outline-none transition-all uppercase font-bold tracking-widest" 
                        value={formData.specialty} 
                        onChange={e => setFormData({...formData, specialty: e.target.value})} 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Initial Status</label>
                    <select 
                      required
                      className="w-full bg-black border border-white/10 p-5 text-white focus:border-blue-500 outline-none transition-all uppercase font-bold tracking-widest appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as Supplier['status']})}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="OPERATIONAL">OPERATIONAL</option>
                      <option value="RESTRICTED">RESTRICTED</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Resilience Threshold ({formData.resilienceScore}%)</label>
                    <div className="h-full flex items-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="w-full accent-blue-500 bg-white/5 h-2 rounded-full appearance-none cursor-pointer" 
                        value={formData.resilienceScore} 
                        onChange={e => setFormData({...formData, resilienceScore: parseInt(e.target.value)})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                   <button type="submit" disabled={isProcessing} className="flex-1 bg-blue-600 text-white py-6 text-xs font-black uppercase tracking-[0.5em] hover:bg-blue-500 transition-all flex items-center justify-center gap-4">
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {isProcessing ? 'Verifying Node...' : 'Authorize Establishment'}
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="px-10 border border-white/10 text-stone-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em]"
                   >
                     Abort
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Studio Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Active Studios', value: suppliers.filter(s => s.status === 'OPERATIONAL').length, icon: Globe, color: 'text-blue-500' },
           { label: 'Network Health', value: '92.4%', icon: Activity, color: 'text-green-500' },
           { label: 'Supply Velocity', value: '14.2/wk', icon: Zap, color: 'text-amber-500' },
           { label: 'Risk Factor', value: 'Minimal', icon: ShieldAlert, color: 'text-stone-500' },
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-3 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start">
                <stat.icon size={14} className={stat.color} />
                <ArrowUpRight size={10} className="text-stone-800" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Main Table Interface */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#0a0a0c] p-6 border border-white/5 rounded-sm">
          <div className="relative w-full md:w-96 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder={`SEARCH STUDIO REGISTRY...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-blue-500/80 focus:border-blue-500 outline-none transition-all placeholder:text-stone-800 rounded-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-stone-600">
             <Filter size={14} />
             {['All Regions', 'Northern', 'Sect 4', 'Gated'].map(f => (
               <button key={f} className="hover:text-white transition-colors">{f}</button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-white/5 bg-[#020203] rounded-sm custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#0a0a0c] border-b border-white/10">
              <tr>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Studio Identity</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Region</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Specialty</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Resilience</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Status</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[10px]">
              {filteredSuppliers.map((s) => (
                <tr 
                  key={s.id} 
                  className="hover:bg-blue-500/[0.02] transition-colors group cursor-pointer"
                  onClick={() => setSelectedSupplier(s)}
                >
                  <td className="p-6 border-r border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black">
                        {s.name[0]}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-white uppercase tracking-widest">{s.name}</p>
                        <p className="text-[7px] text-stone-700 uppercase tracking-tighter">ID: {s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 border-r border-white/5 text-stone-400">{s.region.toUpperCase()}</td>
                  <td className="p-6 border-r border-white/5 text-stone-400">{s.specialty.toUpperCase()}</td>
                  <td className="p-6 border-r border-white/5">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[8px] font-bold uppercase">
                         <span className="text-stone-700">Sync</span>
                         <span className="text-blue-400">{s.resilienceScore}%</span>
                       </div>
                       <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500/40 transition-all duration-1000" style={{ width: `${s.resilienceScore}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="p-6 border-r border-white/5">
                    <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${
                      s.status === 'OPERATIONAL' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                      s.status === 'RESTRICTED' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                      'text-stone-500 border-white/10 bg-white/5'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => updateStatus(s.id, s.status === 'OPERATIONAL' ? 'RESTRICTED' : 'OPERATIONAL')} className="p-2 text-stone-600 hover:text-white transition-all" title="Toggle Restrictions"><Edit3 size={14} /></button>
                      <button onClick={() => deleteSupplier(s.id)} className="p-2 text-stone-600 hover:text-red-500 transition-all" title="Sever Node"><Trash2 size={14} /></button>
                      <button className="p-2 text-stone-600 hover:text-blue-400 transition-all"><MoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="p-8 border border-white/5 bg-[#0a0a0c] rounded-lg flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-800 group-hover:text-blue-500 transition-colors">
               <ShieldCheck size={32} strokeWidth={1} />
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Global Supply Compliance</h3>
               <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-md">
                  Studio nodes are automatically audited every 24 hours for material integrity and aesthetic alignment.
               </p>
            </div>
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="text-right">
               <p className="text-[8px] font-black uppercase text-stone-800 tracking-widest">Resonance Index</p>
               <p className="text-xl font-black text-blue-500">99.9%</p>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <button className="px-10 py-4 bg-white/5 border border-white/10 text-stone-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em]">
               Initialize Audit
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] pointer-events-none" />
      </footer>
    </div>
  );
};
