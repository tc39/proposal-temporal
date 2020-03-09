// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochseconds
---*/

assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(undefined, 10), "undefined");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(null, 10), "null");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(true, 10), "true");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call("test", 10), "string");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(Symbol(), 10), "Symbol");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(7, 10), "number");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call(7n, 10), "bigint");
assert.throws(TypeError, () => Temporal.Absolute.fromEpochSeconds.call({}, 10), "Non-callable object");
