const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Testes de Integração - Rotas /api/itens-pedido', () => {
  beforeEach(async () => {
    // Limpeza das tabelas na ordem correta devido às chaves estrangeiras
    await db.ItemPedido.destroy({ where: {}, truncate: true });
    await db.Pedido.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Produto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Cliente.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Vendedor.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  it('POST /api/itens-pedido - deve criar um novo item de pedido e retornar status 201', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto Teste', preco_unitario: 100, estoque: 10 });
    const pedido = await db.Pedido.create({
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      valor_total: 100
    });

    const dadosNovoItem = {
      id_pedido: pedido.id_pedido,
      id_produto: produto.id_produto,
      quantidade: 2,
      preco_unitario: "100.00" // Campos DECIMAL do banco são frequentemente retornados como strings pela API.
    };

    const response = await request(app).post('/api  /itens-pedido').send(dadosNovoItem);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id_item');
    expect(response.body).toMatchObject(dadosNovoItem);

    const itemSalvo = await db.ItemPedido.findByPk(response.body.id_item);
    expect(itemSalvo).not.toBeNull();
  });

  it('GET /api/itens-pedido - deve retornar uma lista de itens de pedido e status 200', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto Teste', preco_unitario: 100, estoque: 10 });
    const pedido = await db.Pedido.create({
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      valor_total: 100
    });

    await db.ItemPedido.create({
      id_pedido: pedido.id_pedido,
      id_produto: produto.id_produto,
      quantidade: 2,
      preco_unitario: 100
    });

    const response = await request(app).get('/api/itens-pedido');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id_pedido', pedido.id_pedido);
  });

  it('GET /api/itens-pedido/:id - deve retornar um item de pedido específico e status 200', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto Teste', preco_unitario: 100, estoque: 10 });
    const pedido = await db.Pedido.create({
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      valor_total: 100
    });

    const item = await db.ItemPedido.create({
      id_pedido: pedido.id_pedido,
      id_produto: produto.id_produto,
      quantidade: 2,
      preco_unitario: 100
    });

    const response = await request(app).get(`/api/itens-pedido/${item.id_item}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id_item', item.id_item);
    expect(response.body).toHaveProperty('id_pedido', pedido.id_pedido);
  });
});
