import {
  assertTemporalEqual,
  getProgressBar,
  makeDurationCases,
  makeInstantCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingInstants = makeInstantCases();
const interestingDurations = makeDurationCases().filter(
  // Only hours and smaller
  ([d]) => !d.blank && d.years === 0 && d.months === 0 && d.weeks === 0 && d.days === 0
);
const total = interestingInstants.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./instantaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [instant, instantStr] of interestingInstants) {
      for (const [duration, durationStr] of interestingDurations) {
        const testName = `${instantStr}+${durationStr}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const later = matchSnapshotOrOutOfRange(() => instant.add(duration), testName);
        if (later) {
          assertTemporalEqual(
            instant.subtract(duration.negated()),
            later,
            `${instantStr} - -${durationStr} = ${later}`
          );
        }

        const earlier = matchSnapshotOrOutOfRange(() => instant.subtract(duration), `${instantStr}-${durationStr}`);
        if (earlier) {
          assertTemporalEqual(instant.add(duration.negated()), earlier, `${instantStr} + -${durationStr} = ${earlier}`);
        }
      }
    }
  });

  return total;
});
