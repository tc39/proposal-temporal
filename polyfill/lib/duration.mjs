/* global __debug__ */

import {
  // constructors and similar
  IntlDurationFormat,

  // error constructors
  Error as ErrorCtor,
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  MathAbs,
  NumberIsNaN,
  ObjectCreate,
  ObjectDefineProperty,

  // miscellaneous
  warn
} from './primordials.mjs';

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
    if (
      roundingIncrement > 1 &&
      (ES.IsCalendarUnit(smallestUnit) || smallestUnit === 'day') &&
      largestUnit !== smallestUnit
    ) {
      throw new RangeErrorCtor('For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit');
    }

    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    if (zonedRelativeTo) {
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(relativeEpochNs, timeZone, calendar, {
        years,
        months,
        weeks,
        days,
        norm
      });
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferenceZonedDateTimeWithRounding(
          relativeEpochNs,
          targetEpochNs,
          timeZone,
          calendar,
          largestUnit,
          roundingIncrement,
          smallestUnit,
          roundingMode
        ));
    } else if (plainRelativeTo) {
      let targetTime = ES.AddTime(0, 0, 0, 0, 0, 0, norm);

      // Delegate the date part addition to the calendar
      const isoRelativeToDate = ES.TemporalObjectToISODateRecord(plainRelativeTo);
      const calendar = GetSlot(plainRelativeTo, CALENDAR);
      const dateDuration = { years, months, weeks, days: days + targetTime.deltaDays };
      const targetDate = ES.CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');

      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferencePlainDateTimeWithRounding(
          isoRelativeToDate.year,
          isoRelativeToDate.month,
          isoRelativeToDate.day,
          0,
          0,
          0,
          0,
          0,
          0,
          targetDate.year,
          targetDate.month,
          targetDate.day,
          targetTime.hour,
          targetTime.minute,
          targetTime.second,
          targetTime.millisecond,
          targetTime.microsecond,
          targetTime.nanosecond,
          calendar,
          largestUnit,
          roundingIncrement,
          smallestUnit,
          roundingMode
        ));
    } else {
      // No reference date to calculate difference relative to
      if (years !== 0 || months !== 0 || weeks !== 0) {
        throw new RangeErrorCtor('a starting point is required for years, months, or weeks balancing');
      }
      if (ES.IsCalendarUnit(largestUnit)) {
        throw new RangeErrorCtor(`a starting point is required for ${largestUnit}s balancing`);
      }
      if (ES.IsCalendarUnit(smallestUnit)) {
        throw new ErrorCtor('assertion failed: smallestUnit was larger than largestUnit');
      }
      ({ days, norm } = ES.RoundTimeDuration(days, norm, roundingIncrement, smallestUnit, roundingMode));
      ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceTimeDuration(
        norm.add24HourDays(days),
        largestUnit
      ));
    }

    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  total(totalOf) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
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

    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    if (zonedRelativeTo) {
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(relativeEpochNs, timeZone, calendar, {
        years,
        months,
        weeks,
        days,
        norm
      });
      const { total } = ES.DifferenceZonedDateTimeWithRounding(
        relativeEpochNs,
        targetEpochNs,
        timeZone,
        calendar,
        unit,
        1,
        unit,
        'trunc'
      );
      if (NumberIsNaN(total)) throw new ErrorCtor('assertion failed: total hit unexpected code path');
      return total;
    }

    if (plainRelativeTo) {
      let targetTime = ES.AddTime(0, 0, 0, 0, 0, 0, norm);

      // Delegate the date part addition to the calendar
      const isoRelativeToDate = ES.TemporalObjectToISODateRecord(plainRelativeTo);
      const calendar = GetSlot(plainRelativeTo, CALENDAR);
      const dateDuration = { years, months, weeks, days: days + targetTime.deltaDays };
      const targetDate = ES.CalendarDateAdd(calendar, isoRelativeToDate, dateDuration, 'constrain');

      const { total } = ES.DifferencePlainDateTimeWithRounding(
        isoRelativeToDate.year,
        isoRelativeToDate.month,
        isoRelativeToDate.day,
        0,
        0,
        0,
        0,
        0,
        0,
        targetDate.year,
        targetDate.month,
        targetDate.day,
        targetTime.hour,
        targetTime.minute,
        targetTime.second,
        targetTime.millisecond,
        targetTime.microsecond,
        targetTime.nanosecond,
        calendar,
        unit,
        1,
        unit,
        'trunc'
      );
      if (NumberIsNaN(total)) throw new ErrorCtor('assertion failed: total hit unexpected code path');
      return total;
    }

    // No reference date to calculate difference relative to
    if (years !== 0 || months !== 0 || weeks !== 0) {
      throw new RangeErrorCtor('a starting point is required for years, months, or weeks total');
    }
    if (ES.IsCalendarUnit(unit)) {
      throw new RangeErrorCtor(`a starting point is required for ${unit}s total`);
    }
    norm = norm.add24HourDays(days);
    const { total } = ES.RoundTimeDuration(0, norm, 1, unit, 'trunc');
    return total;
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeErrorCtor('invalid receiver');
    options = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(options);
    const roundingMode = ES.GetRoundingModeOption(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour' || smallestUnit === 'minute') {
      throw new RangeErrorCtor('smallestUnit must be a time unit other than "hours" or "minutes"');
    }
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);

    if (unit === 'nanosecond' && increment === 1) return ES.TemporalDurationToString(this, precision);

    const years = GetSlot(this, YEARS);
    const months = GetSlot(this, MONTHS);
    const weeks = GetSlot(this, WEEKS);
    const days = GetSlot(this, DAYS);
    let hours = GetSlot(this, HOURS);
    let minutes = GetSlot(this, MINUTES);
    let seconds = GetSlot(this, SECONDS);
    let milliseconds = GetSlot(this, MILLISECONDS);
    let microseconds = GetSlot(this, MICROSECONDS);
    let nanoseconds = GetSlot(this, NANOSECONDS);
    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    const largestUnit = ES.DefaultTemporalLargestUnit(this);
    ({ norm } = ES.RoundTimeDuration(0, norm, increment, unit, roundingMode));
    let deltaDays;
    ({
      days: deltaDays,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.BalanceTimeDuration(norm, ES.LargerOfTwoTemporalUnits(largestUnit, 'second')));
    const roundedDuration = new Duration(
      years,
      months,
      weeks,
      days + deltaDays,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
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
    if (ES.IsTemporalDuration(item)) {
      return new Duration(
        GetSlot(item, YEARS),
        GetSlot(item, MONTHS),
        GetSlot(item, WEEKS),
        GetSlot(item, DAYS),
        GetSlot(item, HOURS),
        GetSlot(item, MINUTES),
        GetSlot(item, SECONDS),
        GetSlot(item, MILLISECONDS),
        GetSlot(item, MICROSECONDS),
        GetSlot(item, NANOSECONDS)
      );
    }
    return ES.ToTemporalDuration(item);
  }
  static compare(one, two, options = undefined) {
    one = ES.ToTemporalDuration(one);
    two = ES.ToTemporalDuration(two);
    options = ES.GetOptionsObject(options);
    const { plainRelativeTo, zonedRelativeTo } = ES.GetTemporalRelativeToOption(options);
    const y1 = GetSlot(one, YEARS);
    const mon1 = GetSlot(one, MONTHS);
    const w1 = GetSlot(one, WEEKS);
    let d1 = GetSlot(one, DAYS);
    let h1 = GetSlot(one, HOURS);
    const min1 = GetSlot(one, MINUTES);
    const s1 = GetSlot(one, SECONDS);
    const ms1 = GetSlot(one, MILLISECONDS);
    const µs1 = GetSlot(one, MICROSECONDS);
    let ns1 = GetSlot(one, NANOSECONDS);
    const y2 = GetSlot(two, YEARS);
    const mon2 = GetSlot(two, MONTHS);
    const w2 = GetSlot(two, WEEKS);
    let d2 = GetSlot(two, DAYS);
    let h2 = GetSlot(two, HOURS);
    const min2 = GetSlot(two, MINUTES);
    const s2 = GetSlot(two, SECONDS);
    const ms2 = GetSlot(two, MILLISECONDS);
    const µs2 = GetSlot(two, MICROSECONDS);
    let ns2 = GetSlot(two, NANOSECONDS);

    if (
      y1 === y2 &&
      mon1 === mon2 &&
      w1 === w2 &&
      d1 === d2 &&
      h1 === h2 &&
      min1 === min2 &&
      s1 === s2 &&
      ms1 === ms2 &&
      µs1 === µs2 &&
      ns1 === ns2
    ) {
      return 0;
    }

    const calendarUnitsPresent = y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0;

    if (zonedRelativeTo && (calendarUnitsPresent || d1 != 0 || d2 !== 0)) {
      const timeZone = GetSlot(zonedRelativeTo, TIME_ZONE);
      const calendar = GetSlot(zonedRelativeTo, CALENDAR);
      const epochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);

      const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
      const duration1 = { years: y1, months: mon1, weeks: w1, days: d1, norm: norm1 };
      const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
      const duration2 = { years: y2, months: mon2, weeks: w2, days: d2, norm: norm2 };
      const after1 = ES.AddZonedDateTime(epochNs, timeZone, calendar, duration1);
      const after2 = ES.AddZonedDateTime(epochNs, timeZone, calendar, duration2);
      return ES.ComparisonResult(after1.minus(after2).toJSNumber());
    }

    if (calendarUnitsPresent) {
      if (!plainRelativeTo) {
        throw new RangeErrorCtor('A starting point is required for years, months, or weeks comparison');
      }
      const dateDuration1 = { years: y1, months: mon1, weeks: w1, days: d1 };
      d1 = ES.UnbalanceDateDurationRelative(dateDuration1, plainRelativeTo);
      const dateDuration2 = { years: y2, months: mon2, weeks: w2, days: d2 };
      d2 = ES.UnbalanceDateDurationRelative(dateDuration2, plainRelativeTo);
    }
    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1).add24HourDays(d1);
    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2).add24HourDays(d2);
    return norm1.cmp(norm2);
  }
}

MakeIntrinsicClass(Duration, 'Temporal.Duration');
