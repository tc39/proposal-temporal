// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getdatetimefor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
let called = false;
timeZone.getOffsetNanosecondsFor = () => called = true;
assert.throws(RangeError, () => timeZone.getDateTimeFor(undefined), "undefined");
assert.throws(RangeError, () => timeZone.getDateTimeFor(null), "null");
assert.throws(RangeError, () => timeZone.getDateTimeFor(true), "boolean");
assert.throws(RangeError, () => timeZone.getDateTimeFor(""), "empty string");
assert.throws(TypeError, () => timeZone.getDateTimeFor(Symbol()), "Symbol");
assert.throws(RangeError, () => timeZone.getDateTimeFor(5), "number");
assert.throws(RangeError, () => timeZone.getDateTimeFor(5n), "bigint");
assert.throws(RangeError, () => timeZone.getDateTimeFor({}), "plain object");
assert.sameValue(called, false);
