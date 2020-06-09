import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR_ID, ISO_YEAR, ISO_MONTH, ISO_DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

export class Calendar {
  constructor(id) {
    CreateSlots(this);
    SetSlot(this, CALENDAR_ID, id);
  }
  get id() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  dateFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  yearMonthFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  monthDayFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  plus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  minus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  difference(smaller, larger, options) {
    void smaller;
    void larger;
    void options;
    throw new Error('not implemented');
  }
  year(date) {
    void date;
    throw new Error('not implemented');
  }
  month(date) {
    void date;
    throw new Error('not implemented');
  }
  day(date) {
    void date;
    throw new Error('not implemented');
  }
  era(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfWeek(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  weekOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInMonth(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInYear(date) {
    void date;
    throw new Error('not implemented');
  }
  isLeapYear(date) {
    void date;
    throw new Error('not implemented');
  }
  toString() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  static from(item) {
    if (ES.IsTemporalCalendar(item) || (typeof item === 'object' && item)) return item;
    const stringIdent = ES.ToString(item);
    return ES.GetBuiltinCalendar(stringIdent);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');

export class ISO8601 extends Calendar {
  constructor(id = 'iso8601') {
    // Needs to be subclassable, that's why the ID is a default argument
    super(id);
  }
  dateFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { year, month, day } = ES.ToRecord(fields, [['day'], ['era', undefined], ['month'], ['year']]);
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    ({ year, month, day } = ES.RegulateDateRange(year, month, day, disambiguation));
    return new constructor(year, month, day, this);
  }
  yearMonthFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { year, month } = ES.ToRecord(fields, [['era', undefined], ['month'], ['year']]);
    ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
    ({ year, month } = ES.RegulateYearMonthRange(year, month, disambiguation));
    return new constructor(year, month, this, /* refIsoDay = */ 1);
  }
  monthDayFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { month, day } = ES.ToRecord(fields, [['day'], ['month']]);
    ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
    return new constructor(month, day, this, /* refIsoYear = */ 1972);
  }
  plus(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days } = duration;
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, weeks, days, disambiguation));
    ({ year, month, day } = ES.RegulateDateRange(year, month, day, disambiguation));
    return new constructor(year, month, day, this);
  }
  minus(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days } = duration;
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, weeks, days, disambiguation));
    ({ year, month, day } = ES.RegulateDateRange(year, month, day, disambiguation));
    return new constructor(year, month, day, this);
  }
  difference(smaller, larger, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days', ['hours', 'minutes', 'seconds']);
    const { years, months, weeks, days } = ES.DifferenceDate(smaller, larger, largestUnit);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  year(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_YEAR);
  }
  month(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_MONTH);
  }
  day(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_DAY);
  }
  era(date) {
    void date;
    return undefined;
  }
  dayOfWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  dayOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  weekOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  daysInMonth(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  }
  daysInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  }
  isLeapYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(date, ISO_YEAR));
  }
}
