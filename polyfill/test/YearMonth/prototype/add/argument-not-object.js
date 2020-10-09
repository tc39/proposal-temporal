// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.add
features: [Symbol]
---*/

const instance = Temporal.YearMonth.from({ year: 2000, month: 5 });
assert.throws(TypeError, () => instance.add(undefined), "undefined");
assert.throws(TypeError, () => instance.add(null), "null");
assert.throws(TypeError, () => instance.add(true), "boolean");
assert.throws(TypeError, () => instance.add("P3M"), "string");
assert.throws(TypeError, () => instance.add(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.add(7), "number");
assert.throws(TypeError, () => instance.add(7n), "bigint");

