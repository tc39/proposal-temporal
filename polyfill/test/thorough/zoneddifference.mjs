import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  makeZonedCases,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const dateLargestUnits = ['years', 'months', 'weeks', 'days'];
const timeLargestUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];

const interestingCases = makeZonedCases();
const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./zoneddifference.snapshot.json', (matchSnapshot) => {
    for (const [one, str1] of interestingCases) {
      const tz1 = one.timeZoneId;
      for (const [two, str2] of interestingCases) {
        if (T.ZonedDateTime.compare(one, two) === 1) continue;

        const testName = `${str1} : ${str2}`;
        progress.tick(1, { test: testName.slice(0, 45) });
        const tz2 = two.timeZoneId;

        // Date arithmetic can only be done between ZDTs with the same time zone
        if (tz1 === tz2) {
          for (const largestUnit of dateLargestUnits) {
            const dif1 = one.until(two, { largestUnit });
            const sDif1 = dif1.toString();
            matchSnapshot(sDif1, `${testName} ${largestUnit} until`);

            const dif3 = one.since(two, { largestUnit });
            assertDurationsEqual(dif3, dif1.negated(), 'swapping arg and receiver of since() gives -until()');

            assertTemporalEqual(one.add(dif1), two, `${str1} + ${sDif1} = ${str2}`);
            assertTemporalEqual(one.subtract(dif3), two, `${str1} - -(${sDif1}) = ${str2}`);

            const dif2 = two.since(one, { largestUnit });
            const sDif2 = dif2.toString();

            // For zoned arithmetic, `until` and `since` may not even agree for
            // any largestUnit, because length of a day may vary if the starting
            // point is on a transition day.
            matchSnapshot(sDif2, `${testName} ${largestUnit} since`);

            const dif4 = two.until(one, { largestUnit });
            assertDurationsEqual(dif4, dif2.negated(), 'swapping arg and receiver of until() gives -since()');

            assertTemporalEqual(two.subtract(dif2), one, `${str2} - ${sDif2} = ${str1}`);
            assertTemporalEqual(two.add(dif4), one, `${str2} + -(${sDif2}) = ${str1}`);
          }
        }
        for (const largestUnit of timeLargestUnits) {
          const dif = one.until(two, { largestUnit });
          const sDif = dif.toString();
          matchSnapshot(sDif, `${testName} ${largestUnit} until`);

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

          assertTemporalEqual(one.add(dif), two.withTimeZone(tz1), `${str1} + ${sDif} = ${str2}`);
          assertTemporalEqual(one.subtract(dif.negated()), two.withTimeZone(tz1), `${str1} - -(${sDif}) = ${str2}`);

          assertTemporalEqual(two.subtract(dif), one.withTimeZone(tz2), `${str2} - ${sDif} = ${str1}`);
          assertTemporalEqual(two.add(dif.negated()), one.withTimeZone(tz2), `${str2} + -(${sDif}) = ${str1}`);
        }
      }
    }
  });

  return total;
});
