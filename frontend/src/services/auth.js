import api from './api';

export const authService = {
  // Connexion
  login: async (promotion, password) => {
    const response = await api.post('/auth/login', { promotion, password });
    return response.data;
  },

  // Inscription (réservée à l'administration)
  register: async (userData) => {
    // S'assurer que seul un administrateur peut créer des comptes
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obtenir le profil de l'utilisateur connecté
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Déconnexion (côté client)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
