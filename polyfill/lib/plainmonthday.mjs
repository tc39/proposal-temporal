import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CalendarMethodRecord } from './methodrecord.mjs';
import { ISO_MONTH, ISO_DAY, ISO_YEAR, CALENDAR, GetSlot } from './slots.mjs';

const ArrayPrototypeConcat = Array.prototype.concat;

export class PlainMonthDay {
  constructor(isoMonth, isoDay, calendar = 'iso8601', referenceISOYear = 1972) {
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    isoDay = ES.ToIntegerWithTruncation(isoDay);
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
    referenceISOYear = ES.ToIntegerWithTruncation(referenceISOYear);

    ES.CreateTemporalMonthDaySlots(this, isoMonth, isoDay, calendar, referenceISOYear);
  }

  get monthCode() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
    return ES.CalendarDay(calendarRec, this);
  }
  get calendarId() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
  }

  with(temporalMonthDayLike, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalMonthDayLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalMonthDayLike);
    const resolvedOptions = ES.SnapshotOwnProperties(ES.GetOptionsObject(options), null);

    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), [
      'fields',
      'mergeFields',
      'monthDayFromFields'
    ]);
    let { fields, fieldNames } = ES.PrepareCalendarFieldsAndFieldNames(calendarRec, this, [
      'day',
      'month',
      'monthCode',
      'year'
    ]);
    const partialMonthDay = ES.PrepareTemporalFields(temporalMonthDayLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendarRec, fields, partialMonthDay);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);

    return ES.CalendarMonthDayFromFields(calendarRec, fields, resolvedOptions);
  }
  equals(other) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalMonthDay(other);
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(options);
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
  toPlainDate(item) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if (ES.Type(item) !== 'Object') throw new TypeError('argument should be an object');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);

    const { fields, fieldNames: receiverFieldNames } = ES.PrepareCalendarFieldsAndFieldNames(calendarRec, this, [
      'day',
      'monthCode'
    ]);
    const { fields: inputFields, fieldNames: inputFieldNames } = ES.PrepareCalendarFieldsAndFieldNames(
      calendarRec,
      item,
      ['year']
    );
    let mergedFields = ES.CalendarMergeFields(calendarRec, fields, inputFields);
    const concatenatedFieldNames = ES.Call(ArrayPrototypeConcat, receiverFieldNames, inputFieldNames);
    mergedFields = ES.PrepareTemporalFields(mergedFields, concatenatedFieldNames, [], [], 'ignore');
    return ES.CalendarDateFromFields(calendarRec, mergedFields);
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
  getCalendar() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarObject(GetSlot(this, CALENDAR));
  }

  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalMonthDay(item)) {
      ES.GetTemporalOverflowOption(options); // validate and ignore
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
Object.defineProperties(PlainMonthDay.prototype, {
  valueOf: {
    enumerable: false,
    writable: true,
    configurable: true,
    value: GetIntrinsic('%ThrowTypeErrorFromValueOf%')
  }
});
