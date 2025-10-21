import {
  assertDurationsEqual,
  getProgressBar,
  isCalendarUnit,
  // largerOfTwoDurationUnits,
  makeDateCases,
  makeDurationCasesAbbreviated,
  makeZonedCases,
  roundingModes,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

// TODO: shrink the testing space. all largestUnits with all smallestUnits is
// too much and will OOM.
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
  nanoseconds: [1, 2]
};
// const largestUnits = [
//   undefined,
//   'years',
//   'months',
//   'weeks',
//   'days',
//   'hours',
//   'minutes',
//   'seconds',
//   'milliseconds',
//   'microseconds',
//   'nanoseconds'
// ];
const largestUnit = undefined;

const positiveCases = makeDurationCasesAbbreviated();
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
// TODO: abbreviating the list of relativeTo in order to shrink the testing space
const interestingRelativeTo = makeDateCases().slice(0, 10).concat(makeZonedCases().slice(0, 10));
const total = interestingCases.length * Object.keys(roundingGranularities).length; // * largestUnits.length

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationrounding.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [duration, str] of interestingCases) {
      const isCalendarDuration = duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0;
      const wouldOverflowWithRelativeTo = isCalendarDuration
        ? false
        : Math.abs(duration.total('seconds')) > Number.MAX_SAFE_INTEGER;

      // for (const largestUnit of largestUnits) {
      for (let [smallestUnit, increments] of Object.entries(roundingGranularities)) {
        const testName = `${str} ${largestUnit}-${smallestUnit}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        // invalid combination
        // if (largerOfTwoDurationUnits(largestUnit, smallestUnit) !== largestUnit) continue;

        // increments not allowed when largestUnit ≠ smallestUnit and both are
        // calendar units
        // if (isCalendarUnit(smallestUnit) && largestUnit !== smallestUnit) increments = [1];

        if (!wouldOverflowWithRelativeTo) {
          for (const roundingIncrement of increments) {
            for (const roundingMode of roundingModes) {
              for (const [relativeTo, relativeStr] of interestingRelativeTo) {
                let result;
                try {
                  result = matchSnapshotOrOutOfRange(
                    () => duration.round({ largestUnit, smallestUnit, roundingIncrement, roundingMode, relativeTo }),
                    `${testName} ${roundingIncrement} ${roundingMode} ${relativeStr}`
                  );
                } catch (e) {
                  console.log(
                    '\n',
                    str,
                    largestUnit,
                    smallestUnit,
                    roundingIncrement,
                    roundingMode,
                    relativeStr,
                    e.name,
                    e.message
                  );
                }
                if (result && relativeStr !== '-271821-04-19' && largestUnit !== undefined) {
                  const r = relativeTo instanceof T.PlainDate ? relativeTo.toPlainDateTime() : relativeTo;
                  const resultWithUntil = r.until(r.add(duration), {
                    largestUnit,
                    smallestUnit,
                    roundingIncrement,
                    roundingMode
                  });
                  try {
                    assertDurationsEqual(
                      resultWithUntil,
                      result,
                      'd.round(relativeTo) should agree with relativeTo.until(d.add(relativeTo))'
                    );
                  } catch (e) {
                    console.log(
                      '\n',
                      str,
                      largestUnit,
                      smallestUnit,
                      roundingIncrement,
                      roundingMode,
                      relativeStr,
                      e.message
                    );
                  }
                }
              }
            }
          }
        }

        // Skip if testing without relativeTo would be invalid
        if (isCalendarUnit(smallestUnit) || isCalendarUnit(largestUnit) || isCalendarDuration) continue;

        for (const roundingIncrement of increments) {
          for (const roundingMode of roundingModes) {
            matchSnapshotOrOutOfRange(
              () => duration.round({ largestUnit, smallestUnit, roundingIncrement, roundingMode }),
              `${testName} ${roundingIncrement} ${roundingMode}`
            );
          }
        }
      }
      // }
    }
  });

  return total;
});
