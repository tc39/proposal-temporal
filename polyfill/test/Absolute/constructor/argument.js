// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute
features: [Symbol]
---*/

assert.throws(TypeError, () => new Temporal.Absolute(undefined), "undefined");
assert.throws(TypeError, () => new Temporal.Absolute(null), "null");
assert.throws(TypeError, () => new Temporal.Absolute(42), "number");
assert.throws(TypeError, () => new Temporal.Absolute(Symbol()), "symbol");
