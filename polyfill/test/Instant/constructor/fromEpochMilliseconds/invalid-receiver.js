// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochmilliseconds
---*/

assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(undefined, 10), "undefined");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(null, 10), "null");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(true, 10), "true");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call("test", 10), "string");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(Symbol(), 10), "Symbol");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(7, 10), "number");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call(7n, 10), "bigint");
assert.throws(TypeError, () => Temporal.Instant.fromEpochMilliseconds.call({}, 10), "Non-callable object");
