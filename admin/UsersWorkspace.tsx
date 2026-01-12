
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Trophy, 
  Gem, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowUpRight,
  UserPlus,
  Loader2,
  Activity,
  History,
  Info
} from 'lucide-react';
import { UserAccount, UserStatus } from '../types';
import { db } from '../services/database';

interface UsersWorkspaceProps {
  addLog: (msg: string) => void;
}

export const UsersWorkspace: React.FC<UsersWorkspaceProps> = ({ addLog }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => db.getAllUsers());
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const updateStatus = (id: string, status: UserStatus) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const updatedUser = { ...user, status };
    db.updateUser(updatedUser);
    setUsers(db.getAllUsers());
    addLog(`SECURITY: User [${user.username}] recalibrated to status [${status}].`);
  };

  const rewardUser = (id: string, type: 'points' | 'diamonds', amount: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const updatedUser = { 
      ...user, 
      [type]: user[type] + amount 
    };
    db.updateUser(updatedUser);
    setUsers(db.getAllUsers());
    addLog(`CREDIT: Granted ${amount} ${type} to node [${user.username}].`);
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (!confirm(`CRITICAL: You are about to purge user [${user.username}]. This will permanently delete their identity from the cluster. Confirm?`)) return;

    db.deleteUser(id);
    setUsers(db.getAllUsers());
    addLog(`WARN: User identity [${user.username}] purged by root.`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-stone-800">
             <Users size={16} className="text-amber-500/50" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Registry // Core_Users</p>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">User <span className="not-italic text-amber-500">Registry</span></h1>
        </div>

        <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-500 transition-all flex items-center gap-4 rounded-sm shadow-2xl">
          <UserPlus size={14} /> New Enrollment
        </button>
      </header>

      {/* Global Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Total Identities', value: users.length, icon: Users, color: 'text-white' },
           { label: 'Active Icons', value: users.filter(u => u.status === UserStatus.ICON).length, icon: Trophy, color: 'text-indigo-400' },
           { label: 'Network Points', value: users.reduce((acc, u) => acc + u.points, 0).toLocaleString(), icon: Activity, color: 'text-amber-500' },
           { label: 'Shard Reserves', value: users.reduce((acc, u) => acc + u.diamonds, 0).toLocaleString(), icon: Gem, color: 'text-blue-400' },
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-[#0a0a0c] border border-white/5 rounded-lg space-y-3 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start">
                <stat.icon size={14} className={stat.color} />
                <ArrowUpRight size={10} className="text-stone-800" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-stone-700 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#0a0a0c] p-6 border border-white/5 rounded-sm">
          <div className="relative w-full md:w-96 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-amber-500 transition-colors" />
            <input 
              type="text"
              placeholder={`SEARCH IDENTITY CLUSTER...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-amber-500/80 focus:border-amber-500 outline-none transition-all placeholder:text-stone-800 rounded-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-stone-600">
             <Filter size={14} />
             {['All Tiers', 'Icons', 'Trendsetters', 'Insiders'].map(f => (
               <button key={f} className="hover:text-white transition-colors">{f}</button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-white/5 bg-[#020203] rounded-sm custom-scrollbar shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-[#0a0a0c] border-b border-white/10">
              <tr>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Identity</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Status Tier</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Points</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Diamonds</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 border-r border-white/5">Enrolled</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 text-center">Protocol Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[10px]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-amber-500/[0.02] transition-colors group">
                  <td className="p-6 border-r border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 font-black">
                        {u.username[0]}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-white uppercase tracking-widest">{u.username}</p>
                        <p className="text-[7px] text-stone-700 uppercase tracking-tighter">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 border-r border-white/5">
                    <select 
                      value={u.status}
                      onChange={(e) => updateStatus(u.id, e.target.value as UserStatus)}
                      className={`bg-transparent border-none text-[8px] font-black uppercase tracking-widest cursor-pointer outline-none ${
                        u.status === UserStatus.ICON ? 'text-indigo-400' :
                        u.status === UserStatus.TRENDSETTER ? 'text-amber-500' :
                        'text-stone-500'
                      }`}
                    >
                      <option value={UserStatus.OBSERVER}>{UserStatus.OBSERVER}</option>
                      <option value={UserStatus.INSIDER}>{UserStatus.INSIDER}</option>
                      <option value={UserStatus.TRENDSETTER}>{UserStatus.TRENDSETTER}</option>
                      <option value={UserStatus.ICON}>{UserStatus.ICON}</option>
                    </select>
                  </td>
                  <td className="p-6 border-r border-white/5">
                     <div className="flex items-center justify-between gap-4">
                        <span className="text-amber-500/80 font-bold">{u.points.toLocaleString()}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => rewardUser(u.id, 'points', 500)} className="px-1.5 py-0.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[7px] font-black text-stone-500 hover:text-white">+</button>
                        </div>
                     </div>
                  </td>
                  <td className="p-6 border-r border-white/5">
                     <div className="flex items-center justify-between gap-4">
                        <span className="text-blue-400 font-bold">{u.diamonds.toLocaleString()}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => rewardUser(u.id, 'diamonds', 50)} className="px-1.5 py-0.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[7px] font-black text-stone-500 hover:text-white">+</button>
                        </div>
                     </div>
                  </td>
                  <td className="p-6 border-r border-white/5 text-stone-700">{u.joinedDate}</td>
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-stone-600 hover:text-white transition-all"><History size={14} /></button>
                      <button className="p-2 text-stone-600 hover:text-blue-400 transition-all"><Info size={14} /></button>
                      <button onClick={() => deleteUser(u.id)} className="p-2 text-stone-600 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="p-8 border border-white/5 bg-[#0a0a0c] rounded-lg flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-800 group-hover:text-amber-500 transition-colors">
               <ShieldCheck size={32} strokeWidth={1} />
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Global User Protocol</h3>
               <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-md">
                  Status trajectories are automatically synchronized with market volatility metrics every 6 hours.
               </p>
            </div>
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="text-right">
               <p className="text-[8px] font-black uppercase text-stone-800 tracking-widest">Network Consensus</p>
               <p className="text-xl font-black text-amber-500">92.4%</p>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <button className="px-10 py-4 bg-white/5 border border-white/10 text-stone-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em]">
               Initialize Global Audit
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] pointer-events-none" />
      </footer>
    </div>
  );
};
