import {
  assertEqual,
  getProgressBar,
  isCalendarUnit,
  makeDateCases,
  makeDurationCases,
  makeZonedCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const units = [
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
const positiveCases = makeDurationCases();
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
const interestingRelativeTo = makeDateCases().concat(makeZonedCases());
const total = interestingCases.length * units.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationtotal.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [duration, str] of interestingCases) {
      const isCalendarDuration = duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0;
      const wouldOverflowWithRelativeTo = isCalendarDuration
        ? false
        : Math.abs(duration.total('seconds')) > Number.MAX_SAFE_INTEGER;

      for (const unit of units) {
        const testName = `${str} ${unit}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        if (!wouldOverflowWithRelativeTo) {
          for (const [relativeTo, relativeStr] of interestingRelativeTo) {
            let result;
            try {
              result = matchSnapshotOrOutOfRange(
                () => duration.total({ unit, relativeTo }),
                `${testName} ${relativeStr}`
              );
            } catch (e) {
              console.log('\n', str, unit, relativeStr, e.name, e.message);
            }
            if (result) {
              const rounded = duration.round({
                largestUnit: unit,
                smallestUnit: unit,
                roundingMode: 'trunc',
                relativeTo
              })[unit];
              try {
                assertEqual(Math.trunc(result), rounded, 'relativeTo total() should agree with round()');
              } catch (e) {
                console.log('\n', str, unit, relativeStr, e);
              }
            }
          }
        }

        // Skip if testing without relativeTo would be invalid
        if (isCalendarUnit(unit) || isCalendarDuration) continue;
        const result = duration.total(unit);
        matchSnapshot(result.toString(), testName);

        // duration.round() may fail at the last step when converting the
        // internal duration back to JS numbers with ℝ(𝔽(nanoseconds)).
        // Skip this next part of the test if so.
        if (
          (result >= Number.MAX_SAFE_INTEGER || result <= Number.MIN_SAFE_INTEGER) &&
          (unit === 'milliseconds' || unit === 'microseconds' || unit === 'nanoseconds')
        ) {
          continue;
        }

        try {
          const rounded = duration.round({
            largestUnit: unit,
            smallestUnit: unit,
            roundingMode: 'trunc'
          })[unit];
          assertEqual(Math.trunc(result), rounded, 'total() should agree with round()');
        } catch (e) {
          console.log('\n', str, unit, e);
        }
      }
    }
  });

  return total;
});
