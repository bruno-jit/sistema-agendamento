const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentoController');

router.post('/', controller.criar);
router.get('/', controller.listarAgenda);
router.delete('/:id', controller.cancelar);

module.exports = router;