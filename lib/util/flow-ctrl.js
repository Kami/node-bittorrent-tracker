var globalLog = require('logmagic').local('bittorrent-tracker.lib.util.flow-ctrl');

function captureAndLogError(log, func, context) {
  args = Array.prototype.slice.call(arguments, 3);
  log = log || globalLog;

  try {
    func.apply(context, args);
  }
  catch (err) {
    log.error(err.message);
  }
}

exports.captureAndLogError = captureAndLogError;
