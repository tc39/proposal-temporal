
// Setup Global Environment to run TC39 tests via
// node -r ./test/node.js test/<path to test>.js

const assert = require('assert');
global.assert = (value, message)=>assert(value, message);
global.assert.sameValue = (actual, expected, message)=>assert.strictEqual(actual, expected, message);
global.assert.notSameValue = (actual, expected, message)=>assert.notStrictEqual(actual, expected, message);
global.assert.deepEqual = (actual, expected, message)=>assert.strictDeepEqual(actual, expected, message);
global.assert.notDeepEqual = (actual, expected, message)=>assert.notDeepStrictEqual(actual, expected, message);

global.assert.throws = (expectedErrorConstructor, fn, message)=>{
  try {
    fn();
  } catch(err) {
    assert(err.constructor === expectedErrorConstructor, message);
    return;
  }
  assert(false, message);
};
global.temporal = require('../index.js');
