// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.todatetime
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getDateTimeFor",
  "call timeZone.getDateTimeFor",
];

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789Z");
const dateTime = Temporal.DateTime.from("1963-07-02T12:00:00.987654321");
const timeZone = new Proxy({
  getDateTimeFor(absoluteArg) {
    actual.push("call timeZone.getDateTimeFor");
    assert.sameValue(absoluteArg, absolute);
    return dateTime;
  },
}, {
  has(target, property) {
    actual.push(`has timeZone.${property}`);
    return property in target;
  },
  get(target, property) {
    actual.push(`get timeZone.${property}`);
    return target[property];
  },
});

const result = absolute.toDateTime(timeZone);
assert.sameValue(result, dateTime);

assert.compareArray(actual, expected);
