// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.MonthDay.from handles a property bag if any value is -Infinity
esid: sec-temporal.monthday.from
---*/

// constrain

let result = Temporal.MonthDay.from({ month: -Infinity, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
result = Temporal.MonthDay.from({ month: 1, day: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);

// reject

assert.throws(RangeError, () => Temporal.MonthDay.from({ month: -Infinity, day: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.MonthDay.from({ month: 1, day: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

result = Temporal.MonthDay.from({ month: obj, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = Temporal.MonthDay.from({ month: 1, day: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.MonthDay.from({ month: obj, day: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.MonthDay.from({ month: 1, day: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
