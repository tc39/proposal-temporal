// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.from
---*/


function createConstructor(result) {
  return function(ns) {
    assert.sameValue(ns, 217_175_010_123_456_789n);
    return result;
  }
}

assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(undefined), "1976-11-18T14:23:30.123456789Z"), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(null), "1976-11-18T14:23:30.123456789Z"), "null");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(true), "1976-11-18T14:23:30.123456789Z"), "true");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor("test"), "1976-11-18T14:23:30.123456789Z"), "string");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(Symbol()), "1976-11-18T14:23:30.123456789Z"), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(7), "1976-11-18T14:23:30.123456789Z"), "number");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor(7n), "1976-11-18T14:23:30.123456789Z"), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.from.call(createConstructor({}), "1976-11-18T14:23:30.123456789Z"), "Non-callable object");
