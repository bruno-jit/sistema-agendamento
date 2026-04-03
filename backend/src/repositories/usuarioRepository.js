const db = require('../config/db');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
};
const create = async (usuario) => {
  const result = await db.query(
    `INSERT INTO usuarios (nome, email, senha, tipo)
     VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo`,
    [usuario.nome, usuario.email, usuario.senha, usuario.tipo]
  );
  return result.rows[0];
};

module.exports = { findByEmail, create };