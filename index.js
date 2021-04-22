const express = require('express'), app = express();
const APP_PORT = process.env.PORT || 3000;

const db = require('./database.js');

app.get('/', (req, res) => {
  res.send(db());
});

app.listen(APP_PORT || 3000, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});