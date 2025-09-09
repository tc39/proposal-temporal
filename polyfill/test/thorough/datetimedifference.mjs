import {
  assertDurationsEqual,
  assertTemporalEqual,
  createDateSkippingInvalidCombinations,
  getProgressBar,
  interestingDateTimes,
  interestingMonthDays,
  interestingTimes,
  interestingYears,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

// With months and years, the reversibility only holds with overflow constrain,
// because adding 1 month or 1 year may land on leap day.
const constrain = { overflow: 'constrain' };
const reject = { overflow: 'reject' };
const largestUnits = [
  ['years', constrain],
  ['months', constrain],
  ['weeks', reject],
  ['days', reject],
  ['hours', reject],
  ['minutes', reject],
  ['seconds', reject],
  ['milliseconds', reject],
  ['microseconds', reject],
  ['nanoseconds', reject]
];

// Every interesting date with every interesting time would take hours and hours
// to run. That would be interesting too, but too long for a CI job.
let timeIndex = 0;
const interestingCases = [];
for (const year of interestingYears) {
  for (const [month, day] of interestingMonthDays) {
    const date = createDateSkippingInvalidCombinations(year, month, day);
    if (!date) continue;
    const args = interestingTimes[timeIndex];
    timeIndex++;
    timeIndex %= interestingTimes.length;
    const time = new T.PlainTime(...args);
    if (date.toString() === '-271821-04-19' && time.toString() === '00:00:00') continue;
    const datetime = date.toPlainDateTime(time);
    // Pre-compute toString so it's not done repeatedly in each test
    interestingCases.push([datetime, datetime.toString()]);
  }
}
for (const args of interestingDateTimes) {
  const datetime = new T.PlainDateTime(...args);
  interestingCases.push([datetime, datetime.toString()]);
}

const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./datetimedifference.snapshot.json', (matchSnapshot) => {
    for (const [one, str1] of interestingCases) {
      for (const [two, str2] of interestingCases) {
        if (T.PlainDateTime.compare(one, two) === 1) continue;

        const testName = `${str1} : ${str2}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        for (const [largestUnit, opt] of largestUnits) {
          const dif1 = one.until(two, { largestUnit });
          const sDif1 = dif1.toString();
          matchSnapshot(sDif1, `${testName} ${largestUnit} until`);

          const dif2 = two.since(one, { largestUnit });
          const sDif2 = dif2.toString();
          // For months and years, `until` and `since` won't agree because the
          // starting point is always `this` and month-aware arithmetic behavior
          // varies based on the starting point.
          if (largestUnit === 'years' || largestUnit === 'months') {
            // If it isn't equal to dif1, it should be snapshotted
            matchSnapshot(sDif2, `${testName} ${largestUnit} since`);
          } else {
            assertDurationsEqual(dif2, dif1, 'until() and since() agree');
          }

          const dif3 = one.since(two, { largestUnit });
          assertDurationsEqual(dif3, dif1.negated(), 'swapping arg and receiver of since() gives -until()');

          const dif4 = two.until(one, { largestUnit });
          assertDurationsEqual(dif4, dif2.negated(), 'swapping arg and receiver of until() gives -since()');

          // If the duration lost floating-point precision, the reversibility
          // may not hold.
          if (
            !Number.isSafeInteger(dif1.milliseconds) ||
            !Number.isSafeInteger(dif1.microseconds) ||
            !Number.isSafeInteger(dif1.nanoseconds)
          ) {
            continue;
          }

          assertTemporalEqual(one.add(dif1, opt), two, `${str1} + ${sDif1} = ${str2}`);
          assertTemporalEqual(one.subtract(dif1.negated(), opt), two, `${str1} - -(${sDif1}) = ${str2}`);

          assertTemporalEqual(two.subtract(dif2, opt), one, `${str2} - ${sDif2} = ${str1}`);
          assertTemporalEqual(two.add(dif2.negated(), opt), one, `${str2} + -(${sDif2}) = ${str1}`);
        }
      }
    }
  });

  return total;
});
