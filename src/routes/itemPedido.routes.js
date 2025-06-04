const express = require('express');
const itensPedidoController = require('../controllers/itemPedido.controller.js');
const router = express.Router();

router.post('/itens-pedido', itensPedidoController.create);
router.get('/itens-pedido', itensPedidoController.findAll);
router.get('/itens-pedido/:id', itensPedidoController.findOne);
router.put('/itens-pedido/:id', itensPedidoController.update);
router.delete('/itens-pedido/:id', itensPedidoController.delete);

module.exports = router;
