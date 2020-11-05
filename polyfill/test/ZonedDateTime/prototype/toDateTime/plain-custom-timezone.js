// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.toplaindatetime
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getDateTimeFor",
  "call timeZone.getDateTimeFor",
];

const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:00:00.987654321");
const timeZone = new Proxy({
  getDateTimeFor() {
    actual.push("call timeZone.getDateTimeFor");
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

const zdt = new Temporal.ZonedDateTime(160583136123456789n, timeZone);
const result = zdt.toPlainDateTime();
assert.sameValue(result, dateTime);

assert.compareArray(actual, expected);
