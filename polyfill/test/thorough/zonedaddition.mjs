import {
  assertTemporalEqual,
  getProgressBar,
  makeDurationCases,
  makeZonedCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingZonedCases = makeZonedCases();
const interestingDurations = makeDurationCases();
const total = interestingZonedCases.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./zonedaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [datetime, datetimeStr] of interestingZonedCases) {
      for (const [duration, durationStr] of interestingDurations) {
        const testName = `${datetimeStr}+${durationStr}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const later = matchSnapshotOrOutOfRange(() => datetime.add(duration), testName);
        if (later) {
          assertTemporalEqual(
            datetime.subtract(duration.negated()),
            later,
            `${datetimeStr} - -${durationStr} = ${later}`
          );
        }

        const earlier = matchSnapshotOrOutOfRange(() => datetime.subtract(duration), `${datetimeStr}-${durationStr}`);
        if (earlier) {
          assertTemporalEqual(
            datetime.add(duration.negated()),
            earlier,
            `${datetimeStr} + -${durationStr} = ${earlier}`
          );
        }
      }
    }
  });

  return total;
});
