// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.date.prototype.dayofyear
---*/

const dayOfYear = Object.getOwnPropertyDescriptor(Temporal.Date.prototype, "dayOfYear").get;

assert.sameValue(typeof dayOfYear, "function");

assert.throws(TypeError, () => dayOfYear.call(undefined), "undefined");
assert.throws(TypeError, () => dayOfYear.call(null), "null");
assert.throws(TypeError, () => dayOfYear.call(true), "true");
assert.throws(TypeError, () => dayOfYear.call(""), "empty string");
assert.throws(TypeError, () => dayOfYear.call(Symbol()), "symbol");
assert.throws(TypeError, () => dayOfYear.call(1), "1");
assert.throws(TypeError, () => dayOfYear.call({}), "plain object");
assert.throws(TypeError, () => dayOfYear.call(Temporal.Date), "Temporal.Date");
assert.throws(TypeError, () => dayOfYear.call(Temporal.Date.prototype), "Temporal.Date.prototype");
