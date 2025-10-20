import {
  assertTemporalEqual,
  getProgressBar,
  makeDateCases,
  makeDurationCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingDates = makeDateCases();
const interestingDurations = makeDurationCases();
const total = interestingDates.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./dateaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [date, dateStr] of interestingDates) {
      for (const [duration, durationStr] of interestingDurations) {
        const testName = `${dateStr}+${durationStr}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const later = matchSnapshotOrOutOfRange(() => date.add(duration), testName);
        if (later) {
          assertTemporalEqual(date.subtract(duration.negated()), later, `${dateStr} - -${durationStr} = ${later}`);
        }

        const earlier = matchSnapshotOrOutOfRange(() => date.subtract(duration), `${dateStr}-${durationStr}`);
        if (earlier) {
          assertTemporalEqual(date.add(duration.negated()), earlier, `${dateStr} + -${durationStr} = ${earlier}`);
        }
      }
    }
  });

  return total;
});
