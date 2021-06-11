// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.until
info: |
    DifferenceISODateTime ( y1, mon1, d1, h1, min1, s1, ms1, mus1, ns1, y2, mon2, d2, h2, min2, s2, ms2, mus2, ns2, calendar, largestUnit [ , options ] )

    7. Let date1 be ? CreateTemporalDate(balanceResult.[[Year]], balanceResult.[[Month]], balanceResult.[[Day]]).
    8. Let date2 be ? CreateTemporalDate(y2, mon2, d2).
    11. Let dateDifference be ? CalendarDateUntil(calendar, date1, date2, untilOptions).
features: [Temporal]
---*/

class Calendar extends Temporal.Calendar {
  constructor() {
    super("iso8601");
  }

  dateUntil(d1, d2) {
    assert.sameValue(d1.calendar, this, "d1.calendar");
    assert.sameValue(d2.calendar, this, "d2.calendar");
    return new Temporal.Duration();
  }
}
const calendar = new Calendar();
const earlier = new Temporal.PlainDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321, calendar);
const later = new Temporal.PlainDateTime(2001, 6, 3, 13, 35, 57, 988, 655, 322, calendar);
const result = earlier.until(later);
assert(result instanceof Temporal.Duration, "result");
