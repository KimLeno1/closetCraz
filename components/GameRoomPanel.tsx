
import React, { useState } from 'react';
import { 
  Dice5, 
  Target, 
  RotateCw, 
  Zap, 
  Trophy, 
  Gem, 
  ShieldAlert, 
  Dices, 
  Fingerprint,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Gift,
  Activity
} from 'lucide-react';
import { UserStatus, Product } from '../types';
import { ARCHIVE_PRODUCTS } from '../extraMockData';

interface GameRoomPanelProps {
  userStatus: UserStatus;
  diamonds: number;
  tickets: number;
  onSpendDiamonds: (amount: number) => void;
  onEarnTickets: (amount: number) => void;
  onRedeemTickets: (amount: number, productId: string) => void;
}

type GameType = 'guess' | 'dice' | 'wheel' | 'redemption';

export const GameRoomPanel: React.FC<GameRoomPanelProps> = ({ 
  userStatus, 
  diamonds, 
  tickets, 
  onSpendDiamonds, 
  onEarnTickets,
  onRedeemTickets
}) => {
  const [activeGame, setActiveGame] = useState<GameType>('redemption');
  const [gameState, setGameState] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  // --- GUESS THE NUMBER ---
  const [guessVal, setGuessVal] = useState<number>(0);
  const playGuess = () => {
    if (diamonds < 10) return;
    setIsPlaying(true);
    onSpendDiamonds(10);
    const secret = Math.floor(Math.random() * 10) + 1;
    setTimeout(() => {
      if (guessVal === secret) {
        onEarnTickets(100);
        setLastWin(100);
      } else {
        setLastWin(0);
      }
      setGameState({ secret, result: guessVal === secret ? 'Success' : 'Fail' });
      setIsPlaying(false);
    }, 1500);
  };

  // --- ROLL DICE ---
  const playDice = () => {
    if (diamonds < 25) return;
    setIsPlaying(true);
    onSpendDiamonds(25);
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      let win = 0;
      if (total === 7 || total === 11) win = 150;
      else if (d1 === d2) win = 300;
      
      if (win > 0) {
        onEarnTickets(win);
        setLastWin(win);
      } else {
        setLastWin(0);
      }
      setGameState({ d1, d2, total });
      setIsPlaying(false);
    }, 2000);
  };

  // --- SPIN THE WHEEL ---
  const [rotation, setRotation] = useState(0);
  const playWheel = () => {
    if (diamonds < 50) return;
    setIsPlaying(true);
    onSpendDiamonds(50);
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);
    
    setTimeout(() => {
      const resultIndex = Math.floor((newRotation % 360) / 60);
      const rewards = [500, 0, 100, 25, 1000, 0];
      const win = rewards[resultIndex];
      if (win > 0) {
        onEarnTickets(win);
        setLastWin(win);
      } else {
        setLastWin(0);
      }
      setIsPlaying(false);
    }, 3500);
  };

  const menuItems = [
    { id: 'redemption', icon: Gift, label: 'Redemption Protocol' },
    { id: 'guess', icon: Target, label: 'Probability Scan' },
    { id: 'dice', icon: Dices, label: 'Vector Collision' },
    { id: 'wheel', icon: RotateCw, label: 'Kinetic Extraction' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 md:px-24 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/5 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Fingerprint size={16} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Operation: High-Stakes Probability</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white">Probability <span className="italic">Suite</span></h1>
            <p className="text-stone-400 font-light max-w-xl text-lg italic leading-relaxed">
              Convert your transaction-derived Shards into acquisition credits. High volatility. High reward.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="p-8 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2 text-right min-w-[180px]">
              <div className="flex items-center justify-end gap-2 text-stone-600">
                <Gem size={12} className="text-amber-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Neural Shards</span>
              </div>
              <p className="text-4xl font-mono tracking-tighter text-white">{diamonds}</p>
            </div>
            <div className="p-8 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2 text-right min-w-[180px]">
              <div className="flex items-center justify-end gap-2 text-stone-600">
                <Trophy size={12} className="text-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Acquisition Credits</span>
              </div>
              <p className="text-4xl font-mono tracking-tighter text-white">{tickets}</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-12 shrink-0">
             <div className="space-y-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Active Protocols</p>
               <div className="flex flex-col gap-2">
                 {menuItems.map(item => (
                   <button
                    key={item.id}
                    onClick={() => { setActiveGame(item.id as GameType); setGameState({}); setLastWin(null); }}
                    className={`flex items-center gap-4 px-6 py-6 border rounded-sm transition-all text-left ${
                      activeGame === item.id ? 'bg-white text-black border-white' : 'border-white/5 text-stone-500 hover:border-white/20'
                    }`}
                   >
                     <item.icon size={18} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="p-8 border border-white/5 bg-stone-900/10 rounded-sm">
                <div className="flex items-center gap-3 mb-4 text-amber-500">
                  <ShieldAlert size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Risk Advisory</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed font-light italic">
                  Neural Shards are earned exclusively via identity-reinforcing transactions. Probabilistic loss is part of the architecture.
                </p>
             </div>
          </aside>

          {/* Game Area */}
          <main className="flex-1 min-h-[600px] border border-white/5 bg-[#080808] relative rounded-sm overflow-hidden flex flex-col p-12">
            
            {activeGame === 'redemption' && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif italic text-white">The Redemption Vault</h2>
                  <p className="text-stone-500 text-sm">Exchange credits for Archival Artifacts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ARCHIVE_PRODUCTS.map(p => (
                    <div key={p.id} className="p-8 border border-white/5 bg-black space-y-6 group">
                      <div className="aspect-square bg-stone-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <h4 className="text-xl font-serif text-white">{p.name}</h4>
                          <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest">Cost: 1,500 Credits</p>
                        </div>
                        <button 
                          onClick={() => tickets >= 1500 && onRedeemTickets(1500, p.id)}
                          disabled={tickets < 1500}
                          className="px-6 py-3 bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:invert disabled:opacity-20 transition-all"
                        >
                          Extract Piece
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeGame === 'guess' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-serif text-white">Probability Scan</h2>
                  <p className="text-stone-500 text-sm tracking-widest uppercase">Target a single integer from 1 to 10</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button 
                      key={n}
                      disabled={isPlaying}
                      onClick={() => setGuessVal(n)}
                      className={`w-16 h-16 rounded-full border flex items-center justify-center text-xl font-mono transition-all ${
                        guessVal === n ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/10 text-stone-600 hover:border-white/40'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <div className="space-y-8 text-center">
                  <button 
                    onClick={playGuess}
                    disabled={isPlaying || diamonds < 10}
                    className="bg-white text-black px-12 py-6 text-xs font-bold uppercase tracking-[0.5em] hover:invert transition-all disabled:opacity-20"
                  >
                    {isPlaying ? 'Scanning Probability...' : 'Commit 10 Shards'}
                  </button>
                  
                  {gameState.result && !isPlaying && (
                    <div className="animate-in slide-in-from-top-4 duration-500 text-center space-y-2">
                      <p className={`text-xl font-serif italic ${gameState.result === 'Success' ? 'text-amber-500' : 'text-stone-600'}`}>
                        {gameState.result === 'Success' ? `SYNCHRONIZED: +100 Credits` : `COLLISION FAILED (Secret was ${gameState.secret})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeGame === 'dice' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-serif text-white">Vector Collision</h2>
                  <p className="text-stone-500 text-sm tracking-widest uppercase">7 or 11 yields +150 credits. Matching vectors yield +300.</p>
                </div>

                <div className="flex gap-12">
                   <div className={`w-32 h-32 bg-stone-900 border border-white/10 rounded-2xl flex items-center justify-center text-6xl text-white ${isPlaying ? 'animate-bounce' : ''}`}>
                     {gameState.d1 || '?'}
                   </div>
                   <div className={`w-32 h-32 bg-stone-900 border border-white/10 rounded-2xl flex items-center justify-center text-6xl text-white ${isPlaying ? 'animate-bounce' : ''}`}>
                     {gameState.d2 || '?'}
                   </div>
                </div>

                <div className="space-y-8 text-center">
                  <button 
                    onClick={playDice}
                    disabled={isPlaying || diamonds < 25}
                    className="bg-white text-black px-12 py-6 text-xs font-bold uppercase tracking-[0.5em] hover:invert transition-all disabled:opacity-20"
                  >
                    {isPlaying ? 'Calculating Vector...' : 'Commit 25 Shards'}
                  </button>
                  
                  {gameState.total && !isPlaying && (
                    <div className="animate-in slide-in-from-top-4 duration-500">
                      <p className={`text-xl font-serif italic ${lastWin && lastWin > 0 ? 'text-amber-500' : 'text-stone-600'}`}>
                        {lastWin && lastWin > 0 ? `COLLISION POSITIVE: +${lastWin} Credits` : `ENERGY DISSIPATED: Total ${gameState.total}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeGame === 'wheel' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-serif text-white">Kinetic Extraction</h2>
                  <p className="text-stone-500 text-sm tracking-widest uppercase">A high-velocity spin for unpredictable returns.</p>
                </div>

                <div className="relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Zap size={24} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div 
                    className="w-80 h-80 rounded-full border-4 border-white/10 relative transition-transform duration-[3.5s] ease-out flex items-center justify-center overflow-hidden"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {[500, 0, 100, 25, 1000, 0].map((val, i) => (
                      <div 
                        key={i}
                        className="absolute h-full w-[2px] bg-white/5"
                        style={{ transform: `rotate(${i * 60}deg)` }}
                      />
                    ))}
                    {[500, 0, 100, 25, 1000, 0].map((val, i) => (
                      <div 
                        key={i}
                        className="absolute flex flex-col items-center justify-center"
                        style={{ 
                          transform: `rotate(${i * 60 + 30}deg) translate(100px) rotate(${(i * 60 + 30) * -1}deg)` 
                        }}
                      >
                         <span className={`text-xs font-mono font-bold ${val > 0 ? 'text-white' : 'text-stone-800'}`}>
                           {val || 'VOID'}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 text-center">
                  <button 
                    onClick={playWheel}
                    disabled={isPlaying || diamonds < 50}
                    className="bg-white text-black px-12 py-6 text-xs font-bold uppercase tracking-[0.5em] hover:invert transition-all disabled:opacity-20"
                  >
                    {isPlaying ? 'Extracting Momentum...' : 'Commit 50 Shards'}
                  </button>
                  
                  {lastWin !== null && !isPlaying && (
                    <div className="animate-in slide-in-from-top-4 duration-500">
                      <p className={`text-xl font-serif italic ${lastWin > 0 ? 'text-amber-500' : 'text-stone-600'}`}>
                        {lastWin > 0 ? `EXTRACTION SECURED: +${lastWin} Credits` : `EXTRACTION FAILED: Energy Stabilized at Zero`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="absolute bottom-8 left-8 flex items-center gap-2 opacity-10">
              <Activity size={12} className="text-white" />
              <span className="text-[8px] font-mono uppercase tracking-widest text-white">Real-time Entropy Tracking</span>
            </div>
            <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-10">
              <span className="text-[8px] font-mono uppercase tracking-widest text-white">Protocol: 09X-B</span>
              <RefreshCw size={12} className="text-white animate-spin-slow" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 10s linear infinite;
  }
`;
document.head.appendChild(styleElement);
