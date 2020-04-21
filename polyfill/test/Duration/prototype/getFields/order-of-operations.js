// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
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
  "get years",
  "valueOf years"
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.Duration.prototype, key, this);
      if (result === undefined) return undefined;
      return {
        valueOf() {
          actual.push(`valueOf ${key}`);
          return result;
        }
      };
    }
  };
}
class ObservedDuration extends Temporal.Duration {}
Object.defineProperties(ObservedDuration.prototype, {
  years: createGetter('years'),
  months: createGetter('months'),
  days: createGetter('days'),
  hours: createGetter('hours'),
  minutes: createGetter('minutes'),
  seconds: createGetter('seconds'),
  milliseconds: createGetter('milliseconds'),
  microseconds: createGetter('microseconds'),
  nanoseconds: createGetter('nanoseconds')
});
const instance = new ObservedDuration(1, 2, 3, 4, 5, 6, 987, 654, 321);

const result = instance.getFields();
assert.sameValue(result.years, 1, "years result");
assert.sameValue(result.months, 2, "months result");
assert.sameValue(result.days, 3, "days result");
assert.sameValue(result.hours, 4, "hours result");
assert.sameValue(result.minutes, 5, "minutes result");
assert.sameValue(result.seconds, 6, "seconds result");
assert.sameValue(result.milliseconds, 987, "milliseconds result");
assert.sameValue(result.microseconds, 654, "microseconds result");
assert.sameValue(result.nanoseconds, 321, "nanoseconds result");
assert.compareArray(actual, expected, "order of operations");
