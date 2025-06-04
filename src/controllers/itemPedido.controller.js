const db = require("../models");
const ItemPedido = db.ItemPedido;
const Produto = db.Produto;
const Pedido = db.Pedido;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.id_pedido || !req.body.id_produto || !req.body.quantidade || req.body.preco_unitario === undefined) {
    return res.status(400).send({ message: "id_pedido, id_produto, quantidade e preco_unitario são obrigatórios!" });
  }
  ItemPedido.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao criar ItemPedido." }));
};

exports.findAll = (req, res) => {
  const { id_pedido } = req.query;
  let condition = {};
  if (id_pedido) {
    condition.id_pedido = id_pedido;
  }
  ItemPedido.findAll({
    where: condition,
    include: [
      { model: Produto, as: 'produto', attributes: ['nome', 'categoria'] },
      { model: Pedido, as: 'pedido', attributes: ['data_pedido'] }
    ]
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao listar ItensPedido." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id; // id_item
  ItemPedido.findByPk(id, {
    include: [
      { model: Pedido, as: 'pedido' },
      { model: Produto, as: 'produto' }
    ]
  })
    .then(data => data ? res.send(data) : res.status(404).send({ message: `ItemPedido ${id} não encontrado.` }))
    .catch(err => res.status(500).send({ message: "Erro ao buscar ItemPedido " + id }));
};

exports.update = (req, res) => {
  const id = req.params.id; // id_item
  ItemPedido.update(req.body, { where: { id_item: id } })
    .then(num => num == 1 ? res.send({ message: "ItemPedido atualizado." }) : res.status(400).send({ message: `Não foi possível atualizar ItemPedido ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao atualizar ItemPedido " + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id; // id_item
  ItemPedido.destroy({ where: { id_item: id } })
    .then(num => num == 1 ? res.send({ message: "ItemPedido deletado." }) : res.status(404).send({ message: `Não foi possível deletar ItemPedido ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao deletar ItemPedido " + id }));
};
