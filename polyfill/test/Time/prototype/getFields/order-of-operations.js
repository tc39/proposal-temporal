// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

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
  "valueOf second"
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.Time.prototype, key, this);
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
class ObservedTime extends Temporal.Time {}
Object.defineProperties(ObservedTime.prototype, {
  hour: createGetter('hour'),
  minute: createGetter('minute'),
  second: createGetter('second'),
  millisecond: createGetter('millisecond'),
  microsecond: createGetter('microsecond'),
  nanosecond: createGetter('nanosecond')
});
const instance = new ObservedTime(12, 34, 56, 987, 654, 321);

const result = instance.getFields();
assert.sameValue(result.hour, 12, "hour result");
assert.sameValue(result.minute, 34, "minute result");
assert.sameValue(result.second, 56, "second result");
assert.sameValue(result.millisecond, 987, "millisecond result");
assert.sameValue(result.microsecond, 654, "microsecond result");
assert.sameValue(result.nanosecond, 321, "nanosecond result");
assert.compareArray(actual, expected, "order of operations");
