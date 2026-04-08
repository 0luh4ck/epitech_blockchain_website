import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Filter, Search, Zap, ArrowRight } from 'lucide-react';
import { activitiesService } from '../services/activities';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.type = filter;
      }
      const response = await activitiesService.getActivities(params);
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Toutes', icon: Filter },
    { id: 'workshop', label: 'Workshops', icon: Zap },
    { id: 'seminar', label: 'Séminaires', icon: Users },
    { id: 'conference', label: 'Conférences', icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-blue-600 border-r-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      <ParticleGrid />

      {/* Header */}
      <section className="py-24 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-900">
              Nos <span className="text-gradient-web3">Événements</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Plongez au cœur de l'écosystème avec nos sessions de formation et nos rencontres technologiques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat.id
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                        : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200"
              >
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Aucun événement à l'horizon</h3>
                <p className="text-slate-500 font-medium">Revenez plus tard pour de nouvelles activités passionnantes.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <BlockchainCard className="h-full flex flex-col p-8">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {activity.type}
                        </span>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                          {format(new Date(activity.startDate), 'dd MMM', { locale: fr })}
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </h3>

                      <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2">
                        {activity.description}
                      </p>

                      <div className="space-y-4 mb-8 pt-6 border-t border-slate-50">
                        <div className="flex items-center text-xs font-bold text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-blue-500" />
                          </div>
                          {format(new Date(activity.startDate), 'HH:mm', { locale: fr })} - {format(new Date(activity.endDate), 'HH:mm', { locale: fr })}
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-green-500" />
                          </div>
                          {activity.location || 'Epitech Lab'}
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-orange-500" />
                          </div>
                          {activity.currentParticipants || 0} / {activity.maxParticipants || 30} participations
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <BlockchainButton
                          className="w-full text-xs py-3.5 group"
                          variant={activity.isRegistered ? 'secondary' : 'primary'}
                        >
                          {activity.isRegistered ? 'Inscrit' : "S'inscrire"}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </BlockchainButton>
                      </div>
                    </BlockchainCard>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-slate-900 text-white rounded-[64px] mx-4 md:mx-8 mb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Envie d'organiser ?</h2>
            <p className="text-slate-400 font-medium text-lg">Proposez vos propres ateliers ou conférences au bureau du club.</p>
          </div>
          <BlockchainButton primary className="px-12 py-5 shadow-2xl shadow-blue-500/30">
            Soumettre un Projet
          </BlockchainButton>
        </div>
      </section>
    </div>
  );
};

export default Activities;
