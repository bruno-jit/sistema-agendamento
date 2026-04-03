const clienteRepository = require('../repositories/clienteRepository');

const criarCliente = async (data) => {
  if (!data.nome || !data.telefone) {
    throw new Error('Nome e telefone são obrigatórios');
  }
  return await clienteRepository.create(data);
};

const listarClientes = async () => {
  return await clienteRepository.findAll();
};

const buscarClientePorId = async (id) => {
  const cliente = await clienteRepository.findById(id);
  if (!cliente) throw new Error('Cliente não encontrado');
  return cliente;
};

const atualizarCliente = async (id, data) => {
  const cliente = await clienteRepository.update(id, data);
  if (!cliente) throw new Error('Cliente não encontrado');
  return cliente;
};

const deletarCliente = async (id) => {
  const cliente = await clienteRepository.findById(id);
  if (!cliente) throw new Error('Cliente não encontrado');
  await clienteRepository.remove(id);
};

module.exports = {
  criarCliente,
  listarClientes,
  buscarClientePorId,
  atualizarCliente,
  deletarCliente
};