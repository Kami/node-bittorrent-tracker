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
      if (value instanceof Array) {
        return bencode_list(value);
      }
      else if (value instanceof Object) {
        return bencode_dictionary(value);
      }
      else {
        throw new Error('Invalid type')
      }
    }

    default: {
      throw new Error('Invalid type');
    }
  }
}

var bencode_integer = function(integer) {
  return sprintf('i%se', integer);
};

var bencode_string = function(string) {
  return sprintf('%s:%s', string.length, string);
};

var bencode_list = function(list) {
  var item;
  var encoded = [];

  encoded.push('l');
  for (var i = 0; i < list.length; i++) {
    item = list[i];
    encoded.push(bencode(item));
  }

  encoded.push('e');

  return encoded.join('');
};

var bencode_dictionary = function(dictionary) {
  var value, temp;
  var encoded = [];

  encoded.push('d');
  for (var key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      value = dictionary[key];

      encoded.push(sprintf('%s%s', bencode_string(key), bencode(value)));
    }
  }

  // Sort the dictionary items by the key name in alphabetic order
  temp = encoded.splice(1);
  temp.sort(function(a, b) {
    var key_a, key_b;

    key_a  = a.substr(a.indexOf(':') + 1);
    key_b  = b.substr(b.indexOf(':') + 1);

    return key_a.localeCompare(key_b);
  });

  encoded = encoded.concat(temp);
  encoded.push('e');

  return encoded.join('');
};

var bdecode = function(string) {
  var match_object;
  var len, value;
  var bencoded_objects = [];

  if (!string) {
    return '';
  }

  if (typeof string !== 'string') {
    throw new Error('First argument must be a string');
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

  match_object = string.match(/^i(\d+)e/);
  if (match_object) {
    value = match_object[1];
    len = value.length;

    return [value, match_object[1].length + 2];
  }

  if (string[0] === 'l') {
    return bdecode_list(string);
  }
  else if (string[0] === 'd') {
    return bdecode_dictionary(string);
  }

  return null;
};

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

    value = bdecode(list.substr(i));
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

    value = bdecode(dictionary.substr(i));
    key = value[0];

    if (!value) {
      break;
    }

    i = i + value[1];

    value = bdecode(dictionary.substr(i));
    if (!value) {
      break;
    }

    i = i + value[1];

    dictionary_object[key] = value[0];
  }

  return [dictionary_object, dictionary.length];
};

exports.bencode = bencode;
exports.bencode_integer = bencode_integer;
exports.bencode_string = bencode_string;
exports.bencode_list = bencode_list;
exports.bencode_dictionary = bencode_dictionary;

exports.bdecode = bdecode;
exports.bdecode_list = bdecode_list;
exports.bdecode_dictionary = bdecode_dictionary;
