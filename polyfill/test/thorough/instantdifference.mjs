import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  interestingEpochNs,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const largestUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];

const interestingCases = [];
for (const epochNs of interestingEpochNs) {
  const instant = new T.Instant(epochNs);
  // Pre-compute toString so it's not done repeatedly in each test
  interestingCases.push([instant, instant.toString()]);
}

const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./instantdifference.snapshot.json', (matchSnapshot) => {
    for (const [one, str1] of interestingCases) {
      for (const [two, str2] of interestingCases) {
        if (T.Instant.compare(one, two) === 1) continue;

        const testName = `${str1} : ${str2}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        for (const largestUnit of largestUnits) {
          const dif = one.until(two, { largestUnit });
          const sDif = dif.toString();
          matchSnapshot(sDif, `${testName} ${largestUnit}`);

          assertDurationsEqual(two.since(one, { largestUnit }), dif, 'until() and since() agree');
          assertDurationsEqual(one.since(two, { largestUnit }), dif.negated(), 'since() is reversible');
          assertDurationsEqual(two.until(one, { largestUnit }), dif.negated(), 'until() is reversible');

          // If the duration lost floating-point precision, the reversibility
          // may not hold.
          if (
            !Number.isSafeInteger(dif.milliseconds) ||
            !Number.isSafeInteger(dif.microseconds) ||
            !Number.isSafeInteger(dif.nanoseconds)
          ) {
            continue;
          }

          assertTemporalEqual(one.add(dif), two, `${str1} + ${sDif} = ${str2}`);
          assertTemporalEqual(one.subtract(dif.negated()), two, `${str1} - -(${sDif}) = ${str2}`);

          assertTemporalEqual(two.subtract(dif), one, `${str2} - ${sDif} = ${str1}`);
          assertTemporalEqual(two.add(dif.negated()), one, `${str2} + -(${sDif}) = ${str1}`);
        }
      }
    }
  });

  return total;
});
