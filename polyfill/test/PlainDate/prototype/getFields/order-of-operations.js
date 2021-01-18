// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

const expected = [
  "get day",
  "get month",
  "get year",
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.PlainDate.prototype, key, this);
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
class ObservedDate extends Temporal.PlainDate {}
Object.defineProperties(ObservedDate.prototype, {
  year: createGetter('year'),
  month: createGetter('month'),
  day: createGetter('day')
});
const instance = new ObservedDate(2000, 5, 2);

const result = instance.getFields();
assert.compareArray(actual, expected, "order of operations");
assert.sameValue(result.year.valueOf(), 2000, "year result");
assert.sameValue(result.month.valueOf(), 5, "month result");
assert.sameValue(result.day.valueOf(), 2, "day result");
