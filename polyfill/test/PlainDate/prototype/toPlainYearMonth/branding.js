// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toyearmonth
---*/

const toYearMonth = Temporal.PlainDate.prototype.toPlainYearMonth;

assert.sameValue(typeof toYearMonth, "function");

assert.throws(TypeError, () => toYearMonth.call(undefined), "undefined");
assert.throws(TypeError, () => toYearMonth.call(null), "null");
assert.throws(TypeError, () => toYearMonth.call(true), "true");
assert.throws(TypeError, () => toYearMonth.call(""), "empty string");
assert.throws(TypeError, () => toYearMonth.call(Symbol()), "symbol");
assert.throws(TypeError, () => toYearMonth.call(1), "1");
assert.throws(TypeError, () => toYearMonth.call({}), "plain object");
assert.throws(TypeError, () => toYearMonth.call(Temporal.PlainDate), "Temporal.PlainDate");
assert.throws(TypeError, () => toYearMonth.call(Temporal.PlainDate.prototype), "Temporal.PlainDate.prototype");
