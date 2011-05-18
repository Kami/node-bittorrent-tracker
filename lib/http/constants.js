
/**
 * http://wiki.theory.org/BitTorrent_Tracker_Protocol#Response_Codes
 */

var REQUIRED_PARAMS = [ 'info_hash', 'peer_id', 'port' ];

var MISSING_PARAM_STATUS_CODES = {
  'info_hash': 100,
  'peer_id': 101,
  'port': 103
};

exports.REQUIRED_PARAMS = REQUIRED_PARAMS;
exports.MISSING_PARAM_STATUS_CODES = MISSING_PARAM_STATUS_CODES;
