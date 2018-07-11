// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for ZonedInstant
author: Philipp Dunkel
esid: pending
---*/

const instant = new temporal.Instant(217175010450000100n);
const instance = new temporal.ZonedInstant(instant, 'Europe/Vienna');

assert.sameValue(typeof instance, 'object');
assert.sameValue(instance instanceof temporal.ZonedInstant, true);
assert.sameValue(instance.milliseconds, 217175010450);
assert.sameValue(instance.nanoseconds, 100);
assert.sameValue(instance.toString(), '1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
