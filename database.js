//////////////////////////////// # Imports # ////////////////////////////////

const fs = require('fs'), path = require('path');

//////////////////////////////// # Variables # ////////////////////////////////

const databasesPath = path.join(__dirname, 'database');

/////////////////////////////////////////////////////////////////////////

function initializeDatabase(databaseName = "default".toLowerCase()) {
  databaseName = databaseName.toLowerCase();
  console.log(`Inicializando o Banco de Dados ${databaseName}`);
  /////////////////////////////////////////////////////////////////////////

  const databasePath = path.join(databasesPath, databaseName);
  const databaseInfo = {name: databaseName, intialized: false};
  if (!fs.existsSync(databasePath)) {
    fs.mkdirSync(databasePath, {recursive: true});
  }

  /////////////////////////////////////////////////////////////////////////
  databaseInfo.intialized = true;
  console.log(`Banco de Dados ("${databaseName}") inicializado.`);

  return databaseInfo;
}
/////////////////////////////////////////////////////////////////////////
async function main(databaseName = "default".toLowerCase()) {
  console.log(`Database iniciada como ${databaseName}`);

  const database = initializeDatabase(databaseName);
  database.path = path.join(databasesPath, databaseName);

  async function set(key = "", value = null) {
    if (!key) return new Error("O Documento necessita de uma key/nome para ser criado/editado.");

    const keyPath = path.join(database.path, `${key}.json`);

    const docRef = (await fs.existsSync(keyPath)) ? await fs.readFileSync(keyPath, 'utf-8') : false;

    const obj = {key, path: keyPath};
    
    if (!docRef && typeof value != undefined) {
      console.log(`O Documento é inexistente, devido à um valor ter sido passado, ele foi criado.`);
      await fs.writeFileSync(keyPath, JSON.stringify({key, value}, null, 1));
    } else if(typeof value === undefined) {
      await fs.writeFileSync(keyPath, JSON.stringify({key, value}, null, 1));
    } else if (!docRef) {
      obj.err = new Error("Este Documento/Key é inexistente ou um valor não foi definido, por isso não foi retornado.");
    }

    obj.value = value;
    if (await fs.existsSync(keyPath)) {
      await fs.writeFileSync(keyPath, JSON.stringify({key, value}, null, 2));
    }
    
    return obj;
  }

  async function del(key = "") {
    const keyPath = path.join(database.path, `${key}.json`);

    if (await fs.existsSync(keyPath)) {
      await fs.unlinkSync(keyPath);
    } else {
      return {err: new Error("O Documento/Key não existe, então não pode ser excluído.")};
    }

    return {key, excluded: true};
  }

  async function get(key = "", fallback = null) {
    const keyPath = path.join(database.path, `${key}.json`);

    const docRef = (await fs.existsSync(keyPath)) ? await fs.readFileSync(keyPath, 'utf-8') : false;
    const doc = (docRef) ? JSON.parse(docRef) : false;

    const obj = {key, path: keyPath};

    if (doc) {
      obj.value = doc.value;
    } else {
      obj.err = new Error("Não foi possível encontrar os valores do Documento.");
      (fallback) ? obj.value = fallback : null;
    }

    return obj;
  }

  async function add(key = "", value = 1) {
    if (!key) return new Error("O Documento necessita de uma key/nome para ser criado/editado.");

    const keyPath = path.join(database.path, `${key}.json`);

    const docRef = (await fs.existsSync(keyPath)) ? await fs.readFileSync(keyPath, 'utf-8') : false;
    const doc = (docRef) ? JSON.parse(docRef) : false;

    const obj = {key, path: keyPath};

    if (doc && !isNaN(doc.value)) {
      obj.value = doc.value;
    } else if (doc && isNaN(doc.value)) {
      obj.err = new Error("O valor do Documento não é um número (nem int, nem float). Para adicionar, é necessário que o valor seja um número");
    } else {
      obj.err = new Error("O valor do Documento/Key não pode ser encontrado.");
    }

    if (value && !isNaN(obj.value)) {
      obj.value = obj.value + value;
      await set(key, obj.value);
    }

    return obj;
  }

  async function exists(key = "") {
    if (!key || !key.length) return new Error("Preciso de uma Chave para poder encontrar o Documento.");

    const keyPath = path.join(database.path, `${key}.json`);

    var obj = {key, path: keyPath};

    if (await fs.existsSync(keyPath)) {
      obj = await get(key, true);
      obj.exists = true;
    } else {
      obj.exists = false;
    }

    return obj;
  }

  async function all() {
    const keys = [];

    const files = await fs.readdirSync(database.path);
    files.map(file => {
      const key = file.replace(".json", "");
      keys.push(key);
    })

    const realKeys = await keys.map(async key => {
      var obj = {};

      await get(key).then(data => {obj = data});

      if (!obj) return key;
      
      return obj;
    });

    return realKeys.map(data => {return data;});
  }

  return {database, set, delete: del, del, get, fetch: get, add, exists, getAll: all};
}

module.exports = main;