const db = require("../models");
const Cliente = db.cliente;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup function
exports.signup = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Create a new cliente
    const cliente = await Cliente.create({
      nome,
      email,
      senha: hashedPassword
    });

    res.status(201).json({ message: "Cliente cadastrado com sucesso!", cliente });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar cliente.", error: error.message });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Find the cliente by email
    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(senha, cliente.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: cliente.id_cliente }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    res.status(200).json({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login.", error: error.message });
  }
};
