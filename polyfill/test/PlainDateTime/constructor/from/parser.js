// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime.from accepts a custom timezone that starts with "c".
esid: sec-temporal.datetime.from
---*/

const dateTime = Temporal.PlainDateTime.from("2020-01-01T00:00:00+01:00[Custom]");
assert.sameValue(dateTime.year, 2020);
assert.sameValue(dateTime.month, 1);
assert.sameValue(dateTime.day, 1);
assert.sameValue(dateTime.hour, 0);
assert.sameValue(dateTime.minute, 0);
assert.sameValue(dateTime.second, 0);
assert.sameValue(dateTime.millisecond, 0);
assert.sameValue(dateTime.microsecond, 0);
assert.sameValue(dateTime.nanosecond, 0);
