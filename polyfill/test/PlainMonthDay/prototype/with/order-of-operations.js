// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.with
includes: [compareArray.js]
---*/

const instance = new Temporal.PlainMonthDay(5, 2);
const expected = [
  "get calendar",
  "get timeZone",
  "get day",
  "valueOf day",
  "get month",
  "valueOf month",
  "get monthCode",
  "toString monthCode",
  "get year",
  "valueOf year",
];
const actual = [];
const fields = {
  month: 1.7,
  monthCode: "1",
  day: 1.7,
  year: 1.7,
};
const argument = new Proxy(fields, {
  get(target, key) {
    actual.push(`get ${key}`);
    const result = target[key];
    if (result === undefined) {
      return undefined;
    }
    return {
      valueOf() {
        actual.push(`valueOf ${key}`);
        return result;
      },
      toString() {
        actual.push(`toString ${key}`);
        return result.toString();
      }
    };
  },
  has(target, key) {
    actual.push(`has ${key}`);
    return key in target;
  },
});
const result = instance.with(argument);
assert.sameValue(result.monthCode, "1", "monthCode result");
assert.sameValue(result.day, 1, "day result");
assert.compareArray(actual, expected, "order of operations");
