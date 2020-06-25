// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const toDateTime = Temporal.Absolute.prototype.toDateTime;

assert.sameValue(typeof toDateTime, "function");

assert.throws(TypeError, () => toDateTime.call(undefined), "undefined");
assert.throws(TypeError, () => toDateTime.call(null), "null");
assert.throws(TypeError, () => toDateTime.call(true), "true");
assert.throws(TypeError, () => toDateTime.call(""), "empty string");
assert.throws(TypeError, () => toDateTime.call(Symbol()), "symbol");
assert.throws(TypeError, () => toDateTime.call(1), "1");
assert.throws(TypeError, () => toDateTime.call({}), "plain object");
assert.throws(TypeError, () => toDateTime.call(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => toDateTime.call(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
