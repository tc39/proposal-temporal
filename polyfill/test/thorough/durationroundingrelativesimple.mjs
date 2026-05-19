import {
  abbrevs,
  durationUnits,
  getProgressBar,
  isCalendarUnit,
  largerOfTwoDurationUnits,
  largestUnitPresent,
  makeDurationCasesAbbreviated,
  roundingGranularities,
  sensibleRoundingModes,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

function smallestUnitPresent(duration) {
  for (const unit of durationUnits.toReversed()) {
    if (duration[unit] !== 0) return unit;
  }
  return 'none';
}

const boringPlainRelativeTo = new T.PlainDateTime(1970, 1, 1);
const boringZonedRelativeTo = new T.ZonedDateTime(0n, 'UTC');

const positiveCases = makeDurationCasesAbbreviated().filter(([duration]) => {
  // Filter out time-only durations, and durations that are too big to add to
  // any relativeTo. Time-only durations aren't affected by relativeTo.
  try {
    duration.total({ unit: 'days', relativeTo: boringPlainRelativeTo });
  } catch (e) {
    if (e instanceof RangeError) return false;
    throw e;
  }
  const largest = largestUnitPresent(duration);
  return isCalendarUnit(largest) || largest === 'days';
});
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
const total = (interestingCases.length * durationUnits.length * (durationUnits.length + 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationroundingrelativesimple.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [duration, str] of interestingCases) {
      const largest = largestUnitPresent(duration);
      const smallest = smallestUnitPresent(duration);
      const isCalendarDuration = isCalendarUnit(largest);

      for (let [smallestUnit, increments] of Object.entries(roundingGranularities)) {
        const willRound = largerOfTwoDurationUnits(smallest, smallestUnit) !== smallest;

        for (const largestUnit of durationUnits) {
          // Skip invalid combinations of largest/smallestUnit (already
          // accounted for in triangular-number calculation of total)
          if (largerOfTwoDurationUnits(largestUnit, smallestUnit) !== largestUnit) continue;

          progress.tick(1, { test: `${str} ${smallestUnit}-${largestUnit}`.slice(0, 45) });

          // Don't bother testing increments when there won't be rounding. Also,
          // increments are not allowed when largestUnit ≠ smallestUnit and both
          // are calendar units
          let shouldTestIncrements = willRound;
          if (largestUnit !== smallestUnit && (isCalendarUnit(smallestUnit) || smallestUnit === 'days')) {
            shouldTestIncrements = false;
          }

          for (const roundingIncrement of shouldTestIncrements ? increments : [1]) {
            const testName = `${str} ${roundingIncrement} ${abbrevs[smallestUnit]}-${abbrevs[largestUnit]}`;

            for (const roundingMode of sensibleRoundingModes(
              duration,
              str,
              smallestUnit,
              roundingIncrement,
              boringZonedRelativeTo
            )) {
              matchSnapshotOrOutOfRange(
                () =>
                  duration.round({
                    largestUnit,
                    smallestUnit,
                    roundingIncrement,
                    roundingMode,
                    relativeTo: boringZonedRelativeTo
                  }),
                `${testName} ${abbrevs[roundingMode]} rz`
              );
            }

            // PlainDate relativeTo: only test calendar durations, because
            // durations of days or lesser untis aren't affected by a plain
            // relativeTo
            if (!isCalendarDuration) continue;

            for (const roundingMode of sensibleRoundingModes(
              duration,
              str,
              smallestUnit,
              roundingIncrement,
              boringPlainRelativeTo
            )) {
              matchSnapshotOrOutOfRange(
                () =>
                  duration.round({
                    largestUnit,
                    smallestUnit,
                    roundingIncrement,
                    roundingMode,
                    relativeTo: boringPlainRelativeTo
                  }),
                `${testName} ${abbrevs[roundingMode]} rp`
              );
            }
          }
        }
      }
    }
  });

  return total;
});
