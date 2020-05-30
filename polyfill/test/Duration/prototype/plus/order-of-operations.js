// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.plus
includes: [compareArray.js]
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);
const expected = [
  "get days",
  "valueOf days",
  "get hours",
  "valueOf hours",
  "get microseconds",
  "valueOf microseconds",
  "get milliseconds",
  "valueOf milliseconds",
  "get minutes",
  "valueOf minutes",
  "get months",
  "valueOf months",
  "get nanoseconds",
  "valueOf nanoseconds",
  "get seconds",
  "valueOf seconds",
  "get weeks",
  "valueOf weeks",
  "get years",
  "valueOf years",
];
const actual = [];
const fields = {
  years: 1.7,
  months: 1.7,
  weeks: 1.7,
  days: 1.7,
  hours: 1.7,
  minutes: 1.7,
  seconds: 1.7,
  milliseconds: 1.7,
  microseconds: 1.7,
  nanoseconds: 1.7,
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
      }
    };
  },
  has(target, key) {
    actual.push(`has ${key}`);
    return key in target;
  },
});
const result = instance.plus(argument);
assert.sameValue(result.years, 2, "years result");
assert.sameValue(result.months, 3, "months result");
assert.sameValue(result.weeks, 4, "weeks result");
assert.sameValue(result.days, 5, "days result");
assert.sameValue(result.hours, 6, "hours result");
assert.sameValue(result.minutes, 7, "minutes result");
assert.sameValue(result.seconds, 8, "seconds result");
assert.sameValue(result.milliseconds, 988, "milliseconds result");
assert.sameValue(result.microseconds, 655, "microseconds result");
assert.sameValue(result.nanoseconds, 322, "nanoseconds result");
assert.compareArray(actual, expected, "order of operations");
