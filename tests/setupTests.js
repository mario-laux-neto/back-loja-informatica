// Este arquivo configura o ambiente de teste antes e depois de todos os testes
const db = require('../src/models');

// Antes de todos os testes, conecta ao banco de dados de teste
beforeAll(async () => {
  try {
    await db.sequelize.authenticate();
    // Sincroniza o banco de dados de teste, apagando todas as tabelas e dados existentes
    await db.sequelize.sync({ force: true }); // { force: true } recria as tabelas, ideal para testes
    console.log('Conexão com o banco de dados de teste estabelecida.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados de teste:', error);
    throw error;
  }
});

// Após todos os testes, fecha a conexão com o banco de dados
afterAll(async () => {
  try {
    await db.sequelize.close();
    console.log('Conexão com o banco de dados de teste fechada.');
  } catch (error) {
    console.error('Erro ao fechar a conexão com o banco de dados de teste:', error);
    throw error;
  }
});

// Nota: Para testes de integração, use um banco de dados de teste separado ou limpe os dados entre os testes.
