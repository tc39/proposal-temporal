// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.tomonthday
---*/

const toMonthDay = Temporal.Date.prototype.toMonthDay;

assert.sameValue(typeof toMonthDay, "function");

assert.throws(TypeError, () => toMonthDay.call(undefined), "undefined");
assert.throws(TypeError, () => toMonthDay.call(null), "null");
assert.throws(TypeError, () => toMonthDay.call(true), "true");
assert.throws(TypeError, () => toMonthDay.call(""), "empty string");
assert.throws(TypeError, () => toMonthDay.call(Symbol()), "symbol");
assert.throws(TypeError, () => toMonthDay.call(1), "1");
assert.throws(TypeError, () => toMonthDay.call({}), "plain object");
assert.throws(TypeError, () => toMonthDay.call(Temporal.Date), "Temporal.Date");
assert.throws(TypeError, () => toMonthDay.call(Temporal.Date.prototype), "Temporal.Date.prototype");
