// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const getEpochNanoseconds = Temporal.Instant.prototype.getEpochNanoseconds;

assert.sameValue(typeof getEpochNanoseconds, "function");

assert.throws(TypeError, () => getEpochNanoseconds.call(undefined), "undefined");
assert.throws(TypeError, () => getEpochNanoseconds.call(null), "null");
assert.throws(TypeError, () => getEpochNanoseconds.call(true), "true");
assert.throws(TypeError, () => getEpochNanoseconds.call(""), "empty string");
assert.throws(TypeError, () => getEpochNanoseconds.call(Symbol()), "symbol");
assert.throws(TypeError, () => getEpochNanoseconds.call(1), "1");
assert.throws(TypeError, () => getEpochNanoseconds.call({}), "plain object");
assert.throws(TypeError, () => getEpochNanoseconds.call(Temporal.Instant), "Temporal.Instant");
assert.throws(TypeError, () => getEpochNanoseconds.call(Temporal.Instant.prototype), "Temporal.Instant.prototype");
