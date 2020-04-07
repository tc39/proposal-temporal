// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
includes: [compareArray.js]
---*/

function createConstructor(result) {
  return function(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    assert.compareArray([years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], [1, 2, 3, 4, 5, 6, 987, 654, 321]);
    return result;
  };
}
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(undefined), "P1Y2M3DT4H5M6.987654321S"), "undefined");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(null), "P1Y2M3DT4H5M6.987654321S"), "null");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(true), "P1Y2M3DT4H5M6.987654321S"), "true");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor("test"), "P1Y2M3DT4H5M6.987654321S"), "string");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(Symbol()), "P1Y2M3DT4H5M6.987654321S"), "Symbol");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(7), "P1Y2M3DT4H5M6.987654321S"), "number");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor(7n), "P1Y2M3DT4H5M6.987654321S"), "bigint");
assert.throws(TypeError, () => Temporal.Duration.from.call(createConstructor({}), "P1Y2M3DT4H5M6.987654321S"), "Non-callable object");
