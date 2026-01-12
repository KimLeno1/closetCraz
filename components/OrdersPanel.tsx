
import React, { useState } from 'react';
import { Order, UserStatus } from '../types';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  History, 
  Cpu, 
  Sparkles, 
  Loader2, 
  Timer, 
  Share2, 
  Send,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getBroadcastManifesto } from '../services/geminiService';

interface OrdersPanelProps {
  orders: Order[];
  userStatus: UserStatus;
}

export const OrdersPanel: React.FC<OrdersPanelProps> = ({ orders, userStatus }) => {
  const [legacyAnalysis, setLegacyAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const analyzeLegacy = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const itemsList = orders.flatMap(o => o.items.map(i => i.name)).join(', ');
      const prompt = `Based on these past fashion acquisitions: ${itemsList}, define the user's "Style Archetype" in 15 words. Use technical, high-fashion vocabulary (e.g., Brutalist, Avant-garde, Architectural).`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setLegacyAnalysis(response.text);
    } catch (err) {
      setLegacyAnalysis("Your trajectory suggests a deliberate mastery of minimalist form and high-stakes silhouette control.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBroadcast = async (order: Order) => {
    setSharingId(order.id);
    const itemsList = order.items.map(i => i.name).join(', ');
    
    try {
      const manifesto = await getBroadcastManifesto(itemsList, userStatus);
      const shareData = {
        title: 'Closet Craze // Identity Deployment',
        text: manifesto,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${manifesto}\n\nSynced via Closet Craze: ${window.location.href}`);
        alert("Broadcast script copied to neural interface. Ready for external network injection.");
      }
    } catch (err) {
      console.error("Broadcast failed", err);
    } finally {
      setSharingId(null);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 'text-amber-500';
      case 'Deployed': return 'text-blue-400';
      case 'Received': return 'text-green-400';
      default: return 'text-stone-500';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 md:px-24 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-20 border-b border-white/5 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <History size={16} className="text-stone-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Log: Acquisition History</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif">Deployment Record</h2>
          <p className="text-stone-400 font-light mt-6 max-w-lg leading-relaxed">
            A chronological history of your identity reinforcements. Each acquisition contributes to your global status and aesthetic legacy.
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
            <Package size={40} className="mx-auto text-stone-800 mb-6" strokeWidth={1} />
            <p className="text-stone-600 uppercase tracking-[0.3em] text-xs">No Records Found</p>
            <p className="text-stone-400 mt-4 font-light">Commit your first acquisition to begin your record.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Legacy Analysis Section */}
            <div className="bg-[#0D0D0D] border border-white/5 p-10 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
                <Cpu size={120} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-stone-500 flex items-center gap-3">
                    <Sparkles size={14} className="text-amber-500" /> Identity Synthesis
                  </h4>
                  <p className="text-2xl font-serif italic text-white max-w-xl">
                    {legacyAnalysis || "Synthesize your acquisition history to reveal your evolving aesthetic archetype."}
                  </p>
                </div>
                <button 
                  onClick={analyzeLegacy}
                  disabled={isAnalyzing}
                  className="whitespace-nowrap bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-3"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Cpu size={14} />}
                  Run Legacy Analysis
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-12">
              {orders.map((order) => (
                <div key={order.id} className="group p-8 bg-white/[0.01] border border-white/5 rounded-sm hover:border-white/10 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500">Transaction ID: {order.id.toUpperCase()}</p>
                        {order.orderType === 'Pre-order' && (
                          <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                            <Timer size={10} /> Archival Pre-order
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-serif">{order.date}</h3>
                    </div>
                    <div className="flex items-center gap-8 md:gap-12">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Status</p>
                        <p className={`text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Value</p>
                        <p className="text-xl font-serif italic">GH₵{order.total.toLocaleString()}</p>
                      </div>
                      
                      {/* BROADCAST BUTTON */}
                      <button 
                        onClick={() => handleBroadcast(order)}
                        disabled={sharingId === order.id}
                        className="flex flex-col items-center gap-2 text-stone-500 hover:text-white transition-all group/share"
                      >
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/share:bg-white group-hover/share:text-black transition-all">
                          {sharingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover/share:opacity-100 transition-opacity">Broadcast</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center p-4 bg-white/[0.02] border border-transparent hover:border-white/10 transition-colors">
                        <div className="w-16 h-20 bg-stone-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h5 className="text-sm font-medium text-stone-200">{item.name}</h5>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">GH₵{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipment Tracking Progress (Minimalist) */}
                  <div className="mt-12 px-2 space-y-3">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-stone-600">
                      <span>Inventory Lock</span>
                      <span>Logistics Node</span>
                      <span>Deployment Point</span>
                    </div>
                    <div className="h-[1px] w-full bg-stone-900 relative">
                      <div 
                        className={`h-full transition-all duration-1000 ${order.orderType === 'Pre-order' ? 'bg-indigo-400' : 'bg-white'}`}
                        style={{ width: order.status === 'Received' ? '100%' : order.status === 'Deployed' ? '66%' : '33%' }}
                      />
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all ${order.orderType === 'Pre-order' ? 'bg-indigo-400' : 'bg-white'}`}
                        style={{ left: order.status === 'Received' ? '100%' : order.status === 'Deployed' ? '66%' : '33%', transform: 'translate(-50%, -50%)' }}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between opacity-20 group-hover:opacity-40 transition-opacity">
                     <div className="flex items-center gap-3">
                       <ShieldCheck size={12} />
                       <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Auth Verified Acquisition</span>
                     </div>
                     <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Ref: {order.id.split('-')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
