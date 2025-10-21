import {
  assertTemporalEqual,
  getProgressBar,
  makeDateTimeCases,
  makeDurationCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingDateTimeCases = makeDateTimeCases();
const interestingDurations = makeDurationCases();
const total = interestingDateTimeCases.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./datetimeaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [datetime, datetimeStr] of interestingDateTimeCases) {
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
