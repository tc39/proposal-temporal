// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.from
---*/

assert.throws(TypeError, () => Temporal.PlainTime.from.call(undefined, "12:34:56.987654321"), "undefined");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(null, "12:34:56.987654321"), "null");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(true, "12:34:56.987654321"), "true");
assert.throws(TypeError, () => Temporal.PlainTime.from.call("test", "12:34:56.987654321"), "string");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(Symbol(), "12:34:56.987654321"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(7, "12:34:56.987654321"), "number");
assert.throws(TypeError, () => Temporal.PlainTime.from.call(7n, "12:34:56.987654321"), "bigint");
assert.throws(TypeError, () => Temporal.PlainTime.from.call({}, "12:34:56.987654321"), "Non-callable object");
