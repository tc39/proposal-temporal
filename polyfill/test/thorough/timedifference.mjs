import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  makeTimeCases,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const largestUnits = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];

const interestingCases = makeTimeCases();
const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./timedifference.snapshot.json', (matchSnapshot) => {
    for (const [one, str1] of interestingCases) {
      for (const [two, str2] of interestingCases) {
        if (T.PlainTime.compare(one, two) === 1) continue;

        const testName = `${str1} : ${str2}`;
        progress.tick(1, { test: testName });

        for (const largestUnit of largestUnits) {
          const dif = two.since(one, { largestUnit });
          const sDif = dif.toString();
          matchSnapshot(sDif, `${testName} ${largestUnit}`);

          assertTemporalEqual(two.subtract(dif), one, `${str2} - ${sDif} = ${str1}`);
          assertTemporalEqual(two.add(dif.negated()), one, `${str2} + -(${sDif}) = ${str1}`);

          assertDurationsEqual(one.until(two, { largestUnit }), dif, 'until() and since() agree');

          assertTemporalEqual(one.subtract(dif.negated()), two, `${str1} - -(${sDif}) = ${str2}`);
          assertTemporalEqual(one.add(dif), two, `${str1} + ${sDif} => ${str2}`);

          assertDurationsEqual(one.since(two, { largestUnit }), dif.negated(), 'swapping arg and receiver of since()');
          assertDurationsEqual(two.until(one, { largestUnit }), dif.negated(), 'swapping arg and receiver of until()');
        }
      }
    }
  });

  return total;
});
