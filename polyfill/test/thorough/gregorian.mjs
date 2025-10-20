import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  makeDateCases,
  temporalImpl as T,
  time
} from './support.mjs';

const largestUnits = [
  { largestUnit: 'years' },
  { largestUnit: 'months' },
  { largestUnit: 'weeks' },
  { largestUnit: 'days' }
];

const interestingCases = makeDateCases().map(([date, str]) => [date, date.withCalendar('gregory'), str]);
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
