
import React, { useState } from 'react';
import { 
  Database, 
  Trash2, 
  Edit3, 
  Plus, 
  Filter,
  AlertTriangle,
  Download,
  X,
  Save,
  PenTool,
  Cpu, 
  Globe,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Product, CategoryType, StyleType, EmotionType, ProductStatus } from '../types';
import { AssetSynthesizer } from './AssetSynthesizer';
import { db } from '../services/database';

interface InventoryWorkspaceProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  addLog: (msg: string) => void;
}

export const InventoryWorkspace: React.FC<InventoryWorkspaceProps> = ({ 
  products, onAdd, onEdit, onDelete, addLog 
}) => {
  const [showSynthesizer, setShowSynthesizer] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [surgeActive, setSurgeActive] = useState(false);

  const initialFormState: Partial<Product> = {
    name: '',
    description: '',
    statement: '',
    price: 0,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    mood: 'Luxe',
    scarcityCount: 10,
    socialCount: 0,
    fitConfidence: 90,
    category: 'Apparel',
    styleTag: 'Minimal',
    emotionTag: 'Confidence',
    origin: 'admin',
    status: 'DEPLOYED'
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEdit({ ...editingProduct, ...formData } as Product);
      addLog(`ADMIN: Updated asset [${formData.name}] in registry.`);
    } else {
      const newId = `new-${Date.now()}`;
      onAdd({ ...formData, id: newId } as Product);
      addLog(`ADMIN: Committed new asset [${formData.name}] to registry.`);
    }
    resetForm();
  };

  const handleStatusChange = (product: Product, newStatus: ProductStatus) => {
    onEdit({ ...product, status: newStatus });
    addLog(`PROTOCOL: Asset [${product.name}] deployment recalibrated to ${newStatus}.`);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowManualForm(false);
  };

  const startEdit = (p: Product) => {
    setFormData(p);
    setEditingProduct(p);
    setShowManualForm(true);
  };

  const handleCsvExport = () => {
    addLog("EXTRACTION: Generating asset registry snapshot (CSV).");
    const csv = db.generateCSV('products');
    db.triggerDownload(csv, `cc_inventory_${Date.now()}.csv`, 'text/csv');
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter italic text-white">Asset <span className="text-amber-500 not-italic">Registry</span></h1>
          <p className="text-amber-500/40 text-[10px] uppercase tracking-widest font-mono">// Master Inventory Management Terminal</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => { setShowManualForm(true); setShowSynthesizer(false); }}
            className="px-6 md:px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center justify-center gap-3 rounded-sm"
          >
            <Plus size={14} /> Add Manual Asset
          </button>
          <button 
            onClick={() => { setShowSynthesizer(!showSynthesizer); setShowManualForm(false); }}
            className="px-6 md:px-8 py-4 border border-amber-500/20 text-amber-500/60 hover:border-amber-500 transition-all flex items-center justify-center gap-3 rounded-sm"
          >
            <Cpu size={14} /> AI Synthesis
          </button>
        </div>
      </header>

      {/* Manual Add/Edit Form Overlay */}
      {showManualForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0D0D0F] border border-amber-500/20 p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl rounded-sm">
             <button onClick={resetForm} className="absolute top-6 right-6 text-stone-600 hover:text-white transition-colors">
               <X size={24} />
             </button>
             
             <div className="flex items-center gap-4 mb-10 text-amber-500">
                <PenTool size={24} />
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                  {editingProduct ? 'Edit Asset Data' : 'New Asset Protocol'}
                </h2>
             </div>

             <form onSubmit={handleFormSubmit} className="space-y-8 font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Asset Designation</label>
                      <input required type="text" className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Valuation (GH₵)</label>
                      <input required type="number" className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Category</label>
                      <select className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as CategoryType})}>
                         <option value="Apparel">Apparel</option>
                         <option value="Outerwear">Outerwear</option>
                         <option value="Footwear">Footwear</option>
                         <option value="Accessories">Accessories</option>
                         <option value="Jewelry">Jewelry</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Initial Scarcity</label>
                      <input required type="number" className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all" value={formData.scarcityCount} onChange={e => setFormData({...formData, scarcityCount: parseInt(e.target.value)})} />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Aesthetic Statement</label>
                   <input required type="text" className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all italic" placeholder='"Absolute dominance through silence."' value={formData.statement} onChange={e => setFormData({...formData, statement: e.target.value})} />
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Architectural Dossier (Description)</label>
                   <textarea rows={3} className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all text-sm leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] uppercase font-black text-stone-600 tracking-widest">Asset Visual Node (Image URL)</label>
                   <input required type="text" className="w-full bg-black border border-white/10 p-4 text-white focus:border-amber-500 outline-none transition-all text-xs" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>

                <div className="pt-6 flex gap-4">
                   <button type="submit" className="flex-1 bg-amber-500 text-black py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-4">
                      <Save size={16} /> {editingProduct ? 'Update Registry' : 'Commit to Archive'}
                   </button>
                   <button type="button" onClick={resetForm} className="px-8 border border-white/10 text-stone-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em]">
                      Abort
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {showSynthesizer && (
        <div className="animate-in slide-in-from-top-4 duration-500 bg-[#0A0A0C] p-8 border border-amber-500/10 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Neural Synthesis Workbench</h2>
            <button onClick={() => setShowSynthesizer(false)}><X size={16} /></button>
          </div>
          <AssetSynthesizer onDeploy={(asset) => {
            const finalAsset = {
              ...asset,
              id: `syn-${Date.now()}`,
              image: 'https://images.unsplash.com/photo-1544022613-e87cd75a7846?q=80&w=1000&auto=format&fit=crop',
              mood: 'Luxe',
              scarcityCount: 5,
              socialCount: 0,
              fitConfidence: 98,
              category: 'Outerwear',
              styleTag: asset.style as StyleType || 'Minimal',
              emotionTag: 'Confidence',
              origin: 'admin',
              status: 'DEPLOYED'
            };
            onAdd(finalAsset as Product);
            addLog(`Asset [${asset.name}] synthesized and committed to registry.`);
            setShowSynthesizer(false);
          }} />
        </div>
      )}

      {/* Registry Database */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-amber-500/5 p-5 border border-amber-500/10 gap-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-amber-500/60">
            <Filter size={16} className="hidden sm:block" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Lenses:</span>
            {['All', 'Admin', 'Supplier'].map(f => (
              <button key={f} className="px-3 py-1 border border-amber-500/10 hover:border-amber-500/40 text-[9px] uppercase tracking-widest transition-all">
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={handleCsvExport}
            className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-amber-500/40 hover:text-amber-500 transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto border border-amber-500/10 bg-black shadow-2xl custom-scrollbar">
          <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-amber-500/10 border-b border-amber-500/20">
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold border-r border-amber-500/10">ID</th>
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold border-r border-amber-500/10">Deployment Status</th>
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold border-r border-amber-500/10">Asset Designation</th>
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold border-r border-amber-500/10">Valuation</th>
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold border-r border-amber-500/10">Scarcity</th>
                <th className="p-4 md:p-6 uppercase tracking-widest text-amber-500/40 font-bold">Protocols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-amber-500/[0.03] transition-colors group">
                  <td className="p-4 md:p-6 text-amber-500/30 font-mono border-r border-amber-500/10">#{p.id.substring(0, 5)}</td>
                  <td className="p-4 md:p-6 border-r border-amber-500/10">
                    <div className="relative inline-block w-full">
                      <select 
                        value={p.status || 'DEPLOYED'}
                        onChange={(e) => handleStatusChange(p, e.target.value as ProductStatus)}
                        className={`w-full bg-black/40 border border-white/5 p-2 rounded-sm text-[8px] font-black uppercase tracking-widest cursor-pointer outline-none appearance-none hover:border-amber-500/30 transition-all ${
                          p.status === 'DEPLOYED' ? 'text-green-500' : 
                          p.status === 'ARCHIVED' ? 'text-stone-500' : 'text-red-500'
                        }`}
                      >
                        <option value="DEPLOYED">DEPLOYED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                        <option value="RESTRICTED">RESTRICTED</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30" />
                    </div>
                  </td>
                  <td className="p-4 md:p-6 border-r border-amber-500/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-12 bg-stone-900 border border-amber-500/10 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                         <img src={p.image} className="w-full h-full object-cover opacity-60" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold uppercase tracking-widest text-white">{p.name}</p>
                        <p className="text-[9px] text-stone-600 uppercase tracking-tighter truncate max-w-[120px]">{p.category} // {p.mood}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:p-6 font-mono text-amber-500/80 border-r border-amber-500/10">GH₵{p.price.toLocaleString()}</td>
                  <td className="p-4 md:p-6 border-r border-amber-500/10 font-mono text-stone-500">
                    {p.scarcityCount} Units
                  </td>
                  <td className="p-4 md:p-6">
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(p)}
                        className="p-2 border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2 text-[9px] font-black uppercase"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                           if(confirm(`Are you sure you want to purge ${p.name}?`)) {
                             onDelete(p.id);
                             addLog(`WARN: Asset [${p.name}] purged from registry by root.`);
                           }
                        }}
                        className="p-2 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-[9px] font-black uppercase"
                      >
                        <Trash2 size={14} /> Purge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p-6 md:p-10 border border-amber-500/10 bg-[#080808] flex flex-col md:flex-row items-center justify-between rounded-sm gap-8">
        <div className="flex items-center gap-4 md:gap-8 text-center md:text-left">
           <Database size={32} className="text-stone-800 hidden sm:block" />
           <div className="space-y-1">
             <h3 className="text-sm font-bold uppercase tracking-widest text-white">Registry Stability: HIGH</h3>
             <p className="text-[10px] text-stone-600 uppercase tracking-widest">Total Nodes: {products.length} // Cross-Origin Sync: Active</p>
           </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setSurgeActive(!surgeActive)}
             className={`px-8 py-4 border transition-all text-[9px] font-bold uppercase tracking-widest ${surgeActive ? 'bg-red-600 text-white border-red-600' : 'border-amber-500/20 text-amber-500/60 hover:border-amber-500'}`}
           >
             {surgeActive ? 'SURGE: ON' : 'Toggle Global Surge'}
           </button>
        </div>
      </section>
    </div>
  );
};
