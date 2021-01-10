// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindatetimeiso
includes: [compareArray.js]
---*/

const actual = [];
const expected = [];

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return undefined;
  },
});

const resultExplicit = Temporal.now.plainDateTimeISO(undefined);
assert(resultExplicit instanceof Temporal.PlainDateTime);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");

const resultImplicit = Temporal.now.plainDateTimeISO();
assert(resultImplicit instanceof Temporal.PlainDateTime);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");
