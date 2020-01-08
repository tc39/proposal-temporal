// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const getEpochMilliseconds = Temporal.Absolute.prototype.getEpochMilliseconds;

assert.sameValue(typeof getEpochMilliseconds, "function");

assert.throws(TypeError, () => getEpochMilliseconds.call(undefined), "undefined");
assert.throws(TypeError, () => getEpochMilliseconds.call(null), "null");
assert.throws(TypeError, () => getEpochMilliseconds.call(true), "true");
assert.throws(TypeError, () => getEpochMilliseconds.call(""), "empty string");
assert.throws(TypeError, () => getEpochMilliseconds.call(Symbol()), "symbol");
assert.throws(TypeError, () => getEpochMilliseconds.call(1), "1");
assert.throws(TypeError, () => getEpochMilliseconds.call({}), "plain object");
assert.throws(TypeError, () => getEpochMilliseconds.call(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => getEpochMilliseconds.call(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
