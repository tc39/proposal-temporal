import { assertTemporalEqual, getProgressBar, makeDateTimeCases, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject' };
const interestingDateTimes = makeDateTimeCases();
const total = interestingDateTimes.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [dateTime, dateTimeStr] of interestingDateTimes) {
    progress.tick(1, { test: dateTimeStr });

    const { year, month, monthCode, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;

    const propertyBagMonth = { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
    assertTemporalEqual(T.PlainDateTime.from(propertyBagMonth, opts), dateTime, 'from property bag with month');

    const propertyBagMonthCode = { year, monthCode, day, hour, minute, second, millisecond, microsecond, nanosecond };
    assertTemporalEqual(T.PlainDateTime.from(propertyBagMonthCode, opts), dateTime, 'from property bag with monthCode');

    const propertyBagAll = { year, month, monthCode, day, hour, minute, second, millisecond, microsecond, nanosecond };
    assertTemporalEqual(
      T.PlainDateTime.from(propertyBagAll, opts),
      dateTime,
      'from property bag with month and monthCode'
    );

    assertTemporalEqual(T.PlainDateTime.from(dateTimeStr), dateTime, 'from ISO string');

    const stringCalendar = dateTime.toString({ calendarName: 'always' });
    assertTemporalEqual(T.PlainDateTime.from(stringCalendar), dateTime, 'from ISO string with calendar');

    const yPart = `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
    const monPart = String(month).padStart(2, '0');
    const dPart = String(day).padStart(2, '0');
    const hPart = String(hour).padStart(2, '0');
    const minPart = String(minute).padStart(2, '0');
    const sPart = String(second).padStart(2, '0');
    const msPart = String(millisecond).padStart(3, '0');
    const µsPart = String(microsecond).padStart(3, '0');
    const nsPart = String(nanosecond).padStart(3, '0');
    const weirdString = `${yPart}${monPart}${dPart} ${hPart}${minPart}${sPart},${msPart}${µsPart}${nsPart}+1234`;
    assertTemporalEqual(
      T.PlainDateTime.from(weirdString),
      dateTime,
      'from ISO string with weird but allowed formatting'
    );
  }

  return total;
});
