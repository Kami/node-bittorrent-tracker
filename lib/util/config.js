var defaultConfig = {
  'ip': '0.0.0.0',
  'port': 8888,

  'storage_backend': { // Where the peer info is stored
    'name': 'memory',
    'options': {}
  },

  'ssl_enabled': false,
  'ssl_key': '',
  'ssl_cert': '',
  'ssl_ca_cert': '',

  'max_numwant': 100 // Maximum number of peers a client can request
};

function getConfig() {
  return defaultConfig;
}

function getValue(key) {
  return defaultConfig[key];
}

exports.getConfig = getConfig;
exports.getValue = getValue;
