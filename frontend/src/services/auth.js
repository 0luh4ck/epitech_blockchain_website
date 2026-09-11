import api from './api';

// Détecte une panne réseau (vs une erreur métier renvoyée par l'API).
// Couvre : ERR_NETWORK_CHANGED, timeout axios, navigateur hors-ligne,
// fetch/XHR avorté — avec ou sans `error.response` selon le navigateur.
export const isNetworkError = (error) => {
  if (!error) return false;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  if (!error.response) return true; // axios : aucune réponse reçue
  const code = String(error.code || '');
  const message = String(error.message || '');
  return (
    code === 'ERR_NETWORK' ||
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    /network error|ERR_NETWORK_CHANGED|Failed to fetch|Load failed|Network request failed|timeout/i.test(message)
  );
};

export const authService = {
  // Connexion (space: 'member' | 'executive' | 'admin')
  login: async (email, password, space) => {
    const payload = space ? { email, password, space } : { email, password };
    const response = await api.post('/auth/login', payload);
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
