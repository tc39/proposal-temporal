// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

const expected = [
  "get day",
  "get month",
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.PlainMonthDay.prototype, key, this);
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
class ObservedMonthDay extends Temporal.PlainMonthDay {}
Object.defineProperties(ObservedMonthDay.prototype, {
  month: createGetter('month'),
  day: createGetter('day')
});
const instance = new ObservedMonthDay(5, 2);

const result = instance.getFields();
assert.compareArray(actual, expected, "order of operations");
assert.sameValue(result.month.valueOf(), 5, "month result");
assert.sameValue(result.day.valueOf(), 2, "day result");
