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
  const data = new Date(inicio);
  data.setMinutes(data.getMinutes() + duracao);
  return data;
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

module.exports = { criarAgendamento, listarAgendaPorProfissional };