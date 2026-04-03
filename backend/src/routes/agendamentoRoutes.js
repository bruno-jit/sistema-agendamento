const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentoController');

router.post('/', controller.criar);
router.get('/agenda', controller.listarAgenda);

module.exports = router;