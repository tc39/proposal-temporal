import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_MONTH, ISO_DAY, ISO_YEAR, CALENDAR, TIME_ZONE, GetSlot, HasSlot } from './slots.mjs';

const ObjectCreate = Object.create;

export class PlainMonthDay {
  constructor(isoMonth, isoDay, calendar = ES.GetISO8601Calendar(), referenceISOYear = 1972) {
    isoMonth = ES.ToFiniteInteger(isoMonth);
    isoDay = ES.ToFiniteInteger(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);
    referenceISOYear = ES.ToFiniteInteger(referenceISOYear);

    // Note: if the arguments are not passed, ToInteger(undefined) will have returned 0, which will
    //       be rejected by RejectISODate in CreateTemporalMonthDaySlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoMonth and isoDay are required');
    }

    ES.CreateTemporalMonthDaySlots(this, isoMonth, isoDay, calendar, referenceISOYear);
  }

  get monthCode() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get calendar() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }

  with(temporalMonthDayLike, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalMonthDayLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    if (HasSlot(temporalMonthDayLike, CALENDAR) || HasSlot(temporalMonthDayLike, TIME_ZONE)) {
      throw new TypeError('with() does not support a calendar or timeZone property');
    }
    if (temporalMonthDayLike.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (temporalMonthDayLike.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const props = ES.ToPartialRecord(temporalMonthDayLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid month-day-like');
    }
    let fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.ToTemporalMonthDayFields(fields, fieldNames);

    options = ES.GetOptionsObject(options);
    return ES.MonthDayFromFields(calendar, fields, options);
  }
  equals(other) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalMonthDay(other);
    for (const slot of [ISO_MONTH, ISO_DAY, ISO_YEAR]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    return ES.TemporalMonthDayToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.TemporalMonthDayToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use equals() to compare Temporal.PlainMonthDay');
  }
  toPlainDate(item) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);

    const receiverFieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    let fields = ES.ToTemporalMonthDayFields(this, receiverFieldNames);

    const inputFieldNames = ES.CalendarFields(calendar, ['year']);
    const inputEntries = [['year', undefined]];
    // Add extra fields from the calendar at the end
    inputFieldNames.forEach((fieldName) => {
      if (!inputEntries.some(([name]) => name === fieldName)) {
        inputEntries.push([fieldName, undefined]);
      }
    });
    const inputFields = ES.PrepareTemporalFields(item, inputEntries);
    let mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);

    const mergedFieldNames = [...new Set([...receiverFieldNames, ...inputFieldNames])];
    const mergedEntries = [];
    mergedFieldNames.forEach((fieldName) => {
      if (!mergedEntries.some(([name]) => name === fieldName)) {
        mergedEntries.push([fieldName, undefined]);
      }
    });
    mergedFields = ES.PrepareTemporalFields(mergedFields, mergedEntries);
    const options = ObjectCreate(null);
    return ES.DateFromFields(calendar, mergedFields, options);
  }
  getISOFields() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalMonthDay(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      return ES.CreateTemporalMonthDay(
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR),
        GetSlot(item, ISO_YEAR)
      );
    }
    return ES.ToTemporalMonthDay(item, options);
  }
}

MakeIntrinsicClass(PlainMonthDay, 'Temporal.PlainMonthDay');
