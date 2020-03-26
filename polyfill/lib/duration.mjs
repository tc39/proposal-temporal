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
  with(durationLike, options) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const props = ES.ToPartialRecord(durationLike, [
      'days',
      'hours',
      'microseconds',
      'milliseconds',
      'minutes',
      'months',
      'nanoseconds',
      'seconds',
      'years'
    ]);
    if (!props) {
      throw new RangeError('invalid duration-like');
    }
    let {
      years = GetSlot(this, YEARS),
      months = GetSlot(this, MONTHS),
      days = GetSlot(this, DAYS),
      hours = GetSlot(this, HOURS),
      minutes = GetSlot(this, MINUTES),
      seconds = GetSlot(this, SECONDS),
      milliseconds = GetSlot(this, MILLISECONDS),
      microseconds = GetSlot(this, MICROSECONDS),
      nanoseconds = GetSlot(this, NANOSECONDS)
    } = props;
    ({ years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.RegulateDuration(
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(other, options) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    other = ES.ToLimitedTemporalDuration(other);
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.AddDuration(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS),
      GetSlot(other, YEARS),
      GetSlot(other, MONTHS),
      GetSlot(other, DAYS),
      GetSlot(other, HOURS),
      GetSlot(other, MINUTES),
      GetSlot(other, SECONDS),
      GetSlot(other, MILLISECONDS),
      GetSlot(other, MICROSECONDS),
      GetSlot(other, NANOSECONDS),
      disambiguation
    );
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(other, options) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    other = ES.ToLimitedTemporalDuration(other);
    const disambiguation = ES.ToDurationSubtractionTemporalDisambiguation(options);
    const {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.SubtractDuration(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS),
      GetSlot(other, YEARS),
      GetSlot(other, MONTHS),
      GetSlot(other, DAYS),
      GetSlot(other, HOURS),
      GetSlot(other, MINUTES),
      GetSlot(other, SECONDS),
      GetSlot(other, MILLISECONDS),
      GetSlot(other, MICROSECONDS),
      GetSlot(other, NANOSECONDS),
      disambiguation
    );
    const Construct = ES.SpeciesConstructor(this, Duration);
    const result = new Construct(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  }
  toString() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDurationToString(this);
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
