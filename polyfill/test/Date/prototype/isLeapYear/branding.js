// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.date.prototype.isleapyear
---*/

const isLeapYear = Object.getOwnPropertyDescriptor(Temporal.Date.prototype, "isLeapYear").get;

assert.sameValue(typeof isLeapYear, "function");

assert.throws(TypeError, () => isLeapYear.call(undefined), "undefined");
assert.throws(TypeError, () => isLeapYear.call(null), "null");
assert.throws(TypeError, () => isLeapYear.call(true), "true");
assert.throws(TypeError, () => isLeapYear.call(""), "empty string");
assert.throws(TypeError, () => isLeapYear.call(Symbol()), "symbol");
assert.throws(TypeError, () => isLeapYear.call(1), "1");
assert.throws(TypeError, () => isLeapYear.call({}), "plain object");
assert.throws(TypeError, () => isLeapYear.call(Temporal.Date), "Temporal.Date");
assert.throws(TypeError, () => isLeapYear.call(Temporal.Date.prototype), "Temporal.Date.prototype");
