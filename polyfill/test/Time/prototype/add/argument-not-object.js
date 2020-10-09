// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.add
features: [Symbol]
---*/

const instance = Temporal.Time.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
assert.throws(TypeError, () => instance.add(undefined), "undefined");
assert.throws(TypeError, () => instance.add(null), "null");
assert.throws(TypeError, () => instance.add(true), "boolean");
assert.throws(TypeError, () => instance.add("PT3M"), "string");
assert.throws(TypeError, () => instance.add(Symbol()), "Symbol");
assert.throws(TypeError, () => instance.add(7), "number");
assert.throws(TypeError, () => instance.add(7n), "bigint");

