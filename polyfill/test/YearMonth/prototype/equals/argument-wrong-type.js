// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.equals
features: [Symbol]
---*/

const instance = Temporal.YearMonth.from({ year: 2000, month: 5, day: 2 });

assert.throws(TypeError, () => instance.equals(undefined), "undefined");
assert.throws(TypeError, () => instance.equals(null), "null");
assert.throws(TypeError, () => instance.equals(true), "true");
assert.throws(TypeError, () => instance.equals(""), "empty string");
assert.throws(TypeError, () => instance.equals(Symbol()), "symbol");
assert.throws(TypeError, () => instance.equals(1), "1");
assert.throws(TypeError, () => instance.equals({}), "plain object");
assert.throws(TypeError, () => instance.equals(Temporal.YearMonth), "Temporal.YearMonth");
assert.throws(TypeError, () => instance.equals(Temporal.YearMonth.prototype), "Temporal.YearMonth.prototype");
