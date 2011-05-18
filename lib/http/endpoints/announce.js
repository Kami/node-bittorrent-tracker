/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

var async = require('async');

var httpConstants = require('http/constants');
var httpUtil = require('util/http');
var log = require('logmagic').local('bittorrent-tracker.lib.http.endpoints.announce');
var middlewareParamValidator = require('http/middleware/param-validator');

function announceHandler(req, res) {
  if (req.method !== 'GET') {
    httpUtil.returnError(res, 100, null);
  }

  res.end('stub');
}

function register(server) {
  server.all('/announce',
             middlewareParamValidator.attachMiddleware(httpConstants.VALIDATION_RULES),
             announceHandler);
}

exports.register = register;
