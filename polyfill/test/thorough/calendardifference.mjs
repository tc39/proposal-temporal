/*
 ** Copyright (C) 2026 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import { assertDurationsEqual, assertTemporalEqual, getProgressBar, temporalImpl as T, time } from './support.mjs';

// untilCalendar() counts months in non-ISO calendars by comparing the year and
// month of the next month. It used to build that next month with
// addMonthsCalendar(), which formats an ISO date and hands back a cached
// calendar date. That had two consequences, both covered here:
//
// 1. The day of the cached date was overwritten in place with the start date's
//    day, which corrupted later lookups that hit the same cache entry, so
//    until() returned the wrong number of days.
// 2. When the target date was in the first or last month of the ISO range,
//    the month after it was outside the range and formatting it threw.
//
// https://github.com/tc39/proposal-temporal/issues/3327

const d = (str, calendar) => T.PlainDate.from(str).withCalendar(calendar);

// Expected values are Chrome's native Temporal.
const monthCountingCases = [
  // [start, end, calendar, largestUnit, expected]
  ['2022-05-01', '2022-03-31', 'hebrew', 'months', '-P1M1D'],
  ['2023-04-21', '2023-03-21', 'hebrew', 'months', '-P1M1D'],
  ['2024-03-10', '2024-04-07', 'hebrew', 'months', 'P28D'],
  ['2024-03-10', '2023-03-21', 'hebrew', 'months', '-P12M1D'],
  ['2023-04-21', '2022-04-01', 'islamic-civil', 'years', '-P1Y1M1D'],
  ['2024-10-02', '2024-06-04', 'chinese', 'months', '-P4M1D']
];

const nonIsoCalendars = [
  'hebrew',
  'persian',
  'islamic-civil',
  'islamic-tbla',
  'islamic-umalqura',
  'indian',
  'coptic',
  'ethiopic',
  'ethioaa',
  'chinese',
  'dangi'
];

// The whole supported range, in both directions.
const rangeLimits = ['+275760-09-13', '-271821-04-19'];

// Dates within this many days of a limit are used to check stepping near it.
const windowDays = 60;

await time(async (start) => {
  const progress = getProgressBar(start, monthCountingCases.length + nonIsoCalendars.length * 2);
  let total = 0;

  // Each listed case must produce the expected duration and must round-trip:
  // adding the duration to the start date has to give the end date again.
  for (const [startStr, endStr, calendar, largestUnit, expected] of monthCountingCases) {
    const one = d(startStr, calendar);
    const two = d(endStr, calendar);
    assertDurationsEqual(
      one.until(two, { largestUnit }),
      T.Duration.from(expected),
      `${calendar} ${startStr} until ${endStr}`
    );
    assertTemporalEqual(
      one.add(one.until(two, { largestUnit })),
      two,
      `${calendar} ${startStr} until ${endStr} round-trips`
    );
    total += 1;
    progress.tick();
  }

  // Same checks next to both limits of the supported ISO range, where the
  // month after the target date is not representable. These used to throw.
  for (const calendar of nonIsoCalendars) {
    // Walk inward from each limit so every date we construct stays in range.
    for (const [limitStr, offsetOf] of [
      [rangeLimits[0], (days) => ({ days: -days })],
      [rangeLimits[1], (days) => ({ days })]
    ]) {
      const limit = d(limitStr, calendar);
      for (let days = 0; days <= windowDays; days++) {
        const start = limit.add(offsetOf(days));
        for (const largestUnit of ['months', 'years']) {
          const diff = start.until(limit, { largestUnit });
          assertTemporalEqual(
            start.add(diff),
            limit,
            `${calendar} ${start} until ${limit} (${largestUnit}) round-trips`
          );
          total += 1;
        }
      }
    }
    progress.tick(2);
  }
  return total;
});
