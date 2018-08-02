// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for ZonedInstant
author: Philipp Dunkel
esid: pending
---*/

const instant = new temporal.Instant(217175010450000100n);

const one = new temporal.ZonedInstant(instant, 'Europe/Vienna');
assert.sameValue(typeof one, 'object');
assert.sameValue(one instanceof temporal.ZonedInstant, true);
assert.sameValue(one.milliseconds, 217175010450);
assert.sameValue(one.nanoseconds, 100);
assert.sameValue(one.value, 217175010450000100n);
assert.sameValue(one.toString(), '1976-11-18T15:23:30.450000100+01:00');

const two = new temporal.ZonedInstant(instant, 'America/New_York');
assert.sameValue(typeof two, 'object');
assert.sameValue(two instanceof temporal.ZonedInstant, true);
assert.sameValue(two.milliseconds, 217175010450);
assert.sameValue(two.nanoseconds, 100);
assert.sameValue(two.value, 217175010450000100n);
assert.sameValue(two.toString(), '1976-11-18T09:23:30.450000100-05:00');
