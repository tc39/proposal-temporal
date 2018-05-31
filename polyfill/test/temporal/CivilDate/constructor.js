// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for CivilDate
author: Philipp Dunkel
esid: pending
---*/

const instance = new temporal.CivilDate(1976, 11, 18);

assert.sameValue(typeof instance, 'object');
assert.sameValue(instance instanceof temporal.CivilDate, true);
assert.sameValue(instance.year, 1976);
assert.sameValue(instance.month, 11);
assert.sameValue(instance.day, 18);
assert.sameValue(instance.hour, undefined);
assert.sameValue(instance.minute, undefined);
assert.sameValue(instance.second, undefined);
assert.sameValue(instance.millisecond, undefined);
assert.sameValue(instance.nanosecond, undefined);
assert.sameValue(instance.toString(), '1976-11-18');
