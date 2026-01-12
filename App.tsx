
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, UserStatus, Product, Order, Bundle, EngagementRequest, AppNotification, OrderStatus } from './types';
import { db } from './services/database';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { FitFinder } from './components/FitFinder';
import { DropsPanel } from './components/DropsPanel';
import { VaultPanel } from './components/VaultPanel';
import { ProductDetail } from './components/ProductDetail';
import { OrdersPanel } from './components/OrdersPanel';
import { CartPanel } from './components/CartPanel';
import { CheckoutPanel } from './components/CheckoutPanel';
import { ManifestoPanel } from './components/ManifestoPanel';
import { FamousProductsPanel } from './components/FamousProductsPanel';
import { TryOnPanel } from './components/TryOnPanel';
import { CategoryPanel } from './components/CategoryPanel';
import { FlashSalePanel } from './components/FlashSalePanel';
import { GameRoomPanel } from './components/GameRoomPanel';
import { EnsemblePanel } from './components/EnsemblePanel';
import { CustomRequestPanel } from './components/CustomRequestPanel';
import { AdminPanel } from './admin/AdminPanel';
import { SupplierDashboard } from './admin/SupplierDashboard';
import { LandingPanel } from './components/LandingPanel';
import { AuthPanel } from './components/AuthPanel';
import { AdminAuthPanel } from './components/AdminAuthPanel';
import { SupplyPanel } from './components/SupplyPanel';
import { ProfilePanel } from './components/ProfilePanel';
import { ShoppingBag, Bookmark, Bell, X, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(() => db.getAllProducts());
  const [engagementRequests, setEngagementRequests] = useState<EngagementRequest[]>(() => db.getAllRequests());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => db.getAllNotifications());
  const [orders, setOrders] = useState<Order[]>(() => db.getAllOrders());
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [points, setPoints] = useState(1250);
  const [diamonds, setDiamonds] = useState(250); 
  const [tickets, setTickets] = useState(0);     
  const [extraVaultSlots, setExtraVaultSlots] = useState(0);
  const [user, setUser] = useState<any>(null);
  
  const [cartItems, setCartItems] = useState<(Product | Bundle)[]>([]);
  const [vault, setVault] = useState<string[]>(['1', 'a1']);
  const [timeLeft, setTimeLeft] = useState(600);

  // Status calculation (Memoized)
  const currentStatus = useMemo(() => {
    if (points > 20000) return UserStatus.ICON;
    if (points > 5000) return UserStatus.TRENDSETTER;
    if (points > 1000) return UserStatus.INSIDER;
    return UserStatus.OBSERVER;
  }, [points]);

  useEffect(() => {
    if (cartItems.length > 0 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [cartItems, timeLeft]);

  // Actions
  const handleVaultToggle = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setVault(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  }, []);

  const addToCart = useCallback((id: string) => {
    const prod = dynamicProducts.find(p => p.id === id);
    if (prod) {
      setCartItems(prev => [...prev, prod]);
      setView('cart'); // Direct feedback
    }
  }, [dynamicProducts]);

  const completeCheckout = useCallback(() => {
    if (cartItems.length === 0) return;
    
    const newTotal = cartItems.reduce((acc, p) => acc + p.price, 0);
    const earnedPoints = Math.floor(newTotal * 0.15);
    const earnedDiamonds = Math.floor(newTotal / 10); 
    
    const newOrder: Order = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      items: [...cartItems],
      total: newTotal,
      status: 'Processing',
      orderType: 'Standard',
      pointsEarned: earnedPoints
    };

    db.addOrder(newOrder);
    setOrders(db.getAllOrders());
    setPoints(prev => prev + earnedPoints);
    setDiamonds(prev => prev + earnedDiamonds);
    setCartItems([]);
    setTimeLeft(600);
    setView('orders');
  }, [cartItems]);

  const activeUserProducts = useMemo(() => 
    dynamicProducts.filter(p => !p.status || p.status === 'DEPLOYED'),
  [dynamicProducts]);

  const vaultProducts = useMemo(() => 
    vault.map(id => dynamicProducts.find(p => p.id === id)).filter(Boolean) as Product[],
  [vault, dynamicProducts]);

  const isOperatorView = ['admin', 'admin-auth', 'supply', 'landing', 'auth'].includes(view);
  const filteredUserNotifications = notifications.filter(n => n.targetTier === 'ALL' || n.targetTier === currentStatus);
  const unreadCount = filteredUserNotifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (view) {
      case 'landing': return <LandingPanel onEnter={() => setView('auth')} onAdminRequest={() => setView('admin-auth')} userStatus={currentStatus} />;
      case 'auth': return <AuthPanel userStatus={currentStatus} onAuthorized={(userData) => { setUser(userData); setView('home'); }} />;
      case 'admin-auth': return <AdminAuthPanel onSuccess={(role) => setView(role === 'admin' ? 'admin' : 'supply')} onCancel={() => setView('home')} />;
      case 'home':
        return (
          <div className="pb-40">
            <Hero onNavigate={setView} />
            <section className="px-6 md:px-24 py-32">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">Protocol 004 // Active</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-serif tracking-tighter">Midnight <span className="italic text-stone-500">Stock</span></h2>
                </div>
                <button onClick={() => setView('drops')} className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500 hover:text-white border-b border-white/10 pb-2 transition-all">Archive Extraction Protocol</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeUserProducts.filter(p => !p.id.startsWith('a')).map(p => (
                  <ProductCard 
                    key={p.id} product={p} onClick={() => { setSelectedProductId(p.id); setView('product-detail'); }} 
                    onVaultToggle={handleVaultToggle} isInVault={vault.includes(p.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        );
      case 'admin':
        return (
          <AdminPanel 
            products={dynamicProducts} requests={engagementRequests} notifications={notifications} orders={orders}
            onAddProduct={(p) => { db.addProduct(p); setDynamicProducts(db.getAllProducts()); }} 
            onEditProduct={(p) => { db.updateProduct(p); setDynamicProducts(db.getAllProducts()); }} 
            onDeleteProduct={(id) => { db.deleteProduct(id); setDynamicProducts(db.getAllProducts()); }}
            onUpdateRequestStatus={(id, s) => { db.updateRequestStatus(id, s); setEngagementRequests(db.getAllRequests()); }}
            onPurgeRequest={(id) => { db.purgeRequest(id); setEngagementRequests(db.getAllRequests()); }}
            onAddNotification={(n) => { db.addNotification(n); setNotifications(db.getAllNotifications()); }}
            onEditNotification={(n) => { db.updateNotification(n); setNotifications(db.getAllNotifications()); }}
            onDeleteNotification={(id) => { db.deleteNotification(id); setNotifications(db.getAllNotifications()); }}
            onUpdateOrderStatus={(id, s) => { db.updateOrderStatus(id, s); setOrders(db.getAllOrders()); }}
          />
        );
      case 'supply': return <SupplierDashboard />;
      case 'fit-finder': return <FitFinder onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} onVaultToggle={handleVaultToggle} vault={vault} />;
      case 'drops': return <DropsPanel userStatus={currentStatus} onVaultToggle={handleVaultToggle} vault={vault} onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} onAddToCart={addToCart} />;
      case 'vault': return <VaultPanel vaultItems={vaultProducts} removeFromVault={(id) => setVault(v => v.filter(i => i !== id))} moveToCart={addToCart} userStatus={currentStatus} extraVaultSlots={extraVaultSlots} diamonds={diamonds} onBuySpace={(c, s) => { setDiamonds(d => d - c); setExtraVaultSlots(v => v + s); }} />;
      case 'cart': return <CartPanel cartItems={cartItems as Product[]} removeFromCart={(id) => setCartItems(v => v.filter(i => i.id !== id))} moveToVault={(id) => { setVault(v => [...v, id]); setCartItems(c => c.filter(i => i.id !== id)); }} onCheckout={() => setView('checkout')} timeLeft={timeLeft} userStatus={currentStatus} />;
      case 'product-detail':
        const prod = dynamicProducts.find(p => p.id === selectedProductId);
        if (!prod) return <div>Protocol Link Broken</div>;
        return <ProductDetail product={prod} onBack={() => setView('home')} onAddToCart={addToCart} onAddToVault={(id) => setVault(v => [...new Set([...v, id])])} userStatus={currentStatus} onNavigateToTryOn={(id) => { setSelectedProductId(id); setView('try-on'); }} />;
      case 'orders': return <OrdersPanel orders={orders} userStatus={currentStatus} />;
      case 'checkout': return <CheckoutPanel cartItems={cartItems} onBack={() => setView('cart')} onComplete={completeCheckout} userStatus={currentStatus} />;
      case 'profile': return <ProfilePanel user={user} points={points} diamonds={diamonds} userStatus={currentStatus} />;
      case 'famous-products': return <FamousProductsPanel userStatus={currentStatus} onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} onAddToCart={addToCart} />;
      case 'try-on': return <TryOnPanel userStatus={currentStatus} onAddToCart={addToCart} onAddToVault={(id) => setVault(v => [...new Set([...v, id])])} initialProductId={selectedProductId || undefined} />;
      case 'categories': return <CategoryPanel onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} onVaultToggle={handleVaultToggle} vault={vault} />;
      case 'flash-sale': return <FlashSalePanel userStatus={currentStatus} onAddToCart={addToCart} onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} />;
      case 'game-room': return <GameRoomPanel userStatus={currentStatus} diamonds={diamonds} tickets={tickets} onSpendDiamonds={(amt) => setDiamonds(d => d - amt)} onEarnTickets={(amt) => setTickets(t => t + amt)} onRedeemTickets={(amt, pid) => { setTickets(t => t - amt); setVault(v => [...v, pid]); }} />;
      case 'ensembles': return <EnsemblePanel userStatus={currentStatus} onAddBundleToCart={(b) => { setCartItems(prev => [...prev, b]); setView('cart'); }} onProductClick={(id) => { setSelectedProductId(id); setView('product-detail'); }} />;
      case 'custom-request': return <CustomRequestPanel userStatus={currentStatus} onBack={() => setView('home')} />;
      case 'collections': return <ManifestoPanel userStatus={currentStatus} />;
      default: return <div className="pt-40 text-center uppercase tracking-[1em] text-stone-800">Protocol Under Maintenance</div>;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-amber-500/30">
      {!isOperatorView && <Navigation currentView={view} setView={setView} />}
      {!isOperatorView && (
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 md:px-24 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5">
          <div onClick={() => { setView('home'); setSelectedProductId(null); }} className="text-3xl font-serif tracking-tighter cursor-pointer group flex items-center h-full transition-all duration-700">
            <span className="text-white group-hover:text-amber-500 transition-colors">C</span>
            <span className="max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden">loset</span>
            <span className="ml-1 text-white">C</span>
            <span className="max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden">raze</span>
          </div>
          <div className="flex items-center gap-12">
            <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 transition-all ${showNotifications ? 'text-amber-500' : 'text-stone-500 hover:text-white'}`}>
              <Bell size={18} fill={unreadCount > 0 ? "currentColor" : "none"} strokeWidth={1.5} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
            </button>
            <button onClick={() => setView('vault')} className={`relative p-2 transition-all ${view === 'vault' ? 'text-white' : 'text-stone-500 hover:text-white'}`}>
              <Bookmark size={18} fill={vault.length > 0 && view === 'vault' ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            <button onClick={() => setView('cart')} className={`relative p-2 transition-all ${view === 'cart' ? 'text-white' : 'text-stone-500 hover:text-white'}`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartItems.length > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-amber-500 text-black text-[9px] font-black rounded-full border-2 border-black">{cartItems.length}</span>}
            </button>
          </div>
        </header>
      )}

      {/* Notification Stream Overlay */}
      {!isOperatorView && showNotifications && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md" onClick={() => setShowNotifications(false)} />
          <aside className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#050505] border-l border-white/10 z-[70] flex flex-col animate-in slide-in-from-right-12 duration-500 shadow-2xl">
             <header className="p-10 border-b border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Neural Signals</h3>
                   <p className="text-[9px] uppercase tracking-widest text-stone-700 font-mono">Channel: GHOST_FEED_09</p>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-4 text-stone-700 hover:text-white transition-colors border border-white/10 rounded-sm hover:border-white/40"><X size={20} /></button>
             </header>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                {filteredUserNotifications.map(note => (
                  <div key={note.id} onClick={() => { db.markAsRead(note.id); setNotifications(db.getAllNotifications()); }} className={`p-8 border rounded-sm transition-all cursor-pointer relative group ${note.read ? 'border-white/5 bg-white/[0.01]' : 'border-amber-500/20 bg-amber-500/[0.03]'}`}>
                     {!note.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />}
                     <div className="flex items-start gap-6">
                        <div className={`p-3 rounded border ${note.type === 'ALERT' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                           <Zap size={16} fill="currentColor" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center gap-4">
                              <h4 className={`text-xs font-black uppercase tracking-[0.3em] ${note.read ? 'text-stone-600' : 'text-white'}`}>{note.title}</h4>
                              <span className="text-[8px] font-mono text-stone-800">{new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                           <p className="text-sm font-serif italic text-stone-400 group-hover:text-stone-200 leading-relaxed transition-colors">"{note.content}"</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <footer className="p-10 border-t border-white/5 text-center">
                <button onClick={() => setShowNotifications(false)} className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-800 hover:text-stone-400 transition-colors">Close Transmission</button>
             </footer>
          </aside>
        </>
      )}

      <main className={!isOperatorView ? "md:ml-24" : ""}>{renderContent()}</main>
    </div>
  );
};

export default App;
