// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.from
---*/

assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(undefined, "2000-05-02T12:34:56.987654321"), "undefined");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(null, "2000-05-02T12:34:56.987654321"), "null");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(true, "2000-05-02T12:34:56.987654321"), "true");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call("test", "2000-05-02T12:34:56.987654321"), "string");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(Symbol(), "2000-05-02T12:34:56.987654321"), "Symbol");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(7, "2000-05-02T12:34:56.987654321"), "number");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call(7n, "2000-05-02T12:34:56.987654321"), "bigint");
assert.throws(TypeError, () => Temporal.PlainDateTime.from.call({}, "2000-05-02T12:34:56.987654321"), "Non-callable object");
