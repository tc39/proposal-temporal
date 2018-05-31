// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for CivilDate
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.CivilDate.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
assert.sameValue(one instanceof temporal.CivilDate, true);
assert.sameValue(one.year, 1976);
assert.sameValue(one.month, 11);
assert.sameValue(one.day, 18);

const two = temporal.CivilDate.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
assert.sameValue(two instanceof temporal.CivilDate, true);
assert.sameValue(two.year, 1976);
assert.sameValue(two.month, 11);
assert.sameValue(two.day, 18);

const three = temporal.CivilDate.parse('1976-11-18T15:23:30.450000100+01:00');
assert.sameValue(three instanceof temporal.CivilDate, true);
assert.sameValue(three.year, 1976);
assert.sameValue(three.month, 11);
assert.sameValue(three.day, 18);

const four = temporal.CivilDate.parse('1976-11-18T15:23:30.450000100');
assert.sameValue(four instanceof temporal.CivilDate, true);
assert.sameValue(four.year, 1976);
assert.sameValue(four.month, 11);
assert.sameValue(four.day, 18);
