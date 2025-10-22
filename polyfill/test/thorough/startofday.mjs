import { getProgressBar, makeZonedCases, time, withSnapshotsFromFile } from './support.mjs';

const interestingCases = makeZonedCases().filter(
  ([datetime]) =>
    // Filter out cases where startOfDay() will be out of representable range
    !(datetime.epochNanoseconds === -86400_0000_0000_000_000_000n && datetime.offsetNanoseconds !== 0)
);
const total = interestingCases.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./startofday.snapshot.json', (matchSnapshot) => {
    for (const [datetime, str] of interestingCases) {
      progress.tick(1, { test: str });
      matchSnapshot(datetime.startOfDay().toString(), str);
    }
  });

  return total;
});
