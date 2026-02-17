import api from './api';

export const examsService = {
  // Obtenir la liste des examens
  getExams: async (params = {}) => {
    const response = await api.get('/exams', { params });
    return response.data;
  },

  // Obtenir un examen par ID
  getExam: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  // Créer un nouvel examen (admin/executive)
  createExam: async (examData) => {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  // Mettre à jour un examen (admin/executive)
  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  // Supprimer un examen (admin/executive)
  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  // Commencer un examen
  startExam: async (id) => {
    const response = await api.post(`/exams/${id}/start`);
    return response.data;
  },

  // Soumettre les réponses d'un examen
  submitExam: async (id, answers, resultId) => {
    const response = await api.post(`/exams/${id}/submit`, {
      answers,
      resultId
    });
    return response.data;
  },

  // Obtenir les résultats d'un examen
  getExamResults: async (id) => {
    const response = await api.get(`/exams/${id}/results`);
    return response.data;
  }
};
