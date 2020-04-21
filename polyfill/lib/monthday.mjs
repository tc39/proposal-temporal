import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

export class MonthDay {
  constructor(month, day) {
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    const leapYear = 1972; // XXX #261 leap year
    ES.RejectDate(leapYear, month, day);

    CreateSlots(this);
    SetSlot(this, MONTH, month);
    SetSlot(this, DAY, day);
  }

  get month() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get day() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAY);
  }

  with(temporalMonthDayLike, options) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const props = ES.ToPartialRecord(temporalMonthDayLike, ['day', 'month']);
    if (!props) {
      throw new RangeError('invalid month-day-like');
    }
    let { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    const result = new Construct(month, day);
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
  toString() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withYear(item) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    let year;
    if (typeof item === 'object') {
      ({ year } = ES.ToRecord(item, [['year']]));
    } else {
      year = ES.ToInteger(item);
    }
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    const Date = GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day);
  }
  getFields() {
    const fields = ES.ToRecord(this, [['day'], ['month']]);
    if (!fields) throw new TypeError('invalid receiver');
    return fields;
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let month, day;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalMonthDay(item)) {
        month = GetSlot(item, MONTH);
        day = GetSlot(item, DAY);
      } else {
        // Intentionally alphabetical
        ({ month, day } = ES.ToRecord(item, [['day'], ['month']]));
      }
    } else {
      ({ month, day } = ES.ParseTemporalMonthDayString(ES.ToString(item)));
    }
    ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
    const result = new this(month, day);
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalMonthDay(one) || !ES.IsTemporalMonthDay(two)) throw new TypeError('invalid MonthDay object');
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
