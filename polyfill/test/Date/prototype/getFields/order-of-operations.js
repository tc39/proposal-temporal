// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.getfields
includes: [compareArray.js]
features: [Reflect]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get month",
  "valueOf month",
  "get year",
  "valueOf year"
];
const actual = [];

function createGetter(key) {
  return {
    get() {
      actual.push(`get ${key}`);
      const result = Reflect.get(Temporal.Date.prototype, key, this);
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
class ObservedDate extends Temporal.Date {}
Object.defineProperties(ObservedDate.prototype, {
  year: createGetter('year'),
  month: createGetter('month'),
  day: createGetter('day')
});
const instance = new ObservedDate(2000, 5, 2);

const result = instance.getFields();
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.compareArray(actual, expected, "order of operations");
