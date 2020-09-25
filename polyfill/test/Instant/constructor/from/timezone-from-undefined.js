// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.from
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.TimeZone.from",
];

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return undefined;
  },
});

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
assert.sameValue(instant.getEpochNanoseconds(), 160583136123456789n);

assert.compareArray(actual, expected);
