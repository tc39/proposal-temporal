// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toplainmonthday
---*/

const toMonthDay = Temporal.PlainDate.prototype.toPlainMonthDay;

assert.sameValue(typeof toMonthDay, "function");

assert.throws(TypeError, () => toMonthDay.call(undefined), "undefined");
assert.throws(TypeError, () => toMonthDay.call(null), "null");
assert.throws(TypeError, () => toMonthDay.call(true), "true");
assert.throws(TypeError, () => toMonthDay.call(""), "empty string");
assert.throws(TypeError, () => toMonthDay.call(Symbol()), "symbol");
assert.throws(TypeError, () => toMonthDay.call(1), "1");
assert.throws(TypeError, () => toMonthDay.call({}), "plain object");
assert.throws(TypeError, () => toMonthDay.call(Temporal.PlainDate), "Temporal.PlainDate");
assert.throws(TypeError, () => toMonthDay.call(Temporal.PlainDate.prototype), "Temporal.PlainDate.prototype");
