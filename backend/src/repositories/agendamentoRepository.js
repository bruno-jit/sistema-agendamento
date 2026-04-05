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
const remove = async (id) => {
  const result = await db.query(
    'DELETE FROM agendamentos WHERE id = $1 RETURNING *',
    [id]
  );
  
  return result.rows[0];
};

const findByProfissionalAndDate = async (profissional_id, data) => {
  let query = `
    SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome 
    FROM agendamentos a
    LEFT JOIN clientes c ON a.cliente_id = c.id
    LEFT JOIN servicos s ON a.servico_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (profissional_id) {
    params.push(profissional_id);
    query += ` AND a.profissional_id = $${params.length}`;
  }
  if (data) {
    params.push(data);
    query += ` AND DATE(a.data_hora_inicio) = $${params.length}`;
  }

  query += ` ORDER BY a.data_hora_inicio`;

  const result = await db.query(query, params);
  return result.rows;
};

module.exports = { create, findConflicting, findByProfissionalAndDate, remove };