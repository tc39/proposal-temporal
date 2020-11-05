// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime.from handles a property bag if any value is Infinity
esid: sec-temporal.datetime.from
---*/

// constrain

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: Infinity, month: 1, day: 1 }, { overflow: 'constrain' }));
let result = Temporal.PlainDateTime.from({ year: 1970, month: Infinity, day: 1 }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 12);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 31);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 23);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 59);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 59);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 999);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 999);
assert.sameValue(result.nanosecond, 0);
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 999);

// reject

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: Infinity, month: 1, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: Infinity, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: obj, month: 1, day: 1 }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: obj, day: 1 }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: obj, month: 1, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: obj, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
