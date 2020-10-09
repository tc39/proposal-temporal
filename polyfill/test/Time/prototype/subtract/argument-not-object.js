// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.subtract
features: [Symbol]
---*/

const instance = Temporal.Time.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
assert.throws(TypeError, () => instance.subtract(undefined), "undefined");
assert.throws(TypeError, () => instance.subtract(null), "null");
assert.throws(TypeError, () => instance.subtract(true), "boolean");
assert.throws(TypeError, () => instance.subtract("PT3M"), "string");
assert.throws(TypeError, () => instance.subtract(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.subtract(7), "number");
assert.throws(TypeError, () => instance.subtract(7n), "bigint");

