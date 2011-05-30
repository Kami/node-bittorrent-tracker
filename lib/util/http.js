var sprintf = require('sprintf').sprintf;

var httpConstants = require('http/constants');
var bencode = require('util/bencode');

function returnResponse(res, code, headers, data) {
  data = data || '';
  headers = headers || {};

  if (data.length > 0) {
    headers['Content-Length'] = data.length;
  }
  headers['Connection'] = 'close';

  res.writeHead(code, headers);
  res.end(data);
}


function returnError(res, code, msg) {
  var headers;
  code = code || 900;
  msg = msg || '';

  returnResponse(res, code, null, msg);
}

/**
 * Return a bencoded response
 */
function returnBencodedResponse(res, code, obj) {
  var headers, bencoded;
  code = code || 200;

  bencoded = bencode.benc(obj);
  returnResponse(res, code, null, bencoded);
}

function returnJson(res, code, obj) {
  returnResponse(res, code, null, JSON.stringify(obj));
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
exports.returnBencodedResponse = returnBencodedResponse;
exports.returnJson = returnJson;
exports.extractParams = extractParams;
