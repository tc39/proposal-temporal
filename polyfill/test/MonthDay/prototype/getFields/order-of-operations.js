// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get month",
  "valueOf month"
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.MonthDay.prototype, key, this);
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
class ObservedMonthDay extends Temporal.MonthDay {}
Object.defineProperties(ObservedMonthDay.prototype, {
  month: createGetter('month'),
  day: createGetter('day')
});
const instance = new ObservedMonthDay(5, 2);

const result = instance.getFields();
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.compareArray(actual, expected, "order of operations");
