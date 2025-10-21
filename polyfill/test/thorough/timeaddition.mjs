import {
  assertTemporalEqual,
  getProgressBar,
  makeDurationCases,
  makeTimeCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingTimes = makeTimeCases();
const interestingDurations = makeDurationCases();
const total = interestingTimes.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./timeaddition.snapshot.json', (matchSnapshot) => {
    for (const [time, timeStr] of interestingTimes) {
      for (const [duration, durationStr] of interestingDurations) {
        const testName = `${timeStr}+${durationStr}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const later = time.add(duration);
        const laterStr = later.toString();
        matchSnapshot(laterStr, testName);
        assertTemporalEqual(time.subtract(duration.negated()), later, `${timeStr} - -${durationStr} = ${laterStr}`);

        const earlier = time.subtract(duration);
        const earlierStr = earlier.toString();
        matchSnapshot(earlierStr, `${timeStr}-${durationStr}`);
        assertTemporalEqual(time.add(duration.negated()), earlier, `${timeStr} + -${durationStr} = ${earlierStr}`);
      }
    }
  });

  return total;
});
