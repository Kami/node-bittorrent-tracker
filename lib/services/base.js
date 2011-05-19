var sprintf = require('sprintf').sprintf;

function Service(name) {
  this.name = name;
  this._running = false;
  this._log = require('logmagic').local(sprintf('bittorrent-tracker.lib.services.%s', this.name));
}

Service.prototype.start = function(callback) {
  throw new Error('Not implemented');
};

Service.prototype.stop = function(force, callback) {
  throw new Error('Not implemented');
};

Service.prototype.isRunning = function() {
  return this._running;
};

exports.Service = Service;
