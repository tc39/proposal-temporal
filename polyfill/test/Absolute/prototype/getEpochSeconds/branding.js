// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const getEpochSeconds = Temporal.Absolute.prototype.getEpochSeconds;

assert.sameValue(typeof getEpochSeconds, "function");

assert.throws(TypeError, () => getEpochSeconds.call(undefined), "undefined");
assert.throws(TypeError, () => getEpochSeconds.call(null), "null");
assert.throws(TypeError, () => getEpochSeconds.call(true), "true");
assert.throws(TypeError, () => getEpochSeconds.call(""), "empty string");
assert.throws(TypeError, () => getEpochSeconds.call(Symbol()), "symbol");
assert.throws(TypeError, () => getEpochSeconds.call(1), "1");
assert.throws(TypeError, () => getEpochSeconds.call({}), "plain object");
assert.throws(TypeError, () => getEpochSeconds.call(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => getEpochSeconds.call(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
