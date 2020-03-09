// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.from
---*/

assert.throws(TypeError, () => Temporal.Absolute.from.call(undefined, "1976-11-18T14:23:30.123456789Z"), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.from.call(null, "1976-11-18T14:23:30.123456789Z"), "null");
assert.throws(TypeError, () => Temporal.Absolute.from.call(true, "1976-11-18T14:23:30.123456789Z"), "true");
assert.throws(TypeError, () => Temporal.Absolute.from.call("test", "1976-11-18T14:23:30.123456789Z"), "string");
assert.throws(TypeError, () => Temporal.Absolute.from.call(Symbol(), "1976-11-18T14:23:30.123456789Z"), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.from.call(7, "1976-11-18T14:23:30.123456789Z"), "number");
assert.throws(TypeError, () => Temporal.Absolute.from.call(7n, "1976-11-18T14:23:30.123456789Z"), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.from.call({}, "1976-11-18T14:23:30.123456789Z"), "Non-callable object");
