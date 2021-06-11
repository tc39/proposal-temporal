// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.zoneddatetimeiso
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

const systemTimeZone = Temporal.now.timeZone();

const resultExplicit = Temporal.now.zonedDateTimeISO(undefined);
assert.sameValue(resultExplicit.timeZone.id, systemTimeZone.id);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");

const resultImplicit = Temporal.now.zonedDateTimeISO();
assert.sameValue(resultImplicit.timeZone.id, systemTimeZone.id);

assert.compareArray(actual, expected, "Temporal.TimeZone.from should not be called");
