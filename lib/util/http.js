var sprintf = require('sprintf').sprintf;

var httpConstants = require('http/constants');
var bencode = require('util/bencode');

function returnError(res, code, msg) {
  var headers;
  code = code || 900;
  msg = msg || '';

  headers = {
    'Content-Length': msg.length,
    'Connection': 'close'
  };

  res.writeHead(code, headers);
  res.end(msg);
}

/**
 * Return a bencoded response
 */
function returnResponse(res, code, obj) {
  var headers, bencoded;
  code = code || 200;

  bencoded = bencode.benc(obj);
  res.writeHead(code, headers);
  res.end(bencoded);
}

function extractParams(req, paramsObj) {
  var paramName, paramRules, paramValue;
  var paramValues = {};

  for (paramName in paramsObj) {
    if (paramsObj.hasOwnProperty(paramName)) {
      paramRules = paramsObj[paramName];
      paramValue = req.param(paramName, paramRules['default_value']);

      if (paramValue !== null) {
        if (paramRules['type'] === 'number') {
          paramValue = parseInt(paramValue, 10);
        }
      }

      paramValues[paramName] = paramValue;
    }
  }

  return paramValues;
}

exports.returnError = returnError;
exports.returnResponse = returnResponse;
exports.extractParams = extractParams;
