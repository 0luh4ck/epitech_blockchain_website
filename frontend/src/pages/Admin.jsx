import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Inbox, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { membershipRequestsService } from '../services/membershipRequests';

const CARD_CLASS =
  'bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 transition-all duration-200 hover:border-red-500/30 focus-visible:ring-2 focus-visible:ring-red-400';

const Admin = () => {
  const { user, isAdmin, isExecutive } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  // Badge : nombre de demandes d'adhésion en attente
  useEffect(() => {
    const loadPending = async () => {
      try {
        const response = await membershipRequestsService.getStats();
        const count =
          response.data?.byStatus?.find((s) => s.status === 'pending')?.count || 0;
        setPendingCount(Number(count) || 0);
      } catch (error) {
        console.error('Erreur chargement demandes en attente:', error.message);
      }
    };
    loadPending();
  }, []);

  const cards = [
    {
      title: "Demandes d'Adhésion",
      description: "Examiner et valider les demandes d'adhésion des nouveaux membres",
      icon: Inbox,
      href: '/admin/membership-requests',
      available: isAdmin() || isExecutive(),
      badge: pendingCount > 0 ? `${pendingCount} en attente` : null,
    },
    {
      title: 'Gestion des Membres',
      description: 'Gérer les comptes des membres existants',
      icon: Users,
      href: '/admin/members',
      available: isAdmin() || isExecutive(),
      badge: null,
    },
    {
      title: 'Gestion des Activités / QCM',
      description: 'Créer et administrer les activités, événements et examens',
      icon: Calendar,
      href: '/admin/activity-editor',
      available: isAdmin() || isExecutive(),
      badge: null,
    },
    {
      title: 'Statistiques & Paramètres',
      description: 'Consulter les statistiques, configurer le système et la sécurité',
      icon: BarChart3,
      href: '/admin/stats',
      available: isAdmin(),
      badge: null,
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

      {/* 4 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                {card.badge && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-red-500/15 text-red-300 border border-red-500/30">
                    {card.badge}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-slate-100 mb-2">
                {card.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {card.description}
              </p>
              {!card.available && (
                <p className="mt-3 text-sm font-bold text-red-400">
                  Accès restreint
                </p>
              )}
            </>
          );

          return card.available ? (
            <Link key={card.title} to={card.href} className={CARD_CLASS}>
              {inner}
            </Link>
          ) : (
            <div key={card.title} className={`${CARD_CLASS} opacity-60`}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
