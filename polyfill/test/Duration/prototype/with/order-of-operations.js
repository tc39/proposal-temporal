// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
includes: [compareArray.js, temporalHelpers.js]
features: [Temporal]
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
const result = instance.with(argument);
TemporalHelpers.assertDuration(result, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
assert.compareArray(actual, expected, "order of operations");
