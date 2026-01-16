import { assertTemporalEqual, getProgressBar, makeZonedCases, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject', offset: 'reject', disambiguation: 'reject' };
const interestingDateTimes = makeZonedCases();
const total = interestingDateTimes.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [dateTime, dateTimeStr] of interestingDateTimes) {
    progress.tick(1, { test: dateTimeStr });

    const {
      year,
      month,
      monthCode,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offset,
      timeZoneId: timeZone
    } = dateTime;
    const propertyBagCommon = { year, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone };

    const propertyBagMonth = { ...propertyBagCommon, month };
    const earlier = T.ZonedDateTime.from(propertyBagMonth, { disambiguation: 'earlier' });
    const later = T.ZonedDateTime.from(propertyBagMonth, { disambiguation: 'later' });
    const isAmbiguous = !earlier.equals(later);

    if (!isAmbiguous) {
      assertTemporalEqual(T.ZonedDateTime.from(propertyBagMonth, opts), dateTime, 'from property bag with month');

      const propertyBagMonthCode = { ...propertyBagCommon, monthCode };
      assertTemporalEqual(
        T.ZonedDateTime.from(propertyBagMonthCode, opts),
        dateTime,
        'from property bag with monthCode'
      );

      const propertyBagMonthMonthCode = { ...propertyBagCommon, month, monthCode };
      assertTemporalEqual(
        T.ZonedDateTime.from(propertyBagMonthMonthCode, opts),
        dateTime,
        'from property bag with month and monthCode'
      );
    }

    // Can't be constructed from string or property bag with offset:
    if (year === -271821 && month === 4 && day === 19) continue;

    const propertyBagMonthOffset = { ...propertyBagCommon, month, offset };
    assertTemporalEqual(
      T.ZonedDateTime.from(propertyBagMonthOffset, opts),
      dateTime,
      'from property bag with monthCode and offset'
    );

    const propertyBagMonthCodeOffset = { ...propertyBagCommon, monthCode, offset };
    assertTemporalEqual(
      T.ZonedDateTime.from(propertyBagMonthCodeOffset, opts),
      dateTime,
      'from property bag with monthCode and offset'
    );

    const propertyBagAll = { ...propertyBagCommon, month, monthCode, offset };
    assertTemporalEqual(
      T.ZonedDateTime.from(propertyBagAll, opts),
      dateTime,
      'from property bag with month, monthCode, and offset'
    );

    assertTemporalEqual(T.ZonedDateTime.from(dateTimeStr, opts), dateTime, 'from ISO string');

    const stringCalendar = dateTime.toString({ calendarName: 'always', timeZoneName: 'critical' });
    assertTemporalEqual(
      T.ZonedDateTime.from(stringCalendar, opts),
      dateTime,
      'from ISO string with calendar and critical time zone'
    );

    const yPart = `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
    const monPart = String(month).padStart(2, '0');
    const dPart = String(day).padStart(2, '0');
    const hPart = String(hour).padStart(2, '0');
    const minPart = String(minute).padStart(2, '0');
    const sPart = String(second).padStart(2, '0');
    const msPart = String(millisecond).padStart(3, '0');
    const µsPart = String(microsecond).padStart(3, '0');
    const nsPart = String(nanosecond).padStart(3, '0');
    const offPart = offset.replace('.', ',').replaceAll(':', '');
    const tzPart = `[${timeZone.toLowerCase()}]`;
    const weirdString =
      `${yPart}${monPart}${dPart} ${hPart}${minPart}${sPart},` + `${msPart}${µsPart}${nsPart}${offPart}${tzPart}`;
    assertTemporalEqual(
      T.ZonedDateTime.from(weirdString, opts),
      dateTime,
      'from ISO string with weird but allowed formatting'
    );
  }

  return total;
});
