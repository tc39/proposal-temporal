// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth.from handles a property bag if any value is -Infinity
esid: sec-temporal.yearmonth.from
---*/

// constrain

let result = Temporal.YearMonth.from({ year: -Infinity, month: 1 }, { disambiguation: 'constrain' });
assert.sameValue(result.year, -271821);
assert.sameValue(result.month, 4);
result = Temporal.YearMonth.from({ year: 1970, month: -Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
// balance

assert.throws(RangeError, () => Temporal.YearMonth.from({ year: -Infinity, month: 1 }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.YearMonth.from({ year: 1970, month: -Infinity }, { disambiguation: 'balance' }));

// reject

assert.throws(RangeError, () => Temporal.YearMonth.from({ year: -Infinity, month: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.YearMonth.from({ year: 1970, month: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

result = Temporal.YearMonth.from({ year: obj, month: 1 }, { disambiguation: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = Temporal.YearMonth.from({ year: 1970, month: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.YearMonth.from({ year: obj, month: 1 }, { disambiguation: 'balance' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.YearMonth.from({ year: 1970, month: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.YearMonth.from({ year: obj, month: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.YearMonth.from({ year: 1970, month: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
