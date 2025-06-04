// src/models/produto.model.js
const fs = require('fs');
const path = require('path');

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

  Produto.addHook('beforeDestroy', async (produto, options) => {
    if (produto.imagens && produto.imagens.length > 0) {
      console.log(`Deletando imagens para o produto ID: ${produto.id_produto}`);
      const promessasDelecao = produto.imagens.map(imgPath => {
        return new Promise((resolve, reject) => {
          const caminhoRelativoPublic = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
          const fullPath = path.join('public', caminhoRelativoPublic);

          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Falha ao deletar imagem ${fullPath} do produto ${produto.id_produto}:`, err);
              resolve();
            } else {
              console.log(`Imagem deletada: ${fullPath}`);
              resolve();
            }
          });
        });
      });
      await Promise.all(promessasDelecao).catch(err => console.error("Erro em uma das promessas de deleção de imagem:", err));
    }
  });

  return Produto;
};
