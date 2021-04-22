const express = require('express'), app = express();

const db = require('./database.js');

app.get('/', (req, res) => {
  res.send(db());
});

app.listen(3000, () => {
  console.log('server started');
});