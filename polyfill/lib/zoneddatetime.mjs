import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR,
  EPOCHNANOSECONDS,
  ISO_HOUR,
  INSTANT,
  ISO_DAY,
  ISO_MONTH,
  ISO_YEAR,
  ISO_MICROSECOND,
  ISO_MILLISECOND,
  ISO_MINUTE,
  ISO_NANOSECOND,
  ISO_SECOND,
  TIME_ZONE,
  GetSlot
} from './slots.mjs';

import bigInt from 'big-integer';

const ArrayPrototypePush = Array.prototype.push;
const customResolvedOptions = DateTimeFormat.prototype.resolvedOptions;
const ObjectCreate = Object.create;

export class ZonedDateTime {
  constructor(epochNanoseconds, timeZone, calendar = 'iso8601') {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    //       ToTemporalTimeZoneSlotValue(undefined) has a clear enough message.
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochNanoseconds is required');
    }
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    timeZone = ES.ToTemporalTimeZoneSlotValue(timeZone);
    calendar = ES.ToTemporalCalendarSlotValue(calendar);

    ES.CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone, calendar);
  }
  get calendarId() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
  }
  get timeZoneId() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalTimeZoneIdentifier(GetSlot(this, TIME_ZONE));
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthCode() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), dateTime(this));
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hour() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_NANOSECOND);
  }
  get era() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), dateTime(this));
  }
  get eraYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get epochSeconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return ES.BigIntFloorDiv(value, 1e9).toJSNumber();
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return ES.BigIntFloorDiv(value, 1e6).toJSNumber();
  }
  get epochMicroseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return ES.BigIntIfAvailable(ES.BigIntFloorDiv(value, 1e3));
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.BigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get yearOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYearOfWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hoursInDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const year = GetSlot(dt, ISO_YEAR);
    const month = GetSlot(dt, ISO_MONTH);
    const day = GetSlot(dt, ISO_DAY);
    const today = new DateTime(year, month, day, 0, 0, 0, 0, 0, 0);
    const tomorrowFields = ES.AddISODate(year, month, day, 0, 0, 0, 1, 'reject');
    const tomorrow = new DateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0);
    const timeZone = GetSlot(this, TIME_ZONE);
    const todayNs = GetSlot(ES.GetInstantFor(timeZone, today, 'compatible'), EPOCHNANOSECONDS);
    const tomorrowNs = GetSlot(ES.GetInstantFor(timeZone, tomorrow, 'compatible'), EPOCHNANOSECONDS);
    const diffNs = tomorrowNs.subtract(todayNs);
    const { quotient, remainder } = diffNs.divmod(3.6e12);
    return quotient.toJSNumber() + remainder.toJSNumber() / 3.6e12;
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  get offsetNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      throw new TypeError('invalid zoned-date-time-like');
    }
    ES.RejectTemporalLikeObject(temporalZonedDateTimeLike);
    options = ES.GetOptionsObject(options);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, [
      'day',
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'month',
      'monthCode',
      'nanosecond',
      'second',
      'year'
    ]);
    ES.Call(ArrayPrototypePush, fieldNames, ['offset']);
    let fields = ES.PrepareTemporalFields(this, fieldNames, ['offset']);
    const partialZonedDateTime = ES.PrepareTemporalFields(temporalZonedDateTimeLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendar, fields, partialZonedDateTime);
    fields = ES.PrepareTemporalFields(fields, fieldNames, ['offset']);

    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'prefer');

    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
      ES.InterpretTemporalDateTimeFields(calendar, fields, options);
    const offsetNs = ES.ParseDateTimeUTCOffset(fields.offset).offsetNanoseconds;
    const timeZone = GetSlot(this, TIME_ZONE);
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'option',
      offsetNs,
      timeZone,
      disambiguation,
      offset,
      /* matchMinute = */ false
    );

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  }
  withPlainDate(temporalDate) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    temporalDate = ES.ToTemporalDate(temporalDate);

    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendar = GetSlot(temporalDate, CALENDAR);
    const thisDt = dateTime(this);
    const hour = GetSlot(thisDt, ISO_HOUR);
    const minute = GetSlot(thisDt, ISO_MINUTE);
    const second = GetSlot(thisDt, ISO_SECOND);
    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);

    calendar = ES.ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
    const timeZone = GetSlot(this, TIME_ZONE);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(
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
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
    temporalTime = temporalTime === undefined ? new PlainTime() : ES.ToTemporalTime(temporalTime);

    const thisDt = dateTime(this);
    const year = GetSlot(thisDt, ISO_YEAR);
    const month = GetSlot(thisDt, ISO_MONTH);
    const day = GetSlot(thisDt, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

    const timeZone = GetSlot(this, TIME_ZONE);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(
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
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    timeZone = ES.ToTemporalTimeZoneSlotValue(timeZone);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToOrSubtractDurationFromZonedDateTime('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToOrSubtractDurationFromZonedDateTime('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalZonedDateTime('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalZonedDateTime('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (roundTo === undefined) throw new TypeError('options parameter is required');
    if (ES.Type(roundTo) === 'String') {
      const stringParam = roundTo;
      roundTo = ObjectCreate(null);
      roundTo.smallestUnit = stringParam;
    } else {
      roundTo = ES.GetOptionsObject(roundTo);
    }
    const roundingIncrement = ES.ToTemporalRoundingIncrement(roundTo);
    const roundingMode = ES.ToTemporalRoundingMode(roundTo, 'halfExpand');
    const smallestUnit = ES.GetTemporalUnit(roundTo, 'smallestUnit', 'time', ES.REQUIRED, ['day']);
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const maximum = maximumIncrements[smallestUnit];
    const inclusive = maximum === 1;
    ES.ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive);

    // first, round the underlying DateTime fields
    const dt = dateTime(this);
    let year = GetSlot(dt, ISO_YEAR);
    let month = GetSlot(dt, ISO_MONTH);
    let day = GetSlot(dt, ISO_DAY);
    let hour = GetSlot(dt, ISO_HOUR);
    let minute = GetSlot(dt, ISO_MINUTE);
    let second = GetSlot(dt, ISO_SECOND);
    let millisecond = GetSlot(dt, ISO_MILLISECOND);
    let microsecond = GetSlot(dt, ISO_MICROSECOND);
    let nanosecond = GetSlot(dt, ISO_NANOSECOND);

    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const instantStart = ES.GetInstantFor(timeZone, dtStart, 'compatible');
    const endNs = ES.AddZonedDateTime(instantStart, timeZone, calendar, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    const dayLengthNs = endNs.subtract(GetSlot(instantStart, EPOCHNANOSECONDS));
    if (dayLengthNs.leq(0)) {
      throw new RangeError('cannot round a ZonedDateTime in a calendar with zero- or negative-length days');
    }
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundISODateTime(
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
      roundingMode,
      dayLengthNs
    ));

    // Now reset all DateTime fields but leave the TimeZone. The offset will
    // also be retained if the new date/time values are still OK with the old
    // offset. Otherwise the offset will be changed to be compatible with the
    // new date/time values. If DST disambiguation is required, the `compatible`
    // disambiguation algorithm will be used.
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, GetSlot(this, INSTANT));
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'option',
      offsetNs,
      timeZone,
      'compatible',
      'prefer',
      /* matchMinute = */ false
    );

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToCalendarNameOption(options);
    const digits = ES.ToFractionalSecondDigits(options);
    const showOffset = ES.ToShowOffsetOption(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const showTimeZone = ES.ToTimeZoneNameOption(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    return ES.TemporalZonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
      unit,
      increment,
      roundingMode
    });
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);

    // This is not quite per specification, but this polyfill's DateTimeFormat
    // already doesn't match the InitializeDateTimeFormat operation, and the
    // access order might change anyway;
    // see https://github.com/tc39/ecma402/issues/747
    const optionsCopy = ES.SnapshotOwnProperties(options, null, ['timeZone']);

    if (options.timeZone !== undefined) {
      throw new TypeError('ZonedDateTime toLocaleString does not accept a timeZone option');
    }

    if (
      optionsCopy.year === undefined &&
      optionsCopy.month === undefined &&
      optionsCopy.day === undefined &&
      optionsCopy.weekday === undefined &&
      optionsCopy.dateStyle === undefined &&
      optionsCopy.hour === undefined &&
      optionsCopy.minute === undefined &&
      optionsCopy.second === undefined &&
      optionsCopy.timeStyle === undefined &&
      optionsCopy.dayPeriod === undefined &&
      optionsCopy.timeZoneName === undefined
    ) {
      optionsCopy.timeZoneName = 'short';
      // The rest of the defaults will be filled in by formatting the Instant
    }

    const timeZoneIdentifier = ES.ToTemporalTimeZoneIdentifier(GetSlot(this, TIME_ZONE));
    if (ES.IsOffsetTimeZoneIdentifier(timeZoneIdentifier)) {
      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
      throw new RangeError('toLocaleString does not currently support offset time zones');
    } else {
      const record = ES.GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier);
      if (!record) throw new RangeError(`toLocaleString formats built-in time zones, not ${timeZoneIdentifier}`);
      optionsCopy.timeZone = record.identifier;
    }

    const formatter = new DateTimeFormat(locales, optionsCopy);

    const localeCalendarIdentifier = ES.Call(customResolvedOptions, formatter, []).calendar;
    const calendarIdentifier = ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
    if (
      calendarIdentifier !== 'iso8601' &&
      localeCalendarIdentifier !== 'iso8601' &&
      localeCalendarIdentifier !== calendarIdentifier
    ) {
      throw new RangeError(
        `cannot format ZonedDateTime with calendar ${calendarIdentifier}` +
          ` in locale with calendar ${localeCalendarIdentifier}`
      );
    }

    return formatter.format(GetSlot(this, INSTANT));
  }
  toJSON() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalZonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const calendar = GetSlot(this, CALENDAR);
    const dtStart = new DateTime(
      GetSlot(dt, ISO_YEAR),
      GetSlot(dt, ISO_MONTH),
      GetSlot(dt, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0,
      calendar
    );
    const timeZone = GetSlot(this, TIME_ZONE);
    const instant = ES.GetInstantFor(timeZone, dtStart, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toInstant() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toPlainDate() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(dateTime(this));
  }
  toPlainTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(dateTime(this));
  }
  toPlainDateTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return dateTime(this);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarYearMonthFromFields(calendar, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarMonthDayFromFields(calendar, fields);
  }
  getISOFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const tz = GetSlot(this, TIME_ZONE);
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(dt, ISO_DAY),
      isoHour: GetSlot(dt, ISO_HOUR),
      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
      isoMinute: GetSlot(dt, ISO_MINUTE),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
      isoSecond: GetSlot(dt, ISO_SECOND),
      isoYear: GetSlot(dt, ISO_YEAR),
      offset: ES.GetOffsetStringFor(tz, GetSlot(this, INSTANT)),
      timeZone: tz
    };
  }
  getCalendar() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarObject(GetSlot(this, CALENDAR));
  }
  getTimeZone() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalTimeZoneObject(GetSlot(this, TIME_ZONE));
  }

  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalZonedDateTime(item)) {
      ES.ToTemporalDisambiguation(options); // validate and ignore
      ES.ToTemporalOffset(options, 'reject');
      ES.ToTemporalOverflow(options);
      return ES.CreateTemporalZonedDateTime(
        GetSlot(item, EPOCHNANOSECONDS),
        GetSlot(item, TIME_ZONE),
        GetSlot(item, CALENDAR)
      );
    }
    return ES.ToTemporalZonedDateTime(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalZonedDateTime(one);
    two = ES.ToTemporalZonedDateTime(two);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(ns1).lesser(ns2)) return -1;
    if (bigInt(ns1).greater(ns2)) return 1;
    return 0;
  }
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');

function dateTime(zdt) {
  return ES.GetPlainDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
}
