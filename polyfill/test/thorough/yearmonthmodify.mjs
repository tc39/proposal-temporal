import {
  assertTemporalEqual,
  getProgressBar,
  makeYearMonthCases,
  makeYearMonthPropertyBags,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingYearMonths = makeYearMonthCases();
const interestingPropertyBags = makeYearMonthPropertyBags();
const total = interestingYearMonths.length * interestingPropertyBags.length;
const reject = { overflow: 'reject' };

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./yearmonthmodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [ym, ymStr] of interestingYearMonths) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${ymStr}/${bagStr}`;
        progress.tick(1, { test: testName });

        const rejectResult = matchSnapshotOrOutOfRange(() => ym.with(bag, reject), testName);
        if (rejectResult) {
          // if 'reject' didn't throw, 'constrain' should produce the same result
          assertTemporalEqual(ym.with(bag), rejectResult);
        } else {
          matchSnapshotOrOutOfRange(() => ym.with(bag), testName + 'c');
        }
      }
    }
  });

  return total;
});
