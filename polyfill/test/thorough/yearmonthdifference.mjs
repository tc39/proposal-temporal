import {
  assertDurationsEqual,
  assertTemporalEqual,
  createYearMonthSkippingInvalidCombinations,
  getProgressBar,
  interestingYears,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const largestUnits = ['years', 'months'];

const interestingCases = [];
for (const year of interestingYears) {
  for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const ym = createYearMonthSkippingInvalidCombinations(year, month);
    if (!ym) continue;

    // Pre-compute toString so it's not done repeatedly in each test
    interestingCases.push([ym, ym.toString()]);
  }
}

const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./yearmonthdifference.snapshot.json', (matchSnapshot) => {
    for (const [one, str1] of interestingCases) {
      for (const [two, str2] of interestingCases) {
        if (T.PlainYearMonth.compare(one, two) === 1) continue;

        const testName = `${str1} : ${str2}`;
        progress.tick(1, { test: testName });

        for (const largestUnit of largestUnits) {
          const dif = one.until(two, { largestUnit });
          const sDif = dif.toString();
          matchSnapshot(sDif, `${testName} ${largestUnit}`);

          // Month-aware arithmetic behavior varies based on the starting point,
          // but in the ISO calendar until() and since() should still agree since
          // there are no leap months.
          assertDurationsEqual(two.since(one, { largestUnit }), dif, 'until() and since() agree');
          assertDurationsEqual(one.since(two, { largestUnit }), dif.negated(), 'since() is reversible');
          assertDurationsEqual(two.until(one, { largestUnit }), dif.negated(), 'until() is reversible');

          assertTemporalEqual(one.add(dif), two, `${str1} + ${sDif} = ${str2}`);
          assertTemporalEqual(one.subtract(dif.negated()), two, `${str1} - -(${sDif}) = ${str2}`);

          // Can't subtract from +275760-09 because the starting point is
          // +275760-09-30, which is out of range
          if (two.year === 275760 && two.month === 9) continue;
          assertTemporalEqual(two.subtract(dif), one, `${str2} - ${sDif} = ${str1}`);
          assertTemporalEqual(two.add(dif.negated()), one, `${str2} + -(${sDif}) = ${str1}`);
        }
      }
    }
  });

  return total;
});
