// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.minus
features: [Symbol]
---*/

const instance = Temporal.Date.from({ year: 2000, month: 5, day: 2 });
assert.throws(TypeError, () => instance.minus(undefined), "undefined");
assert.throws(TypeError, () => instance.minus(null), "null");
assert.throws(TypeError, () => instance.minus(true), "boolean");
assert.throws(TypeError, () => instance.minus("P3D"), "string");
assert.throws(TypeError, () => instance.minus(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.minus(7), "number");
assert.throws(TypeError, () => instance.minus(7n), "bigint");

