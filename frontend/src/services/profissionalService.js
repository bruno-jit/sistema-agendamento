import api from './api';

export const getProfissionais = () => api.get('/profissionais');
export const createProfissional = (dados) => api.post('/profissionais', dados);
export const deleteProfissional = (id) => api.delete(`/profissionais/${id}`);