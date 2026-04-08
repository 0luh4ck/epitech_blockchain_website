import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  ArrowRight,
  Zap,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { statsService } from '../services/stats';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const Dashboard = () => {
  const { user, isAdmin, isExecutive } = useAuth();
  const [statsData, setStatsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getDashboardStats();
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error('Erreur stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Activités',
      value: loading ? '...' : statsData?.upcomingActivities || '0',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Membres',
      value: loading ? '...' : statsData?.activeMembers || '0',
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Examens',
      value: loading ? '...' : statsData?.availableExams || '0',
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      title: 'Badges',
      value: loading ? '...' : statsData?.certifications || '0',
      icon: Award,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
      <ParticleGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              Tableau de <span className="text-gradient-web3">Bord</span>
            </h1>
            <p className="text-slate-500 font-medium">Bon retour parmi nous, <span className="text-slate-900 font-bold">{user?.firstName}</span> 👋</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-3xl border border-slate-100"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
              <img src="/logo.png" alt="Avatar" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Actuel</p>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {user?.position || user?.role || 'Membre'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all group"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.title}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <BlockchainCard className="p-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Prochaines Missions</h3>
                <BlockchainButton variant="secondary" className="px-5 py-2 text-[10px]">Voir tout</BlockchainButton>
              </div>

              <div className="space-y-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="group p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Zap className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Workshop</span>
                          <span className="text-[10px] font-bold text-slate-400">14 Avril, 14:00</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">Introduction aux Smart Contracts</h4>
                        <p className="text-sm text-slate-500 font-medium mt-2">Apprenez les bases de Solidity et déployez votre premier contrat sur Sepolia.</p>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BlockchainCard>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-bl-[100px]" />
              <div className="relative z-10">
                <Bell className="w-8 h-8 text-blue-400 mb-8" />
                <h3 className="text-2xl font-black mb-4">Annonces</h3>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/10">
                    <p className="text-sm font-bold text-blue-400 mb-1 uppercase tracking-widest">Urgent</p>
                    <p className="text-sm font-medium text-slate-300">N'oubliez pas de valider votre inscription au Hackathon avant demain minuit.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-500 mb-1 uppercase tracking-widest">Nouveau</p>
                    <p className="text-sm font-medium text-slate-300">Les certificats du dernier workshop sont disponibles dans votre profil.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Progression</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                    <span className="text-slate-400">Niveau 2</span>
                    <span className="text-blue-600">65%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full shadow-lg shadow-blue-500/20" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Plus que <span className="text-slate-900 font-black">2 workshops</span> pour débloquer le badge <span className="text-orange-500 font-black">Solidity Master</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
