// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.from
includes: [compareArray.js]
---*/

const dateTimeString = "1975-02-02T14:25:36.123456789";

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    throw new Test262Error("should not get Temporal.TimeZone.from");
  },
});

const absolute = Temporal.Absolute.from(dateTimeString + "+01:00[Custom/TimeZone]");
assert.sameValue(absolute.getEpochMilliseconds(), 160579536123);
