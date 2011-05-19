var util = require('util');

var DatabaseBackend = require('database/base').DatabaseBackend;

function FileDatabaseBackend(name, options) {
  DatabaseBackend.call(this, name, options);
}

util.inherits(FileDatabaseBackend, DatabaseBackend);

FileDatabaseBackend.prototype.start = function(callback) {
  callback();
};

FileDatabaseBackend.prototype.stop = function(force, callback) {
  callback();
};

exports.DatabaseBackend = FileDatabaseBackend;
