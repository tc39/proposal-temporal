// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for CivilDateTime
author: Philipp Dunkel
esid: pending
---*/

const instance = new temporal.CivilDateTime(1976, 11, 18, 15, 23, 30, 450, 12345);

assert.sameValue(typeof instance, 'object');
assert.sameValue(instance instanceof temporal.CivilDateTime, true);
assert.sameValue(instance.year, 1976);
assert.sameValue(instance.month, 11);
assert.sameValue(instance.day, 18);
assert.sameValue(instance.hour, 15);
assert.sameValue(instance.minute, 23);
assert.sameValue(instance.second, 30);
assert.sameValue(instance.millisecond, 450);
assert.sameValue(instance.nanosecond, 12345);
assert.sameValue(instance.toString(), '1976-11-18T15:23:30.450012345');
