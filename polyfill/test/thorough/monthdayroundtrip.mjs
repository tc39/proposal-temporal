import { assertTemporalEqual, getProgressBar, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject' };
const daysInMonth = [undefined, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const interestingMonthDays = [];
for (let month = 1; month < 13; month++) {
  for (let day = 1; day < daysInMonth[month] + 1; day++) {
    const md = T.PlainMonthDay.from({ year: 1972, month, day });
    interestingMonthDays.push([md, md.toString()]);
  }
}
const total = interestingMonthDays.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [md, mdStr] of interestingMonthDays) {
    progress.tick(1, { test: mdStr });

    const { monthCode, day } = md;
    const year = 1972;
    const month = +monthCode.slice(1);

    const propertyBagYearMonth = { year, month, day };
    assertTemporalEqual(T.PlainMonthDay.from(propertyBagYearMonth, opts), md, 'from property bag with year and month');

    const propertyBagMonthCode = { monthCode, day };
    assertTemporalEqual(T.PlainMonthDay.from(propertyBagMonthCode, opts), md, 'from property bag with monthCode');

    const propertyBagYearMonthCode = { year, monthCode, day };
    assertTemporalEqual(
      T.PlainMonthDay.from(propertyBagYearMonthCode, opts),
      md,
      'from property bag with year and monthCode'
    );

    const propertyBagAll = { year, month, monthCode, day };
    assertTemporalEqual(T.PlainMonthDay.from(propertyBagAll, opts), md, 'from property bag with month and monthCode');

    assertTemporalEqual(T.PlainMonthDay.from(mdStr), md, 'from ISO string');

    const stringCalendar = md.toString({ calendarName: 'always' });
    assertTemporalEqual(T.PlainMonthDay.from(stringCalendar), md, 'from ISO string with calendar');

    const stringTime = md.toPlainDate({ year: 1972 }).toPlainDateTime({ hour: 12 }).toString();
    assertTemporalEqual(T.PlainMonthDay.from(stringTime), md, 'from ISO string with time');

    const monPart = monthCode.slice(1);
    const dPart = String(day).padStart(2, '0');
    const weirdString = `+222220${monPart}${dPart} 123456,7+1234`;
    assertTemporalEqual(T.PlainMonthDay.from(weirdString), md, 'from ISO string with weird but allowed formatting');

    const dashString = `--${monPart}-${dPart}`;
    assertTemporalEqual(T.PlainMonthDay.from(dashString), md, 'from ISO string with leading double dash');
  }

  return total;
});
