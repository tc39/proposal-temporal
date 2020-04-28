// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.MonthDay.prototype.with handles a property bag if any value is Infinity
esid: sec-temporal.monthday.prototype.with
---*/

const instance = new Temporal.MonthDay(5, 2);

// constrain

let result = instance.with({ month: Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.month, 12);
assert.sameValue(result.day, 2);
result = instance.with({ day: Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 31);

// balance

assert.throws(RangeError, () => instance.with({ month: Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.with({ day: Infinity }, { disambiguation: 'balance' }));

// reject

assert.throws(RangeError, () => instance.with({ month: Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.with({ day: Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

result = instance.with({ month: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = instance.with({ day: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ month: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ day: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.with({ month: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ day: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
