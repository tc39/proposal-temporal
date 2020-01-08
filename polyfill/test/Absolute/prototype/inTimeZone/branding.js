// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const inTimeZone = Temporal.Absolute.prototype.inTimeZone;

assert.sameValue(typeof inTimeZone, "function");

assert.throws(TypeError, () => inTimeZone.call(undefined), "undefined");
assert.throws(TypeError, () => inTimeZone.call(null), "null");
assert.throws(TypeError, () => inTimeZone.call(true), "true");
assert.throws(TypeError, () => inTimeZone.call(""), "empty string");
assert.throws(TypeError, () => inTimeZone.call(Symbol()), "symbol");
assert.throws(TypeError, () => inTimeZone.call(1), "1");
assert.throws(TypeError, () => inTimeZone.call({}), "plain object");
assert.throws(TypeError, () => inTimeZone.call(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => inTimeZone.call(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
