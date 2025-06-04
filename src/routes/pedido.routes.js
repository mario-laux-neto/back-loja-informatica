const express = require('express');
const pedidosController = require('../controllers/pedido.controller.js');
const router = express.Router();

router.post('/pedidos', pedidosController.create);
router.get('/pedidos', pedidosController.findAll);
router.get('/pedidos/:id', pedidosController.findOne);
router.put('/pedidos/:id', pedidosController.update);
router.delete('/pedidos/:id', pedidosController.delete);

module.exports = router;
