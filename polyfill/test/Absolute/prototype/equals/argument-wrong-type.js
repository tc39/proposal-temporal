// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.equals
features: [Symbol]
---*/

const instance = Temporal.Absolute.fromEpochSeconds(0);

assert.throws(TypeError, () => instance.equals(undefined), "undefined");
assert.throws(TypeError, () => instance.equals(null), "null");
assert.throws(TypeError, () => instance.equals(true), "true");
assert.throws(TypeError, () => instance.equals(""), "empty string");
assert.throws(TypeError, () => instance.equals(Symbol()), "symbol");
assert.throws(TypeError, () => instance.equals(1), "1");
assert.throws(TypeError, () => instance.equals({}), "plain object");
assert.throws(TypeError, () => instance.equals(Temporal.Absolute), "Temporal.Absolute");
assert.throws(TypeError, () => instance.equals(Temporal.Absolute.prototype), "Temporal.Absolute.prototype");
