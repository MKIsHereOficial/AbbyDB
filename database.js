const fs = require('fs'), path = require('path');

function main(databaseName = "default".toLowerCase()) {
  console.log(`Database iniciada como ${databaseName}`);
}

module.exports = main;