// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.MonthDay.prototype.toDateInYear throws a RangeError if the argument is -Infinity
esid: sec-temporal.monthday.prototype.todateinyear
---*/

const instance = new Temporal.MonthDay(5, 2);

assert.throws(RangeError, () => instance.toDateInYear(-Infinity));
assert.throws(RangeError, () => instance.toDateInYear({ year: -Infinity }));

let calls = 0;
const fields = {
  year: -Infinity
};
const obj = new Proxy(fields, {
  get(target, key) {
    const result = target[key];
    if (result === undefined) {
      return undefined;
    }
    return {
      valueOf() {
        calls++;
        return result;
      }
    };
  },
});

assert.throws(RangeError, () => instance.toDateInYear(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
