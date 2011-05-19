var path = require('path');

var sprintf = require('sprintf').sprintf;
var async = require('async');
var log = require('logmagic').local('bittorrent-tracker.lib.run');

var SERVICES_PATH = path.join(__dirname);
var SERVICES = [ 'database', 'http-tracker' ];

function ServicesHandler() {
  this._services = {};
}

ServicesHandler.prototype._initialize = function() {
  var i, service, servicesLen, serviceInstance;

  for (i = 0, servicesLen = SERVICES.length; i < servicesLen; i++) {
    service = SERVICES[i];

    try {
      serviceInstance = require(path.join(SERVICES_PATH, service)).Service;
    }
    catch (err) {
      log.error(sprintf('Failed to load service "%s" module: %s', service, err.message));
      continue;
    }

    this._services[service] = serviceInstance;
  }
};

ServicesHandler.prototype.startServices = function(callback) {
  var self =  this;
  callback = callback || function () {};
  this._initialize();

  async.forEachSeries(Object.keys(this._services), function(service, callback) {
    self._startService(service, callback);
  }, callback);
};

ServicesHandler.prototype.stopServices = function(force, callback) {
  var self =  this;
  force = force || false;
  callback = callback || function () {};

  async.forEachSeries(Object.keys(this._services), function(service, callback) {
    self._stopService(service, force, callback);
  }, callback);
};

ServicesHandler.prototype._startService = function(serviceName, callback) {
  var service = this._services[serviceName];
  service.start(callback);
};

ServicesHandler.prototype._stopService = function(serviceName, force, callback) {
  var service = this._services[serviceName];
  service.stop(force, callback);
};

exports.ServiceHandler = new ServicesHandler();
