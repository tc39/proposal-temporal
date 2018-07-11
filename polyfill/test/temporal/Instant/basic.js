// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for Instant
author: Philipp Dunkel
esid: pending
---*/

const instant = new temporal.Instant(0n);

assert.sameValue('1970-01-01T00:00:00.000000000+00:00[UTC]', instant.toString());

const now = new Date();
const nowi = new temporal.Instant(BigInt(now.valueOf()) * BigInt(1e6));
assert.sameValue(now.toISOString().replace('Z','000000+00:00[UTC]'), nowi.toString());
