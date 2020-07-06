// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getdatetimefor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getDateTimeFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getDateTimeFor(null), "null");
assert.throws(TypeError, () => timeZone.getDateTimeFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getDateTimeFor("2020-01-02T12:34:56Z"), "string");
assert.throws(TypeError, () => timeZone.getDateTimeFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getDateTimeFor(5), "number");
assert.throws(TypeError, () => timeZone.getDateTimeFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getDateTimeFor({}), "plain object");
