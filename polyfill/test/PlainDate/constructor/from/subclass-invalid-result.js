// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(year, month, day) {
    assert.compareArray([year, month, day], [2000, 5, 2]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(undefined), "2000-05-02"), "undefined");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(null), "2000-05-02"), "null");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(true), "2000-05-02"), "true");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor("test"), "2000-05-02"), "string");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(Symbol()), "2000-05-02"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(7), "2000-05-02"), "number");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor(7n), "2000-05-02"), "bigint");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(createConstructor({}), "2000-05-02"), "Non-callable object");
