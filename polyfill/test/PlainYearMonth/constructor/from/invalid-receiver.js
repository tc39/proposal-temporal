// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.from
---*/

assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(undefined, "2000-05"), "undefined");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(null, "2000-05"), "null");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(true, "2000-05"), "true");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call("test", "2000-05"), "string");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(Symbol(), "2000-05"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(7, "2000-05"), "number");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call(7n, "2000-05"), "bigint");
assert.throws(TypeError, () => Temporal.PlainYearMonth.from.call({}, "2000-05"), "Non-callable object");
