const app = require('./src/app');

const PORT = 3000;

const bcrypt = require('bcryptjs');

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});