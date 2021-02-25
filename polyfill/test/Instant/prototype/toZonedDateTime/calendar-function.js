// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.tozoneddatetime
includes: [compareArray.js, temporalHelpers.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getOffsetNanosecondsFor",
  "get timeZone.getPossibleInstantsFor",
  "get timeZone.toString",
];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:34:56.987654321");
const calendar = Object.assign(function () {}, MINIMAL_CALENDAR_OBJECT);
const timeZone = new Proxy(Object.assign({}, MINIMAL_TIME_ZONE_OBJECT, {
  getPlainDateTimeFor() {
    actual.push("call timeZone.getPlainDateTimeFor");
    return dateTime;
  },
}), {
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

const result = instant.toZonedDateTime({ timeZone, calendar });
assert.sameValue(result.epochNanoseconds, instant.epochNanoseconds);
assert.sameValue(result.calendar, calendar);

assert.compareArray(actual, expected);
