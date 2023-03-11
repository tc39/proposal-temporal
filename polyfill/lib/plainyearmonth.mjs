import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CalendarMethodRecord } from './methodrecord.mjs';
import { ISO_YEAR, ISO_MONTH, ISO_DAY, CALENDAR, GetSlot } from './slots.mjs';

const ArrayPrototypeConcat = Array.prototype.concat;
const ObjectCreate = Object.create;

export class PlainYearMonth {
  constructor(isoYear, isoMonth, calendar = 'iso8601', referenceISODay = 1) {
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
    referenceISODay = ES.ToIntegerWithTruncation(referenceISODay);

    ES.CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar, referenceISODay);
  }
  get year() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get calendarId() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalYearMonthLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalYearMonthLike);
    const resolvedOptions = ES.SnapshotOwnProperties(ES.GetOptionsObject(options), null);

    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), [
      'fields',
      'mergeFields',
      'yearMonthFromFields'
    ]);
    const fieldNames = ES.CalendarFields(calendarRec, ['month', 'monthCode', 'year']);
    let fields = ES.PrepareTemporalFields(this, fieldNames, []);
    const partialYearMonth = ES.PrepareTemporalFields(temporalYearMonthLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendarRec, fields, partialYearMonth);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);

    return ES.CalendarYearMonthFromFields(calendarRec, fields, resolvedOptions);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToOrSubtractDurationFromPlainYearMonth('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToOrSubtractDurationFromPlainYearMonth('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other);
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToCalendarNameOption(options);
    return ES.TemporalYearMonthToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.TemporalYearMonthToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainYearMonth');
  }
  toPlainDate(item) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (ES.Type(item) !== 'Object') throw new TypeError('argument should be an object');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);

    const receiverFieldNames = ES.CalendarFields(calendarRec, ['monthCode', 'year']);
    let fields = ES.PrepareTemporalFields(this, receiverFieldNames, []);

    const inputFieldNames = ES.CalendarFields(calendarRec, ['day']);
    const inputFields = ES.PrepareTemporalFields(item, inputFieldNames, []);
    let mergedFields = ES.CalendarMergeFields(calendarRec, fields, inputFields);
    const concatenatedFieldNames = ES.Call(ArrayPrototypeConcat, receiverFieldNames, inputFieldNames);
    mergedFields = ES.PrepareTemporalFields(mergedFields, concatenatedFieldNames, [], [], 'ignore');
    const options = ObjectCreate(null);
    options.overflow = 'reject';
    return ES.CalendarDateFromFields(calendarRec, mergedFields, options);
  }
  getISOFields() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  getCalendar() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarObject(GetSlot(this, CALENDAR));
  }

  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalYearMonth(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      return ES.CreateTemporalYearMonth(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, CALENDAR),
        GetSlot(item, ISO_DAY)
      );
    }
    return ES.ToTemporalYearMonth(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalYearMonth(one);
    two = ES.ToTemporalYearMonth(two);
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

MakeIntrinsicClass(PlainYearMonth, 'Temporal.PlainYearMonth');
