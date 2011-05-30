function DatabaseBackend(name, options) {
  this._name = name;
  this._options = options;
}

/**
 * Return an array of peer dictionaries for the provided info_hash (torrent)
 */
DatabaseBackend.prototype.getPeersByInfoHash = function(infoHash, noPeerId, compact,
                                                        callback) {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addAnnonceEvent = function() {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addStartedEvent = function() {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addStoppedEvent = function() {
  throw new Error('Not implemented');
};

DatabaseBackend.prototype.addCompletedEvent = function() {
  throw new Error('Not implemented');
};

exports.DatabaseBackend = DatabaseBackend;
