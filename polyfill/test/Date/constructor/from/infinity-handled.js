// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Date.from handles a property bag if any value is Infinity
esid: sec-temporal.date.from
---*/

// constrain

assert.throws(RangeError, () => Temporal.Date.from({ year: Infinity, month: 1, day: 1 }, { disambiguation: 'constrain' }));
let result = Temporal.Date.from({ year: 1970, month: Infinity, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 12);
assert.sameValue(result.day, 1);
result = Temporal.Date.from({ year: 1970, month: 1, day: Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 1970);
assert.sameValue(result.month, 1);
assert.sameValue(result.day, 31);

// reject

assert.throws(RangeError, () => Temporal.Date.from({ year: Infinity, month: 1, day: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Date.from({ year: 1970, month: Infinity, day: 1 }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Date.from({ year: 1970, month: 1, day: Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => Temporal.Date.from({ year: obj, month: 1, day: 1 }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = Temporal.Date.from({ year: 1970, month: obj, day: 1 }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = Temporal.Date.from({ year: 1970, month: 1, day: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.Date.from({ year: obj, month: 1, day: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Date.from({ year: 1970, month: obj, day: 1 }, { disambiguation: 'reject' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Date.from({ year: 1970, month: 1, day: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
