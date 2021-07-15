// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindate
includes: [compareArray.js]
features: [Temporal]
---*/

const actual = [];
const expected = [];

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return undefined;
  },
});

const resultExplicit = Temporal.Now.plainDate('iso8601', undefined);
assert(resultExplicit instanceof Temporal.PlainDate);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");

const resultImplicit = Temporal.Now.plainDate('iso8601');
assert(resultImplicit instanceof Temporal.PlainDate);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");
