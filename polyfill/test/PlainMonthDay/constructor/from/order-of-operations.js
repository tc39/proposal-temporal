// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.from
includes: [compareArray.js]
---*/

const expected = [
  "get calendar",
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
  monthCode: "M1",
  day: 1.7,
  year: 1.7,
};
const argument = new Proxy(fields, {
  get(target, key) {
    actual.push(`get ${key}`);
    if (key === "calendar") return Temporal.Calendar.from('iso8601');
    const result = target[key];
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
const result = Temporal.PlainMonthDay.from(argument);
assert.sameValue(result.monthCode, "M1", "monthCode result");
assert.sameValue(result.day, 1, "day result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.compareArray(actual, expected, "order of operations");
