var path = require('path');

var sprintf = require('sprintf').sprintf;

var BACKENDS_PATH = __dirname;

function getDatabaseBackend(name, options) {
  var module, databaseBackend;

  try {
    module = require(path.join(BACKENDS_PATH, name.replace(/\.js$/, '')));
  }
  catch (err) {
    throw new Error(sprintf('Failed loading "%s" backend: %s', name, err.message));
  }

  databaseBackend = new module.DatabaseBackend(name, options);
  return databaseBackend;
}

exports.getDatabaseBackend = getDatabaseBackend;
