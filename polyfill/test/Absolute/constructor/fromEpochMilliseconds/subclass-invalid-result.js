// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochmilliseconds
---*/

function createConstructor(result) {
  return function(ns) {
    assert.sameValue(ns, 10_000_000n);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(undefined), 10), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(null), 10), "null");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(true), 10), "true");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor("test"), 10), "string");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(Symbol()), 10), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(7), 10), "number");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor(7n), 10), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochMilliseconds.call(createConstructor({}), 10), "Non-callable object");
