const db2 = require('../config/db');

const createProf = async (data) => {
  const result = await db2.query(
    `INSERT INTO profissionais (nome, telefone, ativo)
     VALUES ($1, $2, $3) RETURNING *`,
    [data.nome, data.telefone, data.ativo ?? true]
  );
  return result.rows[0];
};

const findAllProf = async () => {
  const result = await db2.query('SELECT * FROM profissionais');
  return result.rows;
};

const findByIdProf = async (id) => {
  const result = await db2.query('SELECT * FROM profissionais WHERE id=$1', [id]);
  return result.rows[0];
};

const updateProf = async (id, data) => {
  const result = await db2.query(
    `UPDATE profissionais SET nome=$1, telefone=$2, ativo=$3
     WHERE id=$4 RETURNING *`,
    [data.nome, data.telefone, data.ativo, id]
  );
  return result.rows[0];
};

const removeProf = async (id) => {
  await db2.query('DELETE FROM profissionais WHERE id=$1', [id]);
};

module.exports = {
  createProf,
  findAllProf,
  findByIdProf,
  updateProf,
  removeProf
};