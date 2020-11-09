// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
---*/

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const timeZone = Temporal.TimeZone.from("Europe/Madrid");
timeZone.getOffsetNanosecondsFor = undefined;
const result = timeZone.getPlainDateTimeFor(instant);
assert.sameValue(result.year, 1975);
assert.sameValue(result.month, 2);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 15);
assert.sameValue(result.minute, 25);
assert.sameValue(result.second, 36);
assert.sameValue(result.millisecond, 123);
assert.sameValue(result.microsecond, 456);
assert.sameValue(result.nanosecond, 789);
assert.sameValue(result.toString(), "1975-02-02T15:25:36.123456789");
