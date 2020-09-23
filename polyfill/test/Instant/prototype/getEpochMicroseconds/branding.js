// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const getEpochMicroseconds = Temporal.Instant.prototype.getEpochMicroseconds;

assert.sameValue(typeof getEpochMicroseconds, "function");

assert.throws(TypeError, () => getEpochMicroseconds.call(undefined), "undefined");
assert.throws(TypeError, () => getEpochMicroseconds.call(null), "null");
assert.throws(TypeError, () => getEpochMicroseconds.call(true), "true");
assert.throws(TypeError, () => getEpochMicroseconds.call(""), "empty string");
assert.throws(TypeError, () => getEpochMicroseconds.call(Symbol()), "symbol");
assert.throws(TypeError, () => getEpochMicroseconds.call(1), "1");
assert.throws(TypeError, () => getEpochMicroseconds.call({}), "plain object");
assert.throws(TypeError, () => getEpochMicroseconds.call(Temporal.Instant), "Temporal.Instant");
assert.throws(TypeError, () => getEpochMicroseconds.call(Temporal.Instant.prototype), "Temporal.Instant.prototype");
