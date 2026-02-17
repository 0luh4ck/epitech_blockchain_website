import api from './api';

export const usersService = {
  // Obtenir la liste des utilisateurs (admin/executive)
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Obtenir les membres du bureau exécutif
  getExecutiveBoard: async () => {
    const response = await api.get('/users/executive-board');
    return response.data;
  },

  // Obtenir un utilisateur par ID
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Désactiver un utilisateur (admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Obtenir les statistiques des utilisateurs
  getUserStats: async () => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  }
};
