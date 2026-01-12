
import React, { useState, useEffect, useRef } from 'react';
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
import { ShoppingBag, ChevronRight, Bookmark, Gem, Trophy, Bell, X, Info, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

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

  useEffect(() => {
    if (cartItems.length > 0 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [cartItems, timeLeft]);

  const getUserStatus = (pts: number): UserStatus => {
    if (pts > 20000) return UserStatus.ICON;
    if (pts > 5000) return UserStatus.TRENDSETTER;
    if (pts > 1000) return UserStatus.INSIDER;
    return UserStatus.OBSERVER;
  };

  const currentStatus = getUserStatus(points);
  
  // Filter for user-facing views: only show DEPLOYED assets
  const activeUserProducts = dynamicProducts.filter(p => !p.status || p.status === 'DEPLOYED');
  
  const vaultProducts = vault.map(id => dynamicProducts.find(p => p.id === id)).filter(Boolean) as Product[];

  const removeFromVault = (id: string) => {
    setVault(prev => prev.filter(vId => vId !== id));
  };

  const toggleVault = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setVault(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const addToVault = (id: string) => {
    setVault(prev => [...new Set([...prev, id])]);
  };

  const addToCart = (id: string) => {
    const prod = dynamicProducts.find(p => p.id === id);
    if (prod) {
      setCartItems(prev => [...prev, prod]);
    }
  };

  const addBundleToCart = (bundle: Bundle) => {
    setCartItems(prev => [...prev, bundle]);
    setView('cart');
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToCart = (id: string) => {
    addToCart(id);
    removeFromVault(id);
  };

  const moveFromCartToVault = (id: string) => {
    addToVault(id);
    removeFromCart(id);
  };

  const buyVaultSpace = (cost: number, slots: number) => {
    setDiamonds(prev => prev - cost);
    setExtraVaultSlots(prev => prev + slots);
  };

  const completeCheckout = () => {
    if (cartItems.length === 0) return;
    
    const newTotal = cartItems.reduce((acc, p) => acc + p.price, 0);
    const earnedPoints = Math.floor(newTotal * 0.15);
    const earnedDiamonds = Math.floor(newTotal / 10); 
    
    const containsPreOrder = cartItems.some(item => {
      if ('products' in item) {
        return item.products.some(p => p.isPreOrder);
      }
      return item.isPreOrder;
    });
    
    const newOrder: Order = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cartItems],
      total: newTotal,
      status: 'Processing',
      orderType: containsPreOrder ? 'Pre-order' : 'Standard',
      pointsEarned: earnedPoints
    };

    db.addOrder(newOrder);
    setOrders(db.getAllOrders());
    setPoints(prev => prev + earnedPoints);
    setDiamonds(prev => prev + earnedDiamonds);
    setCartItems([]);
    setTimeLeft(600);
    setView('orders');
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setView('product-detail');
  };

  const navigateToTryOn = (id: string) => {
    setSelectedProductId(id);
    setView('try-on');
  };

  const handleAddProduct = (newProd: Product) => {
    db.addProduct(newProd);
    setDynamicProducts(db.getAllProducts());
  };

  const handleEditProduct = (updatedProd: Product) => {
    db.updateProduct(updatedProd);
    setDynamicProducts(db.getAllProducts());
  };

  const handleDeleteProduct = (id: string) => {
    db.deleteProduct(id);
    setDynamicProducts(db.getAllProducts());
  };

  const handleUpdateRequestStatus = (id: string, status: EngagementRequest['status']) => {
    db.updateRequestStatus(id, status);
    setEngagementRequests(db.getAllRequests());
  };

  const handlePurgeRequest = (id: string) => {
    db.purgeRequest(id);
    setEngagementRequests(db.getAllRequests());
  };

  const handleAddNotification = (note: AppNotification) => {
    db.addNotification(note);
    setNotifications(db.getAllNotifications());
  };

  const handleEditNotification = (note: AppNotification) => {
    db.updateNotification(note);
    setNotifications(db.getAllNotifications());
  };

  const handleDeleteNotification = (id: string) => {
    db.deleteNotification(id);
    setNotifications(db.getAllNotifications());
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    db.updateOrderStatus(id, status);
    setOrders(db.getAllOrders());
  };

  const markNotificationRead = (id: string) => {
    db.markAsRead(id);
    setNotifications(db.getAllNotifications());
  };

  const isOperatorView = ['admin', 'admin-auth', 'supply', 'landing', 'auth'].includes(view);
  const filteredUserNotifications = notifications.filter(n => n.targetTier === 'ALL' || n.targetTier === currentStatus);
  const unreadCount = filteredUserNotifications.filter(n => !n.read).length;

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPanel onEnter={() => setView('auth')} onAdminRequest={() => setView('admin-auth')} userStatus={currentStatus} />;
      case 'auth':
        return <AuthPanel userStatus={currentStatus} onAuthorized={(userData) => { setUser(userData); setView('home'); }} />;
      case 'admin-auth':
        return <AdminAuthPanel onSuccess={(role) => setView(role === 'admin' ? 'admin' : 'supply')} onCancel={() => setView('home')} />;
      case 'home':
        return (
          <div className="pb-32">
            <Hero onNavigate={setView} />
            <section className="px-6 md:px-24 py-24">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-4xl md:text-6xl font-serif mb-4">The Midnight Drop</h2>
                  <p className="text-stone-500 font-light max-w-md tracking-wide">Limited supply. High social signals.</p>
                </div>
                <div onClick={() => setView('drops')} className="hidden md:flex items-center gap-2 text-stone-400 group cursor-pointer hover:text-white transition-colors">
                  <span className="text-xs uppercase tracking-widest font-bold">View Collection</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {activeUserProducts.filter(p => !p.id.startsWith('a')).map(p => (
                  <ProductCard 
                    key={p.id} product={p} onClick={() => openProduct(p.id)} 
                    onVaultToggle={toggleVault} isInVault={vault.includes(p.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        );
      case 'admin':
        return (
          <AdminPanel 
            products={dynamicProducts} 
            requests={engagementRequests}
            notifications={notifications}
            orders={orders}
            onAddProduct={handleAddProduct} 
            onEditProduct={handleEditProduct} 
            onDeleteProduct={handleDeleteProduct}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onPurgeRequest={handlePurgeRequest}
            onAddNotification={handleAddNotification}
            onEditNotification={handleEditNotification}
            onDeleteNotification={handleDeleteNotification}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'supply':
        return <SupplierDashboard />;
      case 'fit-finder': return <FitFinder onProductClick={openProduct} onVaultToggle={toggleVault} vault={vault} />;
      case 'drops': return <DropsPanel userStatus={currentStatus} onVaultToggle={toggleVault} vault={vault} onProductClick={openProduct} onAddToCart={addToCart} />;
      case 'vault': return <VaultPanel vaultItems={vaultProducts} removeFromVault={removeFromVault} moveToCart={moveToCart} userStatus={currentStatus} extraVaultSlots={extraVaultSlots} diamonds={diamonds} onBuySpace={buyVaultSpace} />;
      case 'cart': return <CartPanel cartItems={cartItems as Product[]} removeFromCart={removeFromCart} moveToVault={moveFromCartToVault} onCheckout={() => setView('checkout')} timeLeft={timeLeft} userStatus={currentStatus} />;
      case 'product-detail':
        const prod = dynamicProducts.find(p => p.id === selectedProductId);
        if (!prod) { setView('home'); return null; }
        return <ProductDetail product={prod} onBack={() => setView('home')} onAddToCart={addToCart} onAddToVault={addToVault} userStatus={currentStatus} onNavigateToTryOn={navigateToTryOn} />;
      case 'orders': return <OrdersPanel orders={orders} userStatus={currentStatus} />;
      case 'checkout': return <CheckoutPanel cartItems={cartItems} onBack={() => setView('cart')} onComplete={completeCheckout} userStatus={currentStatus} />;
      case 'famous-products': return <FamousProductsPanel userStatus={currentStatus} onProductClick={openProduct} onAddToCart={addToCart} />;
      case 'try-on': return <TryOnPanel userStatus={currentStatus} onAddToCart={addToCart} onAddToVault={addToVault} initialProductId={selectedProductId || undefined} />;
      case 'categories': return <CategoryPanel onProductClick={openProduct} onVaultToggle={toggleVault} vault={vault} />;
      case 'flash-sale': return <FlashSalePanel userStatus={currentStatus} onAddToCart={addToCart} onProductClick={openProduct} />;
      case 'game-room': return <GameRoomPanel userStatus={currentStatus} diamonds={diamonds} tickets={tickets} onSpendDiamonds={(amt) => setDiamonds(d => d - amt)} onEarnTickets={(amt) => setTickets(t => t + amt)} onRedeemTickets={(amt, pid) => { setTickets(t => t - amt); addToVault(pid); }} />;
      case 'ensembles': return <EnsemblePanel userStatus={currentStatus} onAddBundleToCart={addBundleToCart} onProductClick={openProduct} />;
      case 'custom-request': return <CustomRequestPanel userStatus={currentStatus} onBack={() => setView('home')} />;
      case 'collections': return <ManifestoPanel userStatus={currentStatus} />;
      default: return <div className="pt-40 text-center">Protocol under maintenance...</div>;
    }
  };

  return (
    <div className="relative min-h-screen">
      {!isOperatorView && <Navigation currentView={view} setView={setView} />}
      {!isOperatorView && (
        <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-24 z-40 bg-black/50 backdrop-blur-md border-b border-white/5">
          <div onClick={() => { setView('home'); setSelectedProductId(null); }} className="text-2xl font-serif tracking-tighter cursor-pointer group flex items-center h-full transition-all duration-700">
            <div className="flex items-center overflow-hidden">
              <span className="hover:text-amber-500 transition-colors">C</span>
              <span className="max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden">loset</span>
              <span className="ml-1">C</span>
              <span className="max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-700 ease-in-out whitespace-nowrap overflow-hidden">raze</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 transition-all ${showNotifications ? 'text-amber-500' : 'text-stone-400 hover:text-white'}`}>
              <Bell size={20} fill={unreadCount > 0 ? "currentColor" : "none"} />
              {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
            </button>
            <button onClick={() => setView('vault')} className={`relative group p-2 transition-all ${view === 'vault' ? 'text-white' : 'text-stone-400 hover:text-white'}`}>
              <Bookmark size={20} fill={vault.length > 0 && view === 'vault' ? "currentColor" : "none"} />
            </button>
            <button onClick={() => setView('cart')} className={`relative group p-2 transition-all ${view === 'cart' ? 'text-white' : 'text-stone-400 hover:text-white'}`}>
              <ShoppingBag size={20} />
              {cartItems.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full" />}
            </button>
          </div>
        </header>
      )}

      {/* Notification Tray */}
      {!isOperatorView && showNotifications && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
          <aside className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0D0D0F] border-l border-white/5 z-[70] flex flex-col animate-in slide-in-from-right duration-500">
             <header className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Neural Signals</h3>
                   <p className="text-[8px] uppercase tracking-widest text-stone-600">Encrypted Broadcast Feed</p>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-2 text-stone-600 hover:text-white transition-colors"><X size={20} /></button>
             </header>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {filteredUserNotifications.map(note => (
                  <div key={note.id} onClick={() => markNotificationRead(note.id)} className={`p-6 border rounded-sm transition-all cursor-pointer relative group ${note.read ? 'border-white/5 bg-white/[0.01]' : 'border-amber-500/20 bg-amber-500/[0.03]'}`}>
                     {!note.read && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}
                     <div className="flex items-start gap-4">
                        <div className={note.type === 'ALERT' ? 'text-red-500' : 'text-amber-500'}>
                           <Zap size={16} />
                        </div>
                        <div className="space-y-1">
                           <h4 className={`text-xs font-black uppercase tracking-widest ${note.read ? 'text-stone-400' : 'text-white'}`}>{note.title}</h4>
                           <p className="text-xs font-serif italic text-stone-500 group-hover:text-stone-300 leading-relaxed">"{note.content}"</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </aside>
        </>
      )}

      <main className={!isOperatorView ? "md:ml-24" : ""}>{renderView()}</main>
    </div>
  );
};

export default App;
