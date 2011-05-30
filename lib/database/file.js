var util = require('util');
var fs = require('fs');
var path = require('path');

var sprintf = require('sprintf').sprintf;
var log = require('logmagic').local('bittorrent-tracker.lib.database.file');

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
          "completed": "<value>" // number (seconds since epoch)
          "last_announce": "<value>" // number (seconds since epoch)
        }
      },
      "aggregate": {
        "uploaded": "<value>", // number (bytes)
        "downloaded": "<value>", // number (bytes)
        "finished_downloads": "<value>", // number
        "active_peers": "<value>" // number
      },
      "meta": {
        "start_date": "<value>", // number (seconds since epoch)
        "last_flush": "<value>" // number (seconds since epoch)
      }
    }
  }
*/

function FileDatabaseBackend(name, options) {
  DatabaseBackend.call(this, name, options);

  this._intervalId = null;
  this._flushing = false;
  this._dirty = false;
  this._database = {};

  this._databasePath = this._options['file_path'];
  this._flushInterval = this._options['flush_interval'];

  throw new Error('W.I.P.');
}

util.inherits(FileDatabaseBackend, DatabaseBackend);

FileDatabaseBackend.prototype.start = function(callback) {
  var self = this;
  path.exists(this._databasePath, function onExists(exists) {
    if (!exists) {
      // Database doesn't exist, nothing to be read
      callback();
      return;
    }

    // Database exists, load it
    log.info(sprintf('Database file "%s" exists, loading data...', self._databasePath));
    self._loadDataFromFile(self._databasePath, function onData(err, data) {
      if (err) {
        log.error(sprintf('Error while loading data from file: %s', err.message));
        callback();
        return;
      }

      log.info('Data successfully loaded');
      this._database = data;
      callback();
    });
  });
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

/**
 * Return a list of dictionary where each dictionary has the following keys:
 * id, ip, port.
 */
FileDatabaseBackend.prototype.getPeersByInfoHash = function(infoHash, noPeerId, compact,
                                                            callback) {
  var data, peers;
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

  data = this._database[infoHash] || [];
  peers = (data) ? this._formatPeersDict(data) : data;
  callback(null, peers);
};

FileDatabaseBackend.prototype._formatPeersDict = function(peersDict) {
  var result = [];
  var i, key, value;

  for (key in peersDict) {
    value = peersDict[key];
    result.push({
      'id': value['id'],
      'ip': value['ip'],
      'port': value['port']
    });
  }

  return result;
};

FileDatabaseBackend.prototype._loadDataFromFile = function(filePath, callback) {
  // Slow, blocking, no verification, zomg
  fs.readFile(filePath, 'utf8', function gotData(err, data) {
    var parsed;

    if (err) {
      callback(err);
      return;
    }

    try {
      parsed = JSON.parse(data);
    }
    catch (err2) {
      callback(err2);
      return;
    }

    callback(null, parsed);
  });
};

FileDatabaseBackend.prototype._saveDataToFile = function(callback) {
  var data;
  this._flushing = true;

  // Always writing the whole database is so bad...
  data = JSON.stringify(this._database);
  fs.writeFile(this._databasePath, data, 'utf8', function onWritten(err) {
    this._flushing = false;
    callback();
  });
};

exports.DatabaseBackend = FileDatabaseBackend;
