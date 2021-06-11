// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
includes: [compareArray.js]
features: [Temporal]
---*/

const actual = [];
const expected = [
  "get timeZone.getOffsetNanosecondsFor",
  "call timeZone.getOffsetNanosecondsFor",
];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const calendar = {};
const timeZone = new Proxy({
  getOffsetNanosecondsFor(instantArg) {
    actual.push("call timeZone.getOffsetNanosecondsFor");
    assert.sameValue(instantArg, instant);
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

const result = Temporal.TimeZone.prototype.getPlainDateTimeFor.call(timeZone, instant, calendar);
assert.sameValue(result.calendar, calendar);

assert.compareArray(actual, expected);
