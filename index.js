const express = require('express'), app = express();
const APP_PORT = process.env.PORT || 3000;

const path = require('path');

const Database = require('./database.js');

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/database', async (req, res) => {
  const dbName = (req.params && req.params['database']) ? req.params['database'] : "default";
  res.json(await Database(dbName));
});
app.get('/database/:database', async (req, res) => {
  const {database} = req.params;
  const db = await Database(database);

  res.json(db);
});
app.get('/database/:database/all', async (req, res) => {
  const {database} = req.params;
  const db = await Database(database);

  console.dir(await db.getAll());

  res.json({all: await db.getAll(), db});
});
app.get('/database/:database/:key', async (req, res) => {
  const {database, key} = req.params;
  const db = await Database(database);

  var obj = await db.exists(key);
  obj = (obj.exists != false) ? await db.get(key) : false;

  if (!obj) obj = await db.set(key, key);

  res.json(obj);
});
app.get('/database/:database/:key/set', async (req, res) => {
  res.json({err: new Error("Não é possível dar GET nessa página.").message})
});
/*app.post('/database/:database/:key/set', async (req, res) => {
  const {database, key} = req.params;
  const db = await Database(database);

  console.log(req);

  var obj = await db.set(key, false);

  res.json(obj);
});*/

app.listen(APP_PORT || 3000, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});