import api from './api';

export const activitiesService = {
  // Obtenir la liste des activités
  getActivities: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  // Obtenir une activité par ID
  getActivity: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  // Créer une nouvelle activité (admin/executive)
  createActivity: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Mettre à jour une activité (admin/executive)
  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  // Supprimer une activité (admin/executive)
  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },

  // S'inscrire à une activité
  registerToActivity: async (id) => {
    const response = await api.post(`/activities/${id}/register`);
    return response.data;
  },

  // Se désinscrire d'une activité
  unregisterFromActivity: async (id) => {
    const response = await api.delete(`/activities/${id}/register`);
    return response.data;
  }
};
