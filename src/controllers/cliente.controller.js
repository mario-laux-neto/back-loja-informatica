const db = require("../models");
const Cliente = db.Cliente;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.nome || req.body.nome.trim() === "") {
    return res.status(400).send({ message: "O nome não pode estar vazio!" });
  }
  Cliente.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao criar Cliente." }));
};

exports.findAll = (req, res) => {
  const nome = req.query.nome;
  var condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : null;
  Cliente.findAll({ where: condition })
    .then(data => res.status(200).send(data || []))
    .catch(err => res.status(500).send({ message: err.message || "Erro ao listar Clientes." }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Cliente.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: `Cliente com ID ${id} não encontrado.` });
      }
    })
    .catch(err => res.status(500).send({ message: "Erro ao buscar Cliente " + id }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Cliente.update(req.body, { where: { id_cliente: id } })
    .then(num => {
      if (num == 1 || (Array.isArray(num) && num[0] == 1)) {
        res.status(200).send({ message: "Cliente atualizado com sucesso." });
      } else {
        res.status(404).send({ message: `Cliente com id=${id} não encontrado ou dados não alterados.` });
      }
    })
    .catch(err => res.status(500).send({ message: "Erro ao atualizar Cliente " + id }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Cliente.destroy({ where: { id_cliente: id } })
    .then(num => {
      if (num == 1) {
        res.status(200).send({ message: "Cliente deletado com sucesso." });
      } else {
        res.status(404).send({ message: `Cliente com id=${id} não encontrado.` });
      }
    })
    .catch(err => res.status(500).send({ message: "Erro ao deletar Cliente " + id }));
};
