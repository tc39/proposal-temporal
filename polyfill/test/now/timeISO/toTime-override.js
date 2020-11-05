// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.nowplaintimeiso
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

Object.defineProperty(Temporal.PlainDateTime.prototype, "toPlainTime", {
  get() {
    actual.push("get Temporal.PlainDateTime.prototype.toPlainTime");
    return function() {
      actual.push("call Temporal.PlainDateTime.prototype.toPlainTime");
    };
  },
});

const timeZone = new Proxy({
  getDateTimeFor(instant) {
    actual.push("call timeZone.getDateTimeFor");
    assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
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

const result = Temporal.now.plainTimeISO("UTC");
assert.sameValue(result instanceof Temporal.PlainTime, true);
for (const property of ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"]) {
  assert.sameValue(result[property], dateTime[property], property);
}

assert.compareArray(actual, expected);
