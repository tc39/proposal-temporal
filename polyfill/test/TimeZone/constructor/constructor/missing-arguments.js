// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone
---*/

assert.throws(RangeError, () => new Temporal.TimeZone());
assert.throws(RangeError, () => new Temporal.TimeZone(undefined));
