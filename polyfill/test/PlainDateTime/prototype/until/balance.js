// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.until
---*/

const a = Temporal.PlainDateTime.from('2017-10-05T08:07:14+00:00[UTC]');
const b = Temporal.PlainDateTime.from('2021-03-05T03:32:45+00:00[UTC]');
const c = Temporal.PlainDateTime.from('2021-03-05T09:32:45+00:00[UTC]');

const r1 = a.until(b, { largestUnit: 'months' });
assert.sameValue(r1.toString(), "P40M27DT19H25M31S", "r1");
assert.sameValue(a.add(r1).toString(), b.toString(), "a.add(r1)");

const r2 = b.until(a, { largestUnit: 'months' });
assert.sameValue(r2.toString(), "-P40M30DT19H25M31S", "r2");
assert.sameValue(b.add(r2).toString(), a.toString(), "b.add(r2)");

const r3 = c.until(a, { largestUnit: 'months' });
assert.sameValue(r3.toString(), "-P41MT1H25M31S", "r3");
assert.sameValue(c.add(r3).toString(), a.toString(), "c.add(r3)");
