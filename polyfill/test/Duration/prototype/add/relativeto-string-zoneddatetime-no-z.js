// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.add
description: RangeError thrown if relativeTo is an ISO 8601 string with a Z as the time zone designator
features: [Temporal]
---*/

['2000-01-01T00:00Z', '2000-01-01T00:00Z[UTC]'].forEach((relativeTo) => {
  const duration = new Temporal.Duration(1, 0, 0, 15);
  assert.throws(RangeError, () => duration.add(new Temporal.Duration(0, 0, 0, 16), { relativeTo }));
});
