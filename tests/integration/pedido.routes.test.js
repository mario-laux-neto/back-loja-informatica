// Teste de sincronização: Verificando se o arquivo está atualizado corretamente.
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Testes de Integração - Rotas /api/pedidos', () => {
  beforeEach(async () => {
    // Limpeza das tabelas na ordem correta devido às chaves estrangeiras
    await db.ItemPedido.destroy({ where: {}, truncate: true });
    await db.Pedido.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Produto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Cliente.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await db.Vendedor.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  });

  it('POST /api/pedidos - deve criar um novo pedido com itens, atualizar estoque e retornar status 201', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto1 = await db.Produto.create({ nome: 'Produto 1', preco_unitario: 100, estoque: 10 });
    const produto2 = await db.Produto.create({ nome: 'Produto 2', preco_unitario: 50, estoque: 5 });

    const dadosNovoPedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      itens: [
        { id_produto: produto1.id_produto, quantidade: 2 },
        { id_produto: produto2.id_produto, quantidade: 1 }
      ]
    };

    const response = await request(app).post('/api/pedidos').send(dadosNovoPedido);

    expect(response.statusCode).toBe(201);
    // O tipo DECIMAL é frequentemente retornado como string do backend para preservar a precisão.
    // Por isso, usamos parseFloat para converter ou comparamos diretamente como string.
    expect(response.body).toHaveProperty('valor_total');
    expect(parseFloat(response.body.valor_total)).toBe(250);
    expect(response.body.cliente).toHaveProperty('nome', 'Cliente Teste');
    expect(response.body.vendedor).toHaveProperty('nome', 'Vendedor Teste');
    expect(response.body.itensPedido).toHaveLength(2);

    const produtoAtualizado1 = await db.Produto.findByPk(produto1.id_produto);
    const produtoAtualizado2 = await db.Produto.findByPk(produto2.id_produto);
    expect(produtoAtualizado1.estoque).toBe(8);
    expect(produtoAtualizado2.estoque).toBe(4);

    const pedidoSalvo = await db.Pedido.findByPk(response.body.id_pedido, {
      include: [{ model: db.ItemPedido, as: 'itensPedido' }]
    });
    expect(pedidoSalvo).not.toBeNull();
    expect(pedidoSalvo.itensPedido).toHaveLength(2);
  });

  it('POST /api/pedidos - deve retornar status 400 se dados básicos do pedido estiverem incompletos', async () => {
    const response = await request(app).post('/api/pedidos').send({
      id_vendedor: 1,
      data_pedido: '2025-06-04',
      itens: []
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Dados do pedido incompletos ou sem itens!');
  });

  it('POST /api/pedidos - deve retornar status 500 (ou apropriado) se o estoque do produto for insuficiente', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto 1', preco_unitario: 100, estoque: 1 });

    const dadosNovoPedido = {
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      itens: [{ id_produto: produto.id_produto, quantidade: 2 }]
    };

    const response = await request(app).post('/api/pedidos').send(dadosNovoPedido);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', expect.stringContaining('Estoque insuficiente'));
  });

  it('GET /api/pedidos - deve retornar uma lista de pedidos com cliente, vendedor e itens (com produto), e status 200', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto 1', preco_unitario: 100, estoque: 10 });

    const pedido = await db.Pedido.create({
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      valor_total: 100
    });

    await db.ItemPedido.create({
      id_pedido: pedido.id_pedido,
      id_produto: produto.id_produto,
      quantidade: 1,
      preco_unitario: 100
    });

    const response = await request(app).get('/api/pedidos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('cliente.nome', 'Cliente Teste');
    expect(response.body[0]).toHaveProperty('vendedor.nome', 'Vendedor Teste');
    expect(response.body[0].itensPedido[0]).toHaveProperty('produto.nome', 'Produto 1');
  });

  it('GET /api/pedidos/:id - deve retornar um pedido específico com detalhes e status 200', async () => {
    const cliente = await db.Cliente.create({ nome: 'Cliente Teste', email: 'cliente@teste.com' });
    const vendedor = await db.Vendedor.create({ nome: 'Vendedor Teste' });
    const produto = await db.Produto.create({ nome: 'Produto 1', preco_unitario: 100, estoque: 10 });

    const pedido = await db.Pedido.create({
      id_cliente: cliente.id_cliente,
      id_vendedor: vendedor.id_vendedor,
      data_pedido: '2025-06-04',
      valor_total: 100
    });

    await db.ItemPedido.create({
      id_pedido: pedido.id_pedido,
      id_produto: produto.id_produto,
      quantidade: 1,
      preco_unitario: 100
    });

    const response = await request(app).get(`/api/pedidos/${pedido.id_pedido}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id_pedido', pedido.id_pedido);
    expect(response.body).toHaveProperty('cliente.nome', 'Cliente Teste');
    expect(response.body).toHaveProperty('vendedor.nome', 'Vendedor Teste');
    expect(response.body.itensPedido[0]).toHaveProperty('produto.nome', 'Produto 1');
  });
});
