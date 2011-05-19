function Service(name) {
  this.name = name;
  this._running = false;
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
