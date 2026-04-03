const clienteService = require('../services/clienteService');

const criar = async (req, res) => {
  try {
    const cliente = await clienteService.criarCliente(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

const listar = async (req, res) => {
  const clientes = await clienteService.listarClientes();
  res.json(clientes);
};

const buscarPorId = async (req, res) => {
  try {
    const cliente = await clienteService.buscarClientePorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};

const atualizar = async (req, res) => {
  try {
    const cliente = await clienteService.atualizarCliente(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};

const deletar = async (req, res) => {
  try {
    await clienteService.deletarCliente(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };