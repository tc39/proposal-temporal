import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_MONTH, ISO_DAY, ISO_YEAR, CALENDAR, GetSlot } from './slots.mjs';

const ArrayPrototypePush = Array.prototype.push;
const ObjectCreate = Object.create;
const SetPrototypeAdd = Set.prototype.add;
const SetPrototypeForEach = Set.prototype.forEach;

export class PlainMonthDay {
  constructor(isoMonth, isoDay, calendar = ES.GetISO8601Calendar(), referenceISOYear = 1972) {
    isoMonth = ES.ToIntegerThrowOnInfinity(isoMonth);
    isoDay = ES.ToIntegerThrowOnInfinity(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);
    referenceISOYear = ES.ToIntegerThrowOnInfinity(referenceISOYear);

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
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
    ES.RejectObjectWithCalendarOrTimeZone(temporalMonthDayLike);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const props = ES.PrepareTemporalFields(temporalMonthDayLike, fieldNames, 'partial');
    if (!props) {
      throw new TypeError('invalid month-day-like');
    }
    let fields = ES.PrepareTemporalFields(this, fieldNames, []);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);

    options = ES.GetOptionsObject(options);
    return ES.CalendarMonthDayFromFields(calendar, fields, options);
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
    if (ES.Type(item) !== 'Object') throw new TypeError('argument should be an object');
    const calendar = GetSlot(this, CALENDAR);

    const receiverFieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    let fields = ES.PrepareTemporalFields(this, receiverFieldNames, []);

    const inputFieldNames = ES.CalendarFields(calendar, ['year']);
    const inputFields = ES.PrepareTemporalFields(item, inputFieldNames, []);
    let mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);

    // TODO: Use MergeLists abstract operation.
    const uniqueFieldNames = new Set();
    for (let index = 0; index < receiverFieldNames.length; index++) {
      ES.Call(SetPrototypeAdd, uniqueFieldNames, [receiverFieldNames[index]]);
    }
    for (let index = 0; index < inputFieldNames.length; index++) {
      ES.Call(SetPrototypeAdd, uniqueFieldNames, [inputFieldNames[index]]);
    }
    const mergedFieldNames = [];
    ES.Call(SetPrototypeForEach, uniqueFieldNames, [
      (element) => ES.Call(ArrayPrototypePush, mergedFieldNames, [element])
    ]);
    mergedFields = ES.PrepareTemporalFields(mergedFields, mergedFieldNames, []);
    const options = ObjectCreate(null);
    options.overflow = 'reject';
    return ES.CalendarDateFromFields(calendar, mergedFields, options);
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
