// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.from
includes: [compareArray.js]
features: [Temporal]
---*/

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    throw new Test262Error("should not get Temporal.TimeZone.from");
  },
});

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
assert.sameValue(instant.epochNanoseconds, 160583136123456789n);
