import { getProgressBar, makeTimeCases, makeTimePropertyBags, time, withSnapshotsFromFile } from './support.mjs';

const interestingTimes = makeTimeCases();
const interestingPropertyBags = makeTimePropertyBags();
const total = interestingTimes.length * interestingPropertyBags.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./timemodify.snapshot.json', (matchSnapshot) => {
    for (const [time, timeStr] of interestingTimes) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${timeStr}/${bagStr}`;
        progress.tick(1, { test: testName });
        matchSnapshot(time.with(bag).toString(), testName);
        // overflow only has an effect on out-of-range input such as minute: 61,
        // which we are not testing here
      }
    }
  });

  return total;
});
