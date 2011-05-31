var ip2long = require('../lib/extern/ip2long');
var jspack = require('../lib/extern/node-jspack/jspack').jspack;
var pack = require('../lib/extern/pack').pack;

exports['test_pack_and_unpack'] = function(test, assert) {
  var ip = '127.0.0.1';
  var port = 5555;
  var ipLong = ip2long.ip2long(ip);

  var packed = new Buffer(pack('Nn', ipLong, port), 'binary');
  var unpacked = jspack.Unpack('LH', packed);

  assert.equal(unpacked[0], ipLong);
  assert.equal(unpacked[1], port);

  test.finish();
};
