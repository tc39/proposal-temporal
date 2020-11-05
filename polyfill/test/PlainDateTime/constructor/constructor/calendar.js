// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.Calendar.from",
  "call Temporal.Calendar.from",
];

const dateTimeArgs = [2020, 12, 24, 12, 34, 56, 123, 456, 789];
const calendar = {};

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    actual.push("get Temporal.Calendar.from");
    return function(argument) {
      actual.push("call Temporal.Calendar.from");
      assert.sameValue(argument, "iso8601");
      return calendar;
    };
  },
});

const dateTime = new Temporal.PlainDateTime(...dateTimeArgs, "iso8601");
assert.sameValue(dateTime.calendar, calendar);

assert.compareArray(actual, expected);
