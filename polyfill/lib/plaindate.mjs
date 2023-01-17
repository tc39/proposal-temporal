import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  CALENDAR,
  EPOCHNANOSECONDS,
  GetSlot
} from './slots.mjs';

export class PlainDate {
  constructor(isoYear, isoMonth, isoDay, calendar = ES.GetISO8601Calendar()) {
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    isoDay = ES.ToIntegerWithTruncation(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);

    ES.CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar);
  }
  get calendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYearOfWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalDateLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectObjectWithCalendarOrTimeZone(temporalDateLike);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const props = ES.PrepareTemporalFields(temporalDateLike, fieldNames, 'partial');
    let fields = ES.PrepareTemporalFields(this, fieldNames, []);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);

    options = ES.GetOptionsObject(options);

    return ES.CalendarDateFromFields(calendar, fields, options);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    return new PlainDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    const duration = ES.ToTemporalDuration(temporalDurationLike);
    options = ES.GetOptionsObject(options);

    return ES.CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    const duration = ES.CreateNegatedTemporalDuration(ES.ToTemporalDuration(temporalDurationLike));
    options = ES.GetOptionsObject(options);

    return ES.CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDate('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDate('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other);
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToCalendarNameOption(options);
    return ES.TemporalDateToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.PlainDate');
  }
  toPlainDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);

    if (temporalTime === undefined) return ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);

    temporalTime = ES.ToTemporalTime(temporalTime);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

    return ES.CreateTemporalDateTime(
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
  }
  toZonedDateTime(item) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let timeZone, temporalTime;
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalTimeZone(item)) {
        timeZone = item;
      } else {
        let timeZoneLike = item.timeZone;
        if (timeZoneLike === undefined) {
          timeZone = ES.ToTemporalTimeZone(item);
        } else {
          timeZone = ES.ToTemporalTimeZone(timeZoneLike);
          temporalTime = item.plainTime;
        }
      }
    } else {
      timeZone = ES.ToTemporalTimeZone(item);
    }

    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);

    let hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      microsecond = 0,
      nanosecond = 0;
    if (temporalTime !== undefined) {
      temporalTime = ES.ToTemporalTime(temporalTime);
      hour = GetSlot(temporalTime, ISO_HOUR);
      minute = GetSlot(temporalTime, ISO_MINUTE);
      second = GetSlot(temporalTime, ISO_SECOND);
      millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
      microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
      nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    }

    const dt = ES.CreateTemporalDateTime(
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
    const instant = ES.GetInstantFor(timeZone, dt, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarYearMonthFromFields(calendar, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarMonthDayFromFields(calendar, fields);
  }
  getISOFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalDate(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      return ES.CreateTemporalDate(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR)
      );
    }
    return ES.ToTemporalDate(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDate(one);
    two = ES.ToTemporalDate(two);
    return ES.CompareISODate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY)
    );
  }
}

MakeIntrinsicClass(PlainDate, 'Temporal.PlainDate');
