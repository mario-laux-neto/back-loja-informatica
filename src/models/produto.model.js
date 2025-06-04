// src/models/produto.model.js
module.exports = (sequelize, Sequelize) => {
  const Produto = sequelize.define("produto", {
    id_produto: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    id_categoria: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'id_categoria'
      }
    },
    preco_unitario: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    estoque: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    // Campo para armazenar múltiplas imagens como um array de strings (caminhos/URLs)
    imagens: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [] // Inicia como um array vazio
    }
  }, {
    tableName: 'produto',
    timestamps: false
  });
  return Produto;
};
