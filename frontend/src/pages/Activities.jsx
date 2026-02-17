import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { activitiesService } from '../services/activities';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const getActivityTypeLabel = (type) => {
    const types = {
      seminar: 'Séminaire',
      conference: 'Conférence',
      workshop: 'Atelier',
      meeting: 'Réunion',
      exam: 'Examen',
      other: 'Autre'
    };
    return types[type] || type;
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      seminar: 'bg-blue-100 text-blue-800',
      conference: 'bg-purple-100 text-purple-800',
      workshop: 'bg-green-100 text-green-800',
      meeting: 'bg-yellow-100 text-yellow-800',
      exam: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Activités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos événements, séminaires, ateliers et conférences sur la blockchain
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('seminar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'seminar'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Séminaires
            </button>
            <button
              onClick={() => setFilter('conference')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'conference'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Conférences
            </button>
            <button
              onClick={() => setFilter('workshop')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'workshop'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ateliers
            </button>
            <button
              onClick={() => setFilter('exam')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'exam'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Examens
            </button>
          </div>
        </div>
      </section>

      {/* Activities List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune activité trouvée
              </h3>
              <p className="text-gray-600">
                Il n'y a actuellement aucune activité de ce type. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivityTypeColor(activity.type)}`}>
                        {getActivityTypeLabel(activity.type)}
                      </span>
                      {activity.isRegistered && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Inscrit
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {activity.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {activity.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        {format(new Date(activity.startDate), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-green-600" />
                        {format(new Date(activity.startDate), 'HH:mm', { locale: fr })} - {format(new Date(activity.endDate), 'HH:mm', { locale: fr })}
                      </div>
                      {activity.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          {activity.location}
                        </div>
                      )}
                      {activity.maxParticipants && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          {activity.currentParticipants}/{activity.maxParticipants} participants
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Voir Détails
                      </button>
                      {isAuthenticated && !activity.isRegistered && (
                        <button className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm font-medium">
                          S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Restez Informé de Nos Activités
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre club pour recevoir des notifications sur nos prochains événements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Rejoindre le Club
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              Nous Contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activities;
