import React, { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/users';
import { membershipRequestsService } from '../services/membershipRequests';
import { activitiesService } from '../services/activities';
import Skeleton from '../components/Skeleton';

const KPI_CARD_CLASS =
  'bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:border-slate-700/80 transition-all';

/**
 * Dashboard administration : 4 KPI dynamiques (données API réelles).
 * Aucune carte de navigation, aucune valeur statique.
 */
const Admin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalMembers: 0,
    pending: 0,
    bureau: 0,
    upcomingActivities: 0,
  });

  useEffect(() => {
    const loadKpis = async () => {
      // Un seul aller-retour groupé : stats membres + demandes + activités
      const [usersRes, requestsRes, activitiesRes] = await Promise.allSettled([
        usersService.getUserStats(),
        membershipRequestsService.getStats(),
        activitiesService.getActivities({ limit: 100 }),
      ]);

      const overview =
        usersRes.status === 'fulfilled' ? usersRes.value?.data?.overview : null;
      const reqStats =
        requestsRes.status === 'fulfilled' ? requestsRes.value?.data : null;
      const activities =
        activitiesRes.status === 'fulfilled'
          ? activitiesRes.value?.data?.activities || []
          : [];

      const now = new Date();
      setKpis({
        totalMembers: Number(overview?.total_users) || 0,
        pending:
          Number(
            reqStats?.byStatus?.find((s) => s.status === 'pending')?.count
          ) || 0,
        bureau:
          (Number(overview?.admins) || 0) + (Number(overview?.executives) || 0),
        upcomingActivities: activities.filter((a) => {
          if (!a?.startDate || a?.status === 'cancelled') return false;
          return new Date(a.startDate) >= now;
        }).length,
      });
      setLoading(false);
    };

    loadKpis();
  }, []);

  const cards = [
    {
      label: 'Total membres',
      value: kpis.totalMembers,
      icon: Users,
      iconWrap: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Membres en attente',
      value: kpis.pending,
      icon: Clock,
      iconWrap: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Membres du bureau',
      value: kpis.bureau,
      icon: ShieldCheck,
      iconWrap: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
    {
      label: 'Activités à venir',
      value: kpis.upcomingActivities,
      icon: Calendar,
      iconWrap: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div>
      {/* En-tête sobre (le profil détaillé vit déjà dans la Sidebar) */}
      <div className="mb-8">
        <h1 className="fluid-h2 font-black text-slate-100 tracking-tight">
          Administration
        </h1>
        <p className="text-slate-400 mt-1">
          Connecté en tant que{' '}
          <span className="font-bold text-slate-200">
            {user?.firstName} {user?.lastName}
          </span>{' '}
          — {user?.position || user?.role}
        </p>
      </div>

      {/* 4 KPI dynamiques */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6"
            >
              <Skeleton dark variant="line" lines={2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div key={card.label} className={KPI_CARD_CLASS}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-100 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.iconWrap}`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
