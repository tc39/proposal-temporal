// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochseconds
---*/


function createConstructor(result) {
  return function(ns) {
    assert.sameValue(ns, 10_000_000_000n);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(undefined), 10), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(null), 10), "null");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(true), 10), "true");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor("test"), 10), "string");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(Symbol()), 10), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(7), 10), "number");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor(7n), 10), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(createConstructor({}), 10), "Non-callable object");
