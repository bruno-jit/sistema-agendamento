const db = require('../config/db');

const create = async (data) => {
  const result = await db.query(
    `INSERT INTO servicos (nome, descricao, preco, duracao_minutos)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.nome, data.descricao, data.preco, data.duracao_minutos]
  );
  return result.rows[0];
};

const findAll = async () => {
  const result = await db.query('SELECT * FROM servicos ORDER BY id');
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM servicos WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, data) => {
  const result = await db.query(
    `UPDATE servicos SET nome=$1, descricao=$2, preco=$3, duracao_minutos=$4
     WHERE id=$5 RETURNING *`,
    [data.nome, data.descricao, data.preco, data.duracao_minutos, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  await db.query('DELETE FROM servicos WHERE id=$1', [id]);
};

module.exports = { create, findAll, findById, update, remove };