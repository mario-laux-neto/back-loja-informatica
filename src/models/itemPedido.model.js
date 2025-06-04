// src/models/itemPedido.model.js
module.exports = (sequelize, Sequelize) => {
  const ItemPedido = sequelize.define("item_pedido", {
    id_item: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pedido: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'pedido', key: 'id_pedido' }
    },
    id_produto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'produto', key: 'id_produto' }
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    preco_unitario: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'item_pedido',
    timestamps: false
  });
  return ItemPedido;
};
