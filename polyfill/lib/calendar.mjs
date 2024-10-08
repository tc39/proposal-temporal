import {
  // constructors and similar
  Date as DateCtor,
  Map as MapCtor,
  Set as SetCtor,
  WeakMap as WeakMapCtor,

  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ArrayFrom,
  ArrayPrototypeFilter,
  ArrayPrototypeFind,
  ArrayPrototypeForEach,
  ArrayPrototypeIncludes,
  ArrayPrototypeIndexOf,
  ArrayPrototypeSort,
  DatePrototypeSetUTCDate,
  DatePrototypeToLocaleDateString,
  IntlDateTimeFormat,
  IntlDateTimeFormatPrototypeFormatToParts,
  JSONStringify,
  MapPrototypeEntries,
  MapPrototypeGet,
  MapPrototypeSet,
  MathAbs,
  MathFloor,
  MathTrunc,
  MathMax,
  NumberIsNaN,
  MathSign,
  ObjectAssign,
  ObjectEntries,
  RegExpPrototypeExec,
  RegExpPrototypeTest,
  SetPrototypeAdd,
  SetPrototypeValues,
  StringPrototypeEndsWith,
  StringPrototypeIndexOf,
  StringPrototypeNormalize,
  StringPrototypePadStart,
  StringPrototypeReplace,
  StringPrototypeSlice,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
  StringPrototypeToLowerCase,
  SymbolIterator,
  WeakMapPrototypeGet,
  WeakMapPrototypeSet,
  MapIteratorPrototypeNext,
  SetIteratorPrototypeNext,

  // miscellaneous
  now
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';
import Type from 'es-abstract/2024/Type.js';

import * as ES from './ecmascript.mjs';
import { DefineIntrinsic } from './intrinsicclass.mjs';

function arrayFromSet(src) {
  const valuesIterator = Call(SetPrototypeValues, src, []);
  return ArrayFrom({
    [SymbolIterator]() {
      return this;
    },
    next() {
      return Call(SetIteratorPrototypeNext, valuesIterator, []);
    }
  });
}

function calendarDateWeekOfYear(id, isoDate) {
  // Supports only Gregorian and ISO8601 calendar; can be updated to add support for other calendars.
  // Returns undefined for calendars without a well-defined week calendar system.
  // eslint-disable-next-line max-len
  // Also see: https://github.com/unicode-org/icu/blob/ab72ab1d4a3c3f9beeb7d92b0c7817ca93dfdb04/icu4c/source/i18n/calendar.cpp#L1606
  if (id !== 'gregory' && id !== 'iso8601') {
    return { week: undefined, year: undefined };
  }
  const calendar = impl[id];
  let yow = isoDate.year;
  const { dayOfWeek, dayOfYear, daysInYear } = calendar.isoToDate(isoDate, {
    dayOfWeek: true,
    dayOfYear: true,
    daysInYear: true
  });
  const fdow = id === 'iso8601' ? 1 : calendar.helper.getFirstDayOfWeek();
  const mdow = id === 'iso8601' ? 4 : calendar.helper.getMinimalDaysInFirstWeek();

  // For both the input date and the first day of its calendar year, calculate the day of week
  // relative to first day of week in the relevant calendar (e.g., in iso8601, relative to Monday).
  var relDow = (dayOfWeek + 7 - fdow) % 7;
  // Assuming the year length is less than 7000 days.
  var relDowJan1 = (dayOfWeek - dayOfYear + 7001 - fdow) % 7;

  var woy = MathFloor((dayOfYear - 1 + relDowJan1) / 7);
  if (7 - relDowJan1 >= mdow) {
    ++woy;
  }

  // Adjust for weeks at the year end that overlap into the previous or next calendar year.
  if (woy == 0) {
    // Check for last week of previous year; if true, handle the case for
    // first week of next year
    const prevYearCalendar = calendar.isoToDate(calendar.dateAdd(isoDate, { years: -1 }, 'constrain'), {
      daysInYear: true
    });
    var prevDoy = dayOfYear + prevYearCalendar.daysInYear;
    woy = weekNumber(fdow, mdow, prevDoy, dayOfWeek);
    yow--;
  } else {
    // For it to be week 1 of the next year, dayOfYear must be >= lastDoy - 5
    //          L-5                  L
    // doy: 359 360 361 362 363 364 365 001
    // dow:      1   2   3   4   5   6   7
    var lastDoy = daysInYear;
    if (dayOfYear >= lastDoy - 5) {
      var lastRelDow = (relDow + lastDoy - dayOfYear) % 7;
      if (lastRelDow < 0) {
        lastRelDow += 7;
      }
      if (6 - lastRelDow >= mdow && dayOfYear + 7 - relDow > lastDoy) {
        woy = 1;
        yow++;
      }
    }
  }
  return { week: woy, year: yow };
}

function ISODateSurpasses(sign, y1, m1, d1, isoDate2) {
  if (y1 !== isoDate2.year) {
    if (sign * (y1 - isoDate2.year) > 0) return true;
  } else if (m1 !== isoDate2.month) {
    if (sign * (m1 - isoDate2.month) > 0) return true;
  } else if (d1 !== isoDate2.day) {
    if (sign * (d1 - isoDate2.day) > 0) return true;
  }
  return false;
}

const impl = {};

impl['iso8601'] = {
  resolveFields(fields, type) {
    if ((type === 'date' || type === 'year-month') && fields.year === undefined) {
      throw new TypeErrorCtor('year is required');
    }
    if ((type === 'date' || type === 'month-day') && fields.day === undefined) {
      throw new TypeErrorCtor('day is required');
    }
    ObjectAssign(fields, resolveNonLunisolarMonth(fields));
  },
  dateToISO(fields, overflow) {
    return ES.RegulateISODate(fields.year, fields.month, fields.day, overflow);
  },
  monthDayToISOReferenceDate(fields, overflow) {
    const referenceISOYear = 1972;
    const { month, day } = ES.RegulateISODate(fields.year ?? referenceISOYear, fields.month, fields.day, overflow);
    return { month, day, year: referenceISOYear };
  },
  extraFields() {
    return [];
  },
  fieldKeysToIgnore(keys) {
    const result = new SetCtor();
    for (let ix = 0; ix < keys.length; ix++) {
      const key = keys[ix];
      Call(SetPrototypeAdd, result, [key]);
      if (key === 'month') {
        Call(SetPrototypeAdd, result, ['monthCode']);
      } else if (key === 'monthCode') {
        Call(SetPrototypeAdd, result, ['month']);
      }
    }
    return arrayFromSet(result);
  },
  dateAdd({ year, month, day }, { years = 0, months = 0, weeks = 0, days = 0 }, overflow) {
    year += years;
    month += months;
    ({ year, month } = ES.BalanceISOYearMonth(year, month));
    ({ year, month, day } = ES.RegulateISODate(year, month, day, overflow));
    day += days + 7 * weeks;
    return ES.BalanceISODate(year, month, day);
  },
  dateUntil(one, two, largestUnit) {
    const sign = -ES.CompareISODate(one, two);
    if (sign === 0) return { years: 0, months: 0, weeks: 0, days: 0 };

    let years = 0;
    let months = 0;
    let intermediate;
    if (largestUnit === 'year' || largestUnit === 'month') {
      // We can skip right to the neighbourhood of the correct number of years,
      // it'll be at least one less than two.year - one.year (unless it's zero)
      let candidateYears = two.year - one.year;
      if (candidateYears !== 0) candidateYears -= sign;
      // loops at most twice
      while (!ISODateSurpasses(sign, one.year + candidateYears, one.month, one.day, two)) {
        years = candidateYears;
        candidateYears += sign;
      }

      let candidateMonths = sign;
      intermediate = ES.BalanceISOYearMonth(one.year + years, one.month + candidateMonths);
      // loops at most 12 times
      while (!ISODateSurpasses(sign, intermediate.year, intermediate.month, one.day, two)) {
        months = candidateMonths;
        candidateMonths += sign;
        intermediate = ES.BalanceISOYearMonth(intermediate.year, intermediate.month + sign);
      }

      if (largestUnit === 'month') {
        months += years * 12;
        years = 0;
      }
    }

    intermediate = ES.BalanceISOYearMonth(one.year + years, one.month + months);
    const constrained = ES.ConstrainISODate(intermediate.year, intermediate.month, one.day);

    let weeks = 0;
    let days =
      ES.ISODateToEpochDays(two.year, two.month - 1, two.day) -
      ES.ISODateToEpochDays(constrained.year, constrained.month - 1, constrained.day);

    if (largestUnit === 'week') {
      weeks = MathTrunc(days / 7);
      days %= 7;
    }

    return { years, months, weeks, days };
  },
  isoToDate({ year, month, day }, requestedFields) {
    // requestedFields parameter is not part of the spec text. It's an
    // illustration of one way implementations may choose to optimize this
    // operation.
    const date = {
      era: undefined,
      eraYear: undefined,
      year,
      month,
      day,
      daysInWeek: 7,
      monthsInYear: 12
    };
    if (requestedFields.monthCode) date.monthCode = buildMonthCode(month);
    if (requestedFields.dayOfWeek) {
      // https://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week#Disparate_variation
      const shiftedMonth = month + (month < 3 ? 10 : -2);
      const shiftedYear = year - (month < 3 ? 1 : 0);

      const century = MathFloor(shiftedYear / 100);
      const yearInCentury = shiftedYear - century * 100;

      const monthTerm = MathFloor(2.6 * shiftedMonth - 0.2);
      const yearTerm = yearInCentury + MathFloor(yearInCentury / 4);
      const centuryTerm = MathFloor(century / 4) - 2 * century;

      const dow = (day + monthTerm + yearTerm + centuryTerm) % 7;

      date.dayOfWeek = dow + (dow <= 0 ? 7 : 0);
    }
    if (requestedFields.dayOfYear) {
      let days = day;
      for (let m = month - 1; m > 0; m--) {
        days += ES.ISODaysInMonth(year, m);
      }
      date.dayOfYear = days;
    }
    if (requestedFields.weekOfYear) date.weekOfYear = calendarDateWeekOfYear('iso8601', { year, month, day });
    if (requestedFields.daysInMonth) date.daysInMonth = ES.ISODaysInMonth(year, month);
    if (requestedFields.daysInYear || requestedFields.inLeapYear) {
      date.inLeapYear = ES.LeapYear(year);
      date.daysInYear = date.inLeapYear ? 366 : 365;
    }
    return date;
  }
};

// Note: other built-in calendars than iso8601 are not part of the Temporal
// proposal for ECMA-262. These calendars will be standardized as part of
// ECMA-402.

function monthCodeNumberPart(monthCode) {
  if (!Call(StringPrototypeStartsWith, monthCode, ['M'])) {
    throw new RangeErrorCtor(`Invalid month code: ${monthCode}.  Month codes must start with M.`);
  }
  const month = +Call(StringPrototypeSlice, monthCode, [1]);
  if (NumberIsNaN(month)) throw new RangeErrorCtor(`Invalid month code: ${monthCode}`);
  return month;
}

function buildMonthCode(month, leap = false) {
  const digitPart = Call(StringPrototypePadStart, `${month}`, [2, '0']);
  const leapMarker = leap ? 'L' : '';
  return `M${digitPart}${leapMarker}`;
}

/**
 * Safely merge a month, monthCode pair into an integer month.
 * If both are present, make sure they match.
 * This logic doesn't work for lunisolar calendars!
 * */
function resolveNonLunisolarMonth(calendarDate, overflow = undefined, monthsPerYear = 12) {
  let { month, monthCode } = calendarDate;
  if (monthCode === undefined) {
    if (month === undefined) throw new TypeErrorCtor('Either month or monthCode are required');
    // The ISO calendar uses the default (undefined) value because it does
    // constrain/reject after this method returns. Non-ISO calendars, however,
    // rely on this function to constrain/reject out-of-range `month` values.
    if (overflow === 'reject') ES.RejectToRange(month, 1, monthsPerYear);
    if (overflow === 'constrain') month = ES.ConstrainToRange(month, 1, monthsPerYear);
    monthCode = buildMonthCode(month);
  } else {
    const numberPart = monthCodeNumberPart(monthCode);
    if (monthCode !== buildMonthCode(numberPart)) {
      throw new RangeErrorCtor(`Invalid month code: ${monthCode}`);
    }
    if (month !== undefined && month !== numberPart) {
      throw new RangeErrorCtor(`monthCode ${monthCode} and month ${month} must match if both are present`);
    }
    month = numberPart;
    if (month < 1 || month > monthsPerYear) throw new RangeErrorCtor(`Invalid monthCode: ${monthCode}`);
  }
  return { ...calendarDate, month, monthCode };
}

function weekNumber(firstDayOfWeek, minimalDaysInFirstWeek, desiredDay, dayOfWeek) {
  var periodStartDayOfWeek = (dayOfWeek - firstDayOfWeek - desiredDay + 1) % 7;
  if (periodStartDayOfWeek < 0) periodStartDayOfWeek += 7;
  var weekNo = MathFloor((desiredDay + periodStartDayOfWeek - 1) / 7);
  if (7 - periodStartDayOfWeek >= minimalDaysInFirstWeek) {
    ++weekNo;
  }
  return weekNo;
}

// Note: other built-in calendars than iso8601 are not part of the Temporal
// proposal for ECMA-262. An implementation of these calendars is present in
// this polyfill in order to validate the Temporal API and to get early feedback
// about non-ISO calendars. However, non-ISO calendar implementation is subject
// to change because these calendars are implementation-defined.

/**
 * This prototype implementation of non-ISO calendars makes many repeated calls
 * to Intl APIs which may be slow (e.g. >0.2ms). This trivial cache will speed
 * up these repeat accesses. Each cache instance is associated (via a WeakMap)
 * to a specific Temporal object, which speeds up multiple calendar calls on the
 * same Temporal object instance.  No invalidation or pruning is necessary
 * because each object's cache is thrown away when the object is GC-ed.
 */
class OneObjectCache {
  constructor(cacheToClone = undefined) {
    this.map = new MapCtor();
    this.calls = 0;
    this.now = now();
    this.hits = 0;
    this.misses = 0;
    if (cacheToClone !== undefined) {
      let i = 0;
      const entriesIterator = Call(MapPrototypeEntries, cacheToClone.map, []);
      for (;;) {
        const iterResult = Call(MapIteratorPrototypeNext, entriesIterator, []);
        if (iterResult.done) break;
        if (++i > OneObjectCache.MAX_CACHE_ENTRIES) break;
        Call(MapPrototypeSet, this.map, iterResult.value);
      }
    }
  }
  get(key) {
    const result = Call(MapPrototypeGet, this.map, [key]);
    if (result) {
      this.hits++;
      this.report();
    }
    this.calls++;
    return result;
  }
  set(key, value) {
    Call(MapPrototypeSet, this.map, [key, value]);
    this.misses++;
    this.report();
  }
  report() {
    /*
    if (this.calls === 0) return;
    const ms = now() - this.now;
    const hitRate = Call(NumberPrototypeToFixed, (100 * this.hits) / this.calls, [0]);
    const t = `${Call(NumberPrototypeToFixed, ms, [2])}ms`;
    log(`${this.calls} calls in ${t}. Hits: ${this.hits} (${hitRate}%). Misses: ${this.misses}.`);
    */
  }
  setObject(obj) {
    if (Call(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj])) throw new RangeErrorCtor('object already cached');
    Call(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, this]);
    this.report();
  }
}
OneObjectCache.objectMap = new WeakMapCtor();
OneObjectCache.MAX_CACHE_ENTRIES = 1000;
/**
 * Returns a WeakMap-backed cache that's used to store expensive results
 * that are associated with a particular Temporal object instance.
 *
 * @param obj - object to associate with the cache
 */
OneObjectCache.getCacheForObject = function (obj) {
  let cache = Call(WeakMapPrototypeGet, OneObjectCache.objectMap, [obj]);
  if (!cache) {
    cache = new OneObjectCache();
    Call(WeakMapPrototypeSet, OneObjectCache.objectMap, [obj, cache]);
  }
  return cache;
};

function toUtcIsoDateString({ isoYear, isoMonth, isoDay }) {
  const yearString = ES.ISOYearString(isoYear);
  const monthString = ES.ISODateTimePartString(isoMonth);
  const dayString = ES.ISODateTimePartString(isoDay);
  return `${yearString}-${monthString}-${dayString}T00:00Z`;
}

function simpleDateDiff(one, two) {
  return {
    years: one.year - two.year,
    months: one.month - two.month,
    days: one.day - two.day
  };
}

/**
 * Implementation that's common to all non-trivial non-ISO calendars
 */
const nonIsoHelperBase = {
  // The properties and methods below here should be the same for all lunar/lunisolar calendars.
  getFormatter() {
    // `new Intl.DateTimeFormat()` is amazingly slow and chews up RAM. Per
    // https://bugs.chromium.org/p/v8/issues/detail?id=6528#c4, we cache one
    // DateTimeFormat instance per calendar. Caching is lazy so we only pay for
    // calendars that are used. Note that the nonIsoHelperBase object is spread
    // into each calendar's implementation before any cache is created, so
    // each calendar gets its own separate cached formatter.
    if (typeof this.formatter === 'undefined') {
      this.formatter = new IntlDateTimeFormat(`en-US-u-ca-${this.id}`, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        era: 'short',
        timeZone: 'UTC'
      });
    }
    return this.formatter;
  },
  isoToCalendarDate(isoDate, cache) {
    const { year: isoYear, month: isoMonth, day: isoDay } = isoDate;
    const key = JSONStringify({ func: 'isoToCalendarDate', isoYear, isoMonth, isoDay, id: this.id });
    const cached = cache.get(key);
    if (cached) return cached;

    const dateTimeFormat = this.getFormatter();
    let parts, isoString;
    try {
      isoString = toUtcIsoDateString({ isoYear, isoMonth, isoDay });
      parts = ES.Call(IntlDateTimeFormatPrototypeFormatToParts, dateTimeFormat, [new DateCtor(isoString)]);
    } catch (e) {
      throw new RangeErrorCtor(`Invalid ISO date: ${JSONStringify({ isoYear, isoMonth, isoDay })}`);
    }
    const result = {};
    for (let i = 0; i < parts.length; i++) {
      let { type, value } = parts[i];
      if (type === 'year' || type === 'relatedYear') {
        if (this.hasEra) {
          result.eraYear = +value;
        } else {
          result.year = +value;
        }
      }
      if (type === 'month') {
        const matches = ES.Call(RegExpPrototypeExec, /^([0-9]*)(.*?)$/, [value]);
        if (!matches || matches.length != 3 || (!matches[1] && !matches[2])) {
          throw new RangeErrorCtor(`Unexpected month: ${value}`);
        }
        // If the month has no numeric part (should only see this for the Hebrew
        // calendar with newer FF / Chromium versions; see
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1751833) then set a
        // placeholder month index of `1` and rely on the derived class to
        // calculate the correct month index from the month name stored in
        // `monthExtra`.
        result.month = matches[1] ? +matches[1] : 1;
        if (result.month < 1) {
          throw new RangeErrorCtor(
            `Invalid month ${value} from ${isoString}[u-ca-${this.id}]` +
              ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)'
          );
        }
        if (result.month > 13) {
          throw new RangeErrorCtor(
            `Invalid month ${value} from ${isoString}[u-ca-${this.id}]` +
              ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)'
          );
        }

        // The ICU formats for the Hebrew calendar no longer support a numeric
        // month format. So we'll rely on the derived class to interpret it.
        // `monthExtra` is also used on the Chinese calendar to handle a suffix
        // "bis" indicating a leap month.
        if (matches[2]) result.monthExtra = matches[2];
      }
      if (type === 'day') result.day = +value;
      if (this.hasEra && type === 'era' && value != null && value !== '') {
        // The convention for Temporal era values is lowercase, so following
        // that convention in this prototype. Punctuation is removed, accented
        // letters are normalized, and spaces are replaced with dashes.
        // E.g.: "ERA0" => "era0", "Before R.O.C." => "before-roc", "En’ō" => "eno"
        // The call to normalize() and the replacement regex deals with era
        // names that contain non-ASCII characters like Japanese eras. Also
        // ignore extra content in parentheses like JPN era date ranges.
        value = ES.Call(StringPrototypeSplit, value, [' ('])[0];
        value = ES.Call(StringPrototypeNormalize, value, ['NFD']);
        value = ES.Call(StringPrototypeReplace, value, [/[^-0-9 \p{L}]/gu, '']);
        value = ES.Call(StringPrototypeReplace, value, [/ /g, '-']);
        value = ES.Call(StringPrototypeToLowerCase, value, []);
        result.era = value;
      }
    }
    if (this.hasEra && result.eraYear === undefined) {
      // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
      // output of Intl.DateTimeFormat.formatToParts.
      throw new RangeErrorCtor(
        `Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`
      );
    }
    // Translate old ICU era codes "ERA0" etc. into canonical era names.
    if (this.hasEra) {
      const replacement = ES.Call(ArrayPrototypeFind, this.eras, [(e) => result.era === e.genericName]);
      if (replacement) result.era = replacement.code;
    }
    // Translate eras that may be handled differently by Temporal vs. by Intl
    // (e.g. Japanese pre-Meiji eras). See #526 for details.
    if (this.reviseIntlEra) {
      const { era, eraYear } = this.reviseIntlEra(result, isoDate);
      result.era = era;
      result.eraYear = eraYear;
    }
    if (this.checkIcuBugs) this.checkIcuBugs(isoDate);
    const calendarDate = this.adjustCalendarDate(result, cache, 'constrain', true);
    if (calendarDate.year === undefined) throw new RangeErrorCtor(`Missing year converting ${JSONStringify(isoDate)}`);
    if (calendarDate.month === undefined) {
      throw new RangeErrorCtor(`Missing month converting ${JSONStringify(isoDate)}`);
    }
    if (calendarDate.day === undefined) throw new RangeErrorCtor(`Missing day converting ${JSONStringify(isoDate)}`);
    cache.set(key, calendarDate);
    // Also cache the reverse mapping
    const cacheReverse = (overflow) => {
      const keyReverse = JSONStringify({
        func: 'calendarToIsoDate',
        year: calendarDate.year,
        month: calendarDate.month,
        day: calendarDate.day,
        overflow,
        id: this.id
      });
      cache.set(keyReverse, isoDate);
    };
    ES.Call(ArrayPrototypeForEach, ['constrain', 'reject'], [cacheReverse]);
    return calendarDate;
  },
  validateCalendarDate(calendarDate) {
    const { month, year, day, eraYear, monthCode, monthExtra } = calendarDate;
    // When there's a suffix (e.g. "5bis" for a leap month in Chinese calendar)
    // the derived class must deal with it.
    if (monthExtra !== undefined) throw new RangeErrorCtor('Unexpected `monthExtra` value');
    if (year === undefined && eraYear === undefined) throw new TypeErrorCtor('year or eraYear is required');
    if (month === undefined && monthCode === undefined) throw new TypeErrorCtor('month or monthCode is required');
    if (day === undefined) throw new RangeErrorCtor('Missing day');
    if (monthCode !== undefined) {
      if (typeof monthCode !== 'string') {
        throw new RangeErrorCtor(
          `monthCode must be a string, not ${ES.Call(StringPrototypeToLowerCase, Type(monthCode), [])}`
        );
      }
      if (!ES.Call(RegExpPrototypeTest, /^M([01]?\d)(L?)$/, [monthCode])) {
        throw new RangeErrorCtor(`Invalid monthCode: ${monthCode}`);
      }
    }
    if (this.hasEra) {
      if ((calendarDate['era'] === undefined) !== (calendarDate['eraYear'] === undefined)) {
        throw new TypeErrorCtor('properties era and eraYear must be provided together');
      }
    }
  },
  /**
   * Allows derived calendars to add additional fields and/or to make
   * adjustments e.g. to set the era based on the date or to revise the month
   * number in lunisolar calendars per
   * https://github.com/tc39/proposal-temporal/issues/1203.
   *
   * The base implementation fills in missing values by assuming the simplest
   * possible calendar:
   * - no eras
   * - non-lunisolar calendar (no leap months)
   * */
  adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
    if (this.calendarType === 'lunisolar') throw new RangeErrorCtor('Override required for lunisolar calendars');
    this.validateCalendarDate(calendarDate);
    const largestMonth = this.monthsInYear(calendarDate, cache);
    let { month, monthCode } = calendarDate;
    ({ month, monthCode } = resolveNonLunisolarMonth(calendarDate, overflow, largestMonth));
    return { ...calendarDate, month, monthCode };
  },
  regulateMonthDayNaive(calendarDate, overflow, cache) {
    const largestMonth = this.monthsInYear(calendarDate, cache);
    let { month, day } = calendarDate;
    if (overflow === 'reject') {
      ES.RejectToRange(month, 1, largestMonth);
      ES.RejectToRange(day, 1, this.maximumMonthLength(calendarDate));
    } else {
      month = ES.ConstrainToRange(month, 1, largestMonth);
      day = ES.ConstrainToRange(day, 1, this.maximumMonthLength({ ...calendarDate, month }));
    }
    return { ...calendarDate, month, day };
  },
  calendarToIsoDate(date, overflow = 'constrain', cache) {
    const originalDate = date;
    // First, normalize the calendar date to ensure that (year, month, day)
    // are all present, converting monthCode and eraYear if needed.
    date = this.adjustCalendarDate(date, cache, overflow, false);

    // Fix obviously out-of-bounds values. Values that are valid generally, but
    // not in this particular year, may not be caught here for some calendars.
    // If so, these will be handled lower below.
    date = this.regulateMonthDayNaive(date, overflow, cache);

    const { year, month, day } = date;
    const key = JSONStringify({ func: 'calendarToIsoDate', year, month, day, overflow, id: this.id });
    let cached = cache.get(key);
    if (cached) return cached;
    // If YMD are present in the input but the input has been constrained
    // already, then cache both the original value and the constrained value.
    let keyOriginal;
    if (
      originalDate.year !== undefined &&
      originalDate.month !== undefined &&
      originalDate.day !== undefined &&
      (originalDate.year !== date.year || originalDate.month !== date.month || originalDate.day !== date.day)
    ) {
      keyOriginal = JSONStringify({
        func: 'calendarToIsoDate',
        year: originalDate.year,
        month: originalDate.month,
        day: originalDate.day,
        overflow,
        id: this.id
      });
      cached = cache.get(keyOriginal);
      if (cached) return cached;
    }

    // First, try to roughly guess the result
    let isoEstimate = this.estimateIsoDate({ year, month, day });
    const calculateSameMonthResult = (diffDays) => {
      // If the estimate is in the same year & month as the target, then we can
      // calculate the result exactly and short-circuit any additional logic.
      // This optimization assumes that months are continuous. It would break if
      // a calendar skipped days, like the Julian->Gregorian switchover. But
      // current ICU calendars only skip days (japanese/roc/buddhist) because of
      // a bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
      // that's currently worked around by a custom calendarToIsoDate
      // implementation in those calendars. So this optimization should be safe
      // for all ICU calendars.
      let testIsoEstimate = this.addDaysIso(isoEstimate, diffDays);
      if (date.day > this.minimumMonthLength(date)) {
        // There's a chance that the calendar date is out of range. Throw or
        // constrain if so.
        let testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
        while (testCalendarDate.month !== month || testCalendarDate.year !== year) {
          if (overflow === 'reject') {
            throw new RangeErrorCtor(`day ${day} does not exist in month ${month} of year ${year}`);
          }
          // Back up a day at a time until we're not hanging over the month end
          testIsoEstimate = this.addDaysIso(testIsoEstimate, -1);
          testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
        }
      }
      return testIsoEstimate;
    };
    let sign = 0;
    let roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
    let diff = simpleDateDiff(date, roundtripEstimate);
    if (diff.years !== 0 || diff.months !== 0 || diff.days !== 0) {
      const diffTotalDaysEstimate = diff.years * 365 + diff.months * 30 + diff.days;
      isoEstimate = this.addDaysIso(isoEstimate, diffTotalDaysEstimate);
      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
      diff = simpleDateDiff(date, roundtripEstimate);
      if (diff.years === 0 && diff.months === 0) {
        isoEstimate = calculateSameMonthResult(diff.days);
      } else {
        sign = this.compareCalendarDates(date, roundtripEstimate);
      }
    }
    // If the initial guess is not in the same month, then bisect the
    // distance to the target, starting with 8 days per step.
    let increment = 8;
    while (sign) {
      isoEstimate = this.addDaysIso(isoEstimate, sign * increment);
      const oldRoundtripEstimate = roundtripEstimate;
      roundtripEstimate = this.isoToCalendarDate(isoEstimate, cache);
      const oldSign = sign;
      sign = this.compareCalendarDates(date, roundtripEstimate);
      if (sign) {
        diff = simpleDateDiff(date, roundtripEstimate);
        if (diff.years === 0 && diff.months === 0) {
          isoEstimate = calculateSameMonthResult(diff.days);
          // Signal the loop condition that there's a match.
          sign = 0;
        } else if (oldSign && sign !== oldSign) {
          if (increment > 1) {
            // If the estimate overshot the target, try again with a smaller increment
            // in the reverse direction.
            increment /= 2;
          } else {
            // Increment is 1, and neither the previous estimate nor the new
            // estimate is correct. The only way that can happen is if the
            // original date was an invalid value that will be constrained or
            // rejected here.
            if (overflow === 'reject') {
              throw new RangeErrorCtor(`Can't find ISO date from calendar date: ${JSONStringify({ ...originalDate })}`);
            } else {
              // To constrain, pick the earliest value
              const order = this.compareCalendarDates(roundtripEstimate, oldRoundtripEstimate);
              // If current value is larger, then back up to the previous value.
              if (order > 0) isoEstimate = this.addDaysIso(isoEstimate, -1);
              sign = 0;
            }
          }
        }
      }
    }
    cache.set(key, isoEstimate);
    if (keyOriginal) cache.set(keyOriginal, isoEstimate);
    if (
      date.year === undefined ||
      date.month === undefined ||
      date.day === undefined ||
      date.monthCode === undefined ||
      (this.hasEra && (date.era === undefined || date.eraYear === undefined))
    ) {
      throw new RangeErrorCtor('Unexpected missing property');
    }
    return isoEstimate;
  },
  compareCalendarDates(date1, date2) {
    if (date1.year !== date2.year) return ES.ComparisonResult(date1.year - date2.year);
    if (date1.month !== date2.month) return ES.ComparisonResult(date1.month - date2.month);
    if (date1.day !== date2.day) return ES.ComparisonResult(date1.day - date2.day);
    return 0;
  },
  /** Ensure that a calendar date actually exists. If not, return the closest earlier date. */
  regulateDate(calendarDate, overflow = 'constrain', cache) {
    const isoDate = this.calendarToIsoDate(calendarDate, overflow, cache);
    return this.isoToCalendarDate(isoDate, cache);
  },
  addDaysIso(isoDate, days) {
    const added = ES.BalanceISODate(isoDate.year, isoDate.month, isoDate.day + days);
    return added;
  },
  addDaysCalendar(calendarDate, days, cache) {
    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
    const addedIso = this.addDaysIso(isoDate, days);
    const addedCalendar = this.isoToCalendarDate(addedIso, cache);
    return addedCalendar;
  },
  addMonthsCalendar(calendarDate, months, overflow, cache) {
    const { day } = calendarDate;
    for (let i = 0, absMonths = MathAbs(months); i < absMonths; i++) {
      const { month } = calendarDate;
      const oldCalendarDate = calendarDate;
      const days =
        months < 0
          ? -MathMax(day, this.daysInPreviousMonth(calendarDate, cache))
          : this.daysInMonth(calendarDate, cache);
      const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
      let addedIso = this.addDaysIso(isoDate, days, cache);
      calendarDate = this.isoToCalendarDate(addedIso, cache);

      // Normally, we can advance one month by adding the number of days in the
      // current month. However, if we're at the end of the current month and
      // the next month has fewer days, then we rolled over to the after-next
      // month. Below we detect this condition and back up until we're back in
      // the desired month.
      if (months > 0) {
        const monthsInOldYear = this.monthsInYear(oldCalendarDate, cache);
        while (calendarDate.month - 1 !== month % monthsInOldYear) {
          addedIso = this.addDaysIso(addedIso, -1, cache);
          calendarDate = this.isoToCalendarDate(addedIso, cache);
        }
      }

      if (calendarDate.day !== day) {
        // try to retain the original day-of-month, if possible
        calendarDate = this.regulateDate({ ...calendarDate, day }, 'constrain', cache);
      }
    }
    if (overflow === 'reject' && calendarDate.day !== day) {
      throw new RangeErrorCtor(`Day ${day} does not exist in resulting calendar month`);
    }
    return calendarDate;
  },
  addCalendar(calendarDate, { years = 0, months = 0, weeks = 0, days = 0 }, overflow, cache) {
    const { year, day, monthCode } = calendarDate;
    const addedYears = this.adjustCalendarDate({ year: year + years, monthCode, day }, cache);
    const addedMonths = this.addMonthsCalendar(addedYears, months, overflow, cache);
    days += weeks * 7;
    const addedDays = this.addDaysCalendar(addedMonths, days, cache);
    return addedDays;
  },
  untilCalendar(calendarOne, calendarTwo, largestUnit, cache) {
    let days = 0;
    let weeks = 0;
    let months = 0;
    let years = 0;
    switch (largestUnit) {
      case 'day':
        days = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
        break;
      case 'week': {
        const totalDays = this.calendarDaysUntil(calendarOne, calendarTwo, cache);
        days = totalDays % 7;
        weeks = (totalDays - days) / 7;
        break;
      }
      case 'month':
      case 'year': {
        const sign = this.compareCalendarDates(calendarTwo, calendarOne);
        if (!sign) {
          return { years: 0, months: 0, weeks: 0, days: 0 };
        }
        const diffYears = calendarTwo.year - calendarOne.year;
        const diffDays = calendarTwo.day - calendarOne.day;
        if (largestUnit === 'year' && diffYears) {
          let diffInYearSign = 0;
          if (calendarTwo.monthCode > calendarOne.monthCode) diffInYearSign = 1;
          if (calendarTwo.monthCode < calendarOne.monthCode) diffInYearSign = -1;
          if (!diffInYearSign) diffInYearSign = MathSign(diffDays);
          const isOneFurtherInYear = diffInYearSign * sign < 0;
          years = isOneFurtherInYear ? diffYears - sign : diffYears;
        }
        const yearsAdded = years ? this.addCalendar(calendarOne, { years }, 'constrain', cache) : calendarOne;
        // Now we have less than one year remaining. Add one month at a time
        // until we go over the target, then back up one month and calculate
        // remaining days and weeks.
        let current;
        let next = yearsAdded;
        do {
          months += sign;
          current = next;
          next = this.addMonthsCalendar(current, sign, 'constrain', cache);
          if (next.day !== calendarOne.day) {
            // In case the day was constrained down, try to un-constrain it
            next = this.regulateDate({ ...next, day: calendarOne.day }, 'constrain', cache);
          }
        } while (this.compareCalendarDates(calendarTwo, next) * sign >= 0);
        months -= sign; // correct for loop above which overshoots by 1
        const remainingDays = this.calendarDaysUntil(current, calendarTwo, cache);
        days = remainingDays;
        break;
      }
    }
    return { years, months, weeks, days };
  },
  daysInMonth(calendarDate, cache) {
    // Add enough days to roll over to the next month. One we're in the next
    // month, we can calculate the length of the current month. NOTE: This
    // algorithm assumes that months are continuous. It would break if a
    // calendar skipped days, like the Julian->Gregorian switchover. But current
    // ICU calendars only skip days (japanese/roc/buddhist) because of a bug
    // (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158) that's
    // currently worked around by a custom calendarToIsoDate implementation in
    // those calendars. So this code should be safe for all ICU calendars.
    const { day } = calendarDate;
    const max = this.maximumMonthLength(calendarDate);
    const min = this.minimumMonthLength(calendarDate);
    // easiest case: we already know the month length if min and max are the same.
    if (min === max) return min;

    // Add enough days to get into the next month, without skipping it
    const increment = day <= max - min ? max : min;
    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
    const addedIsoDate = this.addDaysIso(isoDate, increment);
    const addedCalendarDate = this.isoToCalendarDate(addedIsoDate, cache);

    // Now back up to the last day of the original month
    const endOfMonthIso = this.addDaysIso(addedIsoDate, -addedCalendarDate.day);
    const endOfMonthCalendar = this.isoToCalendarDate(endOfMonthIso, cache);
    return endOfMonthCalendar.day;
  },
  daysInPreviousMonth(calendarDate, cache) {
    const { day, month, year } = calendarDate;

    // Check to see if we already know the month length, and return it if so
    const previousMonthYear = month > 1 ? year : year - 1;
    let previousMonthDate = { year: previousMonthYear, month, day: 1 };
    const previousMonth = month > 1 ? month - 1 : this.monthsInYear(previousMonthDate, cache);
    previousMonthDate = { ...previousMonthDate, month: previousMonth };
    const min = this.minimumMonthLength(previousMonthDate);
    const max = this.maximumMonthLength(previousMonthDate);
    if (min === max) return max;

    const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
    const lastDayOfPreviousMonthIso = this.addDaysIso(isoDate, -day);
    const lastDayOfPreviousMonthCalendar = this.isoToCalendarDate(lastDayOfPreviousMonthIso, cache);
    return lastDayOfPreviousMonthCalendar.day;
  },
  startOfCalendarYear(calendarDate) {
    return { year: calendarDate.year, month: 1, monthCode: 'M01', day: 1 };
  },
  startOfCalendarMonth(calendarDate) {
    return { year: calendarDate.year, month: calendarDate.month, day: 1 };
  },
  calendarDaysUntil(calendarOne, calendarTwo, cache) {
    const oneIso = this.calendarToIsoDate(calendarOne, 'constrain', cache);
    const twoIso = this.calendarToIsoDate(calendarTwo, 'constrain', cache);
    return (
      ES.ISODateToEpochDays(twoIso.year, twoIso.month - 1, twoIso.day) -
      ES.ISODateToEpochDays(oneIso.year, oneIso.month - 1, oneIso.day)
    );
  },
  // Override if calendar uses eras
  hasEra: false,
  monthDayFromFields(fields, overflow, cache) {
    let { era, eraYear, year, month, monthCode, day } = fields;
    if (month !== undefined && year === undefined && (!this.hasEra || era === undefined || eraYear === undefined)) {
      throw new TypeErrorCtor('when month is present, year (or era and eraYear) are required');
    }
    if (monthCode === undefined || year !== undefined || (this.hasEra && eraYear !== undefined)) {
      // Apply overflow behaviour to year/month/day, to get correct monthCode/day
      ({ monthCode, day } = this.isoToCalendarDate(this.calendarToIsoDate(fields, overflow, cache), cache));
    }

    let isoYear, isoMonth, isoDay;
    let closestCalendar, closestIso;
    // Look backwards starting from one of the calendar years spanning ISO year
    // 1972, up to 100 calendar years prior, to find a year that has this month
    // and day. Normal months and days will match immediately, but for leap days
    // and leap months we may have to look for a while.
    const startDateIso = { year: 1972, month: 12, day: 31 };
    const calendarOfStartDateIso = this.isoToCalendarDate(startDateIso, cache);
    // Note: relies on lexicographical ordering of monthCodes
    const calendarYear =
      calendarOfStartDateIso.monthCode > monthCode ||
      (calendarOfStartDateIso.monthCode === monthCode && calendarOfStartDateIso.day >= day)
        ? calendarOfStartDateIso.year
        : calendarOfStartDateIso.year - 1;
    for (let i = 0; i < 100; i++) {
      let testCalendarDate = this.adjustCalendarDate({ day, monthCode, year: calendarYear - i }, cache);
      const isoDate = this.calendarToIsoDate(testCalendarDate, 'constrain', cache);
      const roundTripCalendarDate = this.isoToCalendarDate(isoDate, cache);
      ({ year: isoYear, month: isoMonth, day: isoDay } = isoDate);
      if (roundTripCalendarDate.monthCode === monthCode && roundTripCalendarDate.day === day) {
        return { month: isoMonth, day: isoDay, year: isoYear };
      } else if (overflow === 'constrain') {
        // non-ISO constrain algorithm tries to find the closest date in a matching month
        if (
          closestCalendar === undefined ||
          (roundTripCalendarDate.monthCode === closestCalendar.monthCode &&
            roundTripCalendarDate.day > closestCalendar.day)
        ) {
          closestCalendar = roundTripCalendarDate;
          closestIso = isoDate;
        }
      }
    }
    if (overflow === 'constrain' && closestIso !== undefined) return closestIso;
    throw new RangeErrorCtor(`No recent ${this.id} year with monthCode ${monthCode} and day ${day}`);
  }
};

const helperHebrew = ObjectAssign({}, nonIsoHelperBase, {
  id: 'hebrew',
  calendarType: 'lunisolar',
  inLeapYear(calendarDate /*, cache */) {
    const { year } = calendarDate;
    // FYI: In addition to adding a month in leap years, the Hebrew calendar
    // also has per-year changes to the number of days of Heshvan and Kislev.
    // Given that these can be calculated by counting the number of days in
    // those months, I assume that these DO NOT need to be exposed as
    // Hebrew-only prototype fields or methods.
    return (7 * year + 1) % 19 < 7;
  },
  monthsInYear(calendarDate) {
    return this.inLeapYear(calendarDate) ? 13 : 12;
  },
  minimumMonthLength(calendarDate) {
    return this.minMaxMonthLength(calendarDate, 'min');
  },
  maximumMonthLength(calendarDate) {
    return this.minMaxMonthLength(calendarDate, 'max');
  },
  minMaxMonthLength(calendarDate, minOrMax) {
    const { month, year } = calendarDate;
    const monthCode = this.getMonthCode(year, month);
    const monthInfo = ES.Call(ArrayPrototypeFind, ObjectEntries(this.months), [(m) => m[1].monthCode === monthCode]);
    if (monthInfo === undefined) throw new RangeErrorCtor(`unmatched Hebrew month: ${month}`);
    const daysInMonth = monthInfo[1].days;
    return typeof daysInMonth === 'number' ? daysInMonth : daysInMonth[minOrMax];
  },
  /** Take a guess at what ISO date a particular calendar date corresponds to */
  estimateIsoDate(calendarDate) {
    const { year } = calendarDate;
    return { year: year - 3760, month: 1, day: 1 };
  },
  months: {
    Tishri: { leap: 1, regular: 1, monthCode: 'M01', days: 30 },
    Heshvan: { leap: 2, regular: 2, monthCode: 'M02', days: { min: 29, max: 30 } },
    Kislev: { leap: 3, regular: 3, monthCode: 'M03', days: { min: 29, max: 30 } },
    Tevet: { leap: 4, regular: 4, monthCode: 'M04', days: 29 },
    Shevat: { leap: 5, regular: 5, monthCode: 'M05', days: 30 },
    Adar: { leap: undefined, regular: 6, monthCode: 'M06', days: 29 },
    'Adar I': { leap: 6, regular: undefined, monthCode: 'M05L', days: 30 },
    'Adar II': { leap: 7, regular: undefined, monthCode: 'M06', days: 29 },
    Nisan: { leap: 8, regular: 7, monthCode: 'M07', days: 30 },
    Iyar: { leap: 9, regular: 8, monthCode: 'M08', days: 29 },
    Sivan: { leap: 10, regular: 9, monthCode: 'M09', days: 30 },
    Tamuz: { leap: 11, regular: 10, monthCode: 'M10', days: 29 },
    Av: { leap: 12, regular: 11, monthCode: 'M11', days: 30 },
    Elul: { leap: 13, regular: 12, monthCode: 'M12', days: 29 }
  },
  getMonthCode(year, month) {
    if (this.inLeapYear({ year })) {
      return month === 6 ? buildMonthCode(5, true) : buildMonthCode(month < 6 ? month : month - 1);
    } else {
      return buildMonthCode(month);
    }
  },
  adjustCalendarDate(calendarDate, cache, overflow = 'constrain', fromLegacyDate = false) {
    let { year, month, monthCode, day, monthExtra } = calendarDate;
    if (year === undefined) throw new TypeErrorCtor('Missing property: year');
    if (fromLegacyDate) {
      // In Pre Node-14 V8, DateTimeFormat.formatToParts `month: 'numeric'`
      // output returns the numeric equivalent of `month` as a string, meaning
      // that `'6'` in a leap year is Adar I, while `'6'` in a non-leap year
      // means Adar. In this case, `month` will already be correct and no action
      // is needed. However, in Node 14 and later formatToParts returns the name
      // of the Hebrew month (e.g. "Tevet"), so we'll need to look up the
      // correct `month` using the string name as a key.
      if (monthExtra) {
        const monthInfo = this.months[monthExtra];
        if (!monthInfo) throw new RangeErrorCtor(`Unrecognized month from formatToParts: ${monthExtra}`);
        month = this.inLeapYear({ year }) ? monthInfo.leap : monthInfo.regular;
      }
      monthCode = this.getMonthCode(year, month);
      return { year, month, day, monthCode };
    } else {
      // When called without input coming from legacy Date output, simply ensure
      // that all fields are present.
      this.validateCalendarDate(calendarDate);
      if (month === undefined) {
        if (ES.Call(StringPrototypeEndsWith, monthCode, ['L'])) {
          if (monthCode !== 'M05L') {
            throw new RangeErrorCtor(`Hebrew leap month must have monthCode M05L, not ${monthCode}`);
          }
          month = 6;
          if (!this.inLeapYear({ year })) {
            if (overflow === 'reject') {
              throw new RangeErrorCtor(`Hebrew monthCode M05L is invalid in year ${year} which is not a leap year`);
            } else {
              // constrain to same day of next month (Adar)
              month = 6;
              monthCode = 'M06';
            }
          }
        } else {
          month = monthCodeNumberPart(monthCode);
          // if leap month is before this one, the month index is one more than the month code
          if (this.inLeapYear({ year }) && month >= 6) month++;
          const largestMonth = this.monthsInYear({ year });
          if (month < 1 || month > largestMonth) throw new RangeErrorCtor(`Invalid monthCode: ${monthCode}`);
        }
      } else {
        if (overflow === 'reject') {
          ES.RejectToRange(month, 1, this.monthsInYear({ year }));
          ES.RejectToRange(day, 1, this.maximumMonthLength({ year, month }));
        } else {
          month = ES.ConstrainToRange(month, 1, this.monthsInYear({ year }));
          day = ES.ConstrainToRange(day, 1, this.maximumMonthLength({ year, month }));
        }
        if (monthCode === undefined) {
          monthCode = this.getMonthCode(year, month);
        } else {
          const calculatedMonthCode = this.getMonthCode(year, month);
          if (calculatedMonthCode !== monthCode) {
            throw new RangeErrorCtor(
              `monthCode ${monthCode} doesn't correspond to month ${month} in Hebrew year ${year}`
            );
          }
        }
      }
      return { ...calendarDate, day, month, monthCode, year };
    }
  }
});

/**
 * For Temporal purposes, the Islamic calendar is simple because it's always the
 * same 12 months in the same order.
 */
const helperIslamic = ObjectAssign({}, nonIsoHelperBase, {
  id: 'islamic',
  calendarType: 'lunar',
  inLeapYear(calendarDate, cache) {
    const startOfYearCalendar = { year: calendarDate.year, month: 1, monthCode: 'M01', day: 1 };
    const startOfNextYearCalendar = { year: calendarDate.year + 1, month: 1, monthCode: 'M01', day: 1 };
    const result = this.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
    return result === 355;
  },
  monthsInYear(/* calendarYear, cache */) {
    return 12;
  },
  minimumMonthLength: (/* calendarDate */) => 29,
  maximumMonthLength: (/* calendarDate */) => 30,
  DAYS_PER_ISLAMIC_YEAR: 354 + 11 / 30,
  DAYS_PER_ISO_YEAR: 365.2425,
  estimateIsoDate(calendarDate) {
    const { year } = this.adjustCalendarDate(calendarDate);
    return { year: MathFloor((year * this.DAYS_PER_ISLAMIC_YEAR) / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
});

const helperPersian = ObjectAssign({}, nonIsoHelperBase, {
  id: 'persian',
  calendarType: 'solar',
  inLeapYear(calendarDate, cache) {
    // If the last month has 30 days, it's a leap year.
    return this.daysInMonth({ year: calendarDate.year, month: 12, day: 1 }, cache) === 30;
  },
  monthsInYear(/* calendarYear, cache */) {
    return 12;
  },
  minimumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 12) return 29;
    return month <= 6 ? 31 : 30;
  },
  maximumMonthLength(calendarDate) {
    const { month } = calendarDate;
    if (month === 12) return 30;
    return month <= 6 ? 31 : 30;
  },
  estimateIsoDate(calendarDate) {
    const { year } = this.adjustCalendarDate(calendarDate);
    return { year: year + 621, month: 1, day: 1 };
  }
});

const helperIndian = ObjectAssign({}, nonIsoHelperBase, {
  id: 'indian',
  calendarType: 'solar',
  inLeapYear(calendarDate /*, cache*/) {
    // From https://en.wikipedia.org/wiki/Indian_national_calendar:
    // Years are counted in the Saka era, which starts its year 0 in the year 78
    // of the Common Era. To determine leap years, add 78 to the Saka year – if
    // the result is a leap year in the Gregorian calendar, then the Saka year
    // is a leap year as well.
    return isGregorianLeapYear(calendarDate.year + 78);
  },
  monthsInYear(/* calendarYear, cache */) {
    return 12;
  },
  minimumMonthLength(calendarDate) {
    return this.getMonthInfo(calendarDate).length;
  },
  maximumMonthLength(calendarDate) {
    return this.getMonthInfo(calendarDate).length;
  },
  // Indian months always start at the same well-known Gregorian month and
  // day. So this conversion is easy and fast. See
  // https://en.wikipedia.org/wiki/Indian_national_calendar
  months: {
    1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } },
    2: { length: 31, month: 4, day: 21 },
    3: { length: 31, month: 5, day: 22 },
    4: { length: 31, month: 6, day: 22 },
    5: { length: 31, month: 7, day: 23 },
    6: { length: 31, month: 8, day: 23 },
    7: { length: 30, month: 9, day: 23 },
    8: { length: 30, month: 10, day: 23 },
    9: { length: 30, month: 11, day: 22 },
    10: { length: 30, month: 12, day: 22 },
    11: { length: 30, month: 1, nextYear: true, day: 21 },
    12: { length: 30, month: 2, nextYear: true, day: 20 }
  },
  getMonthInfo(calendarDate) {
    const { month } = calendarDate;
    let monthInfo = this.months[month];
    if (monthInfo === undefined) throw new RangeErrorCtor(`Invalid month: ${month}`);
    if (this.inLeapYear(calendarDate) && monthInfo.leap) monthInfo = monthInfo.leap;
    return monthInfo;
  },
  estimateIsoDate(calendarDate) {
    // FYI, this "estimate" is always the exact ISO date, which makes the Indian
    // calendar fast!
    calendarDate = this.adjustCalendarDate(calendarDate);
    const monthInfo = this.getMonthInfo(calendarDate);
    const isoYear = calendarDate.year + 78 + (monthInfo.nextYear ? 1 : 0);
    const isoMonth = monthInfo.month;
    const isoDay = monthInfo.day;
    const isoDate = ES.BalanceISODate(isoYear, isoMonth, isoDay + calendarDate.day - 1);
    return isoDate;
  },
  // https://bugs.chromium.org/p/v8/issues/detail?id=10529 causes Intl's Indian
  // calendar output to fail for all dates before 0001-01-01 ISO.  For example,
  // in Node 12 0000-01-01 is calculated as 6146/12/-583 instead of 10/11/-79 as
  // expected.
  vulnerableToBceBug:
    ES.Call(DatePrototypeToLocaleDateString, new DateCtor('0000-01-01T00:00Z'), [
      'en-US-u-ca-indian',
      { timeZone: 'UTC' }
    ]) !== '10/11/-79 Saka',
  checkIcuBugs(isoDate) {
    if (this.vulnerableToBceBug && isoDate.year < 1) {
      throw new RangeErrorCtor(
        `calendar '${this.id}' is broken for ISO dates before 0001-01-01` +
          ' (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)'
      );
    }
  }
});

/**
 * This function adds additional metadata that makes it easier to work with
 * eras. Note that it mutates and normalizes the original era objects, which is
 * OK because this is non-observable, internal-only metadata.
 *
 *  interface Era {
 *   // Era code, used to populate the 'era' field of Temporal instances.
 *   // See https://tc39.es/proposal-intl-era-monthcode/#table-eras
 *   code: string;
 *
 *   // Names are additionally accepted as alternate era codes on input, and the
 *   // first name is also output in error messages (and may be the era code if
 *   // desired.)
 *   // See https://tc39.es/proposal-intl-era-monthcode/#table-eras
 *   // If absent, this field defaults to a single element matching the code.
 *   names: string[];
 *
 *   // alternate name of the era used in old versions of ICU data
 *   // format is `era{n}` where n is the zero-based index of the era
 *   // with the oldest era being 0.
 *   genericName: string;
 *
 *   // Signed calendar year where this era begins. Will be 1 (or 0 for zero-based
 *   // eras) for the anchor era assuming that `year` numbering starts at the
 *   // beginning of the anchor era, which is true for all ICU calendars except
 *   // Japanese. For input, the month and day are optional. If an era starts
 *   // mid-year then a calendar month and day are included.
 *   // Otherwise `{ month: 1, day: 1 }` is assumed.
 *   anchorEpoch: { year: number; month: number; day: number };
 *
 *   // ISO date of the first day of this era
 *   isoEpoch: { year: number; month: number; day: number };
 *
 *   // If present, then this era counts years backwards like BC
 *   // and this property points to the forward era. This must be
 *   // the last (oldest) era in the array.
 *   reverseOf?: Era;
 *
 *   // If true, the era's years are 0-based. If omitted or false,
 *   // then the era's years are 1-based.
 *   hasYearZero?: boolean;
 *
 *   // Override if this era is the anchor. Not normally used because
 *   // anchor eras are inferred.
 *   isAnchor?: boolean;
 * }
 * ```
 * */
function adjustEras(eras) {
  if (eras.length === 0) {
    throw new RangeErrorCtor('Invalid era data: eras are required');
  }
  if (eras.length === 1 && eras[0].reverseOf) {
    throw new RangeErrorCtor('Invalid era data: anchor era cannot count years backwards');
  }
  if (eras.length === 1 && !eras[0].code) {
    throw new RangeErrorCtor('Invalid era data: at least one named era is required');
  }
  if (ES.Call(ArrayPrototypeFilter, eras, [(e) => e.reverseOf != null]).length > 1) {
    throw new RangeErrorCtor('Invalid era data: only one era can count years backwards');
  }

  // Find the "anchor era" which is the era used for (era-less) `year`. Reversed
  // eras can never be anchors. The era without an `anchorEpoch` property is the
  // anchor.
  let anchorEra;
  ES.Call(ArrayPrototypeForEach, eras, [
    (e) => {
      if (e.isAnchor || (!e.anchorEpoch && !e.reverseOf)) {
        if (anchorEra) throw new RangeErrorCtor('Invalid era data: cannot have multiple anchor eras');
        anchorEra = e;
        e.anchorEpoch = { year: e.hasYearZero ? 0 : 1 };
      } else if (!e.code) {
        throw new RangeErrorCtor('If era name is blank, it must be the anchor era');
      }
    }
  ]);

  // If the era name is undefined, then it's an anchor that doesn't interact
  // with eras at all. For example, Japanese `year` is always the same as ISO
  // `year`.  So this "era" is the anchor era but isn't used for era matching.
  // Strip it from the list that's returned.
  eras = ES.Call(ArrayPrototypeFilter, eras, [(e) => e.code]);

  ES.Call(ArrayPrototypeForEach, eras, [
    (e) => {
      // Some eras are mirror images of another era e.g. B.C. is the reverse of A.D.
      // Replace the string-valued "reverseOf" property with the actual era object
      // that's reversed.
      const { reverseOf } = e;
      if (reverseOf) {
        const reversedEra = ES.Call(ArrayPrototypeFind, eras, [(era) => era.code === reverseOf]);
        if (reversedEra === undefined) {
          throw new RangeErrorCtor(`Invalid era data: unmatched reverseOf era: ${reverseOf}`);
        }
        e.reverseOf = reversedEra;
        e.anchorEpoch = reversedEra.anchorEpoch;
        e.isoEpoch = reversedEra.isoEpoch;
      }
      if (e.anchorEpoch.month === undefined) e.anchorEpoch.month = 1;
      if (e.anchorEpoch.day === undefined) e.anchorEpoch.day = 1;
    }
  ]);

  // Ensure that the latest epoch is first in the array. This lets us try to
  // match eras in index order, with the last era getting the remaining older
  // years. Any reverse-signed era must be at the end.
  Call(ArrayPrototypeSort, eras, [
    (e1, e2) => {
      if (e1.reverseOf) return 1;
      if (e2.reverseOf) return -1;
      if (!e1.isoEpoch || !e2.isoEpoch) throw new RangeErrorCtor('Invalid era data: missing ISO epoch');
      return e2.isoEpoch.year - e1.isoEpoch.year;
    }
  ]);

  // If there's a reversed era, then the one before it must be the era that's
  // being reversed.
  const lastEraReversed = eras[eras.length - 1].reverseOf;
  if (lastEraReversed) {
    if (lastEraReversed !== eras[eras.length - 2]) {
      throw new RangeErrorCtor('Invalid era data: invalid reverse-sign era');
    }
  }

  // Finally, add a "genericName" property in the format "era{n} where `n` is
  // zero-based index, with the oldest era being zero. This format is used by
  // older versions of ICU data.
  ES.Call(ArrayPrototypeForEach, eras, [
    (e, i) => {
      e.genericName = `era${eras.length - 1 - i}`;
    }
  ]);

  return { eras, anchorEra: anchorEra || eras[0] };
}

function isGregorianLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Base for Gregorian-like calendars without eras, but a different year zero.
 * Can be further overridden to implement fixed epoch for solar calendars with
 * different months/days than Gregorian.
 */
function makeHelperGregorianFixedEpoch(id) {
  return ObjectAssign({}, nonIsoHelperBase, {
    id,
    calendarType: 'solar',
    inLeapYear(calendarDate /*, cache */) {
      const { year } = this.estimateIsoDate(calendarDate);
      return isGregorianLeapYear(year);
    },
    monthsInYear(/* calendarDate */) {
      return 12;
    },
    minimumMonthLength(calendarDate) {
      const { month } = calendarDate;
      if (month === 2) return this.inLeapYear(calendarDate) ? 29 : 28;
      return ES.Call(ArrayPrototypeIndexOf, [4, 6, 9, 11], [month]) >= 0 ? 30 : 31;
    },
    maximumMonthLength(calendarDate) {
      return this.minimumMonthLength(calendarDate);
    },
    estimateIsoDate(calendarDate) {
      calendarDate = this.adjustCalendarDate(calendarDate);
      return ES.RegulateISODate(
        calendarDate.year + this.isoEpoch.year,
        calendarDate.month + this.isoEpoch.month,
        calendarDate.day + this.isoEpoch.day,
        'constrain'
      );
    }
  });
}

/** Base for Gregorian-like calendars with eras. */
const makeHelperGregorian = (id, originalEras) => {
  const { eras, anchorEra } = adjustEras(originalEras);
  return ObjectAssign({}, nonIsoHelperBase, {
    id,
    hasEra: true,
    eras,
    anchorEra,
    calendarType: 'solar',
    inLeapYear(calendarDate /*, cache */) {
      const { year } = this.estimateIsoDate(calendarDate);
      return isGregorianLeapYear(year);
    },
    monthsInYear(/* calendarDate */) {
      return 12;
    },
    minimumMonthLength(calendarDate) {
      const { month } = calendarDate;
      if (month === 2) return this.inLeapYear(calendarDate) ? 29 : 28;
      return ES.Call(ArrayPrototypeIndexOf, [4, 6, 9, 11], [month]) >= 0 ? 30 : 31;
    },
    maximumMonthLength(calendarDate) {
      return this.minimumMonthLength(calendarDate);
    },
    /** Fill in missing parts of the (year, era, eraYear) tuple */
    completeEraYear(calendarDate) {
      const checkField = (property, value, names) => {
        const currentValue = calendarDate[property];
        if (
          currentValue != null &&
          currentValue != value &&
          !ES.Call(ArrayPrototypeIncludes, names || [], [currentValue])
        ) {
          // Prefer displaying an era alias, instead of "gregory-inverse"
          const preferredName = names?.[0];
          const expected = preferredName ? `${value} (also called ${preferredName})` : value;
          throw new RangeErrorCtor(`Input ${property} ${currentValue} doesn't match calculated value ${expected}`);
        }
      };
      const eraFromYear = (year) => {
        let eraYear;
        const adjustedCalendarDate = { ...calendarDate, year };
        const matchingEra = ES.Call(ArrayPrototypeFind, this.eras, [
          (e, i) => {
            if (i === this.eras.length - 1) {
              if (e.reverseOf) {
                // This is a reverse-sign era (like BCE) which must be the oldest
                // era. Count years backwards.
                if (year > 0) throw new RangeErrorCtor(`Signed year ${year} is invalid for era ${e.name}`);
                eraYear = e.anchorEpoch.year - year;
                return true;
              }
              // last era always gets all "leftover" (older than epoch) years,
              // so no need for a comparison like below.
              eraYear = year - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
              return true;
            }
            const comparison = nonIsoHelperBase.compareCalendarDates(adjustedCalendarDate, e.anchorEpoch);
            if (comparison >= 0) {
              eraYear = year - e.anchorEpoch.year + (e.hasYearZero ? 0 : 1);
              return true;
            }
            return false;
          }
        ]);
        if (!matchingEra) throw new RangeErrorCtor(`Year ${year} was not matched by any era`);
        return { eraYear, era: matchingEra.code, eraNames: matchingEra.names };
      };

      let { year, eraYear, era } = calendarDate;
      if (year != null) {
        const matchData = eraFromYear(year);
        ({ eraYear, era } = matchData);
        checkField('era', era, matchData?.eraNames);
        checkField('eraYear', eraYear);
      } else if (eraYear != null) {
        if (era === undefined) throw new RangeErrorCtor('era and eraYear must be provided together');
        const matchingEra = ES.Call(ArrayPrototypeFind, this.eras, [
          ({ code, names = [] }) => code === era || ES.Call(ArrayPrototypeIncludes, names, [era])
        ]);
        if (!matchingEra) throw new RangeErrorCtor(`Era ${era} (ISO year ${eraYear}) was not matched by any era`);
        if (matchingEra.reverseOf) {
          year = matchingEra.anchorEpoch.year - eraYear;
        } else {
          year = eraYear + matchingEra.anchorEpoch.year - (matchingEra.hasYearZero ? 0 : 1);
        }
        checkField('year', year);
        // We'll accept dates where the month/day is earlier than the start of
        // the era or after its end as long as it's in the same year. If that
        // happens, we'll adjust the era/eraYear pair to be the correct era for
        // the `year`.
        ({ eraYear, era } = eraFromYear(year));
      } else {
        throw new RangeErrorCtor('Either year or eraYear and era are required');
      }
      return { ...calendarDate, year, eraYear, era };
    },
    adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
      // Because this is not a lunisolar calendar, it's safe to convert monthCode to a number
      const { month, monthCode } = calendarDate;
      if (month === undefined) calendarDate = { ...calendarDate, month: monthCodeNumberPart(monthCode) };
      this.validateCalendarDate(calendarDate);
      calendarDate = this.completeEraYear(calendarDate);
      calendarDate = Call(nonIsoHelperBase.adjustCalendarDate, this, [calendarDate, cache, overflow]);
      return calendarDate;
    },
    estimateIsoDate(calendarDate) {
      calendarDate = this.adjustCalendarDate(calendarDate);
      const { year, month, day } = calendarDate;
      const { anchorEra } = this;
      const isoYearEstimate = year + anchorEra.isoEpoch.year - (anchorEra.hasYearZero ? 0 : 1);
      return ES.RegulateISODate(isoYearEstimate, month, day, 'constrain');
    }
  });
};

/**
 * Some calendars are identical to Gregorian except era and year. For these
 * calendars, we can avoid using Intl.DateTimeFormat and just calculate the
 * year, era, and eraYear. This is faster (because Intl.DateTimeFormat is slow
 * and uses a huge amount of RAM), and it avoids ICU bugs like
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1173158.
 */
const makeHelperSameMonthDayAsGregorian = (id, originalEras) => {
  const base = makeHelperGregorian(id, originalEras);
  return ObjectAssign(base, {
    isoToCalendarDate(isoDate) {
      // Month and day are same as ISO, so bypass Intl.DateTimeFormat and
      // calculate the year, era, and eraYear here.
      const { year: isoYear, month, day } = isoDate;
      const monthCode = buildMonthCode(month);
      const year = isoYear - this.anchorEra.isoEpoch.year + 1;
      return this.completeEraYear({ year, month, monthCode, day });
    }
  });
};

const makeHelperOrthodox = (id, originalEras) => {
  const base = originalEras ? makeHelperGregorian(id, originalEras) : makeHelperGregorianFixedEpoch(id);
  return ObjectAssign(base, {
    inLeapYear(calendarDate /*, cache */) {
      // Leap years happen one year before the Julian leap year. Note that this
      // calendar is based on the Julian calendar which has a leap year every 4
      // years, unlike the Gregorian calendar which doesn't have leap years on
      // years divisible by 100 except years divisible by 400.
      //
      // Note that we're assuming that leap years in before-epoch times match
      // how leap years are defined now. This is probably not accurate but I'm
      // not sure how better to do it.
      const { year } = calendarDate;
      return (year + 1) % 4 === 0;
    },
    monthsInYear(/* calendarDate */) {
      return 13;
    },
    minimumMonthLength(calendarDate) {
      const { month } = calendarDate;
      // Ethiopian/Coptic calendars have 12 30-day months and an extra 5-6 day 13th month.
      if (month === 13) return this.inLeapYear(calendarDate) ? 6 : 5;
      return 30;
    },
    maximumMonthLength(calendarDate) {
      return this.minimumMonthLength(calendarDate);
    }
  });
};

// `coptic` and `ethiopic` calendars are very similar to `ethioaa` calendar,
// with the following differences:
// - Coptic uses BCE-like positive numbers for years before its epoch (the other
//   two use negative year numbers before epoch)
// - Coptic has a different epoch date
// - Ethiopic has an additional second era that starts at the same date as the
//   zero era of ethioaa.
const helperEthioaa = ObjectAssign(makeHelperOrthodox('ethioaa'), { isoEpoch: { year: -5492, month: 7, day: 17 } });
const helperCoptic = makeHelperOrthodox('coptic', [
  { code: 'coptic', isoEpoch: { year: 284, month: 8, day: 29 } },
  { code: 'coptic-inverse', reverseOf: 'coptic' }
]);
// Anchor is currently the older era to match ethioaa, but should it be the newer era?
// See https://github.com/tc39/ecma402/issues/534 for discussion.
const helperEthiopic = makeHelperOrthodox('ethiopic', [
  { code: 'ethioaa', names: ['ethiopic-amete-alem', 'mundi'], isoEpoch: { year: -5492, month: 7, day: 17 } },
  { code: 'ethiopic', names: ['incar'], isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }
]);

const helperRoc = makeHelperSameMonthDayAsGregorian('roc', [
  { code: 'roc', names: ['minguo'], isoEpoch: { year: 1912, month: 1, day: 1 } },
  { code: 'roc-inverse', names: ['before-roc'], reverseOf: 'roc' }
]);

const helperBuddhist = ObjectAssign(makeHelperGregorianFixedEpoch('buddhist'), {
  isoEpoch: { year: -543, month: 1, day: 1 }
});

const helperGregory = ObjectAssign(
  makeHelperSameMonthDayAsGregorian('gregory', [
    { code: 'gregory', names: ['ad', 'ce'], isoEpoch: { year: 1, month: 1, day: 1 } },
    { code: 'gregory-inverse', names: ['bc', 'bce'], reverseOf: 'gregory' }
  ]),
  {
    reviseIntlEra(calendarDate /*, isoDate*/) {
      let { era, eraYear } = calendarDate;
      // Firefox 96 introduced a bug where the `'short'` format of the era
      // option mistakenly returns the one-letter (narrow) format instead. The
      // code below handles either the correct or Firefox-buggy format. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
      if (era === 'b') era = 'gregory-inverse';
      if (era === 'a') era = 'gregory';
      return { era, eraYear };
    },
    getFirstDayOfWeek() {
      return 1;
    },
    getMinimalDaysInFirstWeek() {
      return 1;
    }
  }
);

const helperJapanese = ObjectAssign(
  // NOTE: Only the 5 modern eras (Meiji and later) are included. For dates
  // before Meiji 1, the `ce` and `bce` eras are used. Challenges with pre-Meiji
  // eras include:
  // - Start/end dates of older eras are not precisely defined, which is
  //   challenging given Temporal's need for precision
  // - Some era dates and/or names are disputed by historians
  // - As historical research proceeds, new eras are discovered and existing era
  //   dates are modified, leading to considerable churn which is not good for
  //   Temporal use.
  //  - The earliest era (in 645 CE) may not end up being the earliest depending
  //    on future historical scholarship
  //  - Before Meiji, Japan used a lunar (or lunisolar?) calendar but AFAIK
  //    that's not reflected in the ICU implementation.
  //
  // For more discussion: https://github.com/tc39/proposal-temporal/issues/526.
  //
  // Here's a full list of CLDR/ICU eras:
  // https://github.com/unicode-org/icu/blob/master/icu4c/source/data/locales/root.txt#L1582-L1818
  // https://github.com/unicode-org/cldr/blob/master/common/supplemental/supplementalData.xml#L4310-L4546
  //
  // NOTE: Japan started using the Gregorian calendar in 6 Meiji, replacing a
  // lunisolar calendar. So the day before January 1 of 6 Meiji (1873) was not
  // December 31, but December 2, of 5 Meiji (1872). The existing Ecma-402
  // Japanese calendar doesn't seem to take this into account, so neither do we:
  // > args = ['en-ca-u-ca-japanese', { era: 'short' }]
  // > new Date('1873-01-01T12:00').toLocaleString(...args)
  // '1 1, 6 Meiji, 12:00:00 PM'
  // > new Date('1872-12-31T12:00').toLocaleString(...args)
  // '12 31, 5 Meiji, 12:00:00 PM'
  makeHelperSameMonthDayAsGregorian('japanese', [
    // The Japanese calendar `year` is just the ISO year, because (unlike other
    // ICU calendars) there's no obvious "default era", we use the ISO year.
    { code: 'reiwa', isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } },
    { code: 'heisei', isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } },
    { code: 'showa', isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } },
    { code: 'taisho', isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } },
    { code: 'meiji', isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } },
    { code: 'japanese', names: ['japanese', 'gregory', 'ad', 'ce'], isoEpoch: { year: 1, month: 1, day: 1 } },
    { code: 'japanese-inverse', names: ['japanese-inverse', 'gregory-inverse', 'bc', 'bce'], reverseOf: 'japanese' }
  ]),
  {
    erasBeginMidYear: true,
    reviseIntlEra(calendarDate, isoDate) {
      const { era, eraYear } = calendarDate;
      const { year: isoYear } = isoDate;
      if (ES.Call(ArrayPrototypeFind, this.eras, [(e) => e.code === era])) return { era, eraYear };
      return isoYear < 1 ? { era: 'japanese-inverse', eraYear: 1 - isoYear } : { era: 'japanese', eraYear: isoYear };
    }
  }
);

const helperChinese = ObjectAssign({}, nonIsoHelperBase, {
  id: 'chinese',
  calendarType: 'lunisolar',
  inLeapYear(calendarDate, cache) {
    const months = this.getMonthList(calendarDate.year, cache);
    return ObjectEntries(months).length === 13;
  },
  monthsInYear(calendarDate, cache) {
    return this.inLeapYear(calendarDate, cache) ? 13 : 12;
  },
  minimumMonthLength: (/* calendarDate */) => 29,
  maximumMonthLength: (/* calendarDate */) => 30,
  getMonthList(calendarYear, cache) {
    if (calendarYear === undefined) {
      throw new TypeErrorCtor('Missing year');
    }
    const key = JSONStringify({ func: 'getMonthList', calendarYear, id: this.id });
    const cached = cache.get(key);
    if (cached) return cached;
    const dateTimeFormat = this.getFormatter();
    const getCalendarDate = (isoYear, daysPastFeb1) => {
      const isoStringFeb1 = toUtcIsoDateString({ isoYear, isoMonth: 2, isoDay: 1 });
      const legacyDate = new DateCtor(isoStringFeb1);
      // Now add the requested number of days, which may wrap to the next month.
      ES.Call(DatePrototypeSetUTCDate, legacyDate, [daysPastFeb1 + 1]);
      const newYearGuess = ES.Call(IntlDateTimeFormatPrototypeFormatToParts, dateTimeFormat, [legacyDate]);
      const calendarMonthString = ES.Call(ArrayPrototypeFind, newYearGuess, [(tv) => tv.type === 'month']).value;
      const calendarDay = +ES.Call(ArrayPrototypeFind, newYearGuess, [(tv) => tv.type === 'day']).value;
      let calendarYearToVerify = ES.Call(ArrayPrototypeFind, newYearGuess, [(tv) => tv.type === 'relatedYear']);
      if (calendarYearToVerify !== undefined) {
        calendarYearToVerify = +calendarYearToVerify.value;
      } else {
        // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
        // output of Intl.DateTimeFormat.formatToParts.
        throw new RangeErrorCtor(
          `Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`
        );
      }
      return { calendarMonthString, calendarDay, calendarYearToVerify };
    };

    // First, find a date close to Chinese New Year. Feb 17 will either be in
    // the first month or near the end of the last month of the previous year.
    let isoDaysDelta = 17;
    let { calendarMonthString, calendarDay, calendarYearToVerify } = getCalendarDate(calendarYear, isoDaysDelta);

    // If we didn't guess the first month correctly, add (almost in some months)
    // a lunar month
    if (calendarMonthString !== '1') {
      isoDaysDelta += 29;
      ({ calendarMonthString, calendarDay } = getCalendarDate(calendarYear, isoDaysDelta));
    }

    // Now back up to near the start of the first month, but not too near that
    // off-by-one issues matter.
    isoDaysDelta -= calendarDay - 5;
    const result = {};
    let monthIndex = 1;
    let oldCalendarDay;
    let oldMonthString;
    let done = false;
    do {
      ({ calendarMonthString, calendarDay, calendarYearToVerify } = getCalendarDate(calendarYear, isoDaysDelta));
      if (oldCalendarDay) {
        result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;
      }
      if (calendarYearToVerify !== calendarYear) {
        done = true;
      } else {
        result[calendarMonthString] = { monthIndex: monthIndex++ };
        // Move to the next month. Because months are sometimes 29 days, the day of the
        // calendar month will move forward slowly but not enough to flip over to a new
        // month before the loop ends at 12-13 months.
        isoDaysDelta += 30;
      }
      oldCalendarDay = calendarDay;
      oldMonthString = calendarMonthString;
    } while (!done);
    result[oldMonthString].daysInMonth = oldCalendarDay + 30 - calendarDay;

    cache.set(key, result);
    return result;
  },
  estimateIsoDate(calendarDate) {
    const { year, month } = calendarDate;
    return { year, month: month >= 12 ? 12 : month + 1, day: 1 };
  },
  adjustCalendarDate(calendarDate, cache, overflow = 'constrain', fromLegacyDate = false) {
    let { year, month, monthExtra, day, monthCode } = calendarDate;
    if (year === undefined) throw new TypeErrorCtor('Missing property: year');
    if (fromLegacyDate) {
      // Legacy Date output returns a string that's an integer with an optional
      // "bis" suffix used only by the Chinese/Dangi calendar to indicate a leap
      // month. Below we'll normalize the output.
      if (monthExtra && monthExtra !== 'bis') throw new RangeErrorCtor(`Unexpected leap month suffix: ${monthExtra}`);
      const monthCode = buildMonthCode(month, monthExtra !== undefined);
      const monthString = `${month}${monthExtra || ''}`;
      const months = this.getMonthList(year, cache);
      const monthInfo = months[monthString];
      if (monthInfo === undefined) throw new RangeErrorCtor(`Unmatched month ${monthString} in Chinese year ${year}`);
      month = monthInfo.monthIndex;
      return { year, month, day, monthCode };
    } else {
      // When called without input coming from legacy Date output,
      // simply ensure that all fields are present.
      this.validateCalendarDate(calendarDate);
      if (month === undefined) {
        const months = this.getMonthList(year, cache);
        let numberPart = ES.Call(StringPrototypeReplace, monthCode, [/^M|L$/g, (ch) => (ch === 'L' ? 'bis' : '')]);
        if (numberPart[0] === '0') numberPart = ES.Call(StringPrototypeSlice, numberPart, [1]);
        let monthInfo = months[numberPart];
        month = monthInfo && monthInfo.monthIndex;
        // If this leap month isn't present in this year, constrain to the same
        // day of the previous month.
        if (
          month === undefined &&
          ES.Call(StringPrototypeEndsWith, monthCode, ['L']) &&
          monthCode != 'M13L' &&
          overflow === 'constrain'
        ) {
          const withoutML = ES.Call(StringPrototypeReplace, monthCode, [/^M0?|L$/g, '']);
          monthInfo = months[withoutML];
          if (monthInfo) {
            month = monthInfo.monthIndex;
            monthCode = buildMonthCode(withoutML);
          }
        }
        if (month === undefined) {
          throw new RangeErrorCtor(`Unmatched month ${monthCode} in Chinese year ${year}`);
        }
      } else if (monthCode === undefined) {
        const months = this.getMonthList(year, cache);
        const monthEntries = ObjectEntries(months);
        const largestMonth = monthEntries.length;
        if (overflow === 'reject') {
          ES.RejectToRange(month, 1, largestMonth);
          ES.RejectToRange(day, 1, this.maximumMonthLength());
        } else {
          month = ES.ConstrainToRange(month, 1, largestMonth);
          day = ES.ConstrainToRange(day, 1, this.maximumMonthLength());
        }
        const matchingMonthEntry = ES.Call(ArrayPrototypeFind, monthEntries, [
          (entry) => entry[1].monthIndex === month
        ]);
        if (matchingMonthEntry === undefined) {
          throw new RangeErrorCtor(`Invalid month ${month} in Chinese year ${year}`);
        }
        monthCode = buildMonthCode(
          ES.Call(StringPrototypeReplace, matchingMonthEntry[0], ['bis', '']),
          ES.Call(StringPrototypeIndexOf, matchingMonthEntry[0], ['bis']) !== -1
        );
      } else {
        // Both month and monthCode are present. Make sure they don't conflict.
        const months = this.getMonthList(year, cache);
        let numberPart = ES.Call(StringPrototypeReplace, monthCode, [/^M|L$/g, (ch) => (ch === 'L' ? 'bis' : '')]);
        if (numberPart[0] === '0') numberPart = ES.Call(StringPrototypeSlice, numberPart, [1]);
        const monthInfo = months[numberPart];
        if (!monthInfo) throw new RangeErrorCtor(`Unmatched monthCode ${monthCode} in Chinese year ${year}`);
        if (month !== monthInfo.monthIndex) {
          throw new RangeErrorCtor(
            `monthCode ${monthCode} doesn't correspond to month ${month} in Chinese year ${year}`
          );
        }
      }
      return { ...calendarDate, year, month, monthCode, day };
    }
  }
});

// Dangi (Korean) calendar has same implementation as Chinese
const helperDangi = { ...helperChinese, id: 'dangi' };

/**
 * Common implementation of all non-ISO calendars.
 * Per-calendar id and logic live in `id` and `helper` properties attached later.
 * This split allowed an easy separation between code that was similar between
 * ISO and non-ISO implementations vs. code that was very different.
 */
const nonIsoGeneralImpl = {
  extraFields(fields) {
    if (this.helper.hasEra && Call(ArrayPrototypeIncludes, fields, ['year'])) {
      return ['era', 'eraYear'];
    }
    return [];
  },
  resolveFields(fields /* , type */) {
    if (this.helper.calendarType !== 'lunisolar') {
      const cache = new OneObjectCache();
      const largestMonth = this.helper.monthsInYear(fields, cache);
      resolveNonLunisolarMonth(fields, undefined, largestMonth);
    }
  },
  dateToISO(fields, overflow) {
    const cache = new OneObjectCache();
    const result = this.helper.calendarToIsoDate(fields, overflow, cache);
    cache.setObject(result);
    return result;
  },
  monthDayToISOReferenceDate(fields, overflow) {
    const cache = new OneObjectCache();
    const result = this.helper.monthDayFromFields(fields, overflow, cache);
    // result.year is a reference year where this month/day exists in this calendar
    cache.setObject(result);
    return result;
  },
  fieldKeysToIgnore(keys) {
    const result = new SetCtor();
    for (let ix = 0; ix < keys.length; ix++) {
      const key = keys[ix];
      Call(SetPrototypeAdd, result, [key]);
      switch (key) {
        case 'era':
          Call(SetPrototypeAdd, result, ['eraYear']);
          Call(SetPrototypeAdd, result, ['year']);
          break;
        case 'eraYear':
          Call(SetPrototypeAdd, result, ['era']);
          Call(SetPrototypeAdd, result, ['year']);
          break;
        case 'year':
          Call(SetPrototypeAdd, result, ['era']);
          Call(SetPrototypeAdd, result, ['eraYear']);
          break;
        case 'month':
          Call(SetPrototypeAdd, result, ['monthCode']);
          // See https://github.com/tc39/proposal-temporal/issues/1784
          if (this.helper.erasBeginMidYear) {
            Call(SetPrototypeAdd, result, ['era']);
            Call(SetPrototypeAdd, result, ['eraYear']);
          }
          break;
        case 'monthCode':
          Call(SetPrototypeAdd, result, ['month']);
          if (this.helper.erasBeginMidYear) {
            Call(SetPrototypeAdd, result, ['era']);
            Call(SetPrototypeAdd, result, ['eraYear']);
          }
          break;
        case 'day':
          if (this.helper.erasBeginMidYear) {
            Call(SetPrototypeAdd, result, ['era']);
            Call(SetPrototypeAdd, result, ['eraYear']);
          }
          break;
      }
    }
    return arrayFromSet(result);
  },
  dateAdd(isoDate, { years, months, weeks, days }, overflow) {
    const cache = OneObjectCache.getCacheForObject(isoDate);
    const calendarDate = this.helper.isoToCalendarDate(isoDate, cache);
    const added = this.helper.addCalendar(calendarDate, { years, months, weeks, days }, overflow, cache);
    const isoAdded = this.helper.calendarToIsoDate(added, 'constrain', cache);
    // The new object's cache starts with the cache of the old object
    if (!OneObjectCache.getCacheForObject(isoAdded)) {
      const newCache = new OneObjectCache(cache);
      newCache.setObject(isoAdded);
    }
    return isoAdded;
  },
  dateUntil(one, two, largestUnit) {
    const cacheOne = OneObjectCache.getCacheForObject(one);
    const cacheTwo = OneObjectCache.getCacheForObject(two);
    const calendarOne = this.helper.isoToCalendarDate(one, cacheOne);
    const calendarTwo = this.helper.isoToCalendarDate(two, cacheTwo);
    const result = this.helper.untilCalendar(calendarOne, calendarTwo, largestUnit, cacheOne);
    return result;
  },
  isoToDate(isoDate, requestedFields) {
    const cache = OneObjectCache.getCacheForObject(isoDate);
    const calendarDate = this.helper.isoToCalendarDate(isoDate, cache);
    if (requestedFields.dayOfWeek) {
      calendarDate.dayOfWeek = impl['iso8601'].isoToDate(isoDate, { dayOfWeek: true }).dayOfWeek;
    }
    if (requestedFields.dayOfYear) {
      const startOfYear = this.helper.startOfCalendarYear(calendarDate);
      const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
      calendarDate.dayOfYear = diffDays + 1;
    }
    if (requestedFields.weekOfYear) calendarDate.weekOfYear = calendarDateWeekOfYear(this.helper.id, isoDate);
    calendarDate.daysInWeek = 7;
    if (requestedFields.daysInMonth) calendarDate.daysInMonth = this.helper.daysInMonth(calendarDate, cache);
    if (requestedFields.daysInYear) {
      const startOfYearCalendar = this.helper.startOfCalendarYear(calendarDate);
      const startOfNextYearCalendar = this.helper.addCalendar(startOfYearCalendar, { years: 1 }, 'constrain', cache);
      calendarDate.daysInYear = this.helper.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
    }
    if (requestedFields.monthsInYear) calendarDate.monthsInYear = this.helper.monthsInYear(calendarDate, cache);
    if (requestedFields.inLeapYear) calendarDate.inLeapYear = this.helper.inLeapYear(calendarDate, cache);
    return calendarDate;
  }
};

impl['hebrew'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperHebrew });
impl['islamic'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperIslamic });
ES.Call(
  ArrayPrototypeForEach,
  ['islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc'],
  [
    (id) => {
      impl[id] = ObjectAssign({}, nonIsoGeneralImpl, { helper: { ...helperIslamic, id } });
    }
  ]
);
impl['persian'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperPersian });
impl['ethiopic'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperEthiopic });
impl['ethioaa'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperEthioaa });
impl['coptic'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperCoptic });
impl['chinese'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperChinese });
impl['dangi'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperDangi });
impl['roc'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperRoc });
impl['indian'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperIndian });
impl['buddhist'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperBuddhist });
impl['japanese'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperJapanese });
impl['gregory'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperGregory });

function calendarImpl(calendar) {
  return impl[calendar];
}
// Probably not what the intrinsics mechanism was intended for, but view this as
// an export of calendarImpl while avoiding circular dependencies
DefineIntrinsic('calendarImpl', calendarImpl);
