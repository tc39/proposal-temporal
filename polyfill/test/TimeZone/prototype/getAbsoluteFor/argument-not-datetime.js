// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getabsolutefor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(null), "null");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getAbsoluteFor("2020-01-02T12:34:56"), "string");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(5), "number");
assert.throws(TypeError, () => timeZone.getAbsoluteFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getAbsoluteFor({ year: 2020 }), "plain object");
