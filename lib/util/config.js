var defaultConfig = {
  'ip': '0.0.0.0',
  'port': 8888,

  'database': {
    'backend': 'memory',
    'options': {}
  },

  'ssl_enabled': false,
  'ssl_key': '',
  'ssl_cert': '',
  'ssl_ca_cert': '',

  'interval': 300, // How long the client should wait between announce requests
  'min_interval': 50, // How often can client send announce messages
  'default_numwant': 30, // Maximum number of peers a client can request
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
