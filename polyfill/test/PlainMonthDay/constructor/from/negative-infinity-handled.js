// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainMonthDay.from handles a property bag if any value is -Infinity
esid: sec-temporal.plainmonthday.from
features: [Temporal]
---*/

// constrain

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: -Infinity, day: 1 }, { overflow: 'constrain' }));
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: -Infinity }, { overflow: 'constrain' }));

// reject

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: -Infinity, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: obj, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: obj, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainMonthDay.from({ month: 1, day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
