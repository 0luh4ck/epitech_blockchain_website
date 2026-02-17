import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, BookOpen, BarChart3, Settings, Shield } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, isExecutive } = useAuth();

  const adminSections = [
    {
      title: 'Demandes d\'Adhésion',
      description: 'Gérer les demandes d\'adhésion et valider les nouveaux membres',
      icon: Users,
      href: '/admin/membership-requests',
      color: 'bg-blue-500',
      available: isAdmin() || isExecutive()
    },
    {
      title: 'Gestion des Membres',
      description: 'Gérer les comptes des membres existants',
      icon: Users,
      href: '/admin/members',
      color: 'bg-indigo-500',
      available: isAdmin() || isExecutive()
    },
    {
      title: 'Gestion des Activités',
      description: 'Créer et modifier les activités et événements',
      icon: Calendar,
      href: '/admin/activities',
      color: 'bg-green-500',
      available: isAdmin() || isExecutive()
    },
    {
      title: 'Gestion des Examens',
      description: 'Créer et administrer les examens en ligne',
      icon: BookOpen,
      href: '/admin/exams',
      color: 'bg-purple-500',
      available: isAdmin() || isExecutive()
    },
    {
      title: 'Statistiques',
      description: 'Consulter les statistiques et rapports du club',
      icon: BarChart3,
      href: '/admin/stats',
      color: 'bg-yellow-500',
      available: isAdmin() || isExecutive()
    },
    {
      title: 'Paramètres',
      description: 'Configuration générale du système',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      available: isAdmin()
    },
    {
      title: 'Sécurité',
      description: 'Gestion des permissions et de la sécurité',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-red-500',
      available: isAdmin()
    }
  ];

  const stats = [
    {
      title: 'Membres Actifs',
      value: '50+',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Activités Cette Semaine',
      value: '3',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: 'Demandes d\'Adhésion',
      value: '8',
      change: 'En attente',
      changeType: 'neutral'
    },
    {
      title: 'Examens Actifs',
      value: '5',
      change: '2 nouveaux',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administration
              </h1>
              <p className="text-gray-600">
                Gestion et administration du Club Blockchain
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Connecté en tant que</p>
              <p className="font-semibold text-green-600">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {user?.position || user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow p-6 ${
                  section.available 
                    ? 'hover:shadow-lg transition-shadow cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => section.available && (window.location.href = section.href)}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {section.description}
                </p>
                {!section.available && (
                  <p className="text-red-600 text-sm font-medium">
                    Accès restreint
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Créer une Activité
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Valider les Adhésions
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Créer un Examen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
