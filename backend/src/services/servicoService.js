const servicoRepository = require('../repositories/servicoRepository');

const criar = async (data) => {
  if (!data.nome || !data.preco || !data.duracao_minutos) {
    throw new Error('Dados obrigatórios não informados');
  }
  return servicoRepository.create(data);
};

const listar = () => servicoRepository.findAll();

const buscarPorId = async (id) => {
  const servico = await servicoRepository.findById(id);
  if (!servico) throw new Error('Serviço não encontrado');
  return servico;
};

const atualizar = async (id, data) => {
  const servico = await servicoRepository.update(id, data);
  if (!servico) throw new Error('Serviço não encontrado');
  return servico;
};

const deletar = async (id) => {
  const servico = await servicoRepository.findById(id);
  if (!servico) throw new Error('Serviço não encontrado');
  await servicoRepository.remove(id);
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };