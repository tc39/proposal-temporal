// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.from
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.TimeZone.from",
  "call Temporal.TimeZone.from",
  "get timeZone.getPossibleAbsolutesFor",
  "call timeZone.getPossibleAbsolutesFor",
];

const dateTimeString = "1975-02-02T14:25:36.123456789";

const timeZone = new Proxy({
  name: "Custom/TimeZone",

  toString() {
    actual.push("call timeZone.toString");
    return {
      get toString() {
        actual.push("get name.toString");
        return function() {
          actual.push("call name.toString");
          return "Custom/TimeZone";
        };
      }
    };
  },

  getOffsetStringFor() {
    actual.push("call timeZone.getOffsetStringFor");
    return {
      get toString() {
        actual.push("get offset.toString");
        return function() {
          actual.push("call offset.toString");
          return "+02:59";
        };
      }
    };
  },

  getDateTimeFor() {
    actual.push("call timeZone.getDateTimeFor");
    return Temporal.DateTime.from("1963-07-02T12:00:00.987654321");
  },

  getPossibleAbsolutesFor(dateTimeArg) {
    actual.push("call timeZone.getPossibleAbsolutesFor");
    assert.sameValue(dateTimeArg.toString(), dateTimeString);
    return [Temporal.Absolute.fromEpochMilliseconds(-205156799345)];
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
      assert.sameValue(argument, "Custom/TimeZone");
      return timeZone;
    };
  },
});

const absolute = Temporal.Absolute.from(dateTimeString + "+01:00[Custom/TimeZone]");
assert.sameValue(absolute.getEpochMilliseconds(), -205156799345);

assert.compareArray(actual, expected);
