import {
  assertTemporalEqual,
  getProgressBar,
  makeDurationCases,
  makeYearMonthCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const interestingYearMonths = makeYearMonthCases();
const interestingDurations = makeDurationCases().filter(
  // We don't need to test over and over that units lower than months are not
  // allowed, but years/months mixed with lower units are still interesting
  ([duration]) => duration.blank || duration.years !== 0 || duration.months !== 0
);
const total = interestingYearMonths.length * interestingDurations.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./yearmonthaddition.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [ym, ymStr] of interestingYearMonths) {
      for (const [duration, durationStr] of interestingDurations) {
        const testName = `${ymStr}+${durationStr}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        const later = matchSnapshotOrOutOfRange(() => ym.add(duration), testName);
        if (later) {
          assertTemporalEqual(ym.subtract(duration.negated()), later, `${ymStr} - -${durationStr} = ${later}`);
        }

        const earlier = matchSnapshotOrOutOfRange(() => ym.subtract(duration), `${ymStr}-${durationStr}`);
        if (earlier) {
          assertTemporalEqual(ym.add(duration.negated()), earlier, `${ymStr} + -${durationStr} = ${earlier}`);
        }
      }
    }
  });

  return total;
});
