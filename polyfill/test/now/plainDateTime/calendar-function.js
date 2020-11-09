// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindatetime
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getPlainDateTimeFor",
  "call timeZone.getPlainDateTimeFor",
];
const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:34:56.987654321");
const calendar = function() {};
const timeZone = new Proxy({
  getPlainDateTimeFor(instant, calendarArg) {
    actual.push("call timeZone.getPlainDateTimeFor");
    assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
    assert.sameValue(calendarArg, calendar);
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

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    actual.push("get Temporal.Calendar.from");
    return undefined;
  },
});

const result = Temporal.now.plainDateTime(calendar, timeZone);
assert.sameValue(result, dateTime);

assert.compareArray(actual, expected);
