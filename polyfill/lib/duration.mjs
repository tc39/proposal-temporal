/* global __debug__ */

import * as ES from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CalendarMethodRecord } from './methodrecord.mjs';
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
  INSTANT,
  EPOCHNANOSECONDS,
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';
import { TimeDuration } from './timeduration.mjs';

const MathAbs = Math.abs;
const NumberIsNaN = Number.isNaN;
const ObjectCreate = Object.create;

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
      const normSeconds = TimeDuration.normalize(0, 0, seconds, milliseconds, microseconds, nanoseconds);
      Object.defineProperty(this, '_repr_', {
        value: `Temporal.Duration <${ES.TemporalDurationToString(
          years,
          months,
          weeks,
          days,
          hours,
          minutes,
          normSeconds
        )}>`,
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
    const partialDuration = ES.PrepareTemporalFields(
      durationLike,
      [
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
      ],
      'partial'
    );
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
    } = partialDuration;
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  negated() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.CreateNegatedTemporalDuration(this);
  }
  abs() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return new Duration(
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
  }
  add(other) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.AddDurations('add', this, other);
  }
  subtract(other) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    return ES.AddDurations('subtract', this, other);
  }
  round(roundTo) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    if (roundTo === undefined) throw new TypeError('options parameter is required');
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

    const existingLargestUnit = ES.DefaultTemporalLargestUnit(
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
    if (ES.Type(roundTo) === 'String') {
      const stringParam = roundTo;
      roundTo = ObjectCreate(null);
      roundTo.smallestUnit = stringParam;
    } else {
      roundTo = ES.GetOptionsObject(roundTo);
    }

    let largestUnit = ES.GetTemporalUnitValuedOption(roundTo, 'largestUnit', 'datetime', undefined, ['auto']);
    let { plainRelativeTo, zonedRelativeTo, timeZoneRec } = ES.GetTemporalRelativeToOption(roundTo);
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
      throw new RangeError('at least one of smallestUnit or largestUnit is required');
    }
    if (ES.LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
      throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
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

    const roundingGranularityIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
    const balancingRequested = largestUnit !== existingLargestUnit;
    const calendarUnitsPresent = years !== 0 || months !== 0 || weeks !== 0;
    const timeUnitsOverflowWillOccur =
      MathAbs(minutes) >= 60 ||
      MathAbs(seconds) >= 60 ||
      MathAbs(milliseconds) >= 1000 ||
      MathAbs(microseconds) >= 1000 ||
      MathAbs(nanoseconds) >= 1000;
    const hoursToDaysConversionMayOccur = (days !== 0 && zonedRelativeTo) || MathAbs(hours) >= 24;
    if (
      roundingGranularityIsNoop &&
      !balancingRequested &&
      !calendarUnitsPresent &&
      !timeUnitsOverflowWillOccur &&
      !hoursToDaysConversionMayOccur
    ) {
      return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    }

    let precalculatedPlainDateTime;
    const plainDateTimeOrRelativeToWillBeUsed =
      ES.IsCalendarUnit(largestUnit) || largestUnit === 'day' || calendarUnitsPresent || days !== 0;
    if (zonedRelativeTo && plainDateTimeOrRelativeToWillBeUsed) {
      // Convert a ZonedDateTime relativeTo to PlainDateTime and PlainDate only
      // if either is needed in one of the operations below, because the
      // conversion is user visible
      precalculatedPlainDateTime = ES.GetPlainDateTimeFor(
        timeZoneRec,
        GetSlot(zonedRelativeTo, INSTANT),
        GetSlot(zonedRelativeTo, CALENDAR)
      );
      plainRelativeTo = ES.TemporalDateTimeToDate(precalculatedPlainDateTime);
    }

    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, [
      'dateAdd',
      'dateUntil'
    ]);

    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    if (zonedRelativeTo) {
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(
        GetSlot(zonedRelativeTo, INSTANT),
        timeZoneRec,
        calendarRec,
        years,
        months,
        weeks,
        days,
        norm,
        precalculatedPlainDateTime
      );
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferenceZonedDateTimeWithRounding(
          relativeEpochNs,
          targetEpochNs,
          calendarRec,
          timeZoneRec,
          precalculatedPlainDateTime,
          ObjectCreate(null),
          largestUnit,
          roundingIncrement,
          smallestUnit,
          roundingMode
        ));
    } else if (plainRelativeTo) {
      let targetTime = ES.AddTime(0, 0, 0, 0, 0, 0, norm);

      // Delegate the date part addition to the calendar
      const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
      const dateDuration = new TemporalDuration(years, months, weeks, days + targetTime.deltaDays, 0, 0, 0, 0, 0, 0);
      const targetDate = ES.AddDate(calendarRec, plainRelativeTo, dateDuration);

      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferencePlainDateTimeWithRounding(
          plainRelativeTo,
          0,
          0,
          0,
          0,
          0,
          0,
          GetSlot(targetDate, ISO_YEAR),
          GetSlot(targetDate, ISO_MONTH),
          GetSlot(targetDate, ISO_DAY),
          targetTime.hour,
          targetTime.minute,
          targetTime.second,
          targetTime.millisecond,
          targetTime.microsecond,
          targetTime.nanosecond,
          calendarRec,
          largestUnit,
          roundingIncrement,
          smallestUnit,
          roundingMode
        ));
    } else {
      // No reference date to calculate difference relative to
      if (calendarUnitsPresent) {
        throw new RangeError('a starting point is required for years, months, or weeks balancing');
      }
      if (ES.IsCalendarUnit(largestUnit)) {
        throw new RangeError(`a starting point is required for ${largestUnit}s balancing`);
      }
      if (ES.IsCalendarUnit(smallestUnit)) {
        throw new RangeError(`a starting point is required for ${smallestUnit}s rounding`);
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

    if (totalOf === undefined) throw new TypeError('options argument is required');
    if (ES.Type(totalOf) === 'String') {
      const stringParam = totalOf;
      totalOf = ObjectCreate(null);
      totalOf.unit = stringParam;
    } else {
      totalOf = ES.GetOptionsObject(totalOf);
    }
    let { plainRelativeTo, zonedRelativeTo, timeZoneRec } = ES.GetTemporalRelativeToOption(totalOf);
    const unit = ES.GetTemporalUnitValuedOption(totalOf, 'unit', 'datetime', ES.REQUIRED);

    let precalculatedPlainDateTime;
    const plainDateTimeOrRelativeToWillBeUsed =
      ES.IsCalendarUnit(unit) || unit === 'day' || years !== 0 || months !== 0 || weeks !== 0 || days !== 0;
    if (zonedRelativeTo && plainDateTimeOrRelativeToWillBeUsed) {
      // Convert a ZonedDateTime relativeTo to PlainDate only if needed in one
      // of the operations below, because the conversion is user visible
      precalculatedPlainDateTime = ES.GetPlainDateTimeFor(
        timeZoneRec,
        GetSlot(zonedRelativeTo, INSTANT),
        GetSlot(zonedRelativeTo, CALENDAR)
      );
      plainRelativeTo = ES.TemporalDateTimeToDate(precalculatedPlainDateTime);
    }

    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, [
      'dateAdd',
      'dateUntil'
    ]);

    let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    if (zonedRelativeTo) {
      const relativeEpochNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
      const targetEpochNs = ES.AddZonedDateTime(
        GetSlot(zonedRelativeTo, INSTANT),
        timeZoneRec,
        calendarRec,
        years,
        months,
        weeks,
        days,
        norm,
        precalculatedPlainDateTime
      );
      const { total } = ES.DifferenceZonedDateTimeWithRounding(
        relativeEpochNs,
        targetEpochNs,
        calendarRec,
        timeZoneRec,
        precalculatedPlainDateTime,
        ObjectCreate(null),
        unit,
        1,
        unit,
        'trunc'
      );
      if (NumberIsNaN(total)) throw new Error('assertion failed: total hit unexpected code path');
      return total;
    }

    if (plainRelativeTo) {
      let targetTime = ES.AddTime(0, 0, 0, 0, 0, 0, norm);

      // Delegate the date part addition to the calendar
      const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
      const dateDuration = new TemporalDuration(years, months, weeks, days + targetTime.deltaDays, 0, 0, 0, 0, 0, 0);
      const targetDate = ES.AddDate(calendarRec, plainRelativeTo, dateDuration);

      const { total } = ES.DifferencePlainDateTimeWithRounding(
        plainRelativeTo,
        0,
        0,
        0,
        0,
        0,
        0,
        GetSlot(targetDate, ISO_YEAR),
        GetSlot(targetDate, ISO_MONTH),
        GetSlot(targetDate, ISO_DAY),
        targetTime.hour,
        targetTime.minute,
        targetTime.second,
        targetTime.millisecond,
        targetTime.microsecond,
        targetTime.nanosecond,
        calendarRec,
        unit,
        1,
        unit,
        'trunc'
      );
      if (NumberIsNaN(total)) throw new Error('assertion failed: total hit unexpected code path');
      return total;
    }

    // No reference date to calculate difference relative to
    if (years !== 0 || months !== 0 || weeks !== 0) {
      throw new RangeError('a starting point is required for years, months, or weeks total');
    }
    if (ES.IsCalendarUnit(unit)) {
      throw new RangeError(`a starting point is required for ${unit}s total`);
    }
    norm = norm.add24HourDays(days);
    const { total } = ES.RoundTimeDuration(0, norm, 1, unit, 'trunc');
    return total;
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(options);
    const roundingMode = ES.GetRoundingModeOption(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour' || smallestUnit === 'minute') {
      throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
    }
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);

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

    if (unit !== 'nanosecond' || increment !== 1) {
      let norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
      const largestUnit = ES.DefaultTemporalLargestUnit(
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
      // Keeping sub-second units separate avoids losing precision after
      // resolving any overflows from rounding
      days += deltaDays;
    }

    const normSeconds = TimeDuration.normalize(0, 0, seconds, milliseconds, microseconds, nanoseconds);
    return ES.TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds, precision);
  }
  toJSON() {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    const normSeconds = TimeDuration.normalize(
      0,
      0,
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS)
    );
    return ES.TemporalDurationToString(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, WEEKS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      normSeconds
    );
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDuration(this)) throw new TypeError('invalid receiver');
    if (typeof Intl !== 'undefined' && typeof Intl.DurationFormat !== 'undefined') {
      return new Intl.DurationFormat(locales, options).format(this);
    }
    console.warn('Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat.');
    const normSeconds = TimeDuration.normalize(
      0,
      0,
      GetSlot(this, SECONDS),
      GetSlot(this, MILLISECONDS),
      GetSlot(this, MICROSECONDS),
      GetSlot(this, NANOSECONDS)
    );
    return ES.TemporalDurationToString(
      GetSlot(this, YEARS),
      GetSlot(this, MONTHS),
      GetSlot(this, WEEKS),
      GetSlot(this, DAYS),
      GetSlot(this, HOURS),
      GetSlot(this, MINUTES),
      normSeconds
    );
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
    const { plainRelativeTo, zonedRelativeTo, timeZoneRec } = ES.GetTemporalRelativeToOption(options);

    const calendarUnitsPresent = y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0;

    const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, ['dateAdd']);

    if (zonedRelativeTo && (calendarUnitsPresent || d1 != 0 || d2 !== 0)) {
      const instant = GetSlot(zonedRelativeTo, INSTANT);
      const precalculatedPlainDateTime = ES.GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.receiver);

      const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
      const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
      const after1 = ES.AddZonedDateTime(
        instant,
        timeZoneRec,
        calendarRec,
        y1,
        mon1,
        w1,
        d1,
        norm1,
        precalculatedPlainDateTime
      );
      const after2 = ES.AddZonedDateTime(
        instant,
        timeZoneRec,
        calendarRec,
        y2,
        mon2,
        w2,
        d2,
        norm2,
        precalculatedPlainDateTime
      );
      return ES.ComparisonResult(after1.minus(after2).toJSNumber());
    }

    if (calendarUnitsPresent) {
      if (!plainRelativeTo) {
        throw new RangeError('A starting point is required for years, months, or weeks comparison');
      }
      d1 = ES.UnbalanceDateDurationRelative(y1, mon1, w1, d1, plainRelativeTo, calendarRec);
      d2 = ES.UnbalanceDateDurationRelative(y2, mon2, w2, d2, plainRelativeTo, calendarRec);
    }
    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1).add24HourDays(d1);
    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2).add24HourDays(d2);
    return norm1.cmp(norm2);
  }
}

MakeIntrinsicClass(Duration, 'Temporal.Duration');
Object.defineProperties(Duration.prototype, {
  valueOf: {
    enumerable: false,
    writable: true,
    configurable: true,
    value: GetIntrinsic('%ThrowTypeErrorFromValueOf%')
  }
});
