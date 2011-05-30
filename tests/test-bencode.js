var bencode = require('util/bencode');

exports['test bencode invalid type'] = function(test, assert) {
  var e = 0;

  try {
    bencode.bencode(true);
  }
  catch (err) {
    assert.match(err.message, /invalid type/i);
    e++;
  }

  assert.equal(e, 1);
  test.finish();
};

exports['test bencode integer'] = function(test, assert) {
  assert.equal(bencode.bencode_integer(4), 'i4e');
  assert.equal(bencode.bencode_integer(-5), 'i-5e');
  assert.equal(bencode.bencode_integer(0), 'i0e');
  assert.equal(bencode.bencode_integer(-0), 'i0e');

  test.finish();
};

exports['test bencode string'] = function(test, assert) {
  assert.equal(bencode.bencode_string('spam'), '4:spam');
  assert.equal(bencode.bencode_string('egg'), '3:egg');

  test.finish();
};

exports['test bencode list'] = function(test, assert) {
  assert.equal(bencode.bencode(['spam', 42]), 'l4:spami42ee');

  test.finish();
};

exports['test bencode dictionary'] = function(test, assert) {
  assert.equal(bencode.bencode({'foo': 42, 'bar': 'spam'}), 'd3:bar4:spam3:fooi42ee');

  test.finish();
};

exports['test bdecode integer'] = function(test, assert) {
  var e = 0;

  assert.equal(bencode.bdecode('i4e'), 4);
  assert.equal(bencode.bdecode('i0e'), 0);
  assert.equal(bencode.bdecode('i12345e'), 12345);
  assert.equal(bencode.bdecode('i-42e'), -42);

  try {
    console.log(bencode.bdecode('i-0e'));
  }
  catch (err) {
    e++;
    assert.match(err.message, /negative zero is not permitted/i);
  }

  assert.equal(e, 1, 'Exceptions thrown');
  test.finish();
};

exports['test bdecode empty string'] = function(test, assert) {
  assert.equal(bencode.bdecode(''), '');
  test.finish();
};

exports['test bdecode dictionary doesnt start with d'] = function(test, assert) {
  var e = 0;

  try {
    bencode.bdecode('x3:bar4');
  }
  catch (err) {
    assert.match(err.message, /invalid bencoded string/i);
    e++;
  }

  assert.equal(e, 1);
  test.finish();
};

exports['test bdecode non-string string'] = function(test, assert) {
  var e = 0;
  var i, value, valuesLen;
  var values = [
    {'a': 'b'},
    [1, 2],
    new Error()
  ];

  for (i = 0, valuesLen = values.length; i < valuesLen; i++) {
    value = values[i];

    try {
      bencode.bdecode(value);
    }
    catch (err) {
      assert.match(err.message, /first argument must be a string/i);
      e++;
    }
  }

  assert.equal(e, valuesLen);
  test.finish();
};


exports['test bdecode string'] = function(test, assert) {
  var e = 0;

  assert.equal(bencode.bdecode('4:test'), 'test');
  assert.equal(bencode.bdecode('3:foo'), 'foo');

  try {
    assert.equal(bencode.bdecode('5:bar'), 'bar');
  }
  catch (error) {
    e++;
    assert.match(error, /invalid bencoded string/i);
  }

  assert.equal(1, e, 'Exceptions thrown');

  test.finish();
};

exports['test bdecode list'] = function(test, assert) {
  assert.deepEqual(bencode.bdecode('l4:spami42ee'), ['spam', 42]);

  test.finish();
};

exports['test bdecode list doesnt start with l'] = function(test, assert) {
  var e = 0;

  try {
    bencode.bdecode('m4:spami42ee');
  }
  catch (err) {
    e++;
    assert.match(err.message, /invalid bencoded string/i);
  }

  assert.equal(e, 1, 'Exceptions thrown');
  test.finish();
};

exports['test bdecode empty list'] = function(test, assert) {
  var e = 0;
  var values = ['l1e'];

  values.forEach(function(value) {
    try {
      bencode.bdecode(value);
    }
    catch (err) {
      e++;
      assert.match(err.message, /invalid bencoded string/i);
    }
  });

  assert.deepEqual(bencode.bdecode('le:e'), []);

  assert.equal(e, values.length, 'Exceptions thrown');
  test.finish();
};

exports['test bdecode empty dictionary'] = function(test, assert) {
  var e = 0;
  var values = ['d1e'];

  values.forEach(function(value) {
    try {
      bencode.bdecode(value);
    }
    catch (err) {
      e++;
    }
  });

  assert.deepEqual(bencode.bdecode('de:e'), {});
  assert.deepEqual(bencode.bdecode('de'), {});

  assert.equal(e, values.length, 'Exceptions thrown');
  test.finish();
};

exports['test bdecode object'] = function(test, assert) {
 assert.deepEqual(bencode.bdecode('d3:bar4:spam3:fooi42ee'), {'foo': 42, 'bar': 'spam'});

  test.finish();
};
