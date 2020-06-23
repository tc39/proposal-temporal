// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth.prototype.with handles a property bag if any value is Infinity
esid: sec-temporal.yearmonth.prototype.with
---*/

const instance = new Temporal.YearMonth(2000, 5);

// constrain

assert.throws(RangeError, () => instance.with({ year: Infinity }, { disambiguation: 'constrain' }));
let result = instance.with({ month: Infinity }, { disambiguation: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 12);

// reject

assert.throws(RangeError, () => instance.with({ year: Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.with({ month: Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.with({ year: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = instance.with({ month: obj }, { disambiguation: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ year: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ month: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
