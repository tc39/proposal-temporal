// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getdatetimefor
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.Calendar.from",
];

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789Z");
const timeZone = Temporal.TimeZone.from("UTC");

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    actual.push("get Temporal.Calendar.from");
    return undefined;
  },
});

const result = timeZone.getDateTimeFor(absolute, "japanese");
assert.sameValue(result.calendar.toString(), "japanese");

assert.compareArray(actual, expected);
