// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDate.prototype.with handles a property bag if any value is Infinity
esid: sec-temporal.date.prototype.with
---*/

const instance = new Temporal.PlainDate(2000, 5, 2);

// constrain

assert.throws(RangeError, () => instance.with({ year: Infinity }, { overflow: 'constrain' }));
let result = instance.with({ month: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 12);
assert.sameValue(result.day, 2);
result = instance.with({ day: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 31);

// reject

assert.throws(RangeError, () => instance.with({ year: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ month: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ day: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.with({ year: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = instance.with({ month: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = instance.with({ day: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ year: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ month: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
