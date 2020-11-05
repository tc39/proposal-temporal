// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindate
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.TimeZone.from",
  "call Temporal.TimeZone.from",
  "get timeZone.getDateTimeFor",
  "call timeZone.getDateTimeFor",
];
const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:34:56.987654321");

const timeZone = new Proxy({
  getDateTimeFor(instant, calendar) {
    actual.push("call timeZone.getDateTimeFor");
    assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
    assert.sameValue(calendar instanceof Temporal.Calendar, true, "Calendar");
    assert.sameValue(calendar.id, "iso8601");
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

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return function(argument) {
      actual.push("call Temporal.TimeZone.from");
      assert.sameValue(argument, "UTC");
      return timeZone;
    };
  },
});

const calendar = Temporal.Calendar.from("iso8601");

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    actual.push("get Temporal.Calendar.from");
    return undefined;
  },
});

const result = Temporal.now.plainDate(calendar, "UTC");
assert.sameValue(result instanceof Temporal.PlainDate, true);
for (const property of ["year", "month", "day"]) {
  assert.sameValue(result[property], dateTime[property], property);
}

assert.compareArray(actual, expected);
