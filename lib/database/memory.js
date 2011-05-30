var util = require('util');

var DatabaseBackend = require('database/base').DatabaseBackend;

function MemoryDatabaseBackend(name, options) {
  DatabaseBackend.call(this, name, options);

  this._database = {};
}

util.inherits(MemoryDatabaseBackend, DatabaseBackend);

exports.DatabaseBackend = MemoryDatabaseBackend;
