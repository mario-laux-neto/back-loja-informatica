module.exports = (sequelize, Sequelize) => {
  const ItemCarrinho = sequelize.define("item_carrinho", {
    id_item_carrinho: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_carrinho: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "carrinho",
        key: "id_carrinho"
      }
    },
    id_produto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "produto",
        key: "id_produto"
      }
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    preco_registrado: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'item_carrinho',
    timestamps: false
  });
  return ItemCarrinho;
};
