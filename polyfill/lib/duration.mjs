import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  YEARS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';
import { duration as STRING } from './regex.mjs';

export class Duration {
  constructor(
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    microseconds = 0,
    nanoseconds = 0,
    disambiguation = 'constrain'
  ) {
    years = ES.ToInteger(years);
    months = ES.ToInteger(months);
    days = ES.ToInteger(days);
    hours = ES.ToInteger(hours);
    minutes = ES.ToInteger(minutes);
    seconds = ES.ToInteger(seconds);
    milliseconds = ES.ToInteger(milliseconds);
    microseconds = ES.ToInteger(microseconds);
    nanoseconds = ES.ToInteger(nanoseconds);

    switch (ES.ToString(disambiguation)) {
      case 'reject':
        for (const prop of [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
          if (prop < 0) throw new RangeError('negative values not allowed as duration fields');
        }
        break;
      case 'constrain':
        const arr = [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds];
        for (const idx in arr) {
          if (arr[idx] < 0) arr[idx] = -arr[idx];
        }
        [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds] = arr;
        break;
      case 'balance':
        let tdays;
        ({
          days: tdays,
          hour: hours,
          minute: minutes,
          second: seconds,
          millisecond: milliseconds,
          microsecond: microseconds,
          nanosecond: nanoseconds
        } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
        days += tdays;
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
    }

    CreateSlots(this);
    SetSlot(this, YEARS, years);
    SetSlot(this, MONTHS, months);
    SetSlot(this, DAYS, days);
    SetSlot(this, HOURS, hours);
    SetSlot(this, MINUTES, minutes);
    SetSlot(this, SECONDS, seconds);
    SetSlot(this, MILLISECONDS, milliseconds);
    SetSlot(this, MICROSECONDS, microseconds);
    SetSlot(this, NANOSECONDS, nanoseconds);
  }
  get years() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEARS);
  }
  get months() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTHS);
  }
  get days() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAYS);
  }
  get hours() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, HOURS);
  }
  get minutes() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MINUTES);
  }
  get seconds() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, SECONDS);
  }
  get milliseconds() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MILLISECONDS);
  }
  get microseconds() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MICROSECONDS);
  }
  get nanoseconds() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, NANOSECONDS);
  }
  toString() {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    const dateParts = [];
    if (GetSlot(this, YEARS)) dateParts.push(`${GetSlot(this, YEARS)}Y`);
    if (GetSlot(this, MONTHS)) dateParts.push(`${GetSlot(this, MONTHS)}M`);
    if (GetSlot(this, DAYS)) dateParts.push(`${GetSlot(this, DAYS)}D`);

    const timeParts = [];
    if (GetSlot(this, HOURS)) timeParts.push(`${GetSlot(this, HOURS)}H`);
    if (GetSlot(this, MINUTES)) timeParts.push(`${GetSlot(this, MINUTES)}M`);

    const secondParts = [];
    if (GetSlot(this, NANOSECONDS)) secondParts.unshift(`000${GetSlot(this, NANOSECONDS)}`.slice(-3));
    if (GetSlot(this, MICROSECONDS) || secondParts.length)
      secondParts.unshift(`000${GetSlot(this, MICROSECONDS)}`.slice(-3));
    if (GetSlot(this, MILLISECONDS) || secondParts.length)
      secondParts.unshift(`000${GetSlot(this, MILLISECONDS)}`.slice(-3));
    if (secondParts.length) secondParts.unshift('.');
    if (GetSlot(this, SECONDS) || secondParts.length) secondParts.unshift(`${this.seconds}`);
    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
    if (timeParts.length) timeParts.unshift('T');
    if (!dateParts.length && !timeParts.length) return 'PT0S';
    return `P${dateParts.join('')}${timeParts.join('')}`;
  }
  toLocaleString(...args) {
    if (!ES.IsDuration(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  static from(arg) {
    let result = ES.ToDuration(arg);
    return this === Duration ? result : new this(
      GetSlot(result, YEARS),
      GetSlot(result, MONTHS),
      GetSlot(result, DAYS),
      GetSlot(result, HOURS),
      GetSlot(result, MINUTES),
      GetSlot(result, SECONDS),
      GetSlot(result, MILLISECONDS),
      GetSlot(result, MICROSECONDS),
      GetSlot(result, NANOSECONDS),
      'reject'
    );
  }
}
Duration.prototype.toJSON = Duration.prototype.toString;

MakeIntrinsicClass(Duration, 'Temporal.Duration');
