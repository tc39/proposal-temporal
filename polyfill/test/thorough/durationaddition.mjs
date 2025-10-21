import { assertDurationsEqual, getProgressBar, makeDurationCases, time, withSnapshotsFromFile } from './support.mjs';

const interestingCases = makeDurationCases().filter(
  // Only days and smaller
  ([d]) => !d.blank && d.years === 0 && d.months === 0 && d.weeks === 0
);
const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [d1, str1] of interestingCases) {
      for (const [d2, str2] of interestingCases) {
        const testName = `${str1}+${str2}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const added = matchSnapshotOrOutOfRange(() => d1.add(d2), testName);
        if (added) {
          assertDurationsEqual(d1.subtract(d2.negated()), added, `${str1} - -${str2} = ${added}`);
        }

        const subtracted = matchSnapshotOrOutOfRange(() => d1.subtract(d2), `${str1}-${str2}`);
        if (subtracted) {
          assertDurationsEqual(d1.add(d2.negated()), subtracted, `${str1} + -${str2} = ${subtracted}`);
        }
      }
    }
  });

  return total;
});
