var httpUtil = require('util/http');
var db = require('services/index').ServiceHandler.getDb();

/**
 * Dump the whole DB. Only used for debugging.
 */
function inspectHandler(req, res) {
  db.dumpData(function gotData(err, data) {
    httpUtil.returnJson(res, 200, data);
  });
}

function register(server) {
  server.get('/_inspect', inspectHandler);
}

exports.register = register;
