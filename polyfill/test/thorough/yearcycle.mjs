// Tests month and year difference between every date pair in a four-year ISO
// calendar cycle.

import { assertDurationsEqual, getProgressBar, temporalImpl as T, time, withSnapshotsFromFile } from './support.mjs';

const datesInCycle = 1461;
const total = datesInCycle ** 2;
const startDate = new T.PlainDate(1970, 1, 1);

// Minimize the number of characters stored in each snapshot, since there are
// three million snapshots. Pack dates and durations into as few ASCII chars as
// possible while still preserving some sort of human legibility in case a
// snapshot needs debugging.

function dateToShortString(date) {
  return `${date.year % 10}${date.monthCode.slice(1)}${`${date.day}`.padStart(2, '0')}`;
}

function isoCalendarDurationToShortString(d) {
  if (d.blank) return '';
  if (
    d.weeks !== 0 ||
    d.hours !== 0 ||
    d.minutes !== 0 ||
    d.seconds !== 0 ||
    d.milliseconds !== 0 ||
    d.microseconds !== 0 ||
    d.nanoseconds !== 0
  ) {
    throw new Error(`Expected zero in all components but years, months, and days; got ${d}`);
  }
  // Omit the "P" (may be the first or second character), resulting in strings
  // like "-1Y1M1D" and "40D".
  return d.toString().replace('P', '');
}

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./yearcycle.snapshot.json', (matchSnapshot) => {
    for (let i = 0; i <= datesInCycle; i++) {
      const d1 = startDate.add({ days: i });
      const str1 = dateToShortString(d1);
      for (let j = 0; j <= datesInCycle; j++) {
        const d2 = startDate.add({ days: j });

        const snapshotName = `${str1}${dateToShortString(d2)}`;
        progress.tick(1, { test: `${d1} : ${d2}` });

        const difYears = d1.until(d2, { largestUnit: 'years' });
        matchSnapshot(isoCalendarDurationToShortString(difYears), snapshotName);

        const difMonths = d1.until(d2, { largestUnit: 'months' });
        if (difYears.years !== 0) {
          matchSnapshot(isoCalendarDurationToShortString(difMonths), `${snapshotName}m`);
        } else {
          assertDurationsEqual(difMonths, difYears);
        }
      }
    }
  });

  return total;
});
