module.exports = (sequelize, Sequelize) => {
  const Carrinho = sequelize.define("carrinho", {
    id_carrinho: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cliente: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "cliente",
        key: "id_cliente"
      }
    }
  }, {
    tableName: 'carrinho',
    timestamps: true
  });
  return Carrinho;
};
