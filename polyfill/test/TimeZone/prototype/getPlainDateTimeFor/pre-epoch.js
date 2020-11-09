// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
---*/

const instant = Temporal.Instant.from("1969-07-16T13:32:01.234567891Z");
assert.sameValue(instant.toString(), "1969-07-16T13:32:01.234567891Z");
const timeZone = Temporal.TimeZone.from("-04:00");
const dateTime = timeZone.getPlainDateTimeFor(instant);
assert.sameValue(dateTime.toString(), "1969-07-16T09:32:01.234567891");
