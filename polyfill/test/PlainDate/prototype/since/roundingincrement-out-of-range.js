// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.since
description: RangeError thrown when roundingIncrement option out of range
info: |
    sec-temporal-totemporalroundingincrement step 6:
      6. If _increment_ < 1 or _increment_ > _maximum_, throw a *RangeError* exception.
includes: [compareArray.js]
---*/

const actual = [];
class Calendar extends Temporal.Calendar {
  constructor() {
    super("iso8601");
  }

  dateUntil(...args) {
    actual.push("dateUntil");
    return super.dateUntil(...args);
  }
}
const calendar = new Calendar();

const earlier = new Temporal.PlainDate(2000, 5, 2, calendar);
const later = new Temporal.PlainDate(2000, 5, 7, calendar);
assert.throws(RangeError, () => later.since(earlier, { roundingIncrement: -Infinity }));
assert.throws(RangeError, () => later.since(earlier, { roundingIncrement: -1 }));
assert.throws(RangeError, () => later.since(earlier, { roundingIncrement: 0 }));
assert.throws(RangeError, () => later.since(earlier, { roundingIncrement: Infinity }));
assert.compareArray(actual, [], "should not call dateUntil");
