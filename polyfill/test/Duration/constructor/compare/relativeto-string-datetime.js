// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.compare
description: >
    Conversion of ISO date-time strings as relativeTo option to
    Temporal.ZonedDateTime or Temporal.PlainDateTime instances
features: [Temporal]
---*/

const instance = new Temporal.Duration(1, 0, 0, 1);
const equalIfPlain = new Temporal.Duration(1, 0, 0, 0, 24);
const equalIfZoned = new Temporal.Duration(1, 0, 0, 0, 25);

let relativeTo = "2019-11-01T00:00";
const result1 = Temporal.Duration.compare(instance, equalIfPlain, { relativeTo });
assert.sameValue(result1, 0, "bare date-time string is a plain relativeTo");

relativeTo = "2019-11-01T00:00Z";
const result2 = Temporal.Duration.compare(instance, equalIfPlain, { relativeTo });
assert.sameValue(result2, 0, "date-time + Z is a plain relativeTo");

relativeTo = "2019-11-01T00:00-07:00";
const result3 = Temporal.Duration.compare(instance, equalIfPlain, { relativeTo });
assert.sameValue(result3, 0, "date-time + offset is a plain relativeTo");

relativeTo = "2019-11-01T00:00[America/Vancouver]";
const result4 = Temporal.Duration.compare(instance, equalIfZoned, { relativeTo });
assert.sameValue(result4, 0, "date-time + IANA annotation is a zoned relativeTo");

relativeTo = "2019-11-01T00:00Z[America/Vancouver]";
const result5 = Temporal.Duration.compare(instance, equalIfZoned, { relativeTo });
assert.sameValue(result5, 0, "date-time + Z + IANA annotation is a zoned relativeTo");

relativeTo = "2019-11-01T00:00-07:00[America/Vancouver]";
const result6 = Temporal.Duration.compare(instance, equalIfZoned, { relativeTo });
assert.sameValue(result6, 0, "date-time + offset + IANA annotation is a zoned relativeTo");

relativeTo = "2019-11-01T00:00+04:15[America/Vancouver]";
assert.throws(RangeError, () => Temporal.Duration.compare(instance, equalIfPlain, { relativeTo }), "date-time + offset + IANA annotation throws if wall time and exact time mismatch");
