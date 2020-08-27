// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.tojson
includes: [compareArray.js]
---*/

const actual = [];
const expected = ['get timeZone.toString', 'call timeZone.toString'];

const timeZone = new Proxy(
  {
    toString() {
      actual.push(`call timeZone.toString`);
      return 'Etc/TAI';
    }
  },
  {
    has(target, property) {
      actual.push(`has timeZone.${property}`);
      return property in target;
    },
    get(target, property) {
      actual.push(`get timeZone.${property}`);
      return target[property];
    }
  }
);

const result = Temporal.TimeZone.prototype.toJSON.call(timeZone);
assert.sameValue(result, 'Etc/TAI', 'toString');
assert.compareArray(actual, expected);
