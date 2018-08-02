// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    fromString Tests for ZonedInstant (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.Instant.fromString('1976-11-18T14:23:30.450000100Z');
assert.sameValue(one instanceof temporal.Instant, true);
assert.sameValue(one.milliseconds, 217175010450);
assert.sameValue(one.nanoseconds, 100);
assert.sameValue(one.value, 217175010450000100n);


assert.throws(Error, ()=>{
  temporal.Instant.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.Instant.fromString('1976-11-18T15:23:30.450000100+01:00');
});
assert.throws(Error, ()=>{
  temporal.Instant.fromString('1976-11-18T15:23:30.450000100');
});
