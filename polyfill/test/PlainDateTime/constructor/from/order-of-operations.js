// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.from
includes: [compareArray.js]
---*/

const expected = [
  "get calendar",
  "get day",
  "valueOf day",
  "get hour",
  "valueOf hour",
  "get microsecond",
  "valueOf microsecond",
  "get millisecond",
  "valueOf millisecond",
  "get minute",
  "valueOf minute",
  "get month",
  "valueOf month",
  "get nanosecond",
  "valueOf nanosecond",
  "get second",
  "valueOf second",
  "get year",
  "valueOf year",
];
const actual = [];
const fields = {
  year: 1.7,
  month: 1.7,
  day: 1.7,
  hour: 1.7,
  minute: 1.7,
  second: 1.7,
  millisecond: 1.7,
  microsecond: 1.7,
  nanosecond: 1.7,
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
const result = Temporal.PlainDateTime.from(argument);
assert.sameValue(result.era, undefined, "era result");
assert.sameValue(result.year, 1, "year result");
assert.sameValue(result.month, 1, "month result");
assert.sameValue(result.day, 1, "day result");
assert.sameValue(result.hour, 1, "hour result");
assert.sameValue(result.minute, 1, "minute result");
assert.sameValue(result.second, 1, "second result");
assert.sameValue(result.millisecond, 1, "millisecond result");
assert.sameValue(result.microsecond, 1, "microsecond result");
assert.sameValue(result.nanosecond, 1, "nanosecond result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.compareArray(actual, expected, "order of operations");
