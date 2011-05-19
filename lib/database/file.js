var util = require('util');

var DatabaseBackend = require('database/base').DatabaseBackend;

/**
  Database format:

  { "<info_hash>": {
      "peers": {
        "<peer_id>": {
          "id": "<value>", // string
          "ip": "<value>", // number
          "port": "<value>", // number
          "uploaded": "<value>", // number (bytes)
          "downloaded": "<value>", // number (bytes)
          "left": "<value>", // number (bytes)
          "last_announce": "<value>" // number (seconds since epoch)
        }
      }
    }
  }
*/


function FileDatabaseBackend(name, options) {
  DatabaseBackend.call(this, name, options);

  this._intervalId = null;
  this._dirty = false;
  this._database = {};
}

util.inherits(FileDatabaseBackend, DatabaseBackend);

FileDatabaseBackend.prototype.start = function(callback) {
  // Load data from disk (if file exists)
  callback();
};

FileDatabaseBackend.prototype.stop = function(force, callback) {
  // Save data to disk
  callback();
};

FileDatabaseBackend.prototype._initialize = function() {
  this._intervalId = setInterval(this._flushDataToDisk,
                                 this._options['flush_interval']);
};

FileDatabaseBackend.prototype._flushDataToDisk = function() {
  if (!this._dirty) {
    // Nothing to be flushed
    return;
  }
};

FileDatabaseBackend.getPeersByInfoHash = function(infoHash, noPeerId, compact,
                                                  callback) {
  var data;
  if (typeof noPeerId === 'function') {
    callback = noPeerId;
  }
  else if (typeof compact === 'function') {
    callback = compact;
  }

  if (!infoHash) {
    callback(new Error('Missing info_hash argument'));
    return;
  }

  data = this._database[infoHash] || {};
  callback(null, data);
};

exports.DatabaseBackend = FileDatabaseBackend;
