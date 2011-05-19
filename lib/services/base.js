var sprintf = require('sprintf').sprintf;
var logmagic = require('logmagic');

function Service(name) {
  this.name = name;
  this._running = false;
  this._log = logmagic.local(sprintf('bittorrent-tracker.lib.services.%s', this.name));
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

Service.prototype.logAction = function(action) {
  action = Array.prototype.slice.call(action);
  action[0] = action[0].toUpperCase();
  action = action.join('');
  this._log.info(sprintf('%s "%s" service...', action, this.name));
};

exports.Service = Service;
