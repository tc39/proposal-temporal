// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.subtract
includes: [temporalHelpers.js]
features: [Temporal]
---*/

TemporalHelpers.checkSubclassingIgnored(
  Temporal.Instant,
  [10n],
  "subtract",
  [{ nanoseconds: 5 }],
  (result) => {
    assert.sameValue(result.epochNanoseconds, 5n, "epochNansoeconds result");
  },
);
