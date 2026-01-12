
import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  Zap, 
  Search, 
  X, 
  Save, 
  Maximize2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Activity
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { db } from '../services/database';

interface SupplierInventoryWorkspaceProps {
  products: Product[];
  onUpdate: () => void;
  addLog: (msg: string) => void;
}

export const SupplierInventoryWorkspace: React.FC<SupplierInventoryWorkspaceProps> = ({ products, onUpdate, addLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setShowForm(true);
  };

  const handleStatusChange = (product: Product, newStatus: ProductStatus) => {
    const updatedProduct = { ...product, status: newStatus };
    db.updateProduct(updatedProduct);
    addLog(`STUDIO_OPS: Asset [${product.name}] status recalibrated to ${newStatus}.`);
    onUpdate();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Layers size={16} className="text-blue-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Asset Management // local_registry</p>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Studio <span className="not-italic text-blue-500">Inventory</span></h1>
        </div>
        
        <button onClick={() => setShowForm(true)} className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 transition-all flex items-center gap-4 rounded-sm shadow-2xl">
          <Plus size={14} /> Register New Silhouette
        </button>
      </header>

      {/* Grid view of studio items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-[#0a0a0c] border border-white/5 p-8 rounded-lg group hover:border-blue-500/30 transition-all relative flex flex-col">
             <div className="aspect-[3/4] overflow-hidden rounded-sm bg-stone-900 mb-8 grayscale group-hover:grayscale-0 transition-all duration-700 relative shrink-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                
                {/* Floating controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => startEdit(p)} className="p-3 bg-black/80 backdrop-blur-md rounded-full text-white hover:text-blue-400 transition-colors">
                     <Edit3 size={16} />
                   </button>
                   <button className="p-3 bg-black/80 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>

                {/* Quick Status Pill */}
                <div className="absolute bottom-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${
                    p.status === 'DEPLOYED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                    p.status === 'RESTRICTED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                    'bg-white/5 text-stone-400 border-white/10'
                  }`}>
                    {p.status || 'DEPLOYED'}
                  </div>
                </div>
             </div>
             
             <div className="flex flex-col flex-1 gap-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase text-white tracking-tighter">{p.name}</h3>
                      <p className="text-[9px] text-stone-600 uppercase font-black tracking-widest">{p.category} // {p.mood}</p>
                   </div>
                   <p className="text-lg font-black text-blue-500">GH₵{p.price}</p>
                </div>

                {/* Deployment Status Control */}
                <div className="space-y-3">
                   <label className="text-[8px] uppercase font-black text-stone-700 tracking-[0.3em]">Deployment Protocol</label>
                   <div className="relative group/select">
                      <select 
                        value={p.status || 'DEPLOYED'}
                        onChange={(e) => handleStatusChange(p, e.target.value as ProductStatus)}
                        className={`w-full bg-black/40 border border-white/10 p-3 rounded-sm text-[9px] font-black uppercase tracking-widest cursor-pointer outline-none appearance-none hover:border-blue-500/30 transition-all ${
                          p.status === 'DEPLOYED' ? 'text-green-500' : 
                          p.status === 'ARCHIVED' ? 'text-stone-500' : 'text-red-500'
                        }`}
                      >
                        <option value="DEPLOYED">DEPLOYED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                        <option value="RESTRICTED">RESTRICTED</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-hover/select:opacity-60 transition-opacity" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-auto">
                   <div className="space-y-1">
                      <p className="text-[8px] uppercase font-black text-stone-800 tracking-widest">Active Stock</p>
                      <p className="text-sm font-black text-white">{p.scarcityCount} Units</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[8px] uppercase font-black text-stone-800 tracking-widest">Social Weight</p>
                      <p className="text-sm font-black text-stone-500">{p.socialCount}</p>
                   </div>
                </div>

                <button onClick={() => addLog(`INFO: Inspecting analytics for ${p.name}`)} className="w-full py-4 border border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-stone-700 hover:text-white transition-all group-hover:bg-white/[0.02] flex items-center justify-center gap-3">
                  <Activity size={12} /> Performance Metrics
                </button>
             </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="lg:col-span-3 py-40 text-center border border-dashed border-white/10 rounded-lg bg-white/[0.01]">
             <Layers size={48} className="mx-auto text-stone-900 mb-6" strokeWidth={1} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-700">No Silhouettes Established</p>
          </div>
        )}
      </div>

      <footer className="p-10 border border-white/5 bg-[#0a0a0c] rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-800 group-hover:text-blue-500 transition-colors">
               <AlertTriangle size={32} strokeWidth={1} />
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Stock Variance Detection</h3>
               <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-sm">
                  Automatic synchronization with logistic nodes occurs every 60 minutes.
               </p>
            </div>
         </div>
         <button className="px-10 py-5 bg-white/[0.03] border border-white/10 text-stone-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] rounded relative z-10 flex items-center gap-4">
            Initialize Stock Audit <ArrowRight size={14} />
         </button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
      </footer>
    </div>
  );
};
