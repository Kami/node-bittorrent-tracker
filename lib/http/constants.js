var sprintf = require('sprintf').sprintf;

var config = require('util/config');

/**
 * http://wiki.theory.org/BitTorrent_Tracker_Protocol#Response_Codes
 */

var REQUIRED_PARAMS = [ 'info_hash', 'peer_id', 'port' ];

var MISSING_PARAM_STATUS_CODES = {
  'info_hash': 100,
  'peer_id': 101,
  'port': 103
};

var PARAM_LENGTHS = {
  'info_hash': 20,
  'peer_indo': 20
};

/**
 * Validation rules for announce http request parameters.
 */
var VALIDATION_RULES = {
  'info_hash': {
    'required': {
      'err_code': 101,
      'err_msg': 'Missing required field: info_hash'
    },
    'length': {
      'value': 20,
      'err_code': 150,
      'err_msg': 'info_hash must be 20 bytes long'
    }
  },
  'peer_id': {
    'required': {
      'err_code': 102,
      'err_msg': 'Missing required field: peer_id'
    },
    'length': {
      'value': 20,
      'err_code': 151,
      'err_msg': 'peer_id must be 20 bytes long'
    }
  },
  'port': {
    'required': {
      'err_code': 103,
      'err_msg': 'Missing required field: port'
    },
    'min_value': {
      'value': 1,
      'err_code': 153,
      'err_msg': 'Minimum port value is 1'
    },
    'max_value': {
      'value': 65535,
      'err_code': 153,
      'err_msg': 'Maximum port value is 65535'
    }
  },
  'numwant': {
    'max_value': {
      'value': config.getValue('max_numwant'),
      'err_code': 152,
      'err_msg': sprintf('Requested more peers than allowed by tracker (allowed=%s)',
                         config.getValue('max_numwant'))
    }
  },
  'event': {
    'valid_values': {
      'value': ['announce', 'started', 'stopped', 'completed'],
      'err_code': 154,
      'err_msg': 'Invalid event provided.'
    }
  }
};

exports.VALIDATION_RULES = VALIDATION_RULES;
