var fs = require('fs');
var path = require('path');
var util = require('util');

var express = require('express');
var sprintf = require('sprintf').sprintf;
var log = require('logmagic').local('bittorrent-tracker.lib.services.tracker');

var config = require('util/config');
var Service = require('services/base').Service;

function TrackerHttpService() {
  Service.call(this, 'http_tracker');
  this._server = null;
}

util.inherits(TrackerHttpService, Service);

TrackerHttpService.prototype.start = function(callback) {
  var self = this;
  var options, protocol, modules;
  var conf = config.getConfig();

  if (conf['ssl_enabled']) {
    protocol = 'https';
    options = {
      key: fs.readFileSync(conf['ssl_key']),
      cert: fs.readFileSync(conf['ssl_cert']),
      ca: fs.readFileSync(conf['ssl_ca_cert']),
      requestCert: true,
      rejectUnauthorized: false
    };

    this._server = express.createServer(options);
  }
  else {
    protocol = 'http';
    this._server = express.createServer();
  }

  // Set up middleware
  this._server.configure(function() {
    self._server.use(express.bodyParser());
  });

  // Set up routes
  modules = this._getHandlerModules(path.join(__dirname, '../http/endpoints'));
  this._registerHandlerFunctions(this._server, modules);

  // Listen
  this._server.listen(conf['port'], conf['ip'], function onBound() {
    self._running = true;
    log.info(sprintf('Tracker started and listening at %s://%s:%s',
                     protocol, conf['ip'], conf['port']));
    callback();
  });
};

TrackerHttpService.prototype.stop = function(force, callback) {
  if (this._server && this._running) {
    log.info('Stopping tracker HTTP server...');

    this._server.close();
    this._running = false;
  }

  callback();
};

TrackerHttpService.prototype._getHandlerModules = function(modulesPath) {
  var i, files, filesLen, file, module;
  var modules = [];

  files = fs.readdirSync(modulesPath);
  for (i = 0, filesLen = files.length; i < filesLen; i++) {
    file = files[i];
    try {
      module = require(path.join(modulesPath, file.replace(/\.js$/, '')));
    }
    catch (err) {
      log.error(sprintf('Unable to load "%s" module: %s', file, err.message));
      continue;
    }

    modules.push(module);
  }

  return modules;
};

TrackerHttpService.prototype._registerHandlerFunctions = function(server, modules) {
  var i, moduless, modulesLen, module;

  for (i = 0, modulesLen = modules.length; i < modulesLen; i++) {
    module = modules[i];
    module.register(server);
  }
};

exports.Service = new TrackerHttpService();
