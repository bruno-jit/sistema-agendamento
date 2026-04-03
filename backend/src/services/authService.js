const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');

const login = async (email, senha) => {
  const usuario = await usuarioRepository.findByEmail(email);

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token };
};
const register = async (data) => {
  const { nome, email, senha, tipo } = data;

  if (!nome || !email || !senha || !tipo) {
    throw new Error('Dados obrigatórios não informados');
  }

  const usuarioExistente = await usuarioRepository.findByEmail(email);

  if (usuarioExistente) {
    throw new Error('Email já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await usuarioRepository.create({
    nome,
    email,
    senha: senhaHash,
    tipo
  });

  return usuario;
};

module.exports = { login, register };