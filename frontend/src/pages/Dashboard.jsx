import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, BookOpen, Award, BarChart3, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isExecutive } = useAuth();

  const stats = [
    {
      title: 'Activités à Venir',
      value: '5',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Membres Actifs',
      value: '30+',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Examens Disponibles',
      value: '3',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Certifications',
      value: '12',
      icon: Award,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      title: 'Voir les Activités',
      description: 'Consultez et inscrivez-vous aux prochaines activités',
      icon: Calendar,
      href: '/activities',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Passer un Examen',
      description: 'Testez vos connaissances en blockchain',
      icon: BookOpen,
      href: '/exams',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Mon Profil',
      description: 'Gérez vos informations personnelles',
      icon: Settings,
      href: '/profile',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const adminActions = [
    {
      title: 'Gérer les Activités',
      description: 'Créer et modifier les activités du club',
      icon: Calendar,
      href: '/admin/activities',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Gérer les Membres',
      description: 'Administrer les comptes des membres',
      icon: Users,
      href: '/admin/members',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Statistiques',
      description: 'Consultez les statistiques du club',
      icon: BarChart3,
      href: '/admin/stats',
      color: 'bg-purple-100 text-purple-600'
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
                Tableau de Bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Rôle</p>
              <p className="font-semibold text-green-600">
                {user?.position || user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Actions Rapides
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {(isAdmin() || isExecutive()) && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Administration
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {adminActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <a
                        key={index}
                        href={action.href}
                        className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Activités Récentes
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Aucune activité récente. Revenez bientôt !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
