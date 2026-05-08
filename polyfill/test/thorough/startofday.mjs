import {
  assertEqual,
  assertTemporalEqual,
  getProgressBar,
  makeZonedCases,
  roundingModes,
  time,
  withSnapshotsFromFile
} from './support.mjs';

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
      const startToday = datetime.startOfDay();
      matchSnapshot(startToday.toString(), str);

      // Can't get tomorrow's startOfDay() if this is the last representable day
      if (datetime.epochMilliseconds > 86400_0000_0000 - 86400) continue;

      const hoursInDay = datetime.hoursInDay;
      matchSnapshot(hoursInDay, str + 'h');

      // Invariant: startOfDay + hoursInDay = following day's startOfDay
      const startTomorrow = datetime.add({ days: 1 }).startOfDay();
      assertTemporalEqual(
        startToday.add({ seconds: hoursInDay * 3600 }),
        startTomorrow,
        `${startToday} + ${hoursInDay}h = ${startTomorrow}`
      );

      // Invariant: round({ smallestUnit: 'day' }) is start of today or tomorrow
      for (const roundingMode of roundingModes) {
        const rounded = datetime.round({ smallestUnit: 'day', roundingMode });
        assertEqual(
          rounded.equals(startToday) || rounded.equals(startTomorrow),
          true,
          `${rounded} = ${startToday} or ${startTomorrow}`
        );
      }
    }
  });

  return total;
});
