var sprintf = require('sprintf').sprintf;

var httpConstants = require('http/constants');

function returnError(res, code, msg) {
  var headers;
  msg = msg || '';

  headers = {
    'Content-Length': msg.length,
    'Connection': 'close'
  };

  res.writeHead(code, headers);
  res.end(msg);
}

exports.returnError = returnError;
