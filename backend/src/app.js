const express = require('express');
const app = express();
const cors = require('cors');


const agendamentoRoutes = require('./routes/agendamentoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const profissionalRoutes = require('./routes/profissionalRoutes');
const authRoutes = require('./routes/authRoutes');
const { verificarToken } = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/agendamentos', verificarToken, agendamentoRoutes);
app.use('/clientes', verificarToken, clienteRoutes);
app.use('/servicos', verificarToken, servicoRoutes);
app.use('/profissionais', verificarToken, profissionalRoutes);

app.get('/', (req, res) => {
  res.send('API rodando');
});

module.exports = app;