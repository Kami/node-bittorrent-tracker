var returnError = require('util/http').returnError;

function attachMiddleware(validationRules) {
  return function(req, res, next) {
    var paramName, rule, rulesLen, paramValue;
    var missingParams, errMsg;

    if (!validationRules || Object.keys(validationRules).length === 0) {
      next();
      return;
    }

    for (paramName in validationRules) {
      rule = validationRules[paramName];
      paramValue = req.param(paramName, null);

      if (rule['required'] && paramValue === null) {
        returnError(res, rule['required']['err_code'], rule['required']['err_msg']);
        return;
      }

      if (rule['length'] && paramValue.length !== rule['length']['value']) {
        returnError(res, rule['length']['err_code'], rule['length']['err_msg']);
        return;
      }

      if (rule['min_value'] && (parseInt(paramValue, 10) < rule['min_value']['value'])) {
        returnError(res, rule['min_value']['err_code'], rule['min_value']['err_msg']);
        return;
      }

      if (rule['max_value'] && (parseInt(paramValue, 10) > rule['max_value']['value'])) {
        returnError(res, rule['max_value']['err_code'], rule['max_value']['err_msg']);
        return;
      }
    }

    next();
  };
}

exports.attachMiddleware = attachMiddleware;
