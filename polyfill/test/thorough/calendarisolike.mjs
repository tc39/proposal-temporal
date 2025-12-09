import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  makeDateCases,
  temporalImpl as T,
  time
} from './support.mjs';

const largestUnits = [{ largestUnit: 'years' }, { largestUnit: 'months' }];
const calendars = ['buddhist', 'gregory', 'japanese', 'roc'];

const interestingCases = makeDateCases();
const total = calendars.length * ((interestingCases.length * (interestingCases.length - 1)) / 2);

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const calendar of calendars) {
    for (const [oneISO, str1] of interestingCases) {
      const one = oneISO.withCalendar(calendar);
      for (const [twoISO, str2] of interestingCases) {
        if (T.PlainDate.compare(oneISO, twoISO) === 1) continue;
        progress.tick(1, { test: `${calendar} ${str1} : ${str2}` });
        const two = twoISO.withCalendar(calendar);
        for (const opts of largestUnits) {
          const dif1 = oneISO.until(twoISO, opts);
          const dif2 = twoISO.since(oneISO, opts);
          assertDurationsEqual(one.until(two, opts), dif1, `${str1} until ${str2} ${opts.largestUnit}`);
          assertDurationsEqual(one.since(two, opts), dif1.negated(), `${str1} since ${str2} ${opts.largestUnit}`);
          assertDurationsEqual(two.until(one, opts), dif2.negated(), `${str2} until ${str1} ${opts.largestUnit}`);
          assertDurationsEqual(two.since(one, opts), dif2, `${str2} since ${str1} ${opts.largestUnit}`);
          assertTemporalEqual(one.add(dif1), two, `${str1} + ${dif1} = ${str2}`);
          assertTemporalEqual(one.subtract(dif1.negated()), two, `${str1} - -${dif1} = ${str2}`);
          assertTemporalEqual(two.add(dif2.negated()), one, `${str2} + -${dif2} = ${str1}`);
          assertTemporalEqual(two.subtract(dif2), one, `${str2} - ${dif2} = ${str1}`);
        }
      }
    }
  }

  return total;
});
