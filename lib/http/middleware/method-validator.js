var returnError = require('util/http').returnError;

function attachMiddleware(allowedMethods, code) {
  return function(req, res, next) {
    if (allowedMethods === 'all') {
      next();
      return;
    }

    if (allowedMethods.indexOf(req.method) === -1) {
      returnError(res, code, 'Only GET methods are allowed');
      return;
    }

    next();
  };
}

exports.attachMiddleware = attachMiddleware;
