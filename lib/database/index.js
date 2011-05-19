var path = require('path');

var BACKENDS_PATH = __dirname;

function getDatabaseBackend(name, options) {
  var module, databaseBackend;

  module = require(path.join(BACKENDS_PATH, name.replace(/\.js$/, '')));
  databaseBackend = new module.DatabaseBackend(name, options);
  return databaseBackend;
}

exports.getDatabaseBackend = getDatabaseBackend;
