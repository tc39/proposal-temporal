// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.from
includes: [compareArray.js]
---*/

const expected = [
  "get calendar",
  "Calendar.from(test)",
  "get day",
  "valueOf day",
  "get hour",
  "valueOf hour",
  "get microsecond",
  "valueOf microsecond",
  "get millisecond",
  "valueOf millisecond",
  "get minute",
  "valueOf minute",
  "get month",
  "valueOf month",
  "get nanosecond",
  "valueOf nanosecond",
  "get second",
  "valueOf second",
  "get year",
  "valueOf year",
  "get era",
  "toString era", // XXX?
];
const actual = [];
const fields = {
  year: 1.7,
  month: 1.7,
  day: 1.7,
  hour: 1.7,
  minute: 1.7,
  second: 1.7,
  millisecond: 1.7,
  microsecond: 1.7,
  nanosecond: 1.7,
  era: "era",
  calendar: "test",
};
const argument = new Proxy(fields, {
  get(target, key) {
    actual.push(`get ${key}`);
    const result = target[key];
    if (key === "calendar") {
      return result;
    }
    return {
      valueOf() {
        actual.push(`valueOf ${key}`);
        return result;
      },
      toString() {
        actual.push(`toString ${key}`);
        return result;
      }
    };
  },
  has(target, key) {
    actual.push(`has ${key}`);
    return key in target;
  },
});
const isoCalendar = Temporal.Calendar.from("iso8601");
const calendarValue = {
  fields(fieldsArgument) {
    assert.compareArray(fieldsArgument, ["day", "month", "year"]);
    return ["day", "era", "month", "year"];
  },
  dateFromFields(fieldsArgument, options, ctor) {
    assert.sameValue(fieldsArgument.era.toString(), "era", "era argument"); // XXX verify
    assert.sameValue(fieldsArgument.year, 1, "year argument");
    assert.sameValue(fieldsArgument.month, 1, "month argument");
    assert.sameValue(fieldsArgument.day, 1, "day argument");
    assert.compareArray(Object.keys(fieldsArgument),
      ["day", "hour", "microsecond", "millisecond", "minute", "month", "nanosecond", "second", "year", "era"]);
    return new ctor(2, 2, 2, isoCalendar);
  }
};
Temporal.Calendar.from = function(argument) {
  actual.push(`Calendar.from(${argument})`);
  return calendarValue;
};
const result = Temporal.PlainDateTime.from(argument);
assert.sameValue(result.calendar, isoCalendar, "calendar result");
assert.sameValue(result.era, undefined, "era result");
assert.sameValue(result.year, 2, "year result");
assert.sameValue(result.month, 2, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(result.hour, 1, "hour result");
assert.sameValue(result.minute, 1, "minute result");
assert.sameValue(result.second, 1, "second result");
assert.sameValue(result.millisecond, 1, "millisecond result");
assert.sameValue(result.microsecond, 1, "microsecond result");
assert.sameValue(result.nanosecond, 1, "nanosecond result");
assert.compareArray(actual, expected, "order of operations");
