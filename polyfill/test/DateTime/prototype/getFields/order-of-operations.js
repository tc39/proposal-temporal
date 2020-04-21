// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get hour",
  "valueOf hour",
  "get microsecond",
  "valueOf microsecond",
  "get millisecond",
  "valueOf millisecond",
  "get minute",
  "valueOf minute",
  "get month",
  "valueOf month",
  "get nanosecond",
  "valueOf nanosecond",
  "get second",
  "valueOf second",
  "get year",
  "valueOf year"
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.DateTime.prototype, key, this);
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
class ObservedDateTime extends Temporal.DateTime {}
Object.defineProperties(ObservedDateTime.prototype, {
  year: createGetter('year'),
  month: createGetter('month'),
  day: createGetter('day'),
  hour: createGetter('hour'),
  minute: createGetter('minute'),
  second: createGetter('second'),
  millisecond: createGetter('millisecond'),
  microsecond: createGetter('microsecond'),
  nanosecond: createGetter('nanosecond')
});
const instance = new ObservedDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321);

const result = instance.getFields();
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(result.hour, 12, "hour result");
assert.sameValue(result.minute, 34, "minute result");
assert.sameValue(result.second, 56, "second result");
assert.sameValue(result.millisecond, 987, "millisecond result");
assert.sameValue(result.microsecond, 654, "microsecond result");
assert.sameValue(result.nanosecond, 321, "nanosecond result");
assert.compareArray(actual, expected, "order of operations");
