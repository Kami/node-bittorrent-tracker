/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

var net = require('net');
var dns = require('dns');
var util = require('util');

var sprintf = require('sprintf').sprintf;
var async = require('async');

var httpConstants = require('http/constants');
var httpUtil = require('util/http');
var config = require('util/config');
var log = require('logmagic').local('bittorrent-tracker.lib.http.endpoints.announce');

var middlewareParamValidator = require('http/middleware/param-validator');
var middlewareMethodValidator = require('http/middleware/method-validator');
var db = require('services/index').ServiceHandler.getDb();

function getParamDict(clientIpAddress) {
  var paramDict = {
    'info_hash': { 'default_value': null, 'type': 'string' },
    'peer_id': { 'default_value': null, 'type': 'string' },
    'ip': { 'default_value': clientIpAddress, 'type': 'string' }, // @TODO: Verify IP address if provided by the client
    'port': { 'default_value': null, 'type': 'number' },
    'uploaded': { 'default_value': null, 'type': 'number' },
    'downloaded': { 'default_value': null, 'type': 'number' },
    'left': { 'default_value': null, 'type': 'number' },
    'event': { 'default_value': 'announce', 'type': 'string' }, // announce, started, completed or stopped
    'numwant': { 'default_value': config.getValue('default_numwant'), 'type': 'number' }
  };

  return paramDict;
}

function announceHandler(req, res) {
  var response, peerInfo;
  var params = httpUtil.extractParams(req, getParamDict(req.socket.remoteAddress));

  function resolveIpAddress(callback) {
    var isIp = net.isIP(params['ip']);
    if (isIp === 4 || isIp === 6) {
      callback();
      return;
    }

    dns.resolve4(params['ip'], function(err, addresses) {
      var ip;
      if (err) {
        callback(err);
        return;
      }

      ip = addresses[0];
      callback();
    });
  }

  function onComplete() {
    response = {
      'interval': config.getValue('interval'),
      'peers': []
    };

    httpUtil.returnBencodedResponse(res, 200, response);
  }

  peerInfo = {
    'id': params['peer_id'],
    'ip': params['ip'],
    'port': params['port']
  };

  if (params['event'] === 'announce') {
    // Regular announce request
  }
  else if (params['event'] === 'started') {
    db.addStartedEvent(params['info_hash'], peerInfo, onComplete);
  }
  else if (params['event'] === 'stopped') {
    db.addStoppedEvent(params['info_hash'], peerInfo, onComplete);
  }
  else if (params['event'] === 'completed') {
    db.addCompletedEvent(params['info_hash'], peerInfo, onComplete);
  }
}

function register(server) {
  server.all('/announce',
             middlewareMethodValidator.attachMiddleware(['GET'], 100),
             middlewareParamValidator.attachMiddleware(httpConstants.VALIDATION_RULES),
             announceHandler);
}

exports.register = register;
