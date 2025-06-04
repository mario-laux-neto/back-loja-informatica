// server.js (na raiz)
const app = require('./src/app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}. (Iniciado pelo server.js na raiz)`);
});
