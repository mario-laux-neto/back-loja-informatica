const db = require("../models");
const Produto = db.Produto;
const Op = db.Sequelize.Op;

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

exports.update = (req, res) => {
  const id = req.params.id;

  // Lógica para lidar com upload de múltiplas imagens
  if (req.files && req.files.length > 0) {
    // Substituindo as imagens existentes por novas
    req.body.imagens = req.files.map(file => '/uploads/produtos/' + file.filename);
  } else if (req.body.imagens === undefined) {
    // Não modificar o campo 'imagens' se não houver novos uploads ou dados no body
    delete req.body.imagens;
  }

  Produto.update(req.body, { where: { id_produto: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Produto atualizado." });
      } else {
        res.status(404).send({ message: `Produto com id=${id} não encontrado ou dados não alterados.` });
      }
    })
    .catch(err => res.status(500).send({ message: "Erro ao atualizar Produto " + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Produto.destroy({ where: { id_produto: id } })
    .then(num => num == 1 ? res.send({ message: "Produto deletado." }) : res.status(404).send({ message: `Não foi possível deletar Produto ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao deletar Produto " + id }));
};
