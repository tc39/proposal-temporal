// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
includes: [compareArray.js]
---*/

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
  years: 1,
  months: 1,
  weeks: 1,
  days: 1,
  hours: 1,
  minutes: 1,
  seconds: 1,
  milliseconds: 1,
  microseconds: 1,
  nanoseconds: 1,
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
const result = Temporal.Duration.from(argument);
assert.sameValue(result.years, 1, "years result");
assert.sameValue(result.months, 1, "months result");
assert.sameValue(result.weeks, 1, "weeks result");
assert.sameValue(result.days, 1, "days result");
assert.sameValue(result.hours, 1, "hours result");
assert.sameValue(result.minutes, 1, "minutes result");
assert.sameValue(result.seconds, 1, "seconds result");
assert.sameValue(result.milliseconds, 1, "milliseconds result");
assert.sameValue(result.microseconds, 1, "microseconds result");
assert.sameValue(result.nanoseconds, 1, "nanoseconds result");
assert.compareArray(actual, expected, "order of operations");
