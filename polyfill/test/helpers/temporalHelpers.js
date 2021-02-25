// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: |
    This defines helper objects and functions for testing Temporal.
defines: [MINIMAL_CALENDAR_OBJECT, MINIMAL_TIME_ZONE_OBJECT]
---*/

/* eslint no-unused-vars: "off", @typescript-eslint/no-unused-vars: "off" */

var MINIMAL_CALENDAR_OBJECT = {
  dateFromFields() { throw new Error('not implemented'); },
  yearMonthFromFields() { throw new Error('not implemented'); },
  monthDayFromFields() { throw new Error('not implemented'); },
  dateAdd() { throw new Error('not implemented'); },
  dateUntil() { throw new Error('not implemented'); },
  year() { throw new Error('not implemented'); },
  month() { throw new Error('not implemented'); },
  monthCode() { throw new Error('not implemented'); },
  day() { throw new Error('not implemented'); },
  era() { return undefined; },
  eraYear() { return undefined; },
  dayOfWeek() { return undefined; },
  dayOfYear() { return undefined; },
  weekOfYear() { return undefined; },
  daysInWeek() { return undefined; },
  daysInMonth() { return undefined; },
  daysInYear() { return undefined; },
  monthsInYear() { return undefined; },
  inLeapYear() { return undefined; },
  toString() { throw new Error('not implemented'); },
};

var MINIMAL_TIME_ZONE_OBJECT = {
  getOffsetNanosecondsFor() { throw new Error('not implemented'); },
  getPossibleInstantsFor() { throw new Error('not implemented'); },
  toString() { throw new Error('not implemented'); },
};
