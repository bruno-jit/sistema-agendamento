const servicoService = require('../services/servicoService');

const criar = async (req, res) => {
  try {
    const data = await servicoService.criar(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

const listar = async (req, res) => {
  res.json(await servicoService.listar());
};

const buscarPorId = async (req, res) => {
  try {
    res.json(await servicoService.buscarPorId(req.params.id));
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

const atualizar = async (req, res) => {
  try {
    res.json(await servicoService.atualizar(req.params.id, req.body));
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

const deletar = async (req, res) => {
  try {
    await servicoService.deletar(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };