// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.minus
features: [Symbol]
---*/

const instance = Temporal.Time.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
assert.throws(TypeError, () => instance.minus(undefined), "undefined");
assert.throws(TypeError, () => instance.minus(null), "null");
assert.throws(TypeError, () => instance.minus(true), "boolean");
assert.throws(TypeError, () => instance.minus("PT3M"), "string");
assert.throws(TypeError, () => instance.minus(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.minus(7), "number");
assert.throws(TypeError, () => instance.minus(7n), "bigint");

