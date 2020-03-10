import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
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
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get day() {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAY);
  }

  with(dateLike, options) {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToDisambiguation(options);
    const props = ES.ValidPropertyBag(dateLike, ['month', 'day']);
    if (!props) {
      throw new RangeError('invalid month-day-like');
    }
    let { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    const result = new Construct(month, day);
    if (!ES.IsMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
  toString() {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withYear(year) {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day);
  }
  static from(arg, options = undefined) {
    const disambiguation = ES.ToDisambiguation(options);
    let result = ES.ToMonthDay(arg, disambiguation);
    if (this === MonthDay) return result;
    return new this(GetSlot(result, MONTH), GetSlot(result, DAY));
  }
  static compare(one, two) {
    if (!ES.IsMonthDay(one) || !ES.IsMonthDay(two)) throw new TypeError('invalid MonthDay object');
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
