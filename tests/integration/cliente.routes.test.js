const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Testes de Integração para Rotas de Clientes (/api/clientes)', () => {
  beforeEach(async () => {
    // Limpa a tabela 'clientes' antes de cada teste
    await db.Cliente.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    // cascade: true e restartIdentity: true ajudam a resetar completamente a tabela, útil para testes
  });

  // --- Testes para a rota POST /api/clientes ---
  it('POST /api/clientes - deve criar um novo cliente e retornar status 201', async () => {
    const dadosNovoCliente = {
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      telefone: '123456789',
      cidade: 'São Paulo',
      estado: 'SP'
    };

    const response = await request(app).post('/api/clientes').send(dadosNovoCliente);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id_cliente');
    expect(response.body.nome).toBe(dadosNovoCliente.nome);
    expect(response.body.email).toBe(dadosNovoCliente.email);

    const clienteCriado = await db.Cliente.findByPk(response.body.id_cliente);
    expect(clienteCriado).not.toBeNull();
    expect(clienteCriado.nome).toBe(dadosNovoCliente.nome);
  });

  // --- Teste para POST /api/clientes ---
  it('POST /api/clientes - deve retornar status 400 se o campo obrigatório "nome" não for fornecido', async () => {
    const clienteInvalido = {
      email: 'invalido@example.com',
      telefone: '123456789',
      cidade: 'São Paulo',
      estado: 'SP'
    };

    console.log('Enviando cliente inválido:', clienteInvalido);

    const response = await request(app).post('/api/clientes').send(clienteInvalido);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // --- Testes para a rota GET /api/clientes ---
  it('GET /api/clientes - deve retornar uma lista de clientes e status 200', async () => {
    const clientesExemplo = [
      { nome: 'Cliente 1', email: 'cliente1@example.com', telefone: '111111111', cidade: 'Cidade 1', estado: 'SP' },
      { nome: 'Cliente 2', email: 'cliente2@example.com', telefone: '222222222', cidade: 'Cidade 2', estado: 'RJ' }
    ];

    await db.Cliente.bulkCreate(clientesExemplo);

    const response = await request(app).get('/api/clientes');

    console.log('Conteúdo de response.body para GET /api/clientes:', response.body);
    console.log('Content-Type da resposta:', response.headers['content-type']);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(clientesExemplo.length);
    expect(response.body[0]).toHaveProperty('id_cliente');
    expect(response.body[0].nome).toBe(clientesExemplo[0].nome);
  });

  it('GET /api/clientes - deve retornar uma lista vazia e status 200 se não houver clientes', async () => {
    const response = await request(app).get('/api/clientes');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  // --- Testes para a rota GET /api/clientes/:id ---
  it('GET /api/clientes/:id - deve retornar um cliente específico e status 200 se o ID existir', async () => {
    const clienteExemplo = await db.Cliente.create({
      nome: 'Cliente Exemplo',
      email: 'exemplo@example.com',
      telefone: '123456789',
      cidade: 'Cidade Exemplo',
      estado: 'SP'
    });

    console.log('Cliente Exemplo Criado no Teste:', JSON.stringify(clienteExemplo, null, 2));

    const response = await request(app).get(`/api/clientes/${clienteExemplo.id_cliente}`);

    console.log('ID sendo usado na requisição:', clienteExemplo.id_cliente);

    expect(response.statusCode).toBe(200);
    expect(response.body.id_cliente).toBe(clienteExemplo.id_cliente);
    expect(response.body.nome).toBe(clienteExemplo.nome);
  });

  it('GET /api/clientes/:id - deve retornar status 404 se o ID do cliente não existir', async () => {
    const response = await request(app).get('/api/clientes/999999');

    expect(response.statusCode).toBe(404);
  });

  // --- Testes para a rota PUT /api/clientes/:id ---
  it('PUT /api/clientes/:id - deve atualizar um cliente existente e retornar status 200', async () => {
    const clienteExemplo = await db.Cliente.create({
      nome: 'Cliente Atualizável',
      email: 'atualizavel@example.com',
      telefone: '123456789',
      cidade: 'Cidade Atualizável',
      estado: 'SP'
    });

    const dadosParaAtualizar = {
      nome: 'Cliente Atualizado',
      email: 'atualizado@example.com'
    };

    const response = await request(app).put(`/api/clientes/${clienteExemplo.id_cliente}`).send(dadosParaAtualizar);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const clienteAtualizado = await db.Cliente.findByPk(clienteExemplo.id_cliente);
    expect(clienteAtualizado.nome).toBe(dadosParaAtualizar.nome);
  });

  it('PUT /api/clientes/:id - deve retornar status apropriado (ex: 400 ou 404) se o ID não existir', async () => {
    const response = await request(app).put('/api/clientes/999999').send({ nome: 'Fantasma' });

    expect(response.statusCode).toBe(404);
  });

  // --- Testes para a rota DELETE /api/clientes/:id ---
  it('DELETE /api/clientes/:id - deve deletar um cliente e retornar status 200 (ou 204)', async () => {
    const clienteExemplo = await db.Cliente.create({
      nome: 'Cliente Deletável',
      email: 'deletavel@example.com',
      telefone: '123456789',
      cidade: 'Cidade Deletável',
      estado: 'SP'
    });

    const response = await request(app).delete(`/api/clientes/${clienteExemplo.id_cliente}`);

    expect(response.statusCode).toBe(200);

    const clienteDeletado = await db.Cliente.findByPk(clienteExemplo.id_cliente);
    expect(clienteDeletado).toBeNull();
  });

  it('DELETE /api/clientes/:id - deve retornar status 404 se o ID não existir', async () => {
    const response = await request(app).delete('/api/clientes/999999');

    expect(response.statusCode).toBe(404);
  });
});
