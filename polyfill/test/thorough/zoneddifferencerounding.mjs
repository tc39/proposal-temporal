import { abbrevs, getProgressBar, makeZonedCases, temporalImpl as T, time, withSnapshotsFromFile } from './support.mjs';

// Time largest units just do Instant arithmetic; not interesting here
const largestUnits = ['years', 'months', 'weeks', 'days'];
const smallestUnits = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds'
];

const interestingCases = makeZonedCases();
const total = (interestingCases.length * (interestingCases.length - 1)) / 2;
// 1 ns as a rounding increment is already covered in zoneddifference.mjs
const roundingGranularities = {
  years: [1, 2],
  months: [1, 2],
  weeks: [1, 2],
  days: [1, 2],
  hours: [1, 2],
  minutes: [1, 2],
  seconds: [1, 2],
  milliseconds: [1, 2],
  microseconds: [1, 2],
  nanoseconds: [2]
};

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./zoneddifferencerounding.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [one, str1] of interestingCases) {
      const tz1 = one.timeZoneId;
      for (const [two, str2] of interestingCases) {
        if (T.ZonedDateTime.compare(one, two) === 1) continue;
        progress.tick(1, { test: `${str1} : ${str2}`.slice(0, 40) });
        // Date arithmetic can only be done between ZDTs with the same time zone
        if (tz1 !== two.timeZoneId) continue;

        largestUnits.forEach((largestUnit, largestUnitIndex) => {
          for (const smallestUnit of smallestUnits.slice(largestUnitIndex)) {
            for (const roundingIncrement of roundingGranularities[smallestUnit]) {
              const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode: 'expand' };
              const key = `${str1}:${str2}${abbrevs[largestUnit]}${roundingIncrement}${abbrevs[smallestUnit]}`;

              matchSnapshotOrOutOfRange(() => one.until(two, options).toString(), key);
              matchSnapshotOrOutOfRange(() => two.since(one, options).toString(), `${key}s`);
            }
          }
        });
      }
    }
  });

  return total;
});
