import {
  assertDurationsEqual,
  assertTemporalEqual,
  createDateSkippingInvalidCombinations,
  getProgressBar,
  interestingMonthDays,
  interestingYears,
  temporalImpl as T,
  time
} from './support.mjs';

const largestUnits = [
  { largestUnit: 'years' },
  { largestUnit: 'months' },
  { largestUnit: 'weeks' },
  { largestUnit: 'days' }
];

const interestingCases = [];
for (const year of interestingYears) {
  for (const [month, day] of interestingMonthDays) {
    const date = createDateSkippingInvalidCombinations(year, month, day);
    if (!date) continue;

    const dateGregorian = date.withCalendar('gregory');

    // Pre-compute toString so it's not done repeatedly in each test
    interestingCases.push([date, dateGregorian, date.toString()]);
  }
}

const total = (interestingCases.length * (interestingCases.length - 1)) / 2;

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const [oneISO, one, str1] of interestingCases) {
    for (const [twoISO, two, str2] of interestingCases) {
      if (T.PlainDate.compare(oneISO, twoISO) === 1) continue;
      progress.tick(1, { test: `${str1} : ${str2}` });
      for (const opts of largestUnits) {
        const dif1 = oneISO.until(twoISO, opts);
        const dif2 = twoISO.since(oneISO, opts);
        assertDurationsEqual(one.until(two, opts), dif1);
        assertDurationsEqual(one.since(two, opts), dif1.negated());
        assertDurationsEqual(two.until(one, opts), dif2.negated());
        assertDurationsEqual(two.since(one, opts), dif2);
        assertTemporalEqual(one.add(dif1), two);
        assertTemporalEqual(one.subtract(dif1.negated()), two);
        assertTemporalEqual(two.add(dif2.negated()), one);
        assertTemporalEqual(two.subtract(dif2), one);
      }
    }
  }

  return total;
});
