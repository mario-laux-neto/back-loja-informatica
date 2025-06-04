module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define("categoria", {
    id_categoria: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'categoria',
    timestamps: false
  });
  return Categoria;
};
