// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaintimeiso
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

const resultExplicit = Temporal.Now.plainTimeISO(undefined);
assert(resultExplicit instanceof Temporal.PlainTime);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");

const resultImplicit = Temporal.Now.plainTimeISO();
assert(resultImplicit instanceof Temporal.PlainTime);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");
