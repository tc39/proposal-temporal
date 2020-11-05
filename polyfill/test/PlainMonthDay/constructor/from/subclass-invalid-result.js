// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(month, day) {
    assert.compareArray([month, day], [5, 2]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(undefined), "05-02"), "undefined");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(null), "05-02"), "null");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(true), "05-02"), "true");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor("test"), "05-02"), "string");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(Symbol()), "05-02"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(7), "05-02"), "number");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor(7n), "05-02"), "bigint");
assert.throws(TypeError, () => Temporal.PlainMonthDay.from.call(createConstructor({}), "05-02"), "Non-callable object");
