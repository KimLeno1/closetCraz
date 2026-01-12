
import React, { useState, useEffect } from 'react';
import { 
  Factory, 
  LayoutDashboard, 
  Layers, 
  Inbox, 
  FlaskConical, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Activity, 
  Zap, 
  Globe, 
  Cpu, 
  Command, 
  ChevronRight, 
  Menu, 
  X, 
  Clock,
  ShieldCheck,
  Binary
} from 'lucide-react';
import { SupplierOverviewWorkspace } from './SupplierOverviewWorkspace';
import { SupplierInventoryWorkspace } from './SupplierInventoryWorkspace';
import { RequestsWorkspace } from './RequestsWorkspace';
import { SupplyPanel } from '../components/SupplyPanel';
import { TerminalOutput } from './TerminalOutput';
import { Product, EngagementRequest, Supplier } from '../types';
import { db } from '../services/database';

type SupplierWorkspace = 'overview' | 'assets' | 'requests' | 'lab' | 'settings';

export const SupplierDashboard: React.FC = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<SupplierWorkspace>('overview');
  const [logs, setLogs] = useState<string[]>([
    "Studio node handshake established.",
    "Bypassing neural uplink...",
    "Syncing production capacity with Global Registry.",
    "Operational status: VALIDATED."
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock current supplier - in real app, this comes from auth context
  const [currentStudio] = useState<Supplier>(() => db.getAllSuppliers()[0]);
  const [studioProducts, setStudioProducts] = useState<Product[]>(() => 
    db.getAllProducts().filter(p => p.supplierId === currentStudio.id)
  );

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  // Sync products when needed
  const refreshStudioProducts = () => {
    setStudioProducts(db.getAllProducts().filter(p => p.supplierId === currentStudio.id));
  };

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Studio Hub', status: 'Optimal' },
    { id: 'assets', icon: Layers, label: 'Asset Registry', status: 'Synced' },
    { id: 'requests', icon: Inbox, label: 'Inbound Feed', status: 'Active' },
    { id: 'lab', icon: FlaskConical, label: 'R&D Lab', status: 'Researching' },
    { id: 'settings', icon: Settings, label: 'Node Config', status: 'Secure' },
  ];

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'overview': 
        return <SupplierOverviewWorkspace studio={currentStudio} products={studioProducts} addLog={addLog} />;
      case 'assets': 
        return (
          <SupplierInventoryWorkspace 
            products={studioProducts} 
            onUpdate={refreshStudioProducts}
            addLog={addLog} 
          />
        );
      case 'requests': 
        return (
          <RequestsWorkspace 
            requests={db.getAllRequests().filter(r => r.origin === currentStudio.name || r.type === 'SUPPLY')} 
            onUpdateStatus={(id, status) => {
              db.updateRequestStatus(id, status);
              addLog(`STUDIO_OPS: Request ${id} status modified to ${status}.`);
            }}
            onPurge={(id) => {
              db.purgeRequest(id);
              addLog(`STUDIO_OPS: Request ${id} purged from studio feed.`);
            }}
            addLog={addLog}
          />
        );
      case 'lab': 
        return <SupplyPanel />; 
      case 'settings':
        return (
          <div className="py-20 text-center opacity-30">
            <Settings size={48} className="mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Node Configuration // Locked</p>
          </div>
        );
      default: 
        return <SupplierOverviewWorkspace studio={currentStudio} products={studioProducts} addLog={addLog} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020203] text-blue-400 font-mono flex selection:bg-blue-500/30 overflow-hidden z-[100]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed lg:relative top-0 left-0 bottom-0 transition-all duration-500 ease-in-out border-r border-white/5 flex flex-col h-full bg-[#050507] z-[70] ${
        isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
      } ${isSidebarOpen && !isMobileMenuOpen ? 'lg:w-80' : 'lg:w-20'}`}>
        
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center justify-center shrink-0">
              <Factory size={20} className="animate-pulse" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-lg font-black tracking-tighter text-white uppercase">Studio_Ops</h1>
                <p className="text-[7px] uppercase tracking-widest text-blue-500/40">NODE_{currentStudio.id}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveWorkspace(item.id as SupplierWorkspace); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center p-4 rounded-md transition-all group border ${
                  isActive 
                  ? 'bg-blue-500 text-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'border-transparent text-stone-500 hover:bg-white/5 hover:text-blue-400'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <div className="ml-4 text-left animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest block">{item.label}</span>
                    <span className={`text-[7px] uppercase font-bold ${isActive ? 'text-black/60' : 'text-stone-700'}`}>{item.status}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => window.location.reload()}
            className="w-full p-4 flex items-center justify-center gap-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black uppercase tracking-[0.3em] border border-transparent hover:border-red-500/20 rounded-md"
          >
            <LogOut size={14} />
            {(isSidebarOpen || isMobileMenuOpen) && "Sever Link"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020203] relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-black/60 backdrop-blur-2xl z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-stone-500 hover:text-blue-400">
              <Menu size={20} />
            </button>
            <div className="space-y-1">
              <h2 className="text-[8px] font-black uppercase tracking-[0.6em] text-stone-700">Studio Context</h2>
              <div className="flex items-center gap-3">
                 <span className="text-sm md:text-lg font-black text-white uppercase tracking-tighter truncate">{currentStudio.name}</span>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-700 group-hover:text-blue-500 transition-colors" />
              <input type="text" placeholder="STUDIO QUERY..." className="bg-white/5 border border-white/5 rounded-md pl-12 pr-6 py-2.5 text-[9px] w-48 lg:w-64 focus:outline-none focus:border-blue-500/40 transition-all placeholder:text-stone-800 uppercase font-bold tracking-widest" />
            </div>
            <button className="relative p-2.5 bg-white/[0.02] border border-white/5 text-stone-600 hover:text-blue-400 rounded-md transition-all">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#020203]">
          <div className="max-w-[1400px] mx-auto space-y-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderWorkspace()}
            </div>
            
            <div className="pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={14} className="text-blue-500" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-700">Studio Signal Log</h3>
              </div>
              <TerminalOutput logs={logs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
