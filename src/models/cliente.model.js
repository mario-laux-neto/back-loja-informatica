// src/models/cliente.model.js
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define("cliente", {
    id_cliente: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100)
    },
    telefone: {
      type: Sequelize.STRING(20)
    },
    cidade: {
      type: Sequelize.STRING(50)
    },
    estado: {
      type: Sequelize.STRING(2)
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'cliente',
    timestamps: false,
    hooks: {
      beforeCreate: async (cliente) => {
        if (cliente.senha) {
          const salt = await bcrypt.genSalt(10);
          cliente.senha = await bcrypt.hash(cliente.senha, salt);
        }
      },
      beforeUpdate: async (cliente) => {
        if (cliente.changed("senha")) {
          const salt = await bcrypt.genSalt(10);
          cliente.senha = await bcrypt.hash(cliente.senha, salt);
        }
      }
    },
  });
  return Cliente;
};
