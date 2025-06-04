const db = require("../models");
const Categoria = db.Categoria;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.nome) {
    return res.status(400).send({ message: "O nome da categoria é obrigatório!" });
  }
  Categoria.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao criar Categoria." }));
};

exports.findAll = (req, res) => {
  const nome = req.query.nome;
  const condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : null;
  Categoria.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao listar Categorias." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Categoria.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: `Categoria ${id} não encontrada.` }))
    .catch(err => res.status(500).send({ message: "Erro ao buscar Categoria " + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Categoria.update(req.body, { where: { id_categoria: id } })
    .then(num => num == 1 ? res.send({ message: "Categoria atualizada." }) : res.status(400).send({ message: `Não foi possível atualizar Categoria ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao atualizar Categoria " + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Categoria.destroy({ where: { id_categoria: id } })
    .then(num => num == 1 ? res.send({ message: "Categoria deletada." }) : res.status(404).send({ message: `Não foi possível deletar Categoria ${id}.` }))
    .catch(err => res.status(500).send({ message: "Erro ao deletar Categoria " + id }));
};
