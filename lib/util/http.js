var sprintf = require('sprintf').sprintf;

var httpConstants = require('http/constants');
var StopError = require('util/flow-ctrl').StopError;

function returnError(res, code, msg) {
  var headers;
  msg = msg || '';

  headers = {
    'Content-Length': msg.length,
    'Connection': 'close'
  };

  res.writeHead(code, headers);
  res.end(msg);

  throw new StopError(sprintf('%d - %s', code, msg));
}

function verifyRequiredParams(req, res, requiredParams, type) {
  var validTypes = [ 'querystring' ];
  var i, param, paramsLen, paramValue;
  var missingParams = [];
  type = type || 'querystring';

  if (validTypes.indexOf(type) === -1) {
    throw new Error(sprintf('Invalid type: %s', type));
  }

  for (i = 0, paramsLen = requiredParams.length; i < paramsLen; i++) {
    param = requiredParams[i];

    if (req.param(param, null) === null) {
      returnError(res, httpConstants.MISSING_PARAM_STATUS_CODES[param],
                  sprintf('Missing required parameter: %s', param));
      return;
    }
  }
}

exports.returnError = returnError;
exports.verifyRequiredParams = verifyRequiredParams;
