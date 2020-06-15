import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
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

export class Date {
  constructor(isoYear, isoMonth, isoDay, calendar = undefined) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    if (calendar === undefined) calendar = GetDefaultCalendar();
    ES.RejectDate(isoYear, isoMonth, isoDay);
    ES.RejectDateRange(isoYear, isoMonth, isoDay);
    if (!calendar || typeof calendar !== 'object') throw new RangeError('invalid calendar');
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, CALENDAR, calendar);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(this);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(this);
  }
  get calendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).era(this);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get isLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).isLeapYear(this);
  }
  with(temporalDateLike = {}, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let source;
    let calendar = temporalDateLike.calendar;
    if (calendar) {
      const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
      calendar = TemporalCalendar.from(calendar);
      source = new Date(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    } else {
      calendar = GetSlot(this, CALENDAR);
      source = this;
    }
    const props = ES.ToPartialRecord(temporalDateLike, ['day', 'era', 'month', 'year']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    const fields = ES.ToTemporalDateRecord(source);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = calendar.dateFromFields(fields, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = TemporalCalendar.from(calendar);
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    const { days } = ES.BalanceDuration(
      duration.days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    );
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = GetSlot(this, CALENDAR).plus(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    const { days } = ES.BalanceDuration(
      duration.days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    );
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = GetSlot(this, CALENDAR).minus(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    const calendar = GetSlot(this, CALENDAR);
    if (calendar.id !== GetSlot(other, CALENDAR).id) {
      other = new Date(GetSlot(other, ISO_YEAR), GetSlot(other, ISO_MONTH), GetSlot(other, ISO_DAY), calendar);
    }
    const comparison = Date.compare(this, other);
    if (comparison < 0) throw new RangeError('other instance cannot be larger than `this`');
    return calendar.difference(other, this, options);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
  }
  toString() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
    const calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
    let resultString = `${year}-${month}-${day}${calendar}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Date');
  }
  withTime(temporalTime) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalTime(temporalTime)) throw new TypeError('invalid Temporal.Time object');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const hour = GetSlot(temporalTime, HOUR);
    const minute = GetSlot(temporalTime, MINUTE);
    const second = GetSlot(temporalTime, SECOND);
    const millisecond = GetSlot(temporalTime, MILLISECOND);
    const microsecond = GetSlot(temporalTime, MICROSECOND);
    const nanosecond = GetSlot(temporalTime, NANOSECOND);
    const DateTime = GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  getYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  getMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  getFields() {
    const fields = ES.ToTemporalDateRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    fields.calendar = GetSlot(this, CALENDAR);
    return fields;
  }
  getISOCalendarFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return {
      year: GetSlot(this, ISO_YEAR),
      month: GetSlot(this, ISO_MONTH),
      day: GetSlot(this, ISO_DAY)
    };
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let result;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalDate(item)) {
        const year = GetSlot(item, ISO_YEAR);
        const month = GetSlot(item, ISO_MONTH);
        const day = GetSlot(item, ISO_DAY);
        const calendar = GetSlot(item, CALENDAR);
        result = new this(year, month, day, calendar);
      } else {
        let calendar = item.calendar;
        if (calendar === undefined) calendar = GetDefaultCalendar();
        calendar = TemporalCalendar.from(calendar);
        result = calendar.dateFromFields(item, options, this);
      }
    } else {
      let { year, month, day, calendar } = ES.ParseTemporalDateString(ES.ToString(item));
      ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
      ({ year, month, day } = ES.RegulateDateRange(year, month, day, disambiguation));
      if (!calendar) calendar = GetDefaultCalendar();
      calendar = TemporalCalendar.from(calendar);
      result = new this(year, month, day, calendar);
    }
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalDate(one) || !ES.IsTemporalDate(two)) throw new TypeError('invalid Date object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    const cal1 = GetSlot(one, CALENDAR).id;
    const cal2 = GetSlot(two, CALENDAR).id;
    return ES.ComparisonResult(cal1 < cal2 ? -1 : cal1 > cal2 ? 1 : 0);
  }
}
Date.prototype.toJSON = Date.prototype.toString;

MakeIntrinsicClass(Date, 'Temporal.Date');
