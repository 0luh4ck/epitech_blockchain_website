import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, isNetworkError } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// État initial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          // Vérifier si le token est encore valide
          const response = await authService.getProfile();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token,
              user: response.data.user
            }
          });
        } catch (err) {
          console.error('Auth sync error:', err);
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Fonction de connexion (space: 'member' | 'executive' | 'admin')
  const login = async (email, password, space) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(email, password, space);

      // Sauvegarder dans le localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });

      toast.success('Connexion réussie !');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.register(userData);

      // Sauvegarder dans le localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });

      toast.success('Compte créé avec succès !');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création du compte';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Déconnexion réussie');
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);

      // Mettre à jour l'utilisateur dans le state et le localStorage
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser
      });

      toast.success('Profil mis à jour avec succès !');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Fonction de changement de mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      
      // Réinitialiser mustChangePassword localement si actif
      if (state.user && state.user.mustChangePassword) {
        const updatedUser = { ...state.user, mustChangePassword: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: { mustChangePassword: false }
        });
      }

      toast.success('Mot de passe modifié avec succès !');
      return { success: true, data: response?.data };
    } catch (error) {
      // Panne réseau : pas de toast ici — la modale gère le retry automatique
      // + l'avertissement inline sans fermer ni réinitialiser le formulaire.
      if (isNetworkError(error)) {
        return {
          success: false,
          networkError: true,
          message: 'Problème de connexion réseau détecté. Veuillez réessayer.',
        };
      }
      const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const setUser = (updater) => {
    const updatedUser = typeof updater === 'function' ? updater(state.user) : updater;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: updatedUser
    });
  };

  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  const hasRole = (role) => state.user?.role === role;
  const hasAnyRole = (roles = []) => (roles || []).includes(state.user?.role);
  // Fonctions (et non booléens) : Header/BlockchainNav/Admin/Dashboard les appellent comme isAdmin()
  const isAdmin = () => state.user?.role === 'admin' || state.user?.role === 'superadmin';
  const isExecutive = () => state.user?.role === 'executive' || isAdmin();

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    setUser,
    clearError,
    hasRole,
    hasAnyRole,
    isAdmin,
    isExecutive
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default AuthContext;
