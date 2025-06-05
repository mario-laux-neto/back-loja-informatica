const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const authJwt = require("../middlewares/authJwt.middleware.js"); // Verifique se o caminho está correto
const router = express.Router();

// Rotas para clientes
router.get('/clientes', clienteController.findAll);
router.post('/clientes', clienteController.create);

// ROTA ESPECÍFICA '/meu-perfil' DEVE VIR ANTES DE '/:id'
router.get(
  "/clientes/meu-perfil",
  [authJwt.verifyToken],
  (req, res, next) => {
    // Este console.log é ótimo para depurar se a rota correta está sendo atingida
    console.log("Backend: Rota /api/clientes/meu-perfil acessada, middleware authJwt passou."); 
    next();
  },
  clienteController.meuPerfil
);

// Rota genérica com parâmetro :id DEPOIS da específica
router.get('/clientes/:id', clienteController.findOne);

// As rotas PUT e DELETE podem permanecer aqui ou serem ajustadas se também tiverem
// uma lógica específica para /meu-perfil vs /:id
router.put('/clientes/:id', [authJwt.verifyToken], clienteController.update); // Protegendo, mas :id ainda é genérico
router.delete('/clientes/:id', [authJwt.verifyToken], clienteController.delete); // Protegendo, mas :id ainda é genérico

router.put(
  "/clientes/meu-perfil",
  [authJwt.verifyToken],
  (req, res, next) => {
    console.log("Backend: Rota PUT /api/clientes/meu-perfil acessada, middleware authJwt passou.");
    next();
  },
  clienteController.updateMeuPerfil
);

module.exports = router;