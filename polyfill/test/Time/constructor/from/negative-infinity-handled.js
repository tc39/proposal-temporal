// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Time.from handles a property bag if any value is -Infinity
esid: sec-temporal.time.from
---*/

// constrain

let result = Temporal.Time.from({ hour: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.Time.from({ minute: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.Time.from({ second: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.Time.from({ millisecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.Time.from({ microsecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);
result = Temporal.Time.from({ nanosecond: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 0);

// balance

assert.throws(RangeError, () => Temporal.Time.from({ hour: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Time.from({ minute: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Time.from({ second: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Time.from({ millisecond: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Time.from({ microsecond: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Time.from({ nanosecond: -Infinity }, { disambiguation: 'balance' }));

// reject

assert.throws(RangeError, () => Temporal.Time.from({ hour: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Time.from({ minute: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Time.from({ second: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Time.from({ millisecond: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Time.from({ microsecond: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Time.from({ nanosecond: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

result = Temporal.Time.from({ hour: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = Temporal.Time.from({ minute: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = Temporal.Time.from({ second: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = Temporal.Time.from({ millisecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = Temporal.Time.from({ microsecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = Temporal.Time.from({ nanosecond: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.Time.from({ hour: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ minute: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ second: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ millisecond: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ microsecond: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ nanosecond: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.Time.from({ hour: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ minute: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ second: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ millisecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ microsecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Time.from({ nanosecond: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
