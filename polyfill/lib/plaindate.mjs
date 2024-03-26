import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CalendarMethodRecord, TimeZoneMethodRecord } from './methodrecord.mjs';
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
  constructor(isoYear, isoMonth, isoDay, calendar = 'iso8601') {
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    isoDay = ES.ToIntegerWithTruncation(isoDay);
    calendar = ES.ToTemporalCalendarSlotValue(calendar);

    ES.CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar);
  }
  get calendarId() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
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
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
    return ES.CalendarDay(calendarRec, this);
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
    ES.RejectTemporalLikeObject(temporalDateLike);
    const resolvedOptions = ES.SnapshotOwnProperties(ES.GetOptionsObject(options), null);

    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
    const fieldNames = ES.CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    let fields = ES.PrepareTemporalFields(this, fieldNames, []);
    const partialDate = ES.PrepareTemporalFields(temporalDateLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendarRec, fields, partialDate);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);

    return ES.CalendarDateFromFields(calendarRec, fields, resolvedOptions);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
    return ES.CreateTemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    const duration = ES.ToTemporalDuration(temporalDurationLike);
    options = ES.GetOptionsObject(options);

    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateAdd']);
    return ES.AddDate(calendarRec, this, duration, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    const duration = ES.CreateNegatedTemporalDuration(ES.ToTemporalDuration(temporalDurationLike));
    options = ES.GetOptionsObject(options);

    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateAdd']);
    return ES.AddDate(calendarRec, this, duration, options);
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
    ES.ValueOfThrows('PlainDate');
  }
  toPlainDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    temporalTime = ES.ToTemporalTimeOrMidnight(temporalTime);
    return ES.CreateTemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(temporalTime, ISO_HOUR),
      GetSlot(temporalTime, ISO_MINUTE),
      GetSlot(temporalTime, ISO_SECOND),
      GetSlot(temporalTime, ISO_MILLISECOND),
      GetSlot(temporalTime, ISO_MICROSECOND),
      GetSlot(temporalTime, ISO_NANOSECOND),
      GetSlot(this, CALENDAR)
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
          timeZone = ES.ToTemporalTimeZoneSlotValue(item);
        } else {
          timeZone = ES.ToTemporalTimeZoneSlotValue(timeZoneLike);
          temporalTime = item.plainTime;
        }
      }
    } else {
      timeZone = ES.ToTemporalTimeZoneSlotValue(item);
    }

    const calendar = GetSlot(this, CALENDAR);
    temporalTime = ES.ToTemporalTimeOrMidnight(temporalTime);
    const dt = ES.CreateTemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(temporalTime, ISO_HOUR),
      GetSlot(temporalTime, ISO_MINUTE),
      GetSlot(temporalTime, ISO_SECOND),
      GetSlot(temporalTime, ISO_MILLISECOND),
      GetSlot(temporalTime, ISO_MICROSECOND),
      GetSlot(temporalTime, ISO_NANOSECOND),
      calendar
    );
    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
    const instant = ES.GetInstantFor(timeZoneRec, dt, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'yearMonthFromFields']);
    const fieldNames = ES.CalendarFields(calendarRec, ['monthCode', 'year']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarYearMonthFromFields(calendarRec, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'monthDayFromFields']);
    const fieldNames = ES.CalendarFields(calendarRec, ['day', 'monthCode']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarMonthDayFromFields(calendarRec, fields);
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
  getCalendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarObject(GetSlot(this, CALENDAR));
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
