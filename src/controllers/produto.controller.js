const db = require("../models");
const Produto = db.Produto;
const Op = db.Sequelize.Op;
const fs = require('fs');
const path = require('path');

exports.create = (req, res) => {
  if (!req.body.nome || !req.body.preco_unitario) {
    return res.status(400).send({ message: "Nome e preço unitário são obrigatórios!" });
  }

  // Lógica para lidar com upload de múltiplas imagens
  if (req.files && req.files.length > 0) {
    // Mapeando os caminhos das imagens enviadas
    req.body.imagens = req.files.map(file => '/uploads/produtos/' + file.filename);
  } else {
    // Garantindo que o campo 'imagens' seja inicializado como um array vazio
    req.body.imagens = req.body.imagens || [];
  }

  Produto.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao criar Produto." }));
};

exports.findAll = (req, res) => {
  const nome = req.query.nome;
  var condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : null;
  Produto.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao listar Produtos." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Produto.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Produto ${id} não encontrado.` }))
    .catch(err => res.status(500).send({ message: "Erro ao buscar Produto " + id }));
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    if ((req.files && req.files.length > 0) || (Array.isArray(req.body.imagens) && req.body.imagens.length === 0)) {
      const produtoExistente = await Produto.findByPk(id);
      if (produtoExistente && produtoExistente.imagens && produtoExistente.imagens.length > 0) {
        produtoExistente.imagens.forEach(imgPath => {
          const caminhoRelativoPublic = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
          const fullPath = path.join('public', caminhoRelativoPublic);

          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Falha ao deletar imagem antiga ${fullPath}:`, err);
            } else {
              console.log(`Imagem antiga deletada: ${fullPath}`);
            }
          });
        });
      }

      if (req.files && req.files.length > 0) {
        req.body.imagens = req.files.map(file => `/uploads/produtos/${file.filename}`);
      } else if (Array.isArray(req.body.imagens) && req.body.imagens.length === 0) {
        req.body.imagens = [];
      } else {
        delete req.body.imagens;
      }
    }

    const [updated] = await Produto.update(req.body, { where: { id_produto: id } });

    if (updated) {
      const produtoAtualizado = await Produto.findByPk(id);
      res.status(200).json(produtoAtualizado);
    } else {
      res.status(404).json({ message: "Produto não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto.", error: error.message });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Produto.destroy({ where: { id_produto: id } })
    .then(num => num == 1 ? res.send({ message: "Produto deletado." }) : res.status(404).send({ message: `Não foi possível deletar Produto ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao deletar Produto " + id }));
};
