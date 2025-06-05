// src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000" // Altere para a origem do seu frontend em produção
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sincronização do banco de dados
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco de dados sincronizado. (src/app.js)");
  })
  .catch((err) => {
    console.log("Falha ao sincronizar o banco de dados: " + err.message);
  });

db.sequelize.authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

app.get("/api", (req, res) => {
  res.json({ message: "Bem-vindo à API de Vendas." });
});

// Rota de teste para verificar a API
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API funcionando corretamente!' });
});

// Rotas da API
const clienteRoutes = require("./routes/cliente.routes.js");
const produtoRoutes = require("./routes/produto.routes.js");
const pedidoRoutes = require("./routes/pedido.routes.js");
const itemPedidoRoutes = require("./routes/itemPedido.routes.js");
const categoriaRoutes = require("./routes/categoria.routes.js");
const authRoutes = require("./routes/auth.routes.js"); // Importação das rotas de autenticação
const carrinhoRoutes = require("./routes/carrinho.routes.js"); // Importação das rotas de carrinho

app.use('/api', clienteRoutes);
app.use('/api', produtoRoutes);
app.use('/api', pedidoRoutes);
app.use('/api', itemPedidoRoutes);
app.use('/api', categoriaRoutes);
app.use("/api/auth", authRoutes); // Montagem das rotas de autenticação
app.use("/api/carrinho", carrinhoRoutes); // Montagem das rotas de carrinho

app.use(express.static(path.join(__dirname, '../public')));

console.log("Valor de JWT_SECRET:", process.env.JWT_SECRET);

module.exports = app;
