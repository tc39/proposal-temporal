import { assertTemporalEqual, getProgressBar, makeDateCases, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject' };
const interestingDates = makeDateCases();
const total = interestingDates.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [date, dateStr] of interestingDates) {
    progress.tick(1, { test: dateStr });

    const { year, month, monthCode, day } = date;

    const propertyBagMonth = { year, month, day };
    assertTemporalEqual(T.PlainDate.from(propertyBagMonth, opts), date, 'from property bag with month');

    const propertyBagMonthCode = { year, monthCode, day };
    assertTemporalEqual(T.PlainDate.from(propertyBagMonthCode, opts), date, 'from property bag with monthCode');

    const propertyBagAll = { year, month, monthCode, day };
    assertTemporalEqual(T.PlainDate.from(propertyBagAll, opts), date, 'from property bag with month and monthCode');

    assertTemporalEqual(T.PlainDate.from(dateStr), date, 'from ISO string');

    const stringCalendar = date.toString({ calendarName: 'always' });
    assertTemporalEqual(T.PlainDate.from(stringCalendar), date, 'from ISO string with calendar');

    const stringTime = date.toPlainDateTime({ hour: 12 }).toString();
    assertTemporalEqual(T.PlainDate.from(stringTime), date, 'from ISO string with time');

    const yPart = `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
    const monPart = String(month).padStart(2, '0');
    const dPart = String(day).padStart(2, '0');
    const weirdString = `${yPart}${monPart}${dPart} 123456,7+1234`;
    assertTemporalEqual(T.PlainDate.from(weirdString), date, 'from ISO string with weird but allowed formatting');
  }

  return total;
});
