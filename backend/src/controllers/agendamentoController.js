const service = require('../services/agendamentoService');

const criar = async (req, res) => {
  try {
    const result = await service.criarAgendamento(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

const cancelar = async (req, res) => {
  try {
    const { id } = req.params; 
    
    const result = await service.cancelarAgendamento(id);
    
    res.json({ mensagem: 'Agendamento cancelado com sucesso', agendamento: result });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

const listarAgenda = async (req, res) => {
  try {
    const { profissional_id, data } = req.query;

    const agenda = await service.listarAgendaPorProfissional(profissional_id, data);

    res.json(agenda);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

module.exports = { criar, listarAgenda, cancelar };