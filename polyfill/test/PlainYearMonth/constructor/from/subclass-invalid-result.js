// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(year, month) {
    assert.compareArray([year, month], [2000, 5]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(undefined), "2000-05"), "undefined");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(null), "2000-05"), "null");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(true), "2000-05"), "true");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor("test"), "2000-05"), "string");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(Symbol()), "2000-05"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(7), "2000-05"), "number");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor(7n), "2000-05"), "bigint");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(createConstructor({}), "2000-05"), "Non-callable object");
