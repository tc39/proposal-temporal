// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
includes: [compareArray.js]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get month",
  "valueOf month",
  "get year",
  "valueOf year",
];
const actual = [];
const fields = {
  year: 1.7,
  month: 1.7,
  day: 1.7,
};
const argument = new Proxy(fields, {
  get(target, key) {
    actual.push(`get ${key}`);
    const result = target[key];
    return {
      valueOf() {
        actual.push(`valueOf ${key}`);
        return result;
      }
    };
  },
  has(target, key) {
    actual.push(`has ${key}`);
    return key in target;
  },
});
const result = Temporal.Date.from(argument);
assert.sameValue(result.year, 1, "year result");
assert.sameValue(result.month, 1, "month result");
assert.sameValue(result.day, 1, "day result");
assert.compareArray(actual, expected, "order of operations");
