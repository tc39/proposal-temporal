// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(hour, minute, second, millisecond, microsecond, nanosecond) {
    assert.compareArray([hour, minute, second, millisecond, microsecond, nanosecond], [12, 34, 56, 987, 654, 321]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(undefined), "12:34:56.987654321"), "undefined");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(null), "12:34:56.987654321"), "null");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(true), "12:34:56.987654321"), "true");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor("test"), "12:34:56.987654321"), "string");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(Symbol()), "12:34:56.987654321"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(7), "12:34:56.987654321"), "number");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor(7n), "12:34:56.987654321"), "bigint");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(createConstructor({}), "12:34:56.987654321"), "Non-callable object");
