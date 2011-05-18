var defaultConfig = {
    'ip': '0.0.0.0',
    'port': 8888,

    'backend': {
        'name': 'memory',
        'options': {}
    },

    'ssl_enabled': false,
    'ssl_key': '',
    'ssl_cert': '',
    'ssl_ca_cert': ''
};

function getConfig() {
    return defaultConfig;
}

function getValue(key) {
    return defaultConfig[key];
}

exports.getConfig = getConfig;
exports.getValue = getValue;
