
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  ShoppingCart, 
  Cpu, 
  Settings, 
  LogOut,
  Bell, 
  Search,
  ChevronRight,
  Activity,
  Globe,
  Maximize2,
  ShieldAlert,
  Zap,
  Radio,
  Command,
  Database,
  Hash,
  Share2,
  Menu,
  X,
  Inbox,
  MessageSquare,
  Table,
  Factory,
  Users,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DashboardWorkspace } from './DashboardWorkspace';
import { InventoryWorkspace } from './InventoryWorkspace';
import { OrdersWorkspace } from './OrdersWorkspace';
import { NeuralWorkspace } from './NeuralWorkspace';
import { SettingsWorkspace } from './SettingsWorkspace';
import { DiagnosticsWorkspace } from './DiagnosticsWorkspace';
import { RequestsWorkspace } from './RequestsWorkspace';
import { MessagesWorkspace } from './MessagesWorkspace';
import { DatabaseWorkspace } from './DatabaseWorkspace';
import { SuppliersWorkspace } from './SuppliersWorkspace';
import { UsersWorkspace } from './UsersWorkspace';
import { TerminalOutput } from './TerminalOutput';
import { Product, EngagementRequest, AppNotification, Order, OrderStatus } from '../types';

type Workspace = 'dashboard' | 'inventory' | 'orders' | 'neural' | 'settings' | 'diagnostics' | 'requests' | 'comms' | 'database' | 'suppliers' | 'users';

interface AdminPanelProps {
  products: Product[];
  requests: EngagementRequest[];
  notifications: AppNotification[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateRequestStatus: (id: string, status: EngagementRequest['status']) => void;
  onPurgeRequest: (id: string) => void;
  onAddNotification: (note: AppNotification) => void;
  onEditNotification: (note: AppNotification) => void;
  onDeleteNotification: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  requests, 
  notifications,
  orders,
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onUpdateRequestStatus, 
  onPurgeRequest,
  onAddNotification,
  onEditNotification,
  onDeleteNotification,
  onUpdateOrderStatus
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>('dashboard');
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Root access authorized.",
    "Bypassing standard firewalls...",
    "Syncing with Global Neural Cluster...",
    "Telemetry feed online."
  ]);
  const [uptime, setUptime] = useState(99.982);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const registryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => Math.min(100, prev + (Math.random() * 0.001 - 0.0005)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (registryRef.current && !registryRef.current.contains(event.target as Node)) {
        setIsRegistryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Hub', status: 'Optimal', hotkey: 'D' },
    { id: 'database', icon: Table, label: 'Cluster Explorer', status: 'Full Access', hotkey: 'B' },
    { id: 'users', icon: Users, label: 'Identity Registry', status: 'Monitored', hotkey: 'U' },
    { id: 'inventory', icon: Database, label: 'Asset Registry', status: 'Synced', hotkey: 'I' },
    { id: 'suppliers', icon: Factory, label: 'Studio Registry', status: 'Established', hotkey: 'S' },
    { id: 'orders', icon: ShoppingCart, label: 'Deployments', status: 'Live', hotkey: 'O' },
    { id: 'requests', icon: Inbox, label: 'Engagement Center', status: 'Inbound', hotkey: 'R' },
    { id: 'comms', icon: MessageSquare, label: 'Signal Dispatch', status: 'Active', hotkey: 'C' },
    { id: 'neural', icon: Cpu, label: 'Neural Core', status: 'Active', hotkey: 'N' },
    { id: 'diagnostics', icon: Radio, label: 'System Pulse', status: 'Scanning', hotkey: 'P' },
    { id: 'settings', icon: Settings, label: 'Root Config', status: 'Secure', hotkey: 'G' },
  ];

  const handleWorkspaceChange = (id: Workspace, label: string) => {
    setActiveWorkspace(id);
    addLog(`SYSTEM: Navigated to ${label}`);
    setIsMobileMenuOpen(false);
    setIsRegistryOpen(false);
  };

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard': return <DashboardWorkspace addLog={addLog} />;
      case 'database': return (
        <DatabaseWorkspace 
          products={products} 
          requests={requests} 
          notifications={notifications} 
          addLog={addLog}
          onDeleteProduct={onDeleteProduct}
          onDeleteRequest={onPurgeRequest}
          onDeleteNotification={onDeleteNotification}
        />
      );
      case 'users': return <UsersWorkspace addLog={addLog} />;
      case 'inventory': return <InventoryWorkspace addLog={addLog} products={products} onAdd={onAddProduct} onEdit={onEditProduct} onDelete={onDeleteProduct} />;
      case 'suppliers': return <SuppliersWorkspace addLog={addLog} />;
      case 'orders': return <OrdersWorkspace orders={orders} onUpdateStatus={onUpdateOrderStatus} addLog={addLog} />;
      case 'neural': return <NeuralWorkspace addLog={addLog} />;
      case 'diagnostics': return <DiagnosticsWorkspace addLog={addLog} />;
      case 'requests': return (
        <RequestsWorkspace 
          addLog={addLog} 
          requests={requests} 
          onUpdateStatus={onUpdateRequestStatus} 
          onPurge={onPurgeRequest}
        />
      );
      case 'comms': return (
        <MessagesWorkspace 
          addLog={addLog} 
          notifications={notifications} 
          onAdd={onAddNotification} 
          onEdit={onEditNotification} 
          onDelete={onDeleteNotification} 
        />
      );
      case 'settings': return <SettingsWorkspace addLog={addLog} />;
      default: return <DashboardWorkspace addLog={addLog} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020203] text-amber-400 font-mono flex selection:bg-amber-500/30 overflow-hidden z-[100]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative top-0 left-0 bottom-0 transition-all duration-500 ease-in-out border-r border-white/5 flex flex-col h-full bg-[#050507] z-[70] ${
        isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
      } ${isSidebarOpen && !isMobileMenuOpen ? 'lg:w-80' : 'lg:w-20'}`}>
        
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-6 right-6 p-2 text-stone-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-center shrink-0">
              <Command size={20} className="animate-pulse" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-lg font-black tracking-tighter text-white">OPS_CORE</h1>
                <p className="text-[7px] uppercase tracking-widest text-amber-500/40">v9.4.1-STABLE</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-2 hover:bg-white/5 rounded-md text-stone-600 hover:text-white transition-all"
          >
            <Hash size={14} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-800 px-4 mb-4 font-bold">Primary Protocols</p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleWorkspaceChange(item.id as Workspace, item.label)}
                className={`w-full flex items-center p-4 rounded-md transition-all group relative border ${
                  isActive 
                  ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'border-transparent text-stone-500 hover:bg-white/5 hover:text-amber-400'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <div className="flex-1 flex items-center justify-between ml-4 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                      <span className={`text-[7px] mt-1 uppercase font-bold ${isActive ? 'text-black/60' : 'text-stone-700'}`}>{item.status}</span>
                    </div>
                    <span className={`text-[8px] font-mono border rounded px-1.5 py-0.5 ${isActive ? 'border-black/20 text-black/40' : 'border-white/5 text-stone-800'}`}>
                      {item.hotkey}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="bg-white/[0.02] border border-white/5 rounded-md p-4 space-y-3">
               <div className="flex justify-between items-center text-[7px] uppercase tracking-widest text-stone-600 font-bold">
                 <span>Neural Synapse</span>
                 <span className="text-amber-500">92%</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500/40 transition-all duration-1000" style={{ width: '92%' }} />
               </div>
            </div>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className={`w-full p-4 flex items-center justify-center gap-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all text-[9px] font-black uppercase tracking-[0.3em] border border-transparent hover:border-red-500/20 group rounded-md ${
              !isSidebarOpen && !isMobileMenuOpen ? 'px-0' : ''
            }`}
          >
            <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
            {(isSidebarOpen || isMobileMenuOpen) && "Eject Session"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020203] relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-10 bg-black/60 backdrop-blur-2xl z-40">
          <div className="flex items-center gap-4 md:gap-10">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-500 hover:text-amber-400"
            >
              <Menu size={20} />
            </button>

            <div className="space-y-1">
              <h2 className="text-[8px] font-black uppercase tracking-[0.6em] text-stone-700">Environment</h2>
              <div className="flex items-center gap-3">
                 <span className="text-sm md:text-lg font-black text-white uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">{activeWorkspace}</span>
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Registry Dropdown (Protocol 'Drop Out') */}
            <div className="relative hidden md:block" ref={registryRef}>
               <button 
                 onClick={() => setIsRegistryOpen(!isRegistryOpen)}
                 className={`flex items-center gap-3 px-4 py-2.5 rounded-md border transition-all ${
                   isRegistryOpen ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/[0.02] border-white/5 text-stone-400 hover:text-white'
                 }`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Registry</span>
                 <ChevronDown size={14} className={`transition-transform duration-300 ${isRegistryOpen ? 'rotate-180' : ''}`} />
               </button>

               {isRegistryOpen && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-[#0d0d0f] border border-white/10 shadow-2xl rounded-sm py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                       <p className="text-[8px] font-black uppercase text-stone-700 tracking-[0.4em]">Core Clusters</p>
                    </div>
                    {[
                      { id: 'users', label: 'Identity Registry', icon: Users, desc: 'Identity & Status Management' },
                      { id: 'suppliers', label: 'Studio Registry', icon: Factory, desc: 'Production Node Controls' },
                      { id: 'inventory', label: 'Asset Registry', icon: Layers, desc: 'Silhouette & Stock Logic' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleWorkspaceChange(item.id as Workspace, item.label)}
                        className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all hover:bg-white/[0.03] group ${
                          activeWorkspace === item.id ? 'bg-white/[0.05]' : ''
                        }`}
                      >
                         <div className={`p-2 rounded border transition-colors ${
                           activeWorkspace === item.id ? 'border-amber-500/40 text-amber-500' : 'border-white/5 text-stone-700 group-hover:text-amber-500/60'
                         }`}>
                           <item.icon size={14} />
                         </div>
                         <div className="flex-1 overflow-hidden">
                           <p className={`text-[9px] font-black uppercase tracking-widest ${
                             activeWorkspace === item.id ? 'text-white' : 'text-stone-400 group-hover:text-white'
                           }`}>{item.label}</p>
                           <p className="text-[7px] text-stone-800 uppercase font-bold tracking-tighter truncate">{item.desc}</p>
                         </div>
                         <ArrowRight size={10} className="text-stone-900 group-hover:text-amber-500 transition-colors" />
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="relative group hidden md:block">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-700 group-hover:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="PROMPT COMMAND..."
                className="bg-white/5 border border-white/5 rounded-md pl-12 pr-6 py-2.5 text-[9px] w-48 lg:w-64 focus:outline-none focus:border-amber-500/40 transition-all placeholder:text-stone-800 uppercase font-bold tracking-widest"
              />
            </div>
            
            <div className="h-8 w-px bg-white/5 hidden md:block" />
            
            <div className="flex items-center gap-2 md:gap-3">
              <button className="relative p-2 md:p-2.5 bg-white/[0.02] border border-white/5 text-stone-600 hover:text-amber-400 hover:border-amber-500/20 rounded-md transition-all group">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              </button>
              <button className="p-2 md:p-2.5 bg-white/[0.02] border border-white/5 text-stone-600 hover:text-white rounded-md transition-all">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 bg-[#020203]">
          <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {renderWorkspace()}
            </div>
            
            <div className="pt-10 md:pt-16 border-t border-white/5 mt-8 md:mt-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 px-2 gap-4">
                 <div className="flex items-center gap-3">
                   <Zap size={14} className="text-amber-500" />
                   <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-700">Protocol Stream // node_01</h3>
                 </div>
                 <div className="flex items-center gap-4 md:gap-6">
                    <span className="text-[8px] font-mono text-stone-800">Buffer: 9942/10000</span>
                    <div className="h-3 w-px bg-white/10" />
                    <span className="text-[8px] font-mono text-amber-500/40 uppercase">RSA-4096_GCM</span>
                 </div>
              </div>
              <TerminalOutput logs={logs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
