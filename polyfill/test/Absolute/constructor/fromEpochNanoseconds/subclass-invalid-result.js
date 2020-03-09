// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochnanoseconds
---*/


function createConstructor(result) {
  return function(ns) {
    assert.sameValue(ns, 10n);
    return result;
  }
}
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(undefined), 10n), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(null), 10n), "null");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(true), 10n), "true");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor("test"), 10n), "string");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(Symbol()), 10n), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(7), 10n), "number");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor(7n), 10n), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochNanoseconds.call(createConstructor({}), 10n), "Non-callable object");
