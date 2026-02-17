import { api } from './api';

export const membershipRequestsService = {
  // Créer une demande d'adhésion
  createRequest: async (data) => {
    const response = await api.post('/membership-requests', data);
    return response.data;
  },

  // Récupérer toutes les demandes d'adhésion (admin seulement)
  getRequests: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await api.get(`/membership-requests?${queryParams.toString()}`);
    return response.data;
  },

  // Approuver une demande d'adhésion (admin seulement)
  approveRequest: async (id, data = {}) => {
    const response = await api.put(`/membership-requests/${id}/approve`, data);
    return response.data;
  },

  // Rejeter une demande d'adhésion (admin seulement)
  rejectRequest: async (id, data = {}) => {
    const response = await api.put(`/membership-requests/${id}/reject`, data);
    return response.data;
  },

  // Récupérer les statistiques des demandes d'adhésion (admin seulement)
  getStats: async () => {
    const response = await api.get('/membership-requests/stats');
    return response.data;
  }
};
