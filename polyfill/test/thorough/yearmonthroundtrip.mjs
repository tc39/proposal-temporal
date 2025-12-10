import { assertTemporalEqual, getProgressBar, makeYearMonthCases, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject' };
const interestingYearMonths = makeYearMonthCases();
const total = interestingYearMonths.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [ym, ymStr] of interestingYearMonths) {
    progress.tick(1, { test: ymStr });

    const { year, month, monthCode } = ym;

    const propertyBagMonth = { year, month };
    assertTemporalEqual(T.PlainYearMonth.from(propertyBagMonth, opts), ym, 'from property bag with month');

    const propertyBagMonthCode = { year, monthCode };
    assertTemporalEqual(T.PlainYearMonth.from(propertyBagMonthCode, opts), ym, 'from property bag with monthCode');

    const propertyBagAll = { year, month, monthCode };
    assertTemporalEqual(T.PlainYearMonth.from(propertyBagAll, opts), ym, 'from property bag with month and monthCode');

    assertTemporalEqual(T.PlainYearMonth.from(ymStr), ym, 'from ISO string');

    const stringCalendar = ym.toString({ calendarName: 'always' });
    assertTemporalEqual(T.PlainYearMonth.from(stringCalendar), ym, 'from ISO string with calendar');

    const stringTime = ym.toPlainDate({ day: 2 }).toPlainDateTime({ hour: 12 }).toString();
    assertTemporalEqual(T.PlainYearMonth.from(stringTime), ym, 'from ISO string with day and time');

    const yPart = `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
    const monPart = String(month).padStart(2, '0');
    const weirdString = `${yPart}${monPart}14 123456,7+1234`;
    assertTemporalEqual(T.PlainYearMonth.from(weirdString), ym, 'from ISO string with weird but allowed formatting');
  }

  return total;
});
