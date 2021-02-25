// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime
includes: [compareArray.js, temporalHelpers.js]
features: [BigInt]
---*/

const expected = [
  "get from",
  "call from",
];
let actual;
const argument = 957270896987654321n;
const timeZone = MINIMAL_TIME_ZONE_OBJECT;

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get from");
    return function(identifier) {
      actual.push("call from");
      assert.sameValue(identifier, "undefined");
      return timeZone;
    };
  },
});

actual = [];
const explicit = new Temporal.ZonedDateTime(argument, undefined);
assert.sameValue(explicit.timeZone, timeZone);
assert.compareArray(actual, expected, "order of operations explicit");

actual = [];
const implicit = new Temporal.ZonedDateTime(argument);
assert.sameValue(implicit.timeZone, timeZone);
assert.compareArray(actual, expected, "order of operations implicit");
