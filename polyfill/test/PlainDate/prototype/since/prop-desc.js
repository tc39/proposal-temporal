// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.since
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.since,
  "function",
  "`typeof Date.prototype.since` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "since", {
  writable: true,
  enumerable: false,
  configurable: true,
});
