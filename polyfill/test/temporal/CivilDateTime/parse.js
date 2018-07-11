// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for CivilDateTime (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.CivilDateTime.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
assert.sameValue(one instanceof temporal.CivilDateTime, true);
assert.sameValue(one.year, 1976);
assert.sameValue(one.month, 11);
assert.sameValue(one.day, 18);
assert.sameValue(one.hour, 15);
assert.sameValue(one.minute, 23);
assert.sameValue(one.second, 30);
assert.sameValue(one.millisecond, 450);
assert.sameValue(one.nanosecond, 100);

const two = temporal.CivilDateTime.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
assert.sameValue(two instanceof temporal.CivilDateTime, true);
assert.sameValue(two.year, 1976);
assert.sameValue(two.month, 11);
assert.sameValue(two.day, 18);
assert.sameValue(two.hour, 15);
assert.sameValue(two.minute, 23);
assert.sameValue(two.second, 30);
assert.sameValue(two.millisecond, 450);
assert.sameValue(two.nanosecond, 100);

const three = temporal.CivilDateTime.parse('1976-11-18T15:23:30.450000100+01:00');
assert.sameValue(three instanceof temporal.CivilDateTime, true);
assert.sameValue(three.year, 1976);
assert.sameValue(three.month, 11);
assert.sameValue(three.day, 18);
assert.sameValue(three.hour, 15);
assert.sameValue(three.minute, 23);
assert.sameValue(three.second, 30);
assert.sameValue(three.millisecond, 450);
assert.sameValue(three.nanosecond, 100);

const four = temporal.CivilDateTime.parse('1976-11-18T15:23:30.450000100');
assert.sameValue(four.year, 1976);
assert.sameValue(four.month, 11);
assert.sameValue(four.day, 18);
assert.sameValue(four.hour, 15);
assert.sameValue(four.minute, 23);
assert.sameValue(four.second, 30);
assert.sameValue(four.millisecond, 450);
assert.sameValue(four.nanosecond, 100);
