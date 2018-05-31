// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for ZonedInstant (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.ZonedInstant.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
assert.sameValue(one instanceof temporal.ZonedInstant, true);
assert.sameValue(one.milliseconds, 217175010450);
assert.sameValue(one.nanoseconds, 100);
assert.sameValue(one.timeZone, 'Europe/Vienna');

const two = temporal.ZonedInstant.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
assert.sameValue(two instanceof temporal.ZonedInstant, true);
assert.sameValue(two.milliseconds, 217175010450);
assert.sameValue(two.nanoseconds, 100);
assert.sameValue(two.timeZone, 'Europe/Vienna');

const three = temporal.ZonedInstant.parse('1976-11-18T15:23:30.450000100+01:00');
assert.sameValue(three instanceof temporal.ZonedInstant, true);
assert.sameValue(three.milliseconds, 217175010450);
assert.sameValue(three.nanoseconds, 100);
assert.sameValue(three.timeZone, 'Europe/Andorra');

const four = temporal.ZonedInstant.parse('1976-11-18T15:23:30.450000100');
assert.sameValue(four instanceof temporal.ZonedInstant, true);
assert.sameValue(four.milliseconds, 217178610450);
assert.sameValue(four.nanoseconds, 100);
assert.sameValue(four.timeZone, 'Europe/London');
