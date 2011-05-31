/**
 * Based on specs at: http://wiki.theory.org/BitTorrent_Tracker_Protocol
 */

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
    'numwant': { 'default_value': config.getValue('default_numwant'), 'type': 'number' },
    'compact': { 'default_value': false, 'type': 'boolean'} // True to replace peer list with peers string
                                                            // with 6 bytes per
                                                            // peer.
  };

  return paramDict;
}

function announceHandler(req, res) {
  var params, peerInfo, peers;
  params = httpUtil.extractParams(req, getParamDict(req.socket.remoteAddress));
  peerInfo = {
    'id': params['peer_id'],
     'ip': params['ip'],
     'port': params['port']
  };

  async.series([
    function savaDataIntoDatabase(callback) {
      if (params['event'] === 'announce') {
        db.addAnnonceEvent(params['info_hash'], peerInfo, params['uploaded'],
                           params['downloaded'], params['left'], callback);
      }
      else if (params['event'] === 'started') {
        db.addStartedEvent(params['info_hash'], peerInfo, callback);
      }
      else if (params['event'] === 'stopped') {
        db.addStoppedEvent(params['info_hash'], peerInfo, callback);
      }
      else if (params['event'] === 'completed') {
        db.addCompletedEvent(params['info_hash'], peerInfo, callback);
      }
    },

    function retrieveTorrentPeers(callback) {
      db.getPeersByInfoHash(params['info_hash'], params['compact'], [params['peer_id']],
                            params['numwant'], function gotPeers(err, data) {
        if (err) {
          callback(err);
          return;
        }

        peers = data;
        callback();
      });
    },
  ],

  function(err) {
    var response;

    if (err) {
      httpUtil.returnError(res, 500, err.message);
    }
    else {
      response = {
        'interval': config.getValue('interval'),
        'min_interval': config.getValue('min_interval'),
        'peers': peers
     };

     httpUtil.returnBencodedResponse(res, 200, response);
    }
  });
}

function register(server) {
  server.all('/announce',
             middlewareMethodValidator.attachMiddleware(['GET'], 100),
             middlewareParamValidator.attachMiddleware(httpConstants.VALIDATION_RULES),
             announceHandler);
}

exports.register = register;
