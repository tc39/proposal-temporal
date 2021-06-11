// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
includes: [compareArray.js, temporalHelpers.js]
features: [Temporal]
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
TemporalHelpers.assertDuration(result, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
assert.compareArray(actual, expected, "order of operations");
