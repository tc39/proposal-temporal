// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const plus = Temporal.Instant.prototype.plus;

assert.sameValue(typeof plus, "function");

assert.throws(TypeError, () => plus.call(undefined), "undefined");
assert.throws(TypeError, () => plus.call(null), "null");
assert.throws(TypeError, () => plus.call(true), "true");
assert.throws(TypeError, () => plus.call(""), "empty string");
assert.throws(TypeError, () => plus.call(Symbol()), "symbol");
assert.throws(TypeError, () => plus.call(1), "1");
assert.throws(TypeError, () => plus.call({}), "plain object");
assert.throws(TypeError, () => plus.call(Temporal.Instant), "Temporal.Instant");
assert.throws(TypeError, () => plus.call(Temporal.Instant.prototype), "Temporal.Instant.prototype");
