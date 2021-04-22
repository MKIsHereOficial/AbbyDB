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
function main(databaseName = "default".toLowerCase()) {
  console.log(`Database iniciada como ${databaseName}`);

  initializeDatabase(databaseName);

}

module.exports = main;