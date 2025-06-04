// src/models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Cliente = require("./cliente.model.js")(sequelize, Sequelize);
db.Produto = require("./produto.model.js")(sequelize, Sequelize);
db.Pedido = require("./pedido.model.js")(sequelize, Sequelize);
db.ItemPedido = require("./itemPedido.model.js")(sequelize, Sequelize);
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);
db.Carrinho = require("./carrinho.model.js")(sequelize, Sequelize);
db.ItemCarrinho = require("./itemCarrinho.model.js")(sequelize, Sequelize);

// Associações
db.Cliente.hasMany(db.Pedido, { foreignKey: 'id_cliente', as: 'pedidos' });
db.Pedido.belongsTo(db.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

db.Pedido.hasMany(db.ItemPedido, { foreignKey: 'id_pedido', as: 'itensPedido' });
db.ItemPedido.belongsTo(db.Pedido, { foreignKey: 'id_pedido', as: 'pedido' });

db.Produto.hasMany(db.ItemPedido, { foreignKey: 'id_produto', as: 'itensPedido' });
db.ItemPedido.belongsTo(db.Produto, { foreignKey: 'id_produto', as: 'produto' });

db.Categoria.hasMany(db.Produto, { foreignKey: 'id_categoria', as: 'produtos' });
db.Produto.belongsTo(db.Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

// Associações do Carrinho
db.Cliente.hasOne(db.Carrinho, { foreignKey: 'id_cliente', as: 'carrinho' });
db.Carrinho.belongsTo(db.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

db.Carrinho.hasMany(db.ItemCarrinho, { foreignKey: 'id_carrinho', as: 'itens', onDelete: 'CASCADE' });
db.ItemCarrinho.belongsTo(db.Carrinho, { foreignKey: 'id_carrinho', as: 'carrinho' });

db.ItemCarrinho.belongsTo(db.Produto, { foreignKey: 'id_produto', as: 'produto' });

module.exports = db;
