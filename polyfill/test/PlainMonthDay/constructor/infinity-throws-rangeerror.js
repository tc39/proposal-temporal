// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainMonthDay throws a RangeError if any numerical value is Infinity
esid: sec-temporal.monthday
---*/

const isoCalendar = Temporal.Calendar.from('iso8601');

assert.throws(RangeError, () => new Temporal.PlainMonthDay(Infinity, 1));
assert.throws(RangeError, () => new Temporal.PlainMonthDay(1, Infinity));
assert.throws(RangeError, () => new Temporal.PlainMonthDay(1, 1, isoCalendar, Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.PlainMonthDay(obj, 1));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainMonthDay(1, obj));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainMonthDay(1, 1, isoCalendar, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
