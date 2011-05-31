function DatabaseBackend(name, options) {
  this._name = name;
  this._options = options;
}

/**
 * Dump the whole DB.
 */
DatabaseBackend.prototype.dumpData = function(callback) {
  throw new Error('Not implemented');
};

/**
 * Return an array of peer dictionaries for the provided info_hash (torrent)
 */
DatabaseBackend.prototype.getPeersByInfoHash = function(infoHash, compact, exclude,
                                                        limit, callback) {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addAnnonceEvent = function(infoHash, peerInfo, uploaded,
                                                     downloaded, left, callback) {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addStartedEvent = function(infoHash, peerInfo, callback) {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addStoppedEvent = function(infoHash, peerInfo, callback) {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addCompletedEvent = function(infoHash, peerInfo, callback) {
  throw new Error('Not implemented');
};

exports.DatabaseBackend = DatabaseBackend;
