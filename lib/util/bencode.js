/**
 * Bencode library based on specs at http://en.wikipedia.org/wiki/Bencode
 */

var sprintf = require('sprintf').sprintf;

var bencode = function(value) {
  var value_type = typeof(value);

  switch (value_type) {
    case 'number': {
      return bencode_integer(value);
    }

    case 'string': {
      return bencode_string(value);
    }

    case 'object': {
    if ((value instanceof Array)) {
        return bencode_list(value);
      }
      else if ((value instanceof Object)) {
        return bencode_dictionary(value);
      }
      else {
        throw new Error(sprintf('Invalid type, value = %s', value));
      }
    }

    default: {
      throw new Error(sprintf('Invalid type, value = %s', value));
    }
  }
}

var bencode_integer = function(integer) {
  return 'i' + integer.toString() + 'e';
};

var bencode_string = function(string) {
  return string.length.toString() + ':' + string;
};

var bencode_list = function(list) {
  var i, len ,item;
  var encoded = '';

  encoded += 'l';
  for (i = 0, len = list.length; i < len; i++) {
    item = list[i];
    encoded += bencode(item);
  }

  encoded += 'e';
  return encoded;
};

var bencode_dictionary = function(dictionary) {
  var keys, key, i, len;
  var encoded = '';

  keys = Object.keys(dictionary);
  keys.sort();

  encoded += 'd';
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    value = dictionary[key];
    encoded += bencode_string(key) + bencode(value);
  }

  encoded += 'e';
  return encoded;
};

/**
 * Decode a bencoded value.
 *
 * @param {String} string Bencoded value.
 * @return {Array} Array where the first item is bdecoded object and the second
 * item is the bencoded string length;
 */

var bdecode = function(string) {
  var offset, offsetMarker, stringLen;
  offset = 0;
  stringLen = string.length;

  if (typeof string !== 'string') {
    throw new Error('First argument must be a string');
  }

  if (string === '') {
    return '';
  }

  var bdecode_value = function() {
    var character, key, value, decoded, decoded_int;

    if (offset > stringLen) {
      throw new Error('Invalid bencoded string');
    }

    offsetMarker = offset;
    switch (character = string[offset++]) {
      case 'd': {
        decoded = {};

        while (true) {
          if (string[offset] === 'e') {
            offset++;
            break;
          }

          key = bdecode_value();
          if (typeof string !== 'string') {
            throw new Error('Dictionary key must be a string');
          }

          value = bdecode_value();
          decoded[key] = value;
        }

        return decoded;
      }

    case 'l': {
        decoded = [];

        while (true) {
          if (string[offset] === 'e') {
            offset++;
            break;
          }

          value = bdecode_value();
          decoded.push(value);
        }

        return decoded;
      }

      // Integer
      case 'e':
      case 'i': {
        decoded = '';
        offsetMarker = offset;

        while ((value = string[offset++]) !== 'e' && offset < stringLen) {
          decoded += value;
        }

        decoded_int = parseInt(decoded, 10);

        if (decoded.charAt(0) === '-' && decoded_int === 0) {
          throw new Error('Negative zero is not permitted');
        }

        return decoded_int;
      }

      // String (starts with length)
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        len = '';

        while ((value = string[offsetMarker++]) !== ':' && (offsetMarker < stringLen)) {
          len += value;
        }

        len = parseInt(len, 10);

        decoded = string.substr(offsetMarker, len);

        if (decoded.length !== len) {
          throw new Error('Invalid bencoded string');
        }

        offsetMarker += len;
        offset = offsetMarker;
        return decoded;

      default: {
        throw new Error(sprintf('Invalid bencoded string, offset: %s', offset));
      }
    }
  };

  return bdecode_value(string);
};

exports.bencode = exports.benc = exports.enc = bencode;
exports.bencode_integer = bencode_integer;
exports.bencode_string = bencode_string;
exports.bencode_list = bencode_list;
exports.bencode_dictionary = bencode_dictionary;

exports.bdecode = exports.bdec = exports.dec = bdecode;
