// Configuração do Jest para testes do backend
module.exports = {
  // Define o ambiente de teste como Node.js
  testEnvironment: 'node',

  // Diretório onde os relatórios de cobertura de código serão armazenados
  coverageDirectory: './coverage/',

  // Limpa automaticamente os mocks entre os testes
  clearMocks: true,

  // Arquivos de configuração executados após o ambiente ser configurado
  setupFilesAfterEnv: ['./tests/setupTests.js'],
};
