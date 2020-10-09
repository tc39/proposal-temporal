// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.subtract
---*/

const subtract = Temporal.Date.prototype.subtract;

assert.sameValue(typeof subtract, "function");

assert.throws(TypeError, () => subtract.call(undefined), "undefined");
assert.throws(TypeError, () => subtract.call(null), "null");
assert.throws(TypeError, () => subtract.call(true), "true");
assert.throws(TypeError, () => subtract.call(""), "empty string");
assert.throws(TypeError, () => subtract.call(Symbol()), "symbol");
assert.throws(TypeError, () => subtract.call(1), "1");
assert.throws(TypeError, () => subtract.call({}), "plain object");
assert.throws(TypeError, () => subtract.call(Temporal.Date), "Temporal.Date");
assert.throws(TypeError, () => subtract.call(Temporal.Date.prototype), "Temporal.Date.prototype");
