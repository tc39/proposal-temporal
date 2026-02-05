import {
  assertTemporalEqual,
  getProgressBar,
  makeDateTimeCases,
  makeDateTimePropertyBags,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingDateTimes = makeDateTimeCases();
const interestingPropertyBags = makeDateTimePropertyBags();
const total = interestingDateTimes.length * interestingPropertyBags.length;
const reject = { overflow: 'reject' };

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./datetimemodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [dt, dtStr] of interestingDateTimes) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${dtStr}/${bagStr}`;
        progress.tick(1, { test: testName.slice(0, 40) });

        const rejectResult = matchSnapshotOrOutOfRange(() => dt.with(bag, reject), testName);
        if (rejectResult) {
          // if 'reject' didn't throw, 'constrain' should produce the same result
          assertTemporalEqual(dt.with(bag), rejectResult);
        } else {
          matchSnapshotOrOutOfRange(() => dt.with(bag), testName + 'c');
        }
      }
    }
  });

  return total;
});
