/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

var async = require('async');

var httpUtil = require('util/http');
var flowCtrl = require('util/flow-ctrl');
var log = require('logmagic').local('bittorrent-tracker.lib.http.endpoints.announce');

function announceHandler(req, res) {
  if (req.method !== 'GET') {
    httpUtil.returnError(res, 100, null);
  }

  res.end('stub');
}

function register(server) {
  server.all('/announce', async.apply(flowCtrl.captureAndLogError,
                                      log, announceHandler, null));
}

exports.register = register;
