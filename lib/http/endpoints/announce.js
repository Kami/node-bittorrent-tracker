/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

var async = require('async');

var httpConstants = require('http/constants');
var httpUtil = require('util/http');
var config = require('util/config');
var log = require('logmagic').local('bittorrent-tracker.lib.http.endpoints.announce');

var middlewareParamValidator = require('http/middleware/param-validator');
var middlewareMethodValidator = require('http/middleware/method-validator');

function getParamDict(clientIpAddress) {
  var paramDict = {
    'info_hash': { 'default_value': null, 'type': 'string' },
    'peer_id': { 'default_value': null, 'type': 'string' },
    'ip': { 'default_value': clientIpAddress, 'type': 'string' }, // @TODO: Verify IP address if provided by the client
    'port': { 'default_value': null, 'type': 'number' },
    'uploaded': { 'default_value': null, 'type': 'number' },
    'downloaded': { 'default_value': null, 'type': 'number' },
    'left': { 'default_value': null, 'type': 'number' },
    'event': { 'default_value': 'announce', 'type': 'string' }, // started, completed or stopped
    'numwant': { 'default_value': config.getValue('default_numwant'), 'type': 'number' }
  };

  return paramDict;
}

function announceHandler(req, res) {
  var params = httpUtil.extractParams(req, getParamDict(req.socket.remoteAddress));

  if (params['event'] === 'announce') {
    // Regular announce request
  }

  res.end('stub');
}

function register(server) {
  server.all('/announce',
             middlewareMethodValidator.attachMiddleware(['GET'], 100),
             middlewareParamValidator.attachMiddleware(httpConstants.VALIDATION_RULES),
             announceHandler);
}

exports.register = register;
