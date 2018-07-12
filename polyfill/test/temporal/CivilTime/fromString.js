// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for CivilTime (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.CivilTime.fromString('15:23:30.450000100');
assert.sameValue(one instanceof temporal.CivilTime, true);
assert.sameValue(one.hour, 15);
assert.sameValue(one.minute, 23);
assert.sameValue(one.second, 30);
assert.sameValue(one.millisecond, 450);
assert.sameValue(one.nanosecond, 100);

assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('1976-11-18T15:23:30.450000100+01:00');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('1976-11-18T15:23:30.450000100');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('15:23:30.450000100+01:00[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('15:23:30.450000100[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.CivilTime.fromString('15:23:30.450000100+01:00');
});
