const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinho.controller.js");
const authJwt = require("../middlewares/authJwt.middleware.js");

router.get("/meu-carrinho", authJwt.verifyToken, carrinhoController.getMeuCarrinho);
router.post("/meu-carrinho/itens", authJwt.verifyToken, carrinhoController.adicionarItem);

module.exports = router;
