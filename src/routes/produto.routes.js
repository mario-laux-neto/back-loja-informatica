const express = require('express');
const produtosController = require('../controllers/produto.controller.js');
const multer = require('multer');

// Configuração do Multer para upload de múltiplas imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/produtos/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

// Atualizando as rotas para usar o middleware de upload
router.post('/produtos', upload.array('imagensProduto', 5), produtosController.create);
router.get('/produtos', produtosController.findAll);
router.get('/produtos/:id', produtosController.findOne);
router.put('/produtos/:id', upload.array('imagensProduto', 5), produtosController.update);
router.delete('/produtos/:id', produtosController.delete);

module.exports = router;
