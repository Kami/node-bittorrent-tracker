var util = require('util');

var globalLog = require('logmagic').local('bittorrent-tracker.lib.util.flow-ctrl');

function StopError(message) {
  this.name = 'StopError';
  this.message = message;
  Error.call(this);
}

util.inherits(StopError, Error);

function captureAndLogError(log, func, context) {
  var args = Array.prototype.slice.call(arguments, 3);
  log = log || globalLog;

  try {
    func.apply(context, args);
  }
  catch (err) {
    if (err instanceof StopError) {
      log.error(err.message);
    }
    else {
      throw err;
    }
  }
}

exports.StopError = StopError;
exports.captureAndLogError = captureAndLogError;
