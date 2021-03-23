// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.round
includes: [temporalHelpers.js]
---*/

TemporalHelpers.checkSubclassingIgnored(
  Temporal.PlainTime,
  [12, 34, 56, 987, 654, 321],
  "round",
  [{ smallestUnit: 'second' }],
  (result) => {
    assert.sameValue(result.hour, 12, "hour result");
    assert.sameValue(result.minute, 34, "minute result");
    assert.sameValue(result.second, 57, "second result");
    assert.sameValue(result.millisecond, 0, "millisecond result");
    assert.sameValue(result.microsecond, 0, "microsecond result");
    assert.sameValue(result.nanosecond, 0, "nanosecond result");
  },
);
