// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for CivilTime (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.CivilTime.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
assert.sameValue(one instanceof temporal.CivilTime, true);
assert.sameValue(one.hour, 15);
assert.sameValue(one.minute, 23);
assert.sameValue(one.second, 30);
assert.sameValue(one.millisecond, 450);
assert.sameValue(one.nanosecond, 100);

const two = temporal.CivilTime.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
assert.sameValue(two instanceof temporal.CivilTime, true);
assert.sameValue(two.hour, 15);
assert.sameValue(two.minute, 23);
assert.sameValue(two.second, 30);
assert.sameValue(two.millisecond, 450);
assert.sameValue(two.nanosecond, 100);

const three = temporal.CivilTime.parse('1976-11-18T15:23:30.450000100+01:00');
assert.sameValue(three instanceof temporal.CivilTime, true);
assert.sameValue(three.hour, 15);
assert.sameValue(three.minute, 23);
assert.sameValue(three.second, 30);
assert.sameValue(three.millisecond, 450);
assert.sameValue(three.nanosecond, 100);

const four = temporal.CivilTime.parse('1976-11-18T15:23:30.450000100');
assert.sameValue(four instanceof temporal.CivilTime, true);
assert.sameValue(four.hour, 15);
assert.sameValue(four.minute, 23);
assert.sameValue(four.second, 30);
assert.sameValue(four.millisecond, 450);
assert.sameValue(four.nanosecond, 100);
