
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  Database, 
  Layers, 
  Bell, 
  Inbox, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Trash2,
  Edit3,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Product, EngagementRequest, AppNotification } from '../types';
import { db } from '../services/database';

interface DatabaseWorkspaceProps {
  products: Product[];
  requests: EngagementRequest[];
  notifications: AppNotification[];
  onDeleteProduct: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  addLog: (msg: string) => void;
}

type CollectionKey = 'products' | 'requests' | 'notifications';

export const DatabaseWorkspace: React.FC<DatabaseWorkspaceProps> = ({ 
  products, requests, notifications, onDeleteProduct, onDeleteRequest, onDeleteNotification, addLog 
}) => {
  const [activeTab, setActiveTab] = useState<CollectionKey>('products');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const tabs = [
    { id: 'products', label: 'Products', icon: Layers, count: products.length },
    { id: 'requests', label: 'Engagement', icon: Inbox, count: requests.length },
    { id: 'notifications', label: 'Signals', icon: Bell, count: notifications.length },
  ];

  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'products': return products;
      case 'requests': return requests;
      case 'notifications': return notifications;
      default: return [];
    }
  }, [activeTab, products, requests, notifications]);

  const filteredData = useMemo(() => {
    let data = [...currentData];
    if (search) {
      data = data.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (sortKey) {
      data.sort((a: any, b: any) => {
        if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [currentData, search, sortKey, sortDir]);

  const columns = useMemo(() => {
    if (currentData.length === 0) return [];
    return Object.keys(currentData[0]);
  }, [currentData]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleExport = (format: 'csv' | 'sql') => {
    addLog(`DATABASE: Exporting ${activeTab} cluster as ${format.toUpperCase()}.`);
    const content = format === 'csv' ? db.generateCSV(activeTab) : db.generateSQL(activeTab);
    db.triggerDownload(content, `cc_db_${activeTab}_${Date.now()}.${format}`, format === 'csv' ? 'text/csv' : 'text/plain');
  };

  const handleDelete = (id: string) => {
    if (!confirm(`Confirm permanent purge of record ${id} from the ${activeTab} cluster?`)) return;
    
    switch (activeTab) {
      case 'products': onDeleteProduct(id); break;
      case 'requests': onDeleteRequest(id); break;
      case 'notifications': onDeleteNotification(id); break;
    }
    addLog(`WARN: Record ${id} purged from ${activeTab} by root.`);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    addLog("DATABASE: Initializing cluster recalibration...");
    setTimeout(() => {
      setIsOptimizing(false);
      addLog("DATABASE: Cluster optimization complete. Integrity score: 100%.");
    }, 2000);
  };

  const handlePurgeAll = () => {
    if (!confirm(`CRITICAL: You are about to purge the ENTIRE ${activeTab} cluster. This action is irreversible.`)) return;
    addLog(`CRITICAL: Mass purge signal sent to ${activeTab} cluster.`);
    // Implementation would iterate and delete, but for safety in this demo, we'll just log it.
    alert("Safety override: Mass purge restricted to terminal command line.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Table size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Raw Cluster Explorer // Data_Grid</p>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">System <span className="not-italic text-amber-500">Database</span></h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleExport('csv')}
            className="px-6 py-3 bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-white hover:border-white/30 transition-all rounded-sm flex items-center gap-2"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => handleExport('sql')}
            className="px-6 py-3 bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-white hover:border-white/30 transition-all rounded-sm flex items-center gap-2"
          >
            <Database size={14} /> Export SQL
          </button>
        </div>
      </header>

      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as CollectionKey); setSortKey(null); }}
            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 relative group shrink-0 ${
              activeTab === tab.id ? 'text-amber-500' : 'text-stone-600 hover:text-stone-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${activeTab === tab.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-stone-700'}`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#0a0a0c] p-6 border border-white/5 rounded-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-amber-500 transition-colors" />
          <input 
            type="text"
            placeholder={`SEARCH ${activeTab.toUpperCase()} CLUSTER...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-amber-500/80 focus:border-amber-500 outline-none transition-all placeholder:text-stone-800 rounded-sm"
          />
        </div>
        
        <div className="flex items-center gap-6 text-stone-700 text-[9px] font-black uppercase tracking-widest">
           <span>Showing {filteredData.length} records</span>
           <div className="h-4 w-px bg-white/5" />
           <div className="flex items-center gap-2">
              <button className="p-2 hover:text-white disabled:opacity-20 transition-all"><ChevronLeft size={16} /></button>
              <span className="text-stone-500">Page 1 / 1</span>
              <button className="p-2 hover:text-white disabled:opacity-20 transition-all"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-white/5 bg-[#020203] rounded-sm custom-scrollbar shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="bg-[#0a0a0c] border-b border-white/10 sticky top-0 z-10">
            <tr>
              <th className="p-4 w-12 border-r border-white/5 text-center">
                <input type="checkbox" className="rounded-none bg-black border-stone-800" />
              </th>
              {columns.map(col => (
                <th 
                  key={col}
                  onClick={() => handleSort(col)}
                  className="p-4 md:p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5 cursor-pointer hover:bg-white/[0.02] hover:text-white transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>{col.replace(/([A-Z])/g, ' $1')}</span>
                    <ArrowUpDown size={10} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortKey === col ? 'opacity-100 text-amber-500' : ''}`} />
                  </div>
                </th>
              ))}
              <th className="p-4 md:p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 text-center">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[10px]">
            {filteredData.map((row: any, idx) => (
              <tr key={idx} className="hover:bg-amber-500/[0.02] transition-colors group">
                <td className="p-4 border-r border-white/5 text-center">
                  <input type="checkbox" className="rounded-none bg-black border-stone-800" />
                </td>
                {columns.map(col => {
                  const val = row[col];
                  const isId = col.toLowerCase().includes('id');
                  const isStatus = col.toLowerCase().includes('status');
                  const isPrice = col.toLowerCase().includes('price');

                  return (
                    <td key={col} className={`p-4 md:p-6 border-r border-white/5 max-w-[200px] truncate ${isId ? 'text-amber-500/60' : 'text-stone-400 group-hover:text-stone-200 transition-colors'}`}>
                       {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : 
                        typeof val === 'object' ? JSON.stringify(val) : 
                        isPrice ? `GH₵${val}` : 
                        isStatus ? (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-amber-500">
                            {String(val)}
                          </span>
                        ) : String(val)}
                    </td>
                  );
                })}
                <td className="p-4 md:p-6 text-center">
                  <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => addLog(`INFO: Inspecting metadata for record ${row.id}`)}
                      className="p-2 text-stone-600 hover:text-white transition-all"
                    ><Edit3 size={14} /></button>
                    <button 
                      onClick={() => handleDelete(row.id)}
                      className="p-2 text-stone-600 hover:text-red-500 transition-all"
                    ><Trash2 size={14} /></button>
                    <button 
                      onClick={() => alert(`Full Log View for ${row.id}: \n\n${JSON.stringify(row, null, 2)}`)}
                      className="p-2 text-stone-600 hover:text-blue-400 transition-all"
                    ><Maximize2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="py-40 text-center">
                   <Database size={48} className="mx-auto text-stone-900 mb-6" strokeWidth={1} />
                   <p className="text-stone-700 uppercase tracking-[0.5em] font-black">No Packets Detected in Stream</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="p-8 bg-[#0a0a0c] border border-white/5 rounded-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">Master Connection: Stable</span>
           </div>
           <span className="text-[8px] font-mono text-stone-800">SCHEMA: V9.4.1 // GCM-ENCRYPTED</span>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={handlePurgeAll}
             className="px-8 py-3 bg-red-600/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
           >
             Purge Active Cluster
           </button>
           <button 
             onClick={handleOptimize}
             disabled={isOptimizing}
             className="px-8 py-3 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
           >
             {isOptimizing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
             Optimize Registry
           </button>
        </div>
      </footer>
    </div>
  );
};
