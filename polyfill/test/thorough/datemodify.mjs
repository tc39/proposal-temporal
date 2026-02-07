import {
  assertTemporalEqual,
  getProgressBar,
  makeDateCases,
  makeDatePropertyBags,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingDates = makeDateCases();
const interestingPropertyBags = makeDatePropertyBags();
const total = interestingDates.length * interestingPropertyBags.length;
const reject = { overflow: 'reject' };

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./datemodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [date, dateStr] of interestingDates) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${dateStr}/${bagStr}`;
        progress.tick(1, { test: testName });

        const rejectResult = matchSnapshotOrOutOfRange(() => date.with(bag, reject), testName);
        if (rejectResult) {
          // if 'reject' didn't throw, 'constrain' should produce the same result
          assertTemporalEqual(date.with(bag), rejectResult);
        } else {
          matchSnapshotOrOutOfRange(() => date.with(bag), testName + 'c');
        }
      }
    }
  });

  return total;
});
