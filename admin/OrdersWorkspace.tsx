
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  ShieldCheck,
  User,
  History,
  ChevronDown
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { db } from '../services/database';

interface OrdersWorkspaceProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  addLog: (msg: string) => void;
}

export const OrdersWorkspace: React.FC<OrdersWorkspaceProps> = ({ orders, onUpdateStatus, addLog }) => {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  
  const filteredOrders = useMemo(() => {
    return orders.filter(o => filter === 'All' || o.status === filter);
  }, [orders, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-amber-500';
      case 'Deployed': return 'text-blue-400';
      case 'Received': return 'text-green-400';
      case 'Archived': return 'text-stone-500';
      default: return 'text-amber-500/40';
    }
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    onUpdateStatus(id, status);
    addLog(`SECURITY: Deployment ${id} protocol recalibrated to status [${status}].`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] italic text-white">Deployment Feed</h1>
          <p className="text-amber-500/40 text-[10px] uppercase tracking-widest font-mono">// Global Transaction Monitoring Node</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 rounded-sm">
            <History size={14} /> Total Deployments: {orders.length}
          </div>
        </div>
      </header>

      {/* Deployments Table */}
      <section className="space-y-6">
        <div className="flex items-center justify-between bg-amber-500/5 p-4 border border-amber-500/10">
          <div className="flex flex-wrap items-center gap-4 text-amber-500/60">
            <Filter size={16} className="hidden sm:block" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Status Lens:</span>
            {['All', 'Processing', 'Deployed', 'Received', 'Archived'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 border border-amber-500/10 hover:border-amber-500/30 text-[9px] uppercase tracking-widest transition-all ${filter === f ? 'bg-amber-500 text-black border-amber-500' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-amber-500/10 bg-black shadow-2xl custom-scrollbar">
          <table className="w-full text-left text-[11px] min-w-[1000px]">
            <thead>
              <tr className="bg-amber-500/10 border-b border-amber-500/20">
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">TX_ID</th>
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">Items Cluster</th>
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">Date Node</th>
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">Valuation</th>
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">Status Protocol</th>
                <th className="p-6 uppercase tracking-widest text-amber-500/40 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-amber-500/5 transition-colors group">
                  <td className="p-6 font-mono text-amber-500">#{order.id}</td>
                  <td className="p-6">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-black bg-stone-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-black bg-stone-800 text-[8px] font-bold text-amber-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-[7px] text-stone-700 uppercase mt-2 font-bold tracking-widest">{order.items.length} Silhouettes</p>
                  </td>
                  <td className="p-6 font-mono text-amber-500/60 uppercase">{order.date}</td>
                  <td className="p-6 font-mono font-bold text-white">GH₵{order.total.toLocaleString()}</td>
                  <td className="p-6">
                    <div className="relative inline-block w-40">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`w-full bg-black/40 border border-white/10 p-2.5 text-[9px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer group-hover:border-amber-500/40 transition-all ${getStatusColor(order.status)}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Deployed">Deployed</option>
                        <option value="Received">Received</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => addLog(`Inspecting deployment logs for ${order.id}...`)}
                        className="p-2 border border-amber-500/10 hover:bg-amber-500/10 text-amber-500/60 transition-all rounded-sm"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 border border-white/5 text-stone-700 hover:text-white transition-all rounded-sm">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p-10 border border-amber-500/10 bg-[#080808] flex flex-col md:flex-row items-center justify-between rounded-sm gap-8">
        <div className="flex items-center gap-6">
           <ShieldCheck size={32} className="text-amber-500/40 hidden sm:block" />
           <div className="space-y-1">
             <h3 className="text-sm font-bold uppercase tracking-widest text-white">Transaction Security Node</h3>
             <p className="text-[10px] text-stone-600 uppercase tracking-widest">All deployments are verified via RSA-4096 neural handshake.</p>
           </div>
        </div>
        <button className="w-full md:w-auto px-8 py-4 border border-amber-500/20 text-amber-500/60 hover:text-amber-500 hover:border-amber-500 transition-all text-[9px] font-bold uppercase tracking-widest rounded-sm">
          Verify Registry Integrity
        </button>
      </section>
    </div>
  );
};
