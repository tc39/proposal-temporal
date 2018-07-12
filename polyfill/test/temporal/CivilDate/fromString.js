// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for CivilDate
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.CivilDate.fromString('1976-11-18');
assert.sameValue(one instanceof temporal.CivilDate, true);
assert.sameValue(one.year, 1976);
assert.sameValue(one.month, 11);
assert.sameValue(one.day, 18);

assert.throws(Error, ()=>{
  temporal.CivilDate.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilDate.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilDate.fromString('1976-11-18T15:23:30.450000100+01:00');
});
assert.throws(Error, ()=>{
  temporal.CivilDate.fromString('1976-11-18T15:23:30.450000100');
});
