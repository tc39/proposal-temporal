// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const minus = Temporal.Absolute.prototype.minus;

assert.sameValue(typeof minus, "function");

assert.throws(TypeError, () => minus.call(undefined), "undefined");
assert.throws(TypeError, () => minus.call(null), "null");
assert.throws(TypeError, () => minus.call(true), "true");
assert.throws(TypeError, () => minus.call(""), "empty string");
assert.throws(TypeError, () => minus.call(Symbol()), "symbol");
assert.throws(TypeError, () => minus.call(1), "1");
assert.throws(TypeError, () => minus.call({}), "plain object");
assert.throws(TypeError, () => minus.call(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => minus.call(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
