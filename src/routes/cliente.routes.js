const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const router = express.Router();

// Rotas para clientes
router.get('/clientes', clienteController.findAll);
router.post('/clientes', clienteController.create);
router.get('/clientes/:id', clienteController.findOne);
router.put('/clientes/:id', clienteController.update);
router.delete('/clientes/:id', clienteController.delete);

module.exports = router;
