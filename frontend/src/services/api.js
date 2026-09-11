import axios from 'axios';
import { ROUTES, SUPERADMIN_LOGIN_PATH } from '../utils/constants';

// Configuration de base d'axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide : on purge la session locale…
      const hadSession = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // …puis on redirige vers la connexion au lieu de laisser l'UI bloquée.
      // Espace admin -> login confidentiel, sinon login public.
      // Jamais de redirection depuis une page de login (ni boucle, ni 401
      // légitime d'identifiants incorrects masqué).
      if (hadSession && typeof window !== 'undefined') {
        const path = window.location.pathname;
        const loginPages = [ROUTES.LOGIN, ROUTES.REGISTER, SUPERADMIN_LOGIN_PATH];
        if (!loginPages.includes(path)) {
          const inAdminSpace =
            path === ROUTES.ADMIN ||
            path.startsWith('/admin/') ||
            path.startsWith('/portal-secure-');
          window.location.href = inAdminSpace ? SUPERADMIN_LOGIN_PATH : ROUTES.LOGIN;
        }
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
