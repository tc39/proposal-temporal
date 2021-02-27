// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.tostring
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getOffsetNanosecondsFor",
  "call timeZone.getOffsetNanosecondsFor",
  "get timeZone.getOffsetNanosecondsFor",
  "call timeZone.getOffsetNanosecondsFor",
];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456Z");
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

  getOffsetNanosecondsFor(instantArg) {
    actual.push("call timeZone.getOffsetNanosecondsFor");
    assert.sameValue(instantArg.epochNanoseconds, instant.epochNanoseconds);
    return -8735135801679;
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

assert.sameValue(instant.toString({ timeZone }), "1975-02-02T12:00:00.987654321-02:25:35.135801679");
assert.compareArray(actual, expected);
