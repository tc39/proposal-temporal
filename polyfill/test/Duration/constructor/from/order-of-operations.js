// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
includes: [compareArray.js, temporalHelpers.js]
features: [Temporal]
---*/

const expected = [
  "get days",
  "get days.valueOf",
  "call days.valueOf",
  "get hours",
  "get hours.valueOf",
  "call hours.valueOf",
  "get microseconds",
  "get microseconds.valueOf",
  "call microseconds.valueOf",
  "get milliseconds",
  "get milliseconds.valueOf",
  "call milliseconds.valueOf",
  "get minutes",
  "get minutes.valueOf",
  "call minutes.valueOf",
  "get months",
  "get months.valueOf",
  "call months.valueOf",
  "get nanoseconds",
  "get nanoseconds.valueOf",
  "call nanoseconds.valueOf",
  "get seconds",
  "get seconds.valueOf",
  "call seconds.valueOf",
  "get weeks",
  "get weeks.valueOf",
  "call weeks.valueOf",
  "get years",
  "get years.valueOf",
  "call years.valueOf",
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
    return TemporalHelpers.toPrimitiveObserver(actual, result, key);
  },
  has(target, key) {
    actual.push(`has ${key}`);
    return key in target;
  },
});
const result = Temporal.Duration.from(argument);
TemporalHelpers.assertDuration(result, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
assert.compareArray(actual, expected, "order of operations");
