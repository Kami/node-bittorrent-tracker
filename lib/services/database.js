var util = require('util');

var config = require('util/config');
var Service = require('services/base').Service;
var getDatabaseBackend = require('database/index').getDatabaseBackend;

function DatabaseService() {
  Service.call(this, 'database');
  this._database = null;

  this._initialize();
}

util.inherits(DatabaseService, Service);

DatabaseService.prototype._initialize = function() {
  var conf = config.getConfig();

  this._database = getDatabaseBackend(conf['database']['backend'],
                                      conf['database']['options']);
};

DatabaseService.prototype.start = function(callback) {
  this.logAction('starting');
  this._database.start(callback);
};

DatabaseService.prototype.stop = function(force, callback) {
  this.logAction('stopping');
  this._database.stop(force, callback);
};

exports.Service = new DatabaseService();
