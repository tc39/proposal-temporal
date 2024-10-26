/* global __debug__ */

import {
  // constructors and similar
  IntlDurationFormat,

  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  MathAbs,
  ObjectCreate,
  ObjectDefineProperty,

  // miscellaneous
  warn
} from './primordials.mjs';
import { assert } from './assert.mjs';
import * as ES from './ecmascript.mjs';
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
  CALENDAR,
  EPOCHNANOSECONDS,
  CreateSlots,
  GetSlot,
  ISO_DATE,
  SetSlot,
  TIME_ZONE
} from './slots.mjs';
import { TimeDuration } from './timeduration.mjs';

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
    years = years === undefined ? 0 : ES.ToIntegerIfIntegral(years);
    months = months === undefined ? 0 : ES.ToIntegerIfIntegral(months);
    weeks = weeks === undefined ? 0 : ES.ToIntegerIfIntegral(weeks);
    days = days === undefined ? 0 : ES.ToIntegerIfIntegral(days);
    hours = hours === undefined ? 0 : ES.ToIntegerIfIntegral(hours);
    minutes = minutes === undefined ? 0 : ES.ToIntegerIfIntegral(minutes);
    seconds = seconds === undefined ? 0 : ES.ToIntegerIfIntegral(seconds);
    milliseconds = milliseconds === undefined ? 0 : ES.ToIntegerIfIntegral(milliseconds);
    microseconds = microseconds === undefined ? 0 : ES.ToIntegerIfIntegral(microseconds);
    nanoseconds = nanoseconds === undefined ? 0 : ES.ToIntegerIfIntegral(nanoseconds);

    ES.RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

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
      ObjectDefineProperty(this, '_repr_', {
        value: `Temporal.Duration <${ES.TemporalDurationToString(this, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get years() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, YEARS);
  }
  get months() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, MONTHS);
  }
  get weeks() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, WEEKS);
  }
  get days() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, DAYS);
  }
  get hours() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, HOURS);
  }
  get minutes() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, MINUTES);
  }
  get seconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, SECONDS);
  }
  get milliseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, MILLISECONDS);
  }
  get microseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, MICROSECONDS);
  }
  get nanoseconds() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, NANOSECONDS);
  }
  get sign() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DurationSign(this);
  }
  get blank() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DurationSign(this) === 0;
  }
  with(durationLike) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    const partialDuration = ES.ToTemporalPartialDurationRecord(durationLike);
    const {
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
    } = partialDuration;
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  negated() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateNegatedTemporalDuration(this);
  }
  abs() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return new Duration(
      MathAbs(GetSlot(this, YEARS)),
      MathAbs(GetSlot(this, MONTHS)),
      MathAbs(GetSlot(this, WEEKS)),
      MathAbs(GetSlot(this, DAYS)),
      MathAbs(GetSlot(this, HOURS)),
      MathAbs(GetSlot(this, MINUTES)),
      MathAbs(GetSlot(this, SECONDS)),
      MathAbs(GetSlot(this, MILLISECONDS)),
      MathAbs(GetSlot(this, MICROSECONDS)),
      MathAbs(GetSlot(this, NANOSECONDS))
    );
  }
  add(other) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurations('add', this, other);
  }
  subtract(other) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurations('subtract', this, other);
  }
  round(roundTo) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    if (roundTo === undefined) throw new TypeErrorCtor('options parameter is required');

    const existingLargestUnit = ES.DefaultTemporalLargestUnit(this);
    if (ES.Type(roundTo) === 'String') {
      const stringParam = roundTo;
      roundTo = ObjectCreate(null);
      roundTo.smallestUnit = stringParam;
    } else {
      roundTo = ES.GetOptionsObject(roundTo);
    }

    let largestUnit = ES.GetTemporalUnitValuedOption(roundTo, 'largestUnit', 'datetime', undefined, ['auto']);
    let { plainRelativeTo, zonedRelativeTo } = ES.GetTemporalRelativeToOption(roundTo);
    const roundingIncrement = ES.GetRoundingIncrementOption(roundTo);
    const roundingMode = ES.GetRoundingModeOption(roundTo, 'halfExpand');
    let smallestUnit = ES.GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'datetime', undefined);

    let smallestUnitPresent = true;
    if (!smallestUnit) {
      smallestUnitPresent = false;
      smallestUnit = 'nanosecond';
    }
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits(existingLargestUnit, smallestUnit);
    let largestUnitPresent = true;
    if (!largestUnit) {
      largestUnitPresent = false;
      largestUnit = defaultLargestUnit;
    }
    if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
    if (!smallestUnitPresent && !largestUnitPresent) {
      throw new RangeErrorCtor('at least one of smallestUnit or largestUnit is required');
    }
    if (ES.LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
      throw new RangeErrorCtor(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
    }

    const maximumIncrements = {
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const maximum = maximumIncrements[smallestUnit];
    if (maximum !== undefined) ES.ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false);
    if (roundingIncrement > 1 && ES.TemporalUnitCategory(smallestUnit) === 'date' && largestUnit !== smallestUnit) {
      throw new RangeErrorCtor('For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit');
    }

    if (zonedRelativeTo) {
      let duration = ES.ToInternalDurationRecord(this);
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(relativeEpochNs, timeZone, calendar, duration);
      duration = ES.DifferenceZonedDateTimeWithRounding(
        relativeEpochNs,
        targetEpochNs,
        timeZone,
        calendar,
        largestUnit,
        roundingIncrement,
        smallestUnit,
        roundingMode
      );
      if (ES.TemporalUnitCategory(largestUnit) === 'date') largestUnit = 'hour';
      return ES.TemporalDurationFromInternal(duration, largestUnit);
    }

    if (plainRelativeTo) {
      let duration = ES.ToInternalDurationRecordWith24HourDays(this);
      const targetTime = ES.AddTime(ES.MidnightTimeRecord(), duration.time);

      // Delegate the date part addition to the calendar
      const isoRelativeToDate = GetSlot(plainRelativeTo, ISO_DATE);
      const calendar = GetSlot(plainRelativeTo, CALENDAR);
      const dateDuration = ES.AdjustDateDurationRecord(duration.date, targetTime.deltaDays);
      const targetDate = ES.CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');

      const isoDateTime = ES.CombineISODateAndTimeRecord(isoRelativeToDate, ES.MidnightTimeRecord());
      const targetDateTime = ES.CombineISODateAndTimeRecord(targetDate, targetTime);
      duration = ES.DifferencePlainDateTimeWithRounding(
        isoDateTime,
        targetDateTime,
        calendar,
        largestUnit,
        roundingIncrement,
        smallestUnit,
        roundingMode
      );
      return ES.TemporalDurationFromInternal(duration, largestUnit);
    }

    // No reference date to calculate difference relative to
    if (ES.IsCalendarUnit(existingLargestUnit)) {
      throw new RangeErrorCtor(`a starting point is required for ${existingLargestUnit}s balancing`);
    }
    if (ES.IsCalendarUnit(largestUnit)) {
      throw new RangeErrorCtor(`a starting point is required for ${largestUnit}s balancing`);
    }
    assert(!ES.IsCalendarUnit(smallestUnit), 'smallestUnit was larger than largestUnit');
    let internalDuration = ES.ToInternalDurationRecordWith24HourDays(this);
    if (smallestUnit === 'day') {
      // First convert time units up to days
      const DAY_NANOS = 86400 * 1e9;
      const { quotient, remainder } = internalDuration.time.divmod(DAY_NANOS);
      let days = internalDuration.date.days + quotient + ES.TotalTimeDuration(remainder, 'day');
      days = ES.RoundNumberToIncrement(days, roundingIncrement, roundingMode);
      const dateDuration = { years: 0, months: 0, weeks: 0, days };
      internalDuration = ES.CombineDateAndTimeDuration(dateDuration, TimeDuration.ZERO);
    } else {
      const timeDuration = ES.RoundTimeDuration(internalDuration.time, roundingIncrement, smallestUnit, roundingMode);
      internalDuration = ES.CombineDateAndTimeDuration(ES.ZeroDateDuration(), timeDuration);
    }
    return ES.TemporalDurationFromInternal(internalDuration, largestUnit);
  }
  total(totalOf) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');

    if (totalOf === undefined) throw new TypeErrorCtor('options argument is required');
    if (ES.Type(totalOf) === 'String') {
      const stringParam = totalOf;
      totalOf = ObjectCreate(null);
      totalOf.unit = stringParam;
    } else {
      totalOf = ES.GetOptionsObject(totalOf);
    }
    let { plainRelativeTo, zonedRelativeTo } = ES.GetTemporalRelativeToOption(totalOf);
    const unit = ES.GetTemporalUnitValuedOption(totalOf, 'unit', 'datetime', ES.REQUIRED);

    if (zonedRelativeTo) {
      const duration = ES.ToInternalDurationRecord(this);
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(relativeEpochNs, timeZone, calendar, duration);
      return ES.DifferenceZonedDateTimeWithTotal(relativeEpochNs, targetEpochNs, timeZone, calendar, unit);
    }

    if (plainRelativeTo) {
      const duration = ES.ToInternalDurationRecordWith24HourDays(this);
      let targetTime = ES.AddTime(ES.MidnightTimeRecord(), duration.time);

      // Delegate the date part addition to the calendar
      const isoRelativeToDate = GetSlot(plainRelativeTo, ISO_DATE);
      const calendar = GetSlot(plainRelativeTo, CALENDAR);
      const dateDuration = ES.AdjustDateDurationRecord(duration.date, targetTime.deltaDays);
      const targetDate = ES.CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');

      const isoDateTime = ES.CombineISODateAndTimeRecord(isoRelativeToDate, ES.MidnightTimeRecord());
      const targetDateTime = ES.CombineISODateAndTimeRecord(targetDate, targetTime);
      return ES.DifferencePlainDateTimeWithTotal(isoDateTime, targetDateTime, calendar, unit);
    }

    // No reference date to calculate difference relative to
    const largestUnit = ES.DefaultTemporalLargestUnit(this);
    if (ES.IsCalendarUnit(largestUnit)) {
      throw new RangeErrorCtor(`a starting point is required for ${largestUnit}s total`);
    }
    if (ES.IsCalendarUnit(unit)) {
      throw new RangeErrorCtor(`a starting point is required for ${unit}s total`);
    }
    const duration = ES.ToInternalDurationRecordWith24HourDays(this);
    return ES.TotalTimeDuration(duration.time, unit);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour' || smallestUnit === 'minute') {
      throw new RangeErrorCtor('smallestUnit must be a time unit other than "hours" or "minutes"');
    }
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);

    if (unit === 'nanosecond' && increment === 1) return ES.TemporalDurationToString(this, precision);

    const largestUnit = ES.DefaultTemporalLargestUnit(this);
    let internalDuration = ES.ToInternalDurationRecord(this);
    const timeDuration = ES.RoundTimeDuration(internalDuration.time, increment, unit, roundingMode);
    internalDuration = ES.CombineDateAndTimeDuration(internalDuration.date, timeDuration);
    const roundedDuration = ES.TemporalDurationFromInternal(
      internalDuration,
      ES.LargerOfTwoTemporalUnits(largestUnit, 'second')
    );
    return ES.TemporalDurationToString(roundedDuration, precision);
  }
  toJSON() {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalDurationToString(this, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    if (typeof IntlDurationFormat === 'function') {
      return new IntlDurationFormat(locales, options).format(this);
    }
    warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
    return ES.TemporalDurationToString(this, 'auto');
  }
  valueOf() {
    ES.ValueOfThrows('Duration');
  }
  static from(item) {
    return ES.ToTemporalDuration(item);
  }
  static compare(one, two, options = undefined) {
    one = ES.ToTemporalDuration(one);
    two = ES.ToTemporalDuration(two);
    const resolvedOptions = ES.GetOptionsObject(options);
    const { plainRelativeTo, zonedRelativeTo } = ES.GetTemporalRelativeToOption(resolvedOptions);

    if (
      GetSlot(one, YEARS) === GetSlot(two, YEARS) &&
      GetSlot(one, MONTHS) === GetSlot(two, MONTHS) &&
      GetSlot(one, WEEKS) === GetSlot(two, WEEKS) &&
      GetSlot(one, DAYS) === GetSlot(two, DAYS) &&
      GetSlot(one, HOURS) === GetSlot(two, HOURS) &&
      GetSlot(one, MINUTES) === GetSlot(two, MINUTES) &&
      GetSlot(one, SECONDS) === GetSlot(two, SECONDS) &&
      GetSlot(one, MILLISECONDS) === GetSlot(two, MILLISECONDS) &&
      GetSlot(one, MICROSECONDS) === GetSlot(two, MICROSECONDS) &&
      GetSlot(one, NANOSECONDS) === GetSlot(two, NANOSECONDS)
    ) {
      return 0;
    }

    const largestUnit1 = ES.DefaultTemporalLargestUnit(one);
    const largestUnit2 = ES.DefaultTemporalLargestUnit(two);
    const duration1 = ES.ToInternalDurationRecord(one);
    const duration2 = ES.ToInternalDurationRecord(two);

    if (
      zonedRelativeTo &&
      (ES.TemporalUnitCategory(largestUnit1) === 'date' || ES.TemporalUnitCategory(largestUnit2) === 'date')
    ) {
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const epochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);

      const after1 = ES.AddZonedDateTime(epochNs, timeZone, calendar, duration1);
      const after2 = ES.AddZonedDateTime(epochNs, timeZone, calendar, duration2);
      return ES.ComparisonResult(after1.minus(after2).toJSNumber());
    }

    let d1 = duration1.date.days;
    let d2 = duration2.date.days;
    if (ES.IsCalendarUnit(largestUnit1) || ES.IsCalendarUnit(largestUnit2)) {
      if (!plainRelativeTo) {
        throw new RangeErrorCtor('A starting point is required for years, months, or weeks comparison');
      }
      d1 = ES.DateDurationDays(duration1.date, plainRelativeTo);
      d2 = ES.DateDurationDays(duration2.date, plainRelativeTo);
    }
    const timeDuration1 = duration1.time.add24HourDays(d1);
    const timeDuration2 = duration2.time.add24HourDays(d2);
    return timeDuration1.cmp(timeDuration2);
  }
}

MakeIntrinsicClass(Duration, 'Temporal.Duration');
