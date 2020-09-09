// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getdatetimefor
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getOffsetNanosecondsFor",
  "call timeZone.getOffsetNanosecondsFor",
];

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789Z");
const calendar = {};
const timeZone = new Proxy({
  getOffsetNanosecondsFor(absoluteArg) {
    actual.push("call timeZone.getOffsetNanosecondsFor");
    assert.sameValue(absoluteArg, absolute);
    return 72e11;
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

const result = Temporal.TimeZone.prototype.getDateTimeFor.call(timeZone, absolute, calendar);
assert.sameValue(result.calendar, calendar);

assert.compareArray(actual, expected);
