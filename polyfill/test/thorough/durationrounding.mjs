import {
  assertDurationsEqual,
  durationUnits,
  getProgressBar,
  isCalendarUnit,
  largerOfTwoDurationUnits,
  largestUnitPresent,
  makeDurationCases,
  sensibleRoundingModes,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const roundingGranularities = {
  days: [1, 2, 10, 1e7, 1e8 - 1, 1e9],
  hours: [1, 2, 3, 4, 6, 8, 12],
  minutes: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  seconds: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  milliseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  microseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  nanoseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500]
};
const largestUnits = durationUnits.slice(3);

const positiveCases = makeDurationCases().filter(([d]) => !isCalendarUnit(largestUnitPresent(d)));
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
const boringRelativeTo = [
  [new T.PlainDate(1970, 1, 1), 'PlainDate'],
  [new T.ZonedDateTime(0n, 'UTC'), 'ZonedDateTime']
];
const total = interestingCases.length * largestUnits.length ** 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationrounding.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [duration, str] of interestingCases) {
      for (let [smallestUnit, increments] of Object.entries(roundingGranularities)) {
        for (const largestUnit of largestUnits) {
          progress.tick(1, { test: `${str} ${smallestUnit}-${largestUnit}`.slice(0, 45) });
          // Skip invalid combinations of largest/smallestUnit
          if (largerOfTwoDurationUnits(largestUnit, smallestUnit) !== largestUnit) continue;

          for (const roundingIncrement of increments) {
            const roundingModes = sensibleRoundingModes(duration, str, smallestUnit, roundingIncrement);
            for (const roundingMode of roundingModes) {
              const testName = `${str} ${roundingIncrement} ${smallestUnit}-${largestUnit} ${roundingMode}`;
              const result = matchSnapshotOrOutOfRange(
                () => duration.round({ largestUnit, smallestUnit, roundingIncrement, roundingMode }),
                testName
              );

              if (
                !result ||
                Math.abs(duration.total('days')) > 1e8 ||
                Math.abs(result.total('days')) > 1e8 ||
                (smallestUnit === 'days' && roundingIncrement > 1e8) ||
                roundingMode === 'halfEven' // invariant doesn't hold with halfEven
              ) {
                continue;
              }

              for (const [relativeTo, relativeStr] of boringRelativeTo) {
                const resultWithRelativeTo = duration.round({
                  largestUnit,
                  smallestUnit,
                  roundingIncrement,
                  roundingMode,
                  relativeTo
                });
                assertDurationsEqual(
                  resultWithRelativeTo,
                  result,
                  `${testName} same as with ${relativeStr} relativeTo`
                );
              }
            }
          }
        }
      }
    }
  });

  return total;
});
