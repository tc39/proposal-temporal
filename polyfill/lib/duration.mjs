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

import bigInt from 'big-integer';

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
    nanoseconds = 0
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

    for (const prop of [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
      if (prop < 0) throw new RangeError('negative values not allowed as duration fields');
      if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
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
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEARS);
  }
  get months() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTHS);
  }
  get days() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAYS);
  }
  get hours() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, HOURS);
  }
  get minutes() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MINUTES);
  }
  get seconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, SECONDS);
  }
  get milliseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MILLISECONDS);
  }
  get microseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MICROSECONDS);
  }
  get nanoseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, NANOSECONDS);
  }
  toString() {
    function formatNumber(num) {
      if (num <= Number.MAX_SAFE_INTEGER) return num.toString(10);
      return bigInt(num).toString();
    }
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const dateParts = [];
    if (GetSlot(this, YEARS)) dateParts.push(`${formatNumber(GetSlot(this, YEARS))}Y`);
    if (GetSlot(this, MONTHS)) dateParts.push(`${formatNumber(GetSlot(this, MONTHS))}M`);
    if (GetSlot(this, DAYS)) dateParts.push(`${formatNumber(GetSlot(this, DAYS))}D`);

    const timeParts = [];
    if (GetSlot(this, HOURS)) timeParts.push(`${formatNumber(GetSlot(this, HOURS))}H`);
    if (GetSlot(this, MINUTES)) timeParts.push(`${formatNumber(GetSlot(this, MINUTES))}M`);

    const secondParts = [];
    let ms = GetSlot(this, MILLISECONDS);
    let µs = GetSlot(this, MICROSECONDS);
    let ns = GetSlot(this, NANOSECONDS);
    let seconds;
    ({ seconds, millisecond: ms, microsecond: µs, nanosecond: ns } = ES.BalanceSubSecond(ms, µs, ns));
    const s = GetSlot(this, SECONDS) + seconds;
    if (ns) secondParts.unshift(`${ns}`.padStart(3, '0'));
    if (µs || secondParts.length) secondParts.unshift(`${µs}`.padStart(3, '0'));
    if (ms || secondParts.length) secondParts.unshift(`${ms}`.padStart(3, '0'));
    if (secondParts.length) secondParts.unshift('.');
    if (s || secondParts.length) secondParts.unshift(formatNumber(s));
    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
    if (timeParts.length) timeParts.unshift('T');
    if (!dateParts.length && !timeParts.length) return 'PT0S';
    return `P${dateParts.join('')}${timeParts.join('')}`;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
      return new Intl.DurationFormat(...args).format(this);
    }
    console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
    return ES.TemporalDurationToString(this);
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let result = ES.ToTemporalDuration(item, disambiguation);
    if (this === Duration) return result;
    return new this(
      GetSlot(result, YEARS),
      GetSlot(result, MONTHS),
      GetSlot(result, DAYS),
      GetSlot(result, HOURS),
      GetSlot(result, MINUTES),
      GetSlot(result, SECONDS),
      GetSlot(result, MILLISECONDS),
      GetSlot(result, MICROSECONDS),
      GetSlot(result, NANOSECONDS)
    );
  }
}
Duration.prototype.toJSON = Duration.prototype.toString;

MakeIntrinsicClass(Duration, 'Temporal.Duration');
