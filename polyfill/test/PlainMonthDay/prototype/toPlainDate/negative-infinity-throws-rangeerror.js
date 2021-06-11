// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainMonthDay.prototype.toPlainDate throws a RangeError if the argument is -Infinity
esid: sec-temporal.plainmonthday.prototype.toplaindate
features: [Temporal]
---*/

const instance = new Temporal.PlainMonthDay(5, 2);

assert.throws(RangeError, () => instance.toPlainDate({ year: -Infinity }));

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

assert.throws(RangeError, () => instance.toPlainDate(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
