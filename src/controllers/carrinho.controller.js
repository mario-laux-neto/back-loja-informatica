const db = require("../models");
const Carrinho = db.Carrinho;
const ItemCarrinho = db.ItemCarrinho;
const Produto = db.Produto;
const { sequelize } = db;

exports.getMeuCarrinho = async (req, res) => {
  try {
    const carrinho = await Carrinho.findOrCreate({
      where: { id_cliente: req.id_cliente },
      include: [{
        model: ItemCarrinho,
        as: 'itens',
        include: [{ model: Produto, as: 'produto' }]
      }]
    });
    res.status(200).json(carrinho);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar o carrinho.", error: error.message });
  }
};

exports.adicionarItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_produto, quantidade = 1 } = req.body;
    const carrinho = await Carrinho.findOrCreate({ where: { id_cliente: req.id_cliente }, transaction });
    const produto = await Produto.findByPk(id_produto);

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    const precoRegistrado = produto.preco_unitario;
    const itemExistente = await ItemCarrinho.findOne({ where: { id_carrinho: carrinho[0].id_carrinho, id_produto }, transaction });

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      await itemExistente.save({ transaction });
    } else {
      await ItemCarrinho.create({
        id_carrinho: carrinho[0].id_carrinho,
        id_produto,
        quantidade,
        preco_registrado: precoRegistrado
      }, { transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: "Item adicionado ao carrinho com sucesso." });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erro ao adicionar item ao carrinho.", error: error.message });
  }
};
