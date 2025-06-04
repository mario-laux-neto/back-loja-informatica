const express = require('express');
const categoriasController = require('../controllers/categoria.controller.js');
const router = express.Router();

router.post('/categorias', categoriasController.create);
router.get('/categorias', categoriasController.findAll);
router.get('/categorias/:id', categoriasController.findOne);
router.put('/categorias/:id', categoriasController.update);
router.delete('/categorias/:id', categoriasController.delete);

module.exports = router;
