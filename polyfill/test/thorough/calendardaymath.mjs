import {
  assertDurationsEqual,
  assertTemporalEqual,
  getProgressBar,
  makeDateCases,
  temporalImpl as T,
  time
} from './support.mjs';

const largestUnits = [{ largestUnit: 'weeks' }, { largestUnit: 'days' }];
// 'chinese' and 'dangi' are temporarily omitted because there are some dates
// that the current version of ICU4C can't handle well enough to calculate the
// snapshots
const calendars = [
  'buddhist',
  'coptic',
  'ethioaa',
  'ethiopic',
  'gregory',
  'hebrew',
  'indian',
  'islamic-civil',
  'islamic-tbla',
  'islamic-umalqura',
  'japanese',
  'persian',
  'roc'
];

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
          const dif = oneISO.until(twoISO, opts);
          assertDurationsEqual(twoISO.since(oneISO, opts), dif, `${str1} and ${str2} symmetric in ${opts.largestUnit}`);
          assertDurationsEqual(one.until(two, opts), dif, `${str1} until ${str2} ${opts.largestUnit}`);
          assertDurationsEqual(one.since(two, opts), dif.negated(), `${str1} since ${str2} ${opts.largestUnit}`);
          assertDurationsEqual(two.until(one, opts), dif.negated(), `${str2} until ${str1} ${opts.largestUnit}`);
          assertDurationsEqual(two.since(one, opts), dif, `${str2} since ${str1} ${opts.largestUnit}`);
          assertTemporalEqual(one.add(dif), two, `${str1} + ${dif} = ${str2}`);
          assertTemporalEqual(one.subtract(dif.negated()), two, `${str1} - -${dif} = ${str2}`);
          assertTemporalEqual(two.add(dif.negated()), one, `${str2} + -${dif} = ${str1}`);
          assertTemporalEqual(two.subtract(dif), one, `${str2} - ${dif} = ${str1}`);
        }
      }
    }
  }

  return total;
});
