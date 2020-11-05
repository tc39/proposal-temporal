// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
    assert.compareArray([year, month, day, hour, minute, second, millisecond, microsecond, nanosecond], [2000, 5, 2, 12, 34, 56, 987, 654, 321]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(undefined), "2000-05-02T12:34:56.987654321"), "undefined");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(null), "2000-05-02T12:34:56.987654321"), "null");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(true), "2000-05-02T12:34:56.987654321"), "true");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor("test"), "2000-05-02T12:34:56.987654321"), "string");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(Symbol()), "2000-05-02T12:34:56.987654321"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(7), "2000-05-02T12:34:56.987654321"), "number");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor(7n), "2000-05-02T12:34:56.987654321"), "bigint");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(createConstructor({}), "2000-05-02T12:34:56.987654321"), "Non-callable object");
