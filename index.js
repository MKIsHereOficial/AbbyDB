const express = require('express'), app = express();
const bodyParser = require('body-parser');
const APP_PORT = process.env.PORT || 3000;

const path = require('path');

const Database = require('./database.js');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const db = await Database('chars');

  if (true) {
    await db.set('765002665041068033', {
      "name": "Ally Blossom G.",
      "id": "765002665041068033",
      "avatar": false,
      "attrs": [
        { name: 'Força', value: 0 }, { name: 'Destreza', value: 0 }, { name: 'Inteligência', value: 0 }, { name: 'Tamanho', value: 0 }, { name: 'Constituição', value: 0 }, { name: 'Educação', value: 0 }, { name: 'Movimento', value: 0 }, { name: 'Aparência', value: 0 }
      ],
      "inventory": [
        { name: 'Lanterna', quantity: 1, givenBy: '475072755033702400' }
      ]
    });
  }


  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/database', async (req, res) => {
  const dbName = (req.params && req.params['database']) ? req.params['database'] : "default";
  res.json(await Database(dbName));
});
app.get('/database/:database', async (req, res) => {
  const { database } = req.params;
  const db = await Database(database);

  res.json(db);
});
app.get('/database/:database/all', async (req, res) => {
  const { database } = req.params;
  const db = await Database(database);

  console.dir(await db.getAll());

  res.json({ all: await db.getAll(), db });
});
app.get('/database/:database/:key', async (req, res) => {
  const { database, key } = req.params;

  if (!database) return res.json({err: 'Nenhum valor DatabaseName (?database) foi entregue.'});
  if (!key) return res.json({err: 'Nenhuma chave (?key) foi entregue. Não há documento sem chave.'});


  const db = await Database(database);

  var obj = await db.exists(key);
  obj = (obj.exists != false) ? await db.get(key) : false;

  if (!obj && req.query['createIfNull']) obj = await db.set(key, key);

  res.json(obj);
});
app.get('/database/:database/:key/set', async (req, res) => {
  const { database, key } = req.params;

  if (!database) return res.json({err: 'Nenhum valor DatabaseName (?database) foi entregue.'});
  if (!key) return res.json({err: 'Nenhuma chave (?key) foi entregue. Não há documento sem chave.'});

  const db = await Database(database.toLowerCase());

  const { value } = req.query;

  var obj = await db.set(key, (value.startsWith("{") && value.endsWith("}")) ? JSON.parse(value) : value || false);

  console.log(`[database/${database.toLowerCase()}/${key}]`, `O Documento foi setado com o valor ${(value.startsWith("{") && value.endsWith("}")) ? JSON.parse(value) : value}.`);

  res.json(obj);
});
app.get('/database/:database/:key/exists', async (req, res) => {
  const { database, key } = req.params;
  
  if (!database) return res.json({err: 'Nenhum valor DatabaseName (?database) foi entregue.'});
  if (!key) return res.json({err: 'Nenhuma chave (?key) foi entregue. Não há documento sem chave.'});

  const db = await Database(database);

  var obj = await db.exists(key);

  console.dir(obj);

  res.json(obj);
});
app.get('/database/:database/:key/del', async (req, res) => {
  const { database, key } = req.params;
  
  if (!database) return res.json({err: 'Nenhum valor DatabaseName (?database) foi entregue.'});
  if (!key) return res.json({err: 'Nenhuma chave (?key) foi entregue. Não há documento sem chave.'});

  const db = await Database(database);

  if ("err" in await db.get(key)) return res.json({err: "Este Documento não existe."});

  var obj = await db.delete(key);

  console.log(`[database/${database.toLowerCase()}/${key}]`, `O Documento foi deletado.`);
  console.dir(obj);

  res.json(obj);
});

app.listen(APP_PORT || 3000, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});