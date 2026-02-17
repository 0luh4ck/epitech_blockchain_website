import api from './api';

export const membershipService = {
  // Soumettre une demande d'adhésion
  submitApplication: async (applicationData) => {
    const response = await api.post('/membership/apply', applicationData);
    return response.data;
  },

  // Obtenir les demandes d'adhésion (admin/executive)
  getApplications: async (params = {}) => {
    const response = await api.get('/membership/applications', { params });
    return response.data;
  },

  // Obtenir une demande d'adhésion par ID (admin/executive)
  getApplication: async (id) => {
    const response = await api.get(`/membership/applications/${id}`);
    return response.data;
  },

  // Examiner une demande d'adhésion (admin/executive)
  reviewApplication: async (id, reviewData) => {
    const response = await api.put(`/membership/applications/${id}/review`, reviewData);
    return response.data;
  },

  // Obtenir les statistiques des demandes d'adhésion (admin/executive)
  getMembershipStats: async () => {
    const response = await api.get('/membership/stats');
    return response.data;
  }
};
