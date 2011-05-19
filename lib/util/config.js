var defaultConfig = {
  'ip': '0.0.0.0',
  'port': 8888,

  'database': {
    'backend': 'file',
    'options': {
      'file_path': 'data.db', // Where the data is saved on disk
      'flush_interval': 100 // How often to flush data from memory on disk
    }
  },

  'ssl_enabled': false,
  'ssl_key': '',
  'ssl_cert': '',
  'ssl_ca_cert': '',

  'interval': 120, // How long the client should wait between announce requests
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
