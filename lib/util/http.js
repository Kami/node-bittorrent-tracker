var sprintf = require('sprintf').sprintf;

function returnError(res, code, msg) {
  var headers;
  msg = msg || '';

  headers = { 
    'Content-Length': msg.length,
    'Connection': 'close'
  };

  res.writeHead(code, headers);
  res.end(msg);

  throw new Error(sprintf('%d - %s', code, msg));
}

exports.returnError = returnError;
