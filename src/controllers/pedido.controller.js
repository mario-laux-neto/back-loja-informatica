const db = require("../models");
const Pedido = db.Pedido;
const ItemPedido = db.ItemPedido;
const Produto = db.Produto;
const Cliente = db.Cliente;
const Vendedor = db.Vendedor;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  if (!req.body.id_cliente || !req.body.data_pedido || !req.body.itens || req.body.itens.length === 0) {
    return res.status(400).send({ message: "Dados do pedido incompletos ou sem itens!" });
  }

  const t = await db.sequelize.transaction();

  try {
    let valorTotalPedido = 0;
    const itensParaCriarDetalhes = [];

    for (const item of req.body.itens) {
      if (!item.id_produto || !item.quantidade) {
        throw new Error("Cada item deve ter id_produto e quantidade.");
      }
      const produto = await Produto.findByPk(item.id_produto, { transaction: t });
      if (!produto) {
        throw new Error(`Produto com ID ${item.id_produto} não encontrado.`);
      }
      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}, Solicitado: ${item.quantidade}`);
      }

      const precoUnitarioItem = produto.preco_unitario;
      valorTotalPedido += precoUnitarioItem * item.quantidade;
      itensParaCriarDetalhes.push({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        preco_unitario: precoUnitarioItem
      });

      await Produto.update(
        { estoque: produto.estoque - item.quantidade },
        { where: { id_produto: item.id_produto }, transaction: t }
      );
    }

    const novoPedido = await Pedido.create({
      id_cliente: req.body.id_cliente,
      data_pedido: req.body.data_pedido,
      valor_total: valorTotalPedido
    }, { transaction: t });

    await ItemPedido.bulkCreate(
      itensParaCriarDetalhes.map(detalhe => ({ ...detalhe, id_pedido: novoPedido.id_pedido })),
      { transaction: t }
    );

    await t.commit();

    const pedidoCompleto = await Pedido.findByPk(novoPedido.id_pedido, {
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nome', 'email'] },
        { model: Vendedor, as: 'vendedor', attributes: ['nome'] },
        {
          model: ItemPedido, as: 'itensPedido',
          include: [{ model: Produto, as: 'produto', attributes: ['nome', 'preco_unitario'] }]
        }
      ]
    });
    res.status(201).send(pedidoCompleto);

  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: err.message || "Ocorreu um erro ao criar o Pedido."
    });
  }
};

exports.findAll = (req, res) => {
  Pedido.findAll({
    include: [
      { model: Cliente, as: 'cliente', attributes: ['id_cliente', 'nome'] },
      { model: Vendedor, as: 'vendedor', attributes: ['id_vendedor', 'nome'] },
      {
        model: ItemPedido, as: 'itensPedido',
        include: [{ model: Produto, as: 'produto', attributes: ['id_produto', 'nome', 'preco_unitario'] }]
      }
    ],
    order: [['data_pedido', 'DESC']]
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao listar Pedidos." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Pedido.findByPk(id, {
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Vendedor, as: 'vendedor' },
      {
        model: ItemPedido, as: 'itensPedido',
        include: [{ model: Produto, as: 'produto' }]
      }
    ]
  })
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Pedido ${id} não encontrado.` }))
    .catch(err => res.status(500).send({ message: "Erro ao buscar Pedido " + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Pedido.update(req.body, { where: { id_pedido: id } })
    .then(num => num == 1 ? res.send({ message: "Pedido atualizado." }) : res.status(400).send({ message: `Não foi possível atualizar Pedido ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao atualizar Pedido " + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Pedido.destroy({ where: { id_pedido: id } })
    .then(num => num == 1 ? res.send({ message: "Pedido deletado." }) : res.status(404).send({ message: `Não foi possível deletar Pedido ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao deletar Pedido " + id }));
};
