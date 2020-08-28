// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.minus
includes: [compareArray.js]
---*/

const instance = new Temporal.Absolute(10n);
const expected = [
  "get days",
  "get hours",
  "valueOf hours",
  "get microseconds",
  "valueOf microseconds",
  "get milliseconds",
  "valueOf milliseconds",
  "get minutes",
  "valueOf minutes",
  "get months",
  "get nanoseconds",
  "valueOf nanoseconds",
  "get seconds",
  "valueOf seconds",
  "get weeks",
  "get years",
];
const actual = [];
const fields = {
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
assert.sameValue(result.getEpochNanoseconds(), -3661001000991n, "nanoseconds result");
assert.compareArray(actual, expected, "order of operations");
