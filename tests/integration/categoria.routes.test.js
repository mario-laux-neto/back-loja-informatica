const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Testes de Integração - Rotas /api/categorias', () => {
  beforeEach(async () => {
    // Limpeza das tabelas
    await db.Produto.destroy({ where: {}, truncate: true });
    await db.Categoria.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  it('POST /api/categorias - deve criar uma nova categoria e retornar status 201', async () => {
    const novaCategoria = {
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos e gadgets.'
    };

    const response = await request(app).post('/api/categorias').send(novaCategoria);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id_categoria');
    expect(response.body).toMatchObject(novaCategoria);

    const categoriaSalva = await db.Categoria.findByPk(response.body.id_categoria);
    expect(categoriaSalva).not.toBeNull();
  });

  it('GET /api/categorias - deve retornar uma lista de categorias e status 200', async () => {
    await db.Categoria.create({ nome: 'Eletrônicos', descricao: 'Produtos eletrônicos e gadgets.' });
    await db.Categoria.create({ nome: 'Móveis', descricao: 'Móveis para casa e escritório.' });

    const response = await request(app).get('/api/categorias');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('GET /api/categorias/:id - deve retornar uma categoria específica e status 200', async () => {
    const categoria = await db.Categoria.create({ nome: 'Eletrônicos', descricao: 'Produtos eletrônicos e gadgets.' });

    const response = await request(app).get(`/api/categorias/${categoria.id_categoria}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id_categoria', categoria.id_categoria);
    expect(response.body).toHaveProperty('nome', 'Eletrônicos');
  });

  it('PUT /api/categorias/:id - deve atualizar uma categoria existente e retornar status 200', async () => {
    const categoria = await db.Categoria.create({ nome: 'Eletrônicos', descricao: 'Produtos eletrônicos e gadgets.' });

    const atualizacao = { nome: 'Eletrônicos Atualizados', descricao: 'Nova descrição.' };
    const response = await request(app).put(`/api/categorias/${categoria.id_categoria}`).send(atualizacao);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Categoria atualizada.');

    const categoriaAtualizada = await db.Categoria.findByPk(categoria.id_categoria);
    expect(categoriaAtualizada.nome).toBe('Eletrônicos Atualizados');
  });

  it('DELETE /api/categorias/:id - deve deletar uma categoria existente e retornar status 200', async () => {
    const categoria = await db.Categoria.create({ nome: 'Eletrônicos', descricao: 'Produtos eletrônicos e gadgets.' });

    const response = await request(app).delete(`/api/categorias/${categoria.id_categoria}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Categoria deletada.');

    const categoriaDeletada = await db.Categoria.findByPk(categoria.id_categoria);
    expect(categoriaDeletada).toBeNull();
  });
});
