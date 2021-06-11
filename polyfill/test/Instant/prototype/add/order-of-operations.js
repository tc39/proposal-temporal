// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.add
includes: [compareArray.js]
features: [Temporal]
---*/

const instance = new Temporal.Instant(10n);
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
const result = instance.add(argument);
assert.sameValue(result.epochNanoseconds, 3661001001011n, "nanoseconds result");
assert.compareArray(actual, expected, "order of operations");
