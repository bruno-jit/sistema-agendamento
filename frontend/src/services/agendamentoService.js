import api from './api';

export const getAgendamentos = () => api.get('/agendamentos');
export const createAgendamento = (data) => api.post('/agendamentos', data);
export const deleteAgendamento = (id) => api.delete(`/agendamentos/${id}`);
