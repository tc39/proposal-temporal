// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.plus
features: [Symbol]
---*/

const instance = Temporal.Time.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
assert.throws(TypeError, () => instance.plus(undefined), "undefined");
assert.throws(TypeError, () => instance.plus(null), "null");
assert.throws(TypeError, () => instance.plus(true), "boolean");
assert.throws(TypeError, () => instance.plus("PT3M"), "string");
assert.throws(TypeError, () => instance.plus(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.plus(7), "number");
assert.throws(TypeError, () => instance.plus(7n), "bigint");

