// src/config/db.config.js
module.exports = {
  HOST: "localhost",
  USER: "postgres",          // Seu usuário do PostgreSQL
  PASSWORD: "your_password", // Sua senha do PostgreSQL
  DB: "vendas_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
// Lembre-se de alterar your_password e, se necessário, USER e HOST.
