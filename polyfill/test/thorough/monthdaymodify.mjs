import {
  assertTemporalEqual,
  getProgressBar,
  makeDatePropertyBags,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingMonthDays = [];
for (let month = 1; month < 13; month++) {
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  for (let day = 1; day <= daysInMonth; day++) {
    const monthCode = 'M' + String(month).padStart(2, '0');
    const md = T.PlainMonthDay.from({ monthCode, day });
    interestingMonthDays.push([md, md.toString()]);
  }
}
const interestingPropertyBags = makeDatePropertyBags();
const total = interestingMonthDays.length * interestingPropertyBags.length;
const reject = { overflow: 'reject' };

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./monthdaymodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [md, mdStr] of interestingMonthDays) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${mdStr}/${bagStr}`;
        progress.tick(1, { test: testName });

        const rejectResult = matchSnapshotOrOutOfRange(() => md.with(bag, reject), testName);
        if (rejectResult) {
          // if 'reject' didn't throw, 'constrain' should produce the same result
          assertTemporalEqual(md.with(bag), rejectResult);
        } else {
          matchSnapshotOrOutOfRange(() => md.with(bag), testName + 'c');
        }
      }
    }
  });

  return total;
});
