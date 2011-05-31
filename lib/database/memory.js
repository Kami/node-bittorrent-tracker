var util = require('util');

var misc = require('util/misc');
var DatabaseBackend = require('database/base').DatabaseBackend;

function MemoryDatabaseBackend(name, options) {
  DatabaseBackend.call(this, name, options);

  this._database = {};
}

util.inherits(MemoryDatabaseBackend, DatabaseBackend);

MemoryDatabaseBackend.prototype.dumpData = function(callback) {
  callback(null, this._database);
};

MemoryDatabaseBackend.prototype.getPeersByInfoHash = function(infoHash, compact,
                                                              exclude, limit, callback) {
  // TODO: compact support
  var torrentPeers, peerId, peerData, packed;
  var result = (compact) ? '' : [];
  var resultCount = 0;
  exclude = exclude || [];

  torrentPeers = this._getInfoHashData(infoHash)['peers'];

  for (peerId in torrentPeers) {
    if (exclude.indexOf(peerId) !== -1) {
      continue;
    }
    else if (resultCount >= limit) {
      break;
    }

    peerData = torrentPeers[peerId];

    if (compact) {
      packed = misc.getCompactAddress(peerData['ip'], peerData['port']);
      result += packed;
    }
    else {
      result.push({
        'ip': peerData['ip'],
        'port': peerData['port']
      });
    }
    resultCount++;
  }

  callback(null, result);
};

MemoryDatabaseBackend.prototype.addStartedEvent = function(infoHash, peerInfo, callback) {
  this._updatePeerData(infoHash, peerInfo, { 'left': 0, 'started_date': misc.getUnixTimestamp() });
  callback(null);
};

MemoryDatabaseBackend.prototype.addStoppedEvent = function(infoHash, peerInfo, callback) {
  this._updatePeerData(infoHash, peerInfo, { 'left': 0, 'stopped_date': misc.getUnixTimestamp() });
  callback(null);
};

MemoryDatabaseBackend.prototype.addCompletedEvent = function(infoHash, peerInfo, callback) {
  this._updatePeerData(infoHash, peerInfo, { 'left': 0, 'completed_date': misc.getUnixTimestamp() });
  callback(null);
};

MemoryDatabaseBackend.prototype._updatePeerData = function(infoHash, peerInfo, data,
                                                           callback) {
  var key, value;
  var peerData = this._getPeerData(infoHash, peerInfo);
  for (key in data) {
    if (data.hasOwnProperty(key)) {
      value = data[key];
      peerData[key] = value;
    }
  }

  this._updateLastAnnounce(infoHash, peerInfo);
};

MemoryDatabaseBackend.prototype._getPeerData = function(infoHash, peerInfo) {
  var peerId = peerInfo['id'];
  var infoHashData = this._getInfoHashData(infoHash);

  if (!infoHashData['peers'].hasOwnProperty(peerId)) {
    infoHashData['peers'][peerId] = {
      'id': peerId,
      'ip': peerInfo['ip'],
      'port': peerInfo['port'],
      'uploaded': 0,
      'downloaded': 0,
      'left': 0,

      'started_date': null,
      'stopped_date': null,
      'completed_date': null,
      'last_announce_date': null
    };
  }

  return infoHashData['peers'][peerId];
};

MemoryDatabaseBackend.prototype._getInfoHashData = function(infoHash) {
  if (!this._database.hasOwnProperty(infoHash)) {
    this._database[infoHash] = {
      'peers': {}
    };
  }

  return this._database[infoHash];
};

MemoryDatabaseBackend.prototype._updateLastAnnounce = function(infoHash, peerInfo, date) {
  var peerData = this._getPeerData(infoHash, peerInfo);
  peerData['last_announce_date'] = misc.getUnixTimestamp(date);
};

exports.DatabaseBackend = MemoryDatabaseBackend;
