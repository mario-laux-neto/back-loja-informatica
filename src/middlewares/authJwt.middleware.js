const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  } else {
    // Fallback para x-access-token se não houver header Authorization no formato Bearer
    token = req.headers["x-access-token"];
  }

  if (!token) {
    return res.status(403).send({
      message: "Nenhum token fornecido!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro na verificação do token:", err.message);
      return res.status(401).send({
        message: "Não autorizado! Token inválido ou expirado."
      });
    }
    // Se o token é válido, o payload decodificado está em 'decoded'
    req.idCliente = decoded.id_cliente; 
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};

module.exports = authJwt;
