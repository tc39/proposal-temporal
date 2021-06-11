// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainMonthDay.from handles a property bag if any value is Infinity
esid: sec-temporal.plainmonthday.from
includes: [temporalHelpers.js]
features: [Temporal]
---*/

// constrain

let result = Temporal.PlainMonthDay.from({ month: Infinity, day: 1 }, { overflow: 'constrain' });
TemporalHelpers.assertPlainMonthDay(result, "M12", 1);
result = Temporal.PlainMonthDay.from({ month: 1, day: Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainMonthDay(result, "M01", 31);

// reject

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: Infinity, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

result = Temporal.PlainMonthDay.from({ month: obj, day: 1 }, { overflow: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = Temporal.PlainMonthDay.from({ month: 1, day: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: obj, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
