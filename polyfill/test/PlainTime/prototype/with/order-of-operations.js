// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.with
includes: [compareArray.js]
---*/

const instance = new Temporal.PlainTime(12, 34, 56, 987, 654, 321);
const expected = [
  "get hour",
  "valueOf hour",
  "get microsecond",
  "valueOf microsecond",
  "get millisecond",
  "valueOf millisecond",
  "get minute",
  "valueOf minute",
  "get nanosecond",
  "valueOf nanosecond",
  "get second",
  "valueOf second",
];
const actual = [];
const fields = {
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
assert.sameValue(result.hour, 1, "hour result");
assert.sameValue(result.minute, 1, "minute result");
assert.sameValue(result.second, 1, "second result");
assert.sameValue(result.millisecond, 1, "millisecond result");
assert.sameValue(result.microsecond, 1, "microsecond result");
assert.sameValue(result.nanosecond, 1, "nanosecond result");
assert.compareArray(actual, expected, "order of operations");
