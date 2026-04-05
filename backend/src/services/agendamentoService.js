const agendamentoRepository = require('../repositories/agendamentoRepository');
const db2 = require('../config/db');

const getDuracaoServico = async (servico_id) => {
  const result = await db2.query(
    'SELECT duracao_minutos FROM servicos WHERE id = $1',
    [servico_id]
  );

  if (result.rows.length === 0) {
    throw new Error('Serviço não encontrado');
  }

  return result.rows[0].duracao_minutos;
};

const calcularFim = (inicio, duracao) => {
  const data = new Date(inicio.replace(' ', 'T'));
  data.setMinutes(data.getMinutes() + duracao);
  
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

const criarAgendamento = async (data) => {
  if (!data.cliente_id || !data.profissional_id || !data.servico_id || !data.data_hora_inicio) {
    throw new Error('Dados obrigatórios não informados');
  }

  const duracao = await getDuracaoServico(data.servico_id);

  const dataFim = calcularFim(data.data_hora_inicio, duracao);

  const conflitos = await agendamentoRepository.findConflicting(
    data.profissional_id,
    data.data_hora_inicio,
    dataFim
  );

  if (conflitos.length > 0) {
    throw new Error('Horário já ocupado para este profissional');
  }

  return await agendamentoRepository.create({
    ...data,
    data_hora_fim: dataFim,
    status: 'agendado'
  });
};

const listarAgendaPorProfissional = async (profissional_id, data) => {
  return await agendamentoRepository.findByProfissionalAndDate(profissional_id, data);
};

const cancelarAgendamento = async (id) => {
  if (!id) {
    throw new Error('ID do agendamento é obrigatório');
  }

  const agendamentoDeletado = await agendamentoRepository.remove(id);

  if (!agendamentoDeletado) {
    throw new Error('Agendamento não encontrado ou já excluído');
  }

  return agendamentoDeletado;
};

module.exports = { criarAgendamento, listarAgendaPorProfissional, cancelarAgendamento };