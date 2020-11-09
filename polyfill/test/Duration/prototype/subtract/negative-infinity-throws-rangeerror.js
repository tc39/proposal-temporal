// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.subtract throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.duration.prototype.subtract
---*/

const fields = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);
const relativeTo = new Temporal.PlainDateTime(2000, 1, 1);

fields.forEach((field) => {
  assert.throws(RangeError, () => instance.subtract({ [field]: -Infinity }, { relativeTo }));
});

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

fields.forEach((field) => {
  calls = 0;
  assert.throws(RangeError, () => instance.subtract({ [field]: obj }, { relativeTo }));
  assert.sameValue(calls, 1, "it fails after fetching the primitive value");
});
