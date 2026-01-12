
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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

  const handleVaultToggle = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setVault(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  }, []);

  const addToCart = useCallback((id: string) => {
    const prod = dynamicProducts.find(p => p.id === id);
    if (prod) {
      setCartItems(prev => [...prev, prod]);
      navigate('/cart');
    }
  }, [dynamicProducts, navigate]);

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
    navigate('/orders');
  }, [cartItems, navigate]);

  const activeUserProducts = useMemo(() => 
    dynamicProducts.filter(p => !p.status || p.status === 'DEPLOYED'),
  [dynamicProducts]);

  const vaultProducts = useMemo(() => 
    vault.map(id => dynamicProducts.find(p => p.id === id)).filter(Boolean) as Product[],
  [vault, dynamicProducts]);

  const isOperatorView = ['/admin', '/admin-auth', '/supply', '/landing', '/auth'].includes(location.pathname) || location.pathname === '/';
  const filteredUserNotifications = notifications.filter(n => n.targetTier === 'ALL' || n.targetTier === currentStatus);
  const unreadCount = filteredUserNotifications.filter(n => !n.read).length;

  return (
    <div className="relative min-h-screen selection:bg-amber-500/30">
      {!isOperatorView && <Navigation />}
      
      {!isOperatorView && (
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 md:px-24 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5">
          <div onClick={() => navigate('/home')} className="text-3xl font-serif tracking-tighter cursor-pointer group flex items-center h-full transition-all duration-700">
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
            <button onClick={() => navigate('/vault')} className={`relative p-2 transition-all ${location.pathname === '/vault' ? 'text-white' : 'text-stone-500 hover:text-white'}`}>
              <Bookmark size={18} fill={vault.length > 0 && location.pathname === '/vault' ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate('/cart')} className={`relative p-2 transition-all ${location.pathname === '/cart' ? 'text-white' : 'text-stone-500 hover:text-white'}`}>
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

      <main className={!isOperatorView ? "md:ml-24" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPanel onEnter={() => navigate('/auth')} onAdminRequest={() => navigate('/admin-auth')} userStatus={currentStatus} />} />
          <Route path="/auth" element={<AuthPanel userStatus={currentStatus} onAuthorized={(userData) => { setUser(userData); navigate('/home'); }} />} />
          <Route path="/admin-auth" element={<AdminAuthPanel onSuccess={(role) => navigate(role === 'admin' ? '/admin' : '/supply')} onCancel={() => navigate('/home')} />} />
          <Route path="/home" element={
            <div className="pb-40">
              <Hero onNavigate={(v) => navigate(`/${v}`)} />
              <section className="px-6 md:px-24 py-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">Protocol 004 // Active</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-serif tracking-tighter">Midnight <span className="italic text-stone-500">Stock</span></h2>
                  </div>
                  <button onClick={() => navigate('/drops')} className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500 hover:text-white border-b border-white/10 pb-2 transition-all">Archive Extraction Protocol</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeUserProducts.filter(p => !p.id.startsWith('a')).map(p => (
                    <ProductCard 
                      key={p.id} product={p} onClick={() => { setSelectedProductId(p.id); navigate(`/product/${p.id}`); }} 
                      onVaultToggle={handleVaultToggle} isInVault={vault.includes(p.id)}
                    />
                  ))}
                </div>
              </section>
            </div>
          } />
          <Route path="/drops" element={<DropsPanel userStatus={currentStatus} onVaultToggle={handleVaultToggle} vault={vault} onProductClick={(id) => navigate(`/product/${id}`)} onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={
            <ProductDetailWrapper 
              products={dynamicProducts} 
              userStatus={currentStatus} 
              addToCart={addToCart} 
              setVault={setVault} 
              onBack={() => navigate('/home')}
              onNavigateToTryOn={(id) => navigate(`/try-on?product=${id}`)}
            />
          } />
          <Route path="/vault" element={<VaultPanel vaultItems={vaultProducts} removeFromVault={(id) => setVault(v => v.filter(i => i !== id))} moveToCart={addToCart} userStatus={currentStatus} extraVaultSlots={extraVaultSlots} diamonds={diamonds} onBuySpace={(c, s) => { setDiamonds(d => d - c); setExtraVaultSlots(v => v + s); }} />} />
          <Route path="/cart" element={<CartPanel cartItems={cartItems as Product[]} removeFromCart={(id) => setCartItems(v => v.filter(i => i.id !== id))} moveToVault={(id) => { setVault(v => [...v, id]); setCartItems(c => c.filter(i => i.id !== id)); }} onCheckout={() => navigate('/checkout')} timeLeft={timeLeft} userStatus={currentStatus} />} />
          <Route path="/orders" element={<OrdersPanel orders={orders} userStatus={currentStatus} />} />
          <Route path="/checkout" element={<CheckoutPanel cartItems={cartItems} onBack={() => navigate('/cart')} onComplete={completeCheckout} userStatus={currentStatus} />} />
          <Route path="/profile" element={<ProfilePanel user={user} points={points} diamonds={diamonds} userStatus={currentStatus} />} />
          <Route path="/famous-products" element={<FamousProductsPanel userStatus={currentStatus} onProductClick={(id) => navigate(`/product/${id}`)} onAddToCart={addToCart} />} />
          <Route path="/try-on" element={<TryOnPanel userStatus={currentStatus} onAddToCart={addToCart} onAddToVault={(id) => setVault(v => [...new Set([...v, id])])} />} />
          <Route path="/categories" element={<CategoryPanel onProductClick={(id) => navigate(`/product/${id}`)} onVaultToggle={handleVaultToggle} vault={vault} />} />
          <Route path="/fit-finder" element={<FitFinder onProductClick={(id) => navigate(`/product/${id}`)} onVaultToggle={handleVaultToggle} vault={vault} />} />
          <Route path="/flash-sale" element={<FlashSalePanel userStatus={currentStatus} onAddToCart={addToCart} onProductClick={(id) => navigate(`/product/${id}`)} />} />
          <Route path="/game-room" element={<GameRoomPanel userStatus={currentStatus} diamonds={diamonds} tickets={tickets} onSpendDiamonds={(amt) => setDiamonds(d => d - amt)} onEarnTickets={(amt) => setTickets(t => t + amt)} onRedeemTickets={(amt, pid) => { setTickets(t => t - amt); setVault(v => [...v, pid]); }} />} />
          <Route path="/ensembles" element={<EnsemblePanel userStatus={currentStatus} onAddBundleToCart={(b) => { setCartItems(prev => [...prev, b]); navigate('/cart'); }} onProductClick={(id) => navigate(`/product/${id}`)} />} />
          <Route path="/custom-request" element={<CustomRequestPanel userStatus={currentStatus} onBack={() => navigate('/home')} />} />
          <Route path="/collections" element={<ManifestoPanel userStatus={currentStatus} />} />
          <Route path="/admin" element={
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
          } />
          <Route path="/supply" element={<SupplierDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

// Helper component to resolve product from URL params
const ProductDetailWrapper: React.FC<any> = ({ products, userStatus, addToCart, setVault, onBack, onNavigateToTryOn }) => {
  const { id } = (window as any).location.hash.includes('product/') ? { id: (window as any).location.hash.split('product/')[1] } : { id: null };
  const prod = products.find((p: any) => p.id === id);
  if (!prod) return <div className="pt-40 text-center uppercase font-black text-stone-800 tracking-[1em]">Protocol Reference Void</div>;
  return <ProductDetail product={prod} onBack={onBack} onAddToCart={addToCart} onAddToVault={(id) => setVault((v: any) => [...new Set([...v, id])])} userStatus={userStatus} onNavigateToTryOn={onNavigateToTryOn} />;
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
