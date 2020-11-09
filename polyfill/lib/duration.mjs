/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  YEARS,
  MONTHS,
  WEEKS,
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

export class Duration {
  constructor(
    years = 0,
    months = 0,
    weeks = 0,
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
    weeks = ES.ToInteger(weeks);
    days = ES.ToInteger(days);
    hours = ES.ToInteger(hours);
    minutes = ES.ToInteger(minutes);
    seconds = ES.ToInteger(seconds);
    milliseconds = ES.ToInteger(milliseconds);
    microseconds = ES.ToInteger(microseconds);
    nanoseconds = ES.ToInteger(nanoseconds);

    const sign = ES.DurationSign(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    for (const prop of [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
      if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
      const propSign = Math.sign(prop);
      if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
    }

    CreateSlots(this);
    SetSlot(this, YEARS, years);
    SetSlot(this, MONTHS, months);
    SetSlot(this, WEEKS, weeks);
    SetSlot(this, DAYS, days);
    SetSlot(this, HOURS, hours);
    SetSlot(this, MINUTES, minutes);
    SetSlot(this, SECONDS, seconds);
    SetSlot(this, MILLISECONDS, milliseconds);
    SetSlot(this, MICROSECONDS, microseconds);
    SetSlot(this, NANOSECONDS, nanoseconds);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${ES.TemporalDurationToString(this)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get years() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEARS);
  }
  get months() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTHS);
  }
  get weeks() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, WEEKS);
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
  get sign() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.DurationSign(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, WEEKS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS)
    );
  }
  get blank() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return (
      ES.DurationSign(
        GetSlot(this, YEARS),
        GetSlot(this, MONTHS),
        GetSlot(this, WEEKS),
        GetSlot(this, DAYS),
        GetSlot(this, HOURS),
        GetSlot(this, MINUTES),
        GetSlot(this, SECONDS),
        GetSlot(this, MILLISECONDS),
        GetSlot(this, MICROSECONDS),
        GetSlot(this, NANOSECONDS)
      ) === 0
    );
  }
  with(durationLike) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const props = ES.ToPartialRecord(durationLike, [
      'days',
      'hours',
      'microseconds',
      'milliseconds',
      'minutes',
      'months',
      'nanoseconds',
      'seconds',
      'weeks',
      'years'
    ]);
    if (!props) {
      throw new TypeError('invalid duration-like');
    }
    let {
      years = GetSlot(this, YEARS),
      months = GetSlot(this, MONTHS),
      weeks = GetSlot(this, WEEKS),
      days = GetSlot(this, DAYS),
      hours = GetSlot(this, HOURS),
      minutes = GetSlot(this, MINUTES),
      seconds = GetSlot(this, SECONDS),
      milliseconds = GetSlot(this, MILLISECONDS),
      microseconds = GetSlot(this, MICROSECONDS),
      nanoseconds = GetSlot(this, NANOSECONDS)
    } = props;
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  negated() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      -GetSlot(this, YEARS),
      -GetSlot(this, MONTHS),
      -GetSlot(this, WEEKS),
      -GetSlot(this, DAYS),
      -GetSlot(this, HOURS),
      -GetSlot(this, MINUTES),
      -GetSlot(this, SECONDS),
      -GetSlot(this, MILLISECONDS),
      -GetSlot(this, MICROSECONDS),
      -GetSlot(this, NANOSECONDS)
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  abs() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      Math.abs(GetSlot(this, YEARS)),
      Math.abs(GetSlot(this, MONTHS)),
      Math.abs(GetSlot(this, WEEKS)),
      Math.abs(GetSlot(this, DAYS)),
      Math.abs(GetSlot(this, HOURS)),
      Math.abs(GetSlot(this, MINUTES)),
      Math.abs(GetSlot(this, SECONDS)),
      Math.abs(GetSlot(this, MILLISECONDS)),
      Math.abs(GetSlot(this, MICROSECONDS)),
      Math.abs(GetSlot(this, NANOSECONDS))
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  add(other, options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    let {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(other);
    options = ES.NormalizeOptionsObject(options);
    const relativeTo = ES.ToRelativeTemporalObject(options);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.AddDuration(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, WEEKS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS),
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      relativeTo
    ));
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(other, options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    let {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(other);
    options = ES.NormalizeOptionsObject(options);
    const relativeTo = ES.ToRelativeTemporalObject(options);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.AddDuration(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, WEEKS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS),
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds,
      relativeTo
    ));
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  round(options) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    let years = GetSlot(this, YEARS);
    let months = GetSlot(this, MONTHS);
    let weeks = GetSlot(this, WEEKS);
    let days = GetSlot(this, DAYS);
    let hours = GetSlot(this, HOURS);
    let minutes = GetSlot(this, MINUTES);
    let seconds = GetSlot(this, SECONDS);
    let milliseconds = GetSlot(this, MILLISECONDS);
    let microseconds = GetSlot(this, MICROSECONDS);
    let nanoseconds = GetSlot(this, NANOSECONDS);

    let defaultLargestUnit = ES.DefaultTemporalLargestUnit(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits(defaultLargestUnit, smallestUnit);
    const relativeTo = ES.ToRelativeTemporalObject(options);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    ({ years, months, weeks, days } = ES.UnbalanceDurationRelative(
      years,
      months,
      weeks,
      days,
      largestUnit,
      relativeTo
    ));
    ({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      relativeTo
    ));
    ({ years, months, weeks, days } = ES.BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  total(options) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    let years = GetSlot(this, YEARS);
    let months = GetSlot(this, MONTHS);
    let weeks = GetSlot(this, WEEKS);
    let days = GetSlot(this, DAYS);
    let hours = GetSlot(this, HOURS);
    let minutes = GetSlot(this, MINUTES);
    let seconds = GetSlot(this, SECONDS);
    let milliseconds = GetSlot(this, MILLISECONDS);
    let microseconds = GetSlot(this, MICROSECONDS);
    let nanoseconds = GetSlot(this, NANOSECONDS);

    options = ES.NormalizeOptionsObject(options);
    const unit = ES.ToTemporalDurationTotalUnit(options, undefined);
    if (unit === undefined) throw new RangeError('unit option is required');
    const relativeTo = ES.ToRelativeTemporalObject(options);

    // Convert larger units down to days
    ({ years, months, weeks, days } = ES.UnbalanceDurationRelative(years, months, weeks, days, unit, relativeTo));
    // If the unit we're totalling is smaller than `days`, convert days down to that unit.
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      unit
    ));
    // Finally, truncate to the correct unit and calculate remainder
    const rounded = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      1,
      unit,
      'trunc',
      relativeTo
    );
    return rounded[unit] + rounded.remainder;
  }
  getFields() {
    const fields = ES.ToRecord(this, [
      ['days'],
      ['hours'],
      ['microseconds'],
      ['milliseconds'],
      ['minutes'],
      ['months'],
      ['nanoseconds'],
      ['seconds'],
      ['weeks'],
      ['years']
    ]);
    if (!fields) throw new TypeError('invalid receiver');
    return fields;
  }
  toString() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDurationToString(this);
  }
  toJSON() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDurationToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
      return new Intl.DurationFormat(locales, options).format(this);
    }
    console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
    return ES.TemporalDurationToString(this);
  }
  valueOf() {
    throw new TypeError('use compare() to compare Temporal.Duration');
  }
  static from(item) {
    if (ES.IsTemporalDuration(item)) {
      const years = GetSlot(item, YEARS);
      const months = GetSlot(item, MONTHS);
      const weeks = GetSlot(item, WEEKS);
      const days = GetSlot(item, DAYS);
      const hours = GetSlot(item, HOURS);
      const minutes = GetSlot(item, MINUTES);
      const seconds = GetSlot(item, SECONDS);
      const milliseconds = GetSlot(item, MILLISECONDS);
      const microseconds = GetSlot(item, MICROSECONDS);
      const nanoseconds = GetSlot(item, NANOSECONDS);
      const result = new this(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      );
      if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalDuration(item, this);
  }
  static compare(one, two, options = undefined) {
    one = ES.ToTemporalDuration(one, Duration);
    two = ES.ToTemporalDuration(two, Duration);
    options = ES.NormalizeOptionsObject(options);
    const relativeTo = ES.ToRelativeTemporalObject(options);
    const y1 = GetSlot(one, YEARS);
    const mon1 = GetSlot(one, MONTHS);
    const w1 = GetSlot(one, WEEKS);
    let d1 = GetSlot(one, DAYS);
    const h1 = GetSlot(one, HOURS);
    const min1 = GetSlot(one, MINUTES);
    const s1 = GetSlot(one, SECONDS);
    const ms1 = GetSlot(one, MILLISECONDS);
    const µs1 = GetSlot(one, MICROSECONDS);
    let ns1 = GetSlot(one, NANOSECONDS);
    const y2 = GetSlot(two, YEARS);
    const mon2 = GetSlot(two, MONTHS);
    const w2 = GetSlot(two, WEEKS);
    let d2 = GetSlot(two, DAYS);
    const h2 = GetSlot(two, HOURS);
    const min2 = GetSlot(two, MINUTES);
    const s2 = GetSlot(two, SECONDS);
    const ms2 = GetSlot(two, MILLISECONDS);
    const µs2 = GetSlot(two, MICROSECONDS);
    let ns2 = GetSlot(two, NANOSECONDS);
    const shift1 = ES.CalculateOffsetShift(relativeTo, y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
    const shift2 = ES.CalculateOffsetShift(relativeTo, y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
    if (y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0) {
      ({ days: d1 } = ES.UnbalanceDurationRelative(y1, mon1, w1, d1, 'days', relativeTo));
      ({ days: d2 } = ES.UnbalanceDurationRelative(y2, mon2, w2, d2, 'days', relativeTo));
    }
    ns1 = ES.TotalDurationNanoseconds(d1, h1, min1, s1, ms1, µs1, ns1, shift1);
    ns2 = ES.TotalDurationNanoseconds(d2, h2, min2, s2, ms2, µs2, ns2, shift2);
    return ES.ComparisonResult(ns1.minus(ns2).toJSNumber());
  }
}

MakeIntrinsicClass(Duration, 'Temporal.Duration');
