const repoProf = require('../repositories/profissionalRepository');

const criar = async (data) => {
  if (!data.nome) throw new Error('Nome é obrigatório');
  return repoProf.createProf(data);
};

const listar = () => repoProf.findAllProf();

const buscarPorId = async (id) => {
  const p = await repoProf.findByIdProf(id);
  if (!p) throw new Error('Profissional não encontrado');
  return p;
};

const atualizar = async (id, data) => {
  const p = await repoProf.updateProf(id, data);
  if (!p) throw new Error('Profissional não encontrado');
  return p;
};

const deletar = async (id) => {
  const p = await repoProf.findByIdProf(id);
  if (!p) throw new Error('Profissional não encontrado');
  await repoProf.removeProf(id);
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };