const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Testes de Integração para Rotas de Produtos (/api/produtos)', () => {
  beforeEach(async () => {
    // Limpa a tabela 'produtos' antes de cada teste
    await db.Produto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  // --- Testes para a rota POST /api/produtos ---
  it('POST /api/produtos - deve criar um novo produto e retornar status 201', async () => {
    const categoria = await db.Categoria.create({ nome: 'Eletrônicos', descricao: 'Produtos eletrônicos e gadgets.' });

    const novoProduto = {
      nome: 'Smartphone',
      preco_unitario: 1500.00,
      estoque: 50,
      id_categoria: categoria.id_categoria
    };

    const response = await request(app).post('/api/produtos').send(novoProduto);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id_produto');
    expect(response.body).toMatchObject(novoProduto);

    const produtoSalvo = await db.Produto.findByPk(response.body.id_produto);
    expect(produtoSalvo).not.toBeNull();
  });

  it('POST /api/produtos - deve retornar status 400 se campos obrigatórios (nome, preco_unitario) não forem fornecidos', async () => {
    const produtoInvalido = {
      categoria: 'Eletrônicos'
    };

    const response = await request(app).post('/api/produtos').send(produtoInvalido);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // --- Testes para a rota GET /api/produtos ---
  it('GET /api/produtos - deve retornar uma lista de produtos e status 200', async () => {
    const produtosExemplo = [
      { nome: 'Produto 1', categoria: 'Categoria 1', preco_unitario: 100.00 },
      { nome: 'Produto 2', categoria: 'Categoria 2', preco_unitario: 200.00 }
    ];

    await db.Produto.bulkCreate(produtosExemplo);

    const response = await request(app).get('/api/produtos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(produtosExemplo.length);
    expect(response.body[0]).toHaveProperty('id_produto');
    expect(response.body[0].nome).toBe(produtosExemplo[0].nome);
  });

  it('GET /api/produtos - deve retornar uma lista vazia e status 200 se não houver produtos', async () => {
    const response = await request(app).get('/api/produtos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  // --- Testes para a rota GET /api/produtos/:id ---
  it('GET /api/produtos/:id - deve retornar um produto específico e status 200 se o ID existir', async () => {
    const produtoExemplo = await db.Produto.create({
      nome: 'Produto Exemplo',
      categoria: 'Categoria Exemplo',
      preco_unitario: 150.00
    });

    const response = await request(app).get(`/api/produtos/${produtoExemplo.id_produto}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id_produto).toBe(produtoExemplo.id_produto);
    expect(response.body.nome).toBe(produtoExemplo.nome);
  });

  it('GET /api/produtos/:id - deve retornar status 404 se o ID do produto não existir', async () => {
    const response = await request(app).get('/api/produtos/999999');

    expect(response.statusCode).toBe(404);
  });

  // --- Testes para a rota PUT /api/produtos/:id ---
  it('PUT /api/produtos/:id - deve atualizar um produto existente e retornar status 200', async () => {
    const produtoExemplo = await db.Produto.create({
      nome: 'Produto Atualizável',
      categoria: 'Categoria Atualizável',
      preco_unitario: 300.00
    });

    const dadosParaAtualizar = {
      nome: 'Produto Atualizado',
      preco_unitario: 350.00
    };

    const response = await request(app).put(`/api/produtos/${produtoExemplo.id_produto}`).send(dadosParaAtualizar);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();

    const produtoAtualizado = await db.Produto.findByPk(produtoExemplo.id_produto);
    expect(produtoAtualizado.nome).toBe(dadosParaAtualizar.nome);
  });

  it('PUT /api/produtos/:id - deve retornar status 404 se o ID não existir', async () => {
    const response = await request(app).put('/api/produtos/999999').send({ nome: 'Fantasma' });

    expect(response.statusCode).toBe(404);
  });

  // --- Testes para a rota DELETE /api/produtos/:id ---
  it('DELETE /api/produtos/:id - deve deletar um produto e retornar status 200 (ou 204)', async () => {
    const produtoExemplo = await db.Produto.create({
      nome: 'Produto Deletável',
      categoria: 'Categoria Deletável',
      preco_unitario: 400.00
    });

    const response = await request(app).delete(`/api/produtos/${produtoExemplo.id_produto}`);

    expect(response.statusCode).toBe(200);

    const produtoDeletado = await db.Produto.findByPk(produtoExemplo.id_produto);
    expect(produtoDeletado).toBeNull();
  });

  it('DELETE /api/produtos/:id - deve retornar status 404 se o ID não existir', async () => {
    const response = await request(app).delete('/api/produtos/999999');

    expect(response.statusCode).toBe(404);
  });
});
