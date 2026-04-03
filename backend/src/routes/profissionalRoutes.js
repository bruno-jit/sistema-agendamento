const express = require('express');
const routerProf = express.Router();
const controllerProf = require('../controllers/profissionalController');

routerProf.post('/', controllerProf.criar);
routerProf.get('/', controllerProf.listar);
routerProf.get('/:id', controllerProf.buscarPorId);
routerProf.put('/:id', controllerProf.atualizar);
routerProf.delete('/:id', controllerProf.deletar);

module.exports = routerProf;