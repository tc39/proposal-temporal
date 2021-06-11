// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainMonthDay.prototype.with handles a property bag if any value is -Infinity
esid: sec-temporal.plainmonthday.prototype.with
features: [Temporal]
---*/

const instance = new Temporal.PlainMonthDay(5, 2);

// constrain

assert.throws(RangeError, () => instance.with({ day: -Infinity }, { overflow: 'constrain' }));

// reject

assert.throws(RangeError, () => instance.with({ day: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.with({ day: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.with({ day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
