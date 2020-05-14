// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const getPossibleAbsolutesFor = Temporal.TimeZone.prototype.getPossibleAbsolutesFor;

assert.sameValue(typeof getPossibleAbsolutesFor, "function");

assert.throws(TypeError, () => getPossibleAbsolutesFor.call(undefined), "undefined");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(null), "null");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(true), "true");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(""), "empty string");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(Symbol()), "symbol");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(1), "1");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call({}), "plain object");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(Temporal.TimeZone), "Temporal.TimeZone");
assert.throws(TypeError, () => getPossibleAbsolutesFor.call(Temporal.TimeZone.prototype), "Temporal.TimeZone.prototype");
