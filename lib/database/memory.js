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

MemoryDatabaseBackend.prototype.addCompletedEvent = function(infoHash, peerInfo, callback) {
  var peerData = this._getPeerData(infoHash, peerInfo);
  peerData['left'] = 0;
  peerData['completed'] = misc.getUnixTimestamp();

  this._updateLastAnnounce(infoHash, peerInfo);
  callback(null);
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
      'last_announced': null
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
  peerData['last_announce'] = misc.getUnixTimestamp(date);
};

exports.DatabaseBackend = MemoryDatabaseBackend;
