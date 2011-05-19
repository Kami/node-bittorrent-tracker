function DatabaseBackend(name, options) {
  this._name = name;
  this._options = options;
}

/**
 * Initialize the database backend.
 *
 * @param {Function} callback Callback which must be called when the database is
 * initialized.
 */
DatabaseBackend.prototype.start = function(callback) {
  throw new Error('Not implemented');
};

/**
 * Stop the database backend.
 *
 * @param {Function} callback Callback which must be called when the database is
 * stopped.
 */
DatabaseBackend.prototype.stop = function(force, callback) {
  throw new Error('Not implemented');
};

/**
 * Return an array of peer dictionaries for the provided info_hash (torrent)
 */
DatabaseBackend.prototype.getPeersByInfoHash = function(noPeerId, compact) {
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
