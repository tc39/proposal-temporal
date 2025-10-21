import { getProgressBar, makeTimeCases, roundingModes, time, withSnapshotsFromFile } from './support.mjs';

const roundingGranularities = {
  hour: [1, 2, 3, 4, 6, 8, 12],
  minute: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  second: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  millisecond: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  microsecond: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  nanosecond: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500]
};
const totalGranularities = Object.entries(roundingGranularities).reduce(
  (sum, [, granularities]) => sum + granularities.length,
  0
);

const interestingCases = makeTimeCases();
const total = interestingCases.length * totalGranularities;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./timerounding.snapshot.json', (matchSnapshot) => {
    for (const [time, str] of interestingCases) {
      for (const [smallestUnit, increments] of Object.entries(roundingGranularities)) {
        for (const roundingIncrement of increments) {
          for (const roundingMode of roundingModes) {
            const testName = `${str} ${roundingIncrement} ${smallestUnit}`;
            progress.tick(1, { test: testName });

            const result = time.round({ smallestUnit, roundingIncrement, roundingMode });
            matchSnapshot(result.toString(), `${testName} ${roundingMode}`);
          }
        }
      }
    }
  });

  return total;
});
