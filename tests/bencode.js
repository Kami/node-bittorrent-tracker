var bencode = require('bencode');

exports['test bencode integer'] = function(assert, beforeExit) {
  var e = 0;

  assert.equal(bencode.bencode_integer(4), 'i4e');
  assert.equal(bencode.bencode_integer(-5), 'i-5e');
  assert.equal(bencode.bencode_integer(0), 'i0e');
  assert.equal(bencode.bencode_integer(-0), 'i0e');
};

exports['test bencode string'] = function(assert, beforeExit) {
  assert.equal(bencode.bencode_string('spam'), '4:spam');
  assert.equal(bencode.bencode_string('egg'), '3:egg');
};

exports['test bencode list'] = function(assert, beforeExit) {
  assert.equal(bencode.bencode_list(['spam', 42]), 'l4:spami42ee');
};

exports['test bencode dictionary'] = function(assert, beforeExit) {
  assert.equal(bencode.bencode_dictionary({'foo': 42, 'bar': 'spam'}), 'd3:bar4:spam3:fooi42ee');
};

exports['test bdecode integer'] = function(assert, beforeExit) {
  assert.equal(bencode.bdecode('i4e')[0], 4);
  assert.equal(bencode.bdecode('i0e')[0], 0);
  assert.equal(bencode.bdecode('i12345e')[0], 12345);
  assert.equal(bencode.bdecode('i-0e'), null);
};

exports['test bdecode string'] = function(assert, beforeExit) {
  var e = 0;

  assert.equal(bencode.bdecode('4:test')[0], 'test');
  assert.equal(bencode.bdecode('3:foo')[0], 'foo');

  try {
    assert.equal(bencode.bdecode('5:bar'), 'bar');
  }
  catch (error) {
    e++;
    assert.match(error, /invalid bencoded string/i);
  }

  beforeExit(function(){
    assert.equal(1, e, 'Exceptions thrown');
  });
};

exports['test bdecode list'] = function(assert, beforeExit) {
  assert.deepEqual(bencode.bdecode('l4:spami42ee')[0], ['spam', 42]);
};

exports['test bdecode object'] = function(assert, beforeExit) {
 assert.deepEqual(bencode.bdecode('d3:bar4:spam3:fooi42ee')[0], {'foo': 42, 'bar': 'spam'});
};
