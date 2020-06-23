// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.DateTime.from handles a property bag if any value is -Infinity
esid: sec-temporal.datetime.from
---*/

// constrain

assert.throws(RangeError, () => Temporal.DateTime.from({ year: -Infinity, month: 1, day: 1 }, { disambiguation: 'constrain' }));
let result = Temporal.DateTime.from({ year: 1970, month: -Infinity, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, hour: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, minute: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, second: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, millisecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, microsecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, nanosecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 1);
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);

// reject

assert.throws(RangeError, () => Temporal.DateTime.from({ year: -Infinity, month: 1, day: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: -Infinity, day: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, hour: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, minute: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, second: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, millisecond: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, microsecond: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, nanosecond: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => Temporal.DateTime.from({ year: obj, month: 1, day: 1 }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: obj, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = Temporal.DateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.DateTime.from({ year: obj, month: 1, day: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: obj, day: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.DateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
