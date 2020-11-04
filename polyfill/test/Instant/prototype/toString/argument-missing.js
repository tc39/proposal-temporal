// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.tostring
includes: [compareArray.js]
---*/

const actual = [];
const expected = [];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456Z");

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return function(identifier) {
      actual.push("call Temporal.TimeZone.from");
      assert.sameValue(identifier, "UTC");
    };
  },
});

assert.sameValue(instant.toString(), "1975-02-02T14:25:36.123456Z");
assert.compareArray(actual, expected);
