// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.prototype.minus
includes: [compareArray.js]
---*/

const instance = new Temporal.DateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321);
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
  "get years",
  "valueOf years",
];
const actual = [];
const fields = {
  years: 1.7,
  months: 1.7,
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
const result = instance.minus(argument);
assert.sameValue(result.year, 1999, "year result");
assert.sameValue(result.month, 4, "month result");
assert.sameValue(result.day, 1, "day result");
assert.sameValue(result.hour, 11, "hour result");
assert.sameValue(result.minute, 33, "minute result");
assert.sameValue(result.second, 55, "second result");
assert.sameValue(result.millisecond, 986, "millisecond result");
assert.sameValue(result.microsecond, 653, "microsecond result");
assert.sameValue(result.nanosecond, 320, "nanosecond result");
assert.compareArray(actual, expected, "order of operations");
