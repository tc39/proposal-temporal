// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
---*/

assert.throws(TypeError, () => Temporal.PlainDate.from.call(undefined, "2000-05-02"), "undefined");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(null, "2000-05-02"), "null");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(true, "2000-05-02"), "true");
assert.throws(TypeError, () => Temporal.PlainDate.from.call("test", "2000-05-02"), "string");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(Symbol(), "2000-05-02"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(7, "2000-05-02"), "number");
assert.throws(TypeError, () => Temporal.PlainDate.from.call(7n, "2000-05-02"), "bigint");
assert.throws(TypeError, () => Temporal.PlainDate.from.call({}, "2000-05-02"), "Non-callable object");
