const serviceProf = require('../services/profissionalService');

const criar = async (req, res) => {
  try {
    res.status(201).json(await serviceProf.criar(req.body));
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

const listar = async (req, res) => {
  res.json(await serviceProf.listar());
};

const buscarPorId = async (req, res) => {
  try {
    res.json(await serviceProf.buscarPorId(req.params.id));
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

const atualizar = async (req, res) => {
  try {
    res.json(await serviceProf.atualizar(req.params.id, req.body));
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

const deletar = async (req, res) => {
  try {
    await serviceProf.deletar(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ erro: e.message });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };