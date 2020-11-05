// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.prototype.tozoneddatetime
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get options.disambiguation",
  "get disambiguation.toString",
  "call disambiguation.toString",
  "get timeZone.getInstantFor",
  "call timeZone.getInstantFor",
];

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return undefined;
  },
});

const dateTime = Temporal.PlainDateTime.from("1975-02-02T14:25:36.123456789");
const instant = Temporal.Instant.fromEpochNanoseconds(-205156799012345679n);

const options = new Proxy({
  disambiguation: {
    get toString() {
      actual.push("get disambiguation.toString");
      return function() {
        actual.push("call disambiguation.toString");
        return "reject";
      };
    },
  },
}, {
  has(target, property) {
    actual.push(`has options.${property}`);
    return property in target;
  },
  get(target, property) {
    actual.push(`get options.${property}`);
    return target[property];
  },
});

const timeZone = new Proxy({
  getInstantFor(dateTimeArg, optionsArg) {
    actual.push("call timeZone.getInstantFor");
    assert.sameValue(dateTimeArg, dateTime);
    assert.sameValue(typeof optionsArg, "object");
    assert.notSameValue(optionsArg, null);
    assert.notSameValue(optionsArg, options);
    assert.sameValue(optionsArg.disambiguation, "reject");
    return instant;
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

const result = dateTime.toZonedDateTime(timeZone, options);
assert.sameValue(result.epochNanoseconds, instant.epochNanoseconds);
assert.sameValue(result.timeZone, timeZone);
assert.sameValue(result.calendar, dateTime.calendar);

assert.compareArray(actual, expected);
