import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ShieldCheck, Calendar, ArrowRight, MapPin } from 'lucide-react';
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
  const [recentMembers, setRecentMembers] = useState([]);
  const [nextActivity, setNextActivity] = useState(null);
  const [recentDecisions, setRecentDecisions] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      // Un seul aller-retour groupé (aucune duplication d'appels) :
      // stats membres + demandes + 5 derniers inscrits + 20 dernières demandes + activités
      const [usersRes, requestsRes, activitiesRes, latestRes, feedRes] =
        await Promise.allSettled([
          usersService.getUserStats(),
          membershipRequestsService.getStats(),
          activitiesService.getActivities({ limit: 100 }),
          usersService.getUsers({ page: 1, limit: 5 }),
          membershipRequestsService.getRequests({ page: 1, limit: 20 }),
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
      const upcoming = activities
        .filter((a) => a?.startDate && a?.status !== 'cancelled' && new Date(a.startDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      const feed =
        feedRes.status === 'fulfilled' ? feedRes.value?.data?.requests || [] : [];

      setKpis({
        totalMembers: Number(overview?.total_users) || 0,
        pending:
          Number(
            reqStats?.byStatus?.find((s) => s.status === 'pending')?.count
          ) || 0,
        bureau:
          (Number(overview?.admins) || 0) + (Number(overview?.executives) || 0),
        upcomingActivities: upcoming.length,
      });
      // Garde défensive : aucun compte anonymisé au dashboard (déjà exclus côté API)
      const usable = (u) =>
        !u?.isAnonymized && !String(u?.email || '').endsWith('@deleted.local');
      const latestUsers =
        latestRes.status === 'fulfilled' ? latestRes.value?.data?.users || [] : [];
      setRecentMembers(latestUsers.filter(usable));
      setNextActivity(upcoming[0] || null);
      // Fil d'activité : 4 dernières demandes traitées (données réelles)
      setRecentDecisions(
        feed
          .filter((r) => r.status !== 'pending' && r.reviewed_at)
          .sort((a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at))
          .slice(0, 4)
      );
      setLoading(false);
    };

    loadDashboard();
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

      {/* Section principale : inscriptions récentes + activités/logs */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
          {/* Dernières inscriptions (60%) */}
          <div className="lg:col-span-3 bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-100">
                Dernières inscriptions
              </h2>
              <Link
                to="/admin/members"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-300 transition-all focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg min-h-[44px]"
              >
                Voir tous les membres <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentMembers.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune inscription récente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800/60">
                  <thead>
                    <tr>
                      {['Nom', 'Date', 'Statut'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 tracking-wider uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {recentMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-100">
                          {m.firstName} {m.lastName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                            !m.isActive
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : !m.isVerified
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {!m.isActive ? 'Désactivé' : !m.isVerified ? 'En attente' : 'Actif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Prochain workshop + fil d'activité (40%) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-black text-slate-100 mb-3">
                Prochain workshop
              </h2>
              {nextActivity ? (
                <div>
                  <p className="font-bold text-slate-200">{nextActivity.title}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    {new Date(nextActivity.startDate).toLocaleString('fr-FR')}
                  </p>
                  {nextActivity.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {nextActivity.location}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Aucune activité à venir.</p>
              )}
            </div>

            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-black text-slate-100 mb-3">
                Dernières décisions
              </h2>
              {recentDecisions.length === 0 ? (
                <p className="text-sm text-slate-400">Aucune action récente.</p>
              ) : (
                <ul className="space-y-3">
                  {recentDecisions.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border shrink-0 ${
                        r.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {r.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-slate-200">
                        {r.first_name} {r.last_name}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {new Date(r.reviewed_at).toLocaleDateString('fr-FR')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
