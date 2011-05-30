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
var bdecode_value = function(string) {
  var match_object;
  var len, value, value_int, negative;
  var bencoded_objects = [];

  if (typeof string !== 'string') {
    throw new Error('First argument must be a string');
  }

  if (!string) {
    return ['', 0];
  }

  match_object = string.match(/^(\d+):/);
  if (match_object) {
    len = parseInt(match_object[1], 10);
    value = string.substr(match_object[1].length + 1, len);

    if (value.length !== len) {
      throw new Error('Invalid bencoded string');
    }

    return [value, (value.length + match_object[1].length + 1)];
  }

  match_object = string.match(/^i((-)?\d+)e/);
  if (match_object) {
    // Integer
    value = match_object[1];
    value_int = parseInt(parseInt(value), 10);
    negative = match_object[2];
    len = value.length;

    if (value_int === 0 && negative) {
      throw new Error('Negative zero is not permitted');
    }

    return [value_int, match_object[1].length + 2];
  }

  if (string[0] === 'l') {
    return bdecode_list(string);
  }
  else if (string[0] === 'd') {
    return bdecode_dictionary(string);
  }

  throw new Error(sprintf('Invalid bencoded string: %s', string));
};

var bdecode = function(string) {
  return bdecode_value(string)[0];
}

var bdecode_list = function(list) {
  var i, item, value;
  var list_array = [];

  if (list[0] !== 'l') {
    throw new Error('Bencoded list objects must start with \'l\'');
  }

  i = 1;
  while (i < list.length - 1) {
    item = list[i];
    if (item === 'e') {
      break;
    }

    value = bdecode_value(list.substr(i));
    if (!value) {
      break;
    }

    i = i + value[1];
    list_array.push(value[0]);
  }

  return [list_array, list.length];
};

var bdecode_dictionary = function(dictionary) {
  var i, item, key, value;
  var dictionary_object = {};

  if (dictionary[0] !== 'd') {
    throw new Error('Bencoded dictionary objects must start with \'d\'');
  }

  i = 1;
  while (i < dictionary.length - 1) {
    item = dictionary[i];
    if (item === 'e') {
      break;
    }

    value = bdecode_value(dictionary.substr(i));

    if (!value) {
      break;
    }

    key = value[0];
    i = i + value[1];

    value = bdecode_value(dictionary.substr(i));
    if (!value) {
      break;
    }

    i = i + value[1];

    dictionary_object[key] = value[0];
  }

  return [dictionary_object, dictionary.length];
};

exports.bencode = exports.benc = exports.enc = bencode;
exports.bencode_integer = bencode_integer;
exports.bencode_string = bencode_string;
exports.bencode_list = bencode_list;
exports.bencode_dictionary = bencode_dictionary;

exports.bdecode = exports.bdec = exports.dec = bdecode;
exports.bdecode_list = bdecode_list;
exports.bdecode_dictionary = bdecode_dictionary;
