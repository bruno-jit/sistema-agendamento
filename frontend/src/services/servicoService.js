import api from './api';

export const getServicos = () => api.get('/servicos');
export const createServico = (dados) => api.post('/servicos', dados);
export const deleteServico = (id) => api.delete(`/servicos/${id}`);