// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday
includes: [compareArray.js]
---*/

const expected = [
  "valueOf month",
];
const actual = [];
const args = [
  { valueOf() { actual.push("valueOf month"); return 1; } },
];

assert.throws(RangeError, () => new Temporal.PlainMonthDay(...args));
assert.compareArray(actual, expected, "order of operations");
