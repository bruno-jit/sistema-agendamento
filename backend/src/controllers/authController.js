const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    res.json(result);
  } catch (e) {
    res.status(401).json({ erro: e.message });
  }
};
const register = async (req, res) => {
  try {
    const usuario = await authService.register(req.body);
    res.status(201).json(usuario);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};

module.exports = { login, register };