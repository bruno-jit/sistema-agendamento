const db = require('../config/db');

const create = async (data) => {
  const result = await db.query(
    `INSERT INTO agendamentos
    (cliente_id, profissional_id, servico_id, data_hora_inicio, data_hora_fim, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.cliente_id,
      data.profissional_id,
      data.servico_id,
      data.data_hora_inicio,
      data.data_hora_fim,
      data.status
    ]
  );
  return result.rows[0];
};

const findConflicting = async (profissional_id, inicio, fim) => {
  const result = await db.query(
    `SELECT * FROM agendamentos
     WHERE profissional_id = $1
     AND status = 'agendado'
     AND (
       data_hora_inicio < $3
       AND data_hora_fim > $2
     )`,
    [profissional_id, inicio, fim]
  );

  return result.rows;
};

const findByProfissionalAndDate = async (profissional_id, data) => {
  const result = await db.query(
    `SELECT * FROM agendamentos
     WHERE profissional_id = $1
     AND DATE(data_hora_inicio) = $2
     ORDER BY data_hora_inicio`,
    [profissional_id, data]
  );

  return result.rows;
};

module.exports = { create, findConflicting, findByProfissionalAndDate };