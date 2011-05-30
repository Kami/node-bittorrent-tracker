var net = require('net');
var dns = require('dns');

function getUnixTimestamp(date) {
  var dateToFormat = date || new Date();

  return Math.round(dateToFormat / 1000);
}

function resolveIpAddress(ip, callback) {
  var isIp = net.isIP(ip);
  if (isIp === 4 || isIp === 6) {
    callback();
    return;
  }

  dns.resolve4(ip, function(err, addresses) {
    var ip;
    if (err) {
      callback(err);
      return;
    }

    ip = addresses[0];
    callback();
  });
}

exports.getUnixTimestamp = getUnixTimestamp;
exports.resolveIpAddress = resolveIpAddress;
