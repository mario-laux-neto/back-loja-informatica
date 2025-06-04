// src/models/pedido.model.js
module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define("pedido", {
    id_pedido: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cliente: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'cliente', key: 'id_cliente' }
    },
    data_pedido: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    valor_total: {
      type: Sequelize.DECIMAL(10, 2)
    }
  }, {
    tableName: 'pedido',
    timestamps: false
  });
  return Pedido;
};
