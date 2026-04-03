const db = require('../config/db');

const create = async (cliente) => {
  const query = `INSERT INTO clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING *`;
  const values = [cliente.nome, cliente.telefone, cliente.email];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findAll = async () => {
  const result = await db.query('SELECT * FROM clientes ORDER BY id');
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, cliente) => {
  const query = `
    UPDATE clientes
    SET nome = $1, telefone = $2, email = $3
    WHERE id = $4
    RETURNING *
  `;
  const values = [cliente.nome, cliente.telefone, cliente.email, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

const remove = async (id) => {
  await db.query('DELETE FROM clientes WHERE id = $1', [id]);
};

module.exports = { create, findAll, findById, update, remove };