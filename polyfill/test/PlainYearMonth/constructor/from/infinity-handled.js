// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainYearMonth.from handles a property bag if any value is Infinity
esid: sec-temporal.plainyearmonth.from
includes: [temporalHelpers.js]
features: [Temporal]
---*/

// constrain

assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: Infinity, month: 1 }, { overflow: 'constrain' }));
let result = Temporal.PlainYearMonth.from({ year: 1970, month: Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainYearMonth(result, 1970, 12, "M12");

// reject

assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: Infinity, month: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: 1970, month: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: obj, month: 1 }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = Temporal.PlainYearMonth.from({ year: 1970, month: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: obj, month: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainYearMonth.from({ year: 1970, month: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
