// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.tozoneddatetime
includes: [compareArray.js, temporalHelpers.js]
features: [Temporal]
---*/

const plainTime = Temporal.PlainTime.from('12:00');
const plainDate = Temporal.PlainDate.from('2020-07-08');
const timeZone = Temporal.TimeZone.from('America/Los_Angeles');

const objects = plainTime.toZonedDateTime({ timeZone, plainDate });
TemporalHelpers.assertZonedDateTime(objects, 2020, 7, "M07", 8, 12, 0, 0, 0, 0, 0, "objects");
assert.sameValue(objects.timeZone, timeZone, "objects: timeZone");

const timeZoneString = plainTime.toZonedDateTime({ timeZone: "America/Los_Angeles", plainDate });
TemporalHelpers.assertZonedDateTime(timeZoneString, 2020, 7, "M07", 8, 12, 0, 0, 0, 0, 0, "timeZone string");
assert.sameValue(timeZoneString.timeZone.id, "America/Los_Angeles", "timeZone string: timeZone");

const plainDateString = plainTime.toZonedDateTime({ timeZone, plainDate: "2020-07-08" });
TemporalHelpers.assertZonedDateTime(timeZoneString, 2020, 7, "M07", 8, 12, 0, 0, 0, 0, 0, "plainDate string");
assert.sameValue(timeZoneString.timeZone.id, "America/Los_Angeles", "plainDate string: timeZone");
