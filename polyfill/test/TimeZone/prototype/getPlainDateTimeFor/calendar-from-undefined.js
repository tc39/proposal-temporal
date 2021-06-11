// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
includes: [compareArray.js]
features: [Temporal]
---*/

const actual = [];
const expected = [];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const timeZone = Temporal.TimeZone.from("UTC");

const result = timeZone.getPlainDateTimeFor(instant, "japanese");
assert.sameValue(result.calendar.toString(), "japanese");

assert.compareArray(actual, expected);
