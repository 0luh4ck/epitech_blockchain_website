import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit2, LogOut, Award, Zap, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainButton from '../components/BlockchainButton';

const Profile = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Projets', value: '3', icon: Zap, color: 'text-blue-600' },
    { label: 'Workshops', value: '12', icon: Calendar, color: 'text-green-500' },
    { label: 'Badges', value: '5', icon: Award, color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      <ParticleGrid />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: User Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 sticky top-28">
              <div className="relative mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-[32px] bg-gradient-to-tr from-blue-600 to-green-500 p-1">
                  <div className="w-full h-full rounded-[30px] bg-white flex items-center justify-center border-4 border-white overflow-hidden shadow-inner">
                    <img
                      src="/logo.png"
                      alt="Avatar"
                      className="w-16 h-16 object-contain grayscale-[0.2]"
                    />
                  </div>
                </div>
                <button className="absolute bottom-0 right-1/4 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.firstName} {user?.lastName}</h2>
                <p className="text-slate-500 font-medium">@{user?.firstName?.toLowerCase()}_btc</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {user?.role || 'Membre'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                    Actif
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</div>
                    <div className="text-sm font-bold text-slate-700 truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membre ID</div>
                    <div className="text-sm font-bold text-slate-700">#EPI-BC-2024-{user?.id || '001'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6">
                <BlockchainButton
                  variant="secondary"
                  className="w-full text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </BlockchainButton>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-slate-50`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Activités Récentes</h3>
                <button className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <Bell className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-6 relative">
                    {i !== 2 && <div className="absolute left-6 top-10 bottom-[-32px] w-px bg-slate-100" />}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 z-10">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 mb-1 text-gradient-web3">Participation au Workshop DeFi</div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Vous avez validé les acquis sur le protocole Aave et les flash loans.</p>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Il y a 2 jours • Epitech Lab</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 text-white rounded-[40px] p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-8">Certifications & Badges</h3>
                <div className="flex flex-wrap gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="group cursor-help">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                        <Award className="w-8 h-8 text-blue-400 group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
