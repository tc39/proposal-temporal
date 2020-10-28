/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CALENDAR,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

function DateTimeToString(dateTime, precision, options = undefined) {
  let year = GetSlot(dateTime, ISO_YEAR);
  let month = GetSlot(dateTime, ISO_MONTH);
  let day = GetSlot(dateTime, ISO_DAY);
  let hour = GetSlot(dateTime, HOUR);
  let minute = GetSlot(dateTime, MINUTE);
  let second = GetSlot(dateTime, SECOND);
  let millisecond = GetSlot(dateTime, MILLISECOND);
  let microsecond = GetSlot(dateTime, MICROSECOND);
  let nanosecond = GetSlot(dateTime, NANOSECOND);

  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      increment,
      unit,
      roundingMode
    ));
  }

  year = ES.ISOYearString(year);
  month = ES.ISODateTimePartString(month);
  day = ES.ISODateTimePartString(day);
  hour = ES.ISODateTimePartString(hour);
  minute = ES.ISODateTimePartString(minute);
  const seconds = ES.FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  const calendar = ES.FormatCalendarAnnotation(GetSlot(dateTime, CALENDAR));
  return `${year}-${month}-${day}T${hour}:${minute}${seconds}${calendar}`;
}

export class DateTime {
  constructor(
    isoYear,
    isoMonth,
    isoDay,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0,
    calendar = GetISO8601Calendar()
  ) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    hour = ES.ToInteger(hour);
    minute = ES.ToInteger(minute);
    second = ES.ToInteger(second);
    millisecond = ES.ToInteger(millisecond);
    microsecond = ES.ToInteger(microsecond);
    nanosecond = ES.ToInteger(nanosecond);
    calendar = ES.ToTemporalCalendar(calendar);

    ES.RejectDateTime(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond);
    ES.RejectDateTimeRange(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond);

    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, HOUR, hour);
    SetSlot(this, MINUTE, minute);
    SetSlot(this, SECOND, second);
    SetSlot(this, MILLISECOND, millisecond);
    SetSlot(this, MICROSECOND, microsecond);
    SetSlot(this, NANOSECOND, nanosecond);
    SetSlot(this, CALENDAR, calendar);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get year() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(this);
  }
  get month() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get day() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(this);
  }
  get hour() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, HOUR);
  }
  get minute() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MINUTE);
  }
  get second() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, NANOSECOND);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInWeek(this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).inLeapYear(this);
  }
  with(temporalDateTimeLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalDateTimeLike) !== 'Object') {
      const str = ES.ToString(temporalDateTimeLike);
      temporalDateTimeLike = ES.RelevantTemporalObjectFromString(str);
    }
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    let source;
    let calendar = temporalDateTimeLike.calendar;
    if (calendar) {
      const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
      calendar = TemporalCalendar.from(calendar);
      source = new DateTime(
        GetSlot(this, ISO_YEAR),
        GetSlot(this, ISO_MONTH),
        GetSlot(this, ISO_DAY),
        GetSlot(this, HOUR),
        GetSlot(this, MINUTE),
        GetSlot(this, SECOND),
        GetSlot(this, MILLISECOND),
        GetSlot(this, MICROSECOND),
        GetSlot(this, NANOSECOND),
        calendar
      );
    } else {
      calendar = GetSlot(this, CALENDAR);
      source = this;
    }
    const fieldNames = ES.CalendarFields(calendar, [
      'day',
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'month',
      'nanosecond',
      'second',
      'year'
    ]);
    const props = ES.ToPartialRecord(temporalDateTimeLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid date-time-like');
    }
    const fields = ES.ToTemporalDateTimeFields(source, fieldNames);
    ObjectAssign(fields, props);
    const date = calendar.dateFromFields(fields, options, GetIntrinsic('%Temporal.Date%'));
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = fields;
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
    if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(this, HOUR),
      GetSlot(this, MINUTE),
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND),
      calendar
    );
    if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    // For a negative duration, BalanceDuration() subtracts from days to make
    // all other units positive, so it's not needed to switch on the sign below
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    ));
    duration = { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };

    // Add the time part
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    duration.days += deltaDays;

    // Delegate the date part addition to the calendar
    const calendar = GetSlot(this, CALENDAR);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const datePart = new TemporalDate(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      calendar
    );
    const addedDate = calendar.dateAdd(datePart, duration, options, TemporalDate);
    let year = GetSlot(addedDate, ISO_YEAR);
    let month = GetSlot(addedDate, ISO_MONTH);
    let day = GetSlot(addedDate, ISO_DAY);

    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
    if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    // For a negative duration, BalanceDuration() subtracts from days to make
    // all other units positive, so it's not needed to switch on the sign below
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    ));
    duration = { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };

    // Subtract the time part
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    duration.days -= deltaDays;

    // Delegate the date part subtraction to the calendar
    const calendar = GetSlot(this, CALENDAR);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const datePart = new TemporalDate(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      calendar
    );
    const subtractedDate = calendar.dateSubtract(datePart, duration, options, TemporalDate);
    let year = GetSlot(subtractedDate, ISO_YEAR);
    let month = GetSlot(subtractedDate, ISO_MONTH);
    let day = GetSlot(subtractedDate, ISO_DAY);

    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
    if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDateTime(other, DateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    let { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(this, HOUR),
      GetSlot(this, MINUTE),
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND),
      GetSlot(other, HOUR),
      GetSlot(other, MINUTE),
      GetSlot(other, SECOND),
      GetSlot(other, MILLISECOND),
      GetSlot(other, MICROSECOND),
      GetSlot(other, NANOSECOND)
    );
    let year = GetSlot(this, ISO_YEAR);
    let month = GetSlot(this, ISO_MONTH);
    let day = GetSlot(this, ISO_DAY) + deltaDays;
    ({ year, month, day } = ES.BalanceDate(year, month, day));

    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const adjustedDate = new TemporalDate(year, month, day, calendar);
    const otherDate = new TemporalDate(
      GetSlot(other, ISO_YEAR),
      GetSlot(other, ISO_MONTH),
      GetSlot(other, ISO_DAY),
      calendar
    );
    const dateLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', largestUnit);
    const dateOptions = ObjectAssign({}, options, { largestUnit: dateLargestUnit });
    let { years, months, weeks, days } = calendar.dateUntil(adjustedDate, otherDate, dateOptions);

    ({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      this
    ));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDateTime(other, DateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    let { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(other, HOUR),
      GetSlot(other, MINUTE),
      GetSlot(other, SECOND),
      GetSlot(other, MILLISECOND),
      GetSlot(other, MICROSECOND),
      GetSlot(other, NANOSECOND),
      GetSlot(this, HOUR),
      GetSlot(this, MINUTE),
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND)
    );
    let year = GetSlot(this, ISO_YEAR);
    let month = GetSlot(this, ISO_MONTH);
    let day = GetSlot(this, ISO_DAY) + deltaDays;
    ({ year, month, day } = ES.BalanceDate(year, month, day));

    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const adjustedDate = new TemporalDate(year, month, day, calendar);
    const otherDate = new TemporalDate(
      GetSlot(other, ISO_YEAR),
      GetSlot(other, ISO_MONTH),
      GetSlot(other, ISO_DAY),
      calendar
    );
    const dateLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', largestUnit);
    const dateOptions = ObjectAssign({}, options, { largestUnit: dateLargestUnit });
    let { years, months, weeks, days } = calendar.dateUntil(otherDate, adjustedDate, dateOptions);

    ({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.RoundDuration(
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode),
      this
    ));
    years = -years;
    months = -months;
    weeks = -weeks;
    days = -days;
    hours = -hours;
    minutes = -minutes;
    seconds = -seconds;
    milliseconds = -milliseconds;
    microseconds = -microseconds;
    nanoseconds = -nanoseconds;
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(options) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    let year = GetSlot(this, ISO_YEAR);
    let month = GetSlot(this, ISO_MONTH);
    let day = GetSlot(this, ISO_DAY);
    let hour = GetSlot(this, HOUR);
    let minute = GetSlot(this, MINUTE);
    let second = GetSlot(this, SECOND);
    let millisecond = GetSlot(this, MILLISECOND);
    let microsecond = GetSlot(this, MICROSECOND);
    let nanosecond = GetSlot(this, NANOSECOND);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ));

    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      GetSlot(this, CALENDAR)
    );
    if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDateTime(other, DateTime);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    return DateTimeToString(this, precision, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return DateTimeToString(this, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.DateTime');
  }

  toInstant(temporalTimeZoneLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    options = ES.NormalizeOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    return ES.GetTemporalInstantFor(timeZone, this, disambiguation);
  }
  toDate() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(this);
  }
  toYearMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  toMonthDay() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  toTime() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(this);
  }
  getFields() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateTimeFields(this, fieldNames);
    fields.calendar = calendar;
    return fields;
  }
  getISOFields() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      hour: GetSlot(this, HOUR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR),
      microsecond: GetSlot(this, MICROSECOND),
      millisecond: GetSlot(this, MILLISECOND),
      minute: GetSlot(this, MINUTE),
      nanosecond: GetSlot(this, NANOSECOND),
      second: GetSlot(this, SECOND)
    };
  }

  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    if (ES.IsTemporalDateTime(item)) {
      const year = GetSlot(item, ISO_YEAR);
      const month = GetSlot(item, ISO_MONTH);
      const day = GetSlot(item, ISO_DAY);
      const hour = GetSlot(item, HOUR);
      const minute = GetSlot(item, MINUTE);
      const second = GetSlot(item, SECOND);
      const millisecond = GetSlot(item, MILLISECOND);
      const microsecond = GetSlot(item, MICROSECOND);
      const nanosecond = GetSlot(item, NANOSECOND);
      const calendar = GetSlot(item, CALENDAR);
      const result = new this(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
      if (!ES.IsTemporalDateTime(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalDateTime(item, this, overflow);
  }
  static compare(one, two) {
    one = ES.ToTemporalDateTime(one, DateTime);
    two = ES.ToTemporalDateTime(two, DateTime);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return ES.CalendarCompare(GetSlot(one, CALENDAR), GetSlot(two, CALENDAR));
  }
}

MakeIntrinsicClass(DateTime, 'Temporal.DateTime');
