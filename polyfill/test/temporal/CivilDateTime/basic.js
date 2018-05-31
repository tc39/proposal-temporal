// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for CivilDateTime
author: Philipp Dunkel
esid: pending
---*/

const instance = new temporal.CivilDateTime(1976, 11, 18, 15, 23, 30);

assert.sameValue('1976-11-18T15:23:30.000000000', instance.toString());
assert.sameValue('1976-11-18T15:23:30.000000000+01:00[Europe/Berlin]', instance.withZone('Europe/Berlin').toString());

const anniversary = instance.plus({ years: 3 });
assert.sameValue('1979-11-18T15:23:30.000000000', anniversary.toString());
assert.sameValue('1979-11-18T15:23:30.000000000+01:00[Europe/Berlin]', anniversary.withZone('Europe/Berlin').toString());

const runup = anniversary.plus({ months: -1 });
assert.sameValue('1979-10-18T15:23:30.000000000', runup.toString());
assert.sameValue('1979-10-18T15:23:30.000000000+01:00[Europe/Berlin]', runup.withZone('Europe/Berlin').toString());

const thirty = runup.plus({ days: 30 });
assert.sameValue('1979-11-17T15:23:30.000000000', thirty.toString());
assert.sameValue('1979-11-17T15:23:30.000000000+01:00[Europe/Berlin]', thirty.withZone('Europe/Berlin').toString());

const preptime = anniversary.plus({ hours: -5, minutes: 37, seconds: 30, milliseconds: 4, nanoseconds: -3 });
assert.sameValue('1979-11-18T11:01:00.003999997', preptime.toString());
assert.sameValue('1979-11-18T11:01:00.003999997+01:00[Europe/Berlin]', preptime.withZone('Europe/Berlin').toString());

const daybreak = anniversary.with({ hour: 0, minute: 0, second: 0 });
assert.sameValue('1979-11-18T00:00:00.000000000', daybreak.toString());
assert.sameValue('1979-11-18T00:00:00.000000000+01:00[Europe/Berlin]', daybreak.withZone('Europe/Berlin').toString());

const nightfall = anniversary.with({ hour: 23, minute: 59, second: 59, millisecond: 1000, nanosecond: -1 });
assert.sameValue('1979-11-18T23:59:59.999999999', nightfall.toString());
assert.sameValue('1979-11-18T23:59:59.999999999+01:00[Europe/Berlin]', nightfall.withZone('Europe/Berlin').toString());

const year = (new Date()).getFullYear()
const birthday = instance.with({ year });
assert.sameValue(`${year}-11-18T15:23:30.000000000`, birthday.toString());
assert.sameValue(`${year}-11-18T15:23:30.000000000+01:00[Europe/Berlin]`, birthday.withZone('Europe/Berlin').toString());
