// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaintimeiso
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getPlainDateTimeFor",
  "call timeZone.getPlainDateTimeFor",
];
const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:34:56.987654321");

const timeZone = new Proxy({
  getPlainDateTimeFor(instant, calendar) {
    actual.push("call timeZone.getPlainDateTimeFor");
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
    return undefined;
  },
});

const result = Temporal.now.plainTimeISO(timeZone);
assert.sameValue(result instanceof Temporal.PlainTime, true);
for (const property of ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"]) {
  assert.sameValue(result[property], dateTime[property], property);
}

assert.compareArray(actual, expected);
