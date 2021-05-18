/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import { CALENDAR_ID, ISO_YEAR, ISO_MONTH, ISO_DAY, CreateSlots, GetSlot, HasSlot, SetSlot } from './slots.mjs';

const ArrayIncludes = Array.prototype.includes;
const ArrayPrototypePush = Array.prototype.push;
const ObjectAssign = Object.assign;

const impl = {};

export class Calendar {
  constructor(id) {
    // Note: if the argument is not passed, IsBuiltinCalendar("undefined") will fail. This check
    //       exists only to improve the error message.
    if (arguments.length < 1) {
      throw new RangeError('missing argument: id is required');
    }

    id = ES.ToString(id);
    if (!IsBuiltinCalendar(id)) throw new RangeError(`invalid calendar identifier ${id}`);
    CreateSlots(this);
    SetSlot(this, CALENDAR_ID, id);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${id}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    return ES.ToString(this);
  }
  dateFromFields(fields, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.GetOptionsObject(options);
    return impl[GetSlot(this, CALENDAR_ID)].dateFromFields(fields, options, this);
  }
  yearMonthFromFields(fields, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.GetOptionsObject(options);
    return impl[GetSlot(this, CALENDAR_ID)].yearMonthFromFields(fields, options, this);
  }
  monthDayFromFields(fields, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.GetOptionsObject(options);
    return impl[GetSlot(this, CALENDAR_ID)].monthDayFromFields(fields, options, this);
  }
  fields(fields) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const fieldsArray = [];
    for (const name of fields) {
      if (ES.Type(name) !== 'String') throw new TypeError('invalid fields');
      ArrayPrototypePush.call(fieldsArray, name);
    }
    return impl[GetSlot(this, CALENDAR_ID)].fields(fieldsArray);
  }
  mergeFields(fields, additionalFields) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].mergeFields(fields, additionalFields);
  }
  dateAdd(date, duration, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date);
    duration = ES.ToTemporalDuration(duration);
    options = ES.GetOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    return impl[GetSlot(this, CALENDAR_ID)].dateAdd(date, duration, overflow, this);
  }
  dateUntil(one, two, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    one = ES.ToTemporalDate(one);
    two = ES.ToTemporalDate(two);
    options = ES.GetOptionsObject(options);
    const largestUnit = ES.ToLargestTemporalUnit(
      options,
      'auto',
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      'day'
    );
    const { years, months, weeks, days } = impl[GetSlot(this, CALENDAR_ID)].dateUntil(one, two, largestUnit);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  year(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].year(date);
  }
  month(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.IsTemporalMonthDay(date)) throw new TypeError('use monthCode on PlainMonthDay instead');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].month(date);
  }
  monthCode(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date) && !ES.IsTemporalMonthDay(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].monthCode(date);
  }
  day(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalMonthDay(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].day(date);
  }
  era(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].era(date);
  }
  eraYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].eraYear(date);
  }
  dayOfWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].dayOfWeek(date);
  }
  dayOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].dayOfYear(date);
  }
  weekOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].weekOfYear(date);
  }
  daysInWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].daysInWeek(date);
  }
  daysInMonth(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].daysInMonth(date);
  }
  daysInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].daysInYear(date);
  }
  monthsInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].monthsInYear(date);
  }
  inLeapYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(date)) date = ES.ToTemporalDate(date);
    return impl[GetSlot(this, CALENDAR_ID)].inLeapYear(date);
  }
  toString() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  toJSON() {
    return ES.ToString(this);
  }
  static from(item) {
    return ES.ToTemporalCalendar(item);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
DefineIntrinsic('Temporal.Calendar.from', Calendar.from);

impl['iso8601'] = {
  dateFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    fields = ES.PrepareTemporalFields(fields, [['day'], ['month', undefined], ['monthCode', undefined], ['year']]);
    fields = resolveNonLunisolarMonth(fields);
    let { year, month, day } = fields;
    ({ year, month, day } = ES.RegulateISODate(year, month, day, overflow));
    return ES.CreateTemporalDate(year, month, day, calendar);
  },
  yearMonthFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    fields = ES.PrepareTemporalFields(fields, [['month', undefined], ['monthCode', undefined], ['year']]);
    fields = resolveNonLunisolarMonth(fields);
    let { year, month } = fields;
    ({ year, month } = ES.RegulateISOYearMonth(year, month, overflow));
    return ES.CreateTemporalYearMonth(year, month, calendar, /* referenceISODay = */ 1);
  },
  monthDayFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    fields = ES.PrepareTemporalFields(fields, [
      ['day'],
      ['month', undefined],
      ['monthCode', undefined],
      ['year', undefined]
    ]);
    if (fields.month !== undefined && fields.year === undefined && fields.monthCode === undefined) {
      throw new TypeError('either year or monthCode required with month');
    }
    const useYear = fields.monthCode === undefined;
    const referenceISOYear = 1972;
    fields = resolveNonLunisolarMonth(fields);
    let { month, day, year } = fields;
    ({ month, day } = ES.RegulateISODate(useYear ? year : referenceISOYear, month, day, overflow));
    return ES.CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
  },
  fields(fields) {
    return fields;
  },
  mergeFields(fields, additionalFields) {
    const { month, monthCode, ...original } = fields;
    const { month: newMonth, monthCode: newMonthCode } = additionalFields;
    if (newMonth === undefined && newMonthCode === undefined) {
      original.month = month;
      original.monthCode = monthCode;
    }
    return { ...original, ...additionalFields };
  },
  dateAdd(date, duration, overflow, calendar) {
    const { years, months, weeks, days } = duration;
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    ({ year, month, day } = ES.AddISODate(year, month, day, years, months, weeks, days, overflow));
    return ES.CreateTemporalDate(year, month, day, calendar);
  },
  dateUntil(one, two, largestUnit) {
    return ES.DifferenceISODate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY),
      largestUnit
    );
  },
  year(date) {
    return GetSlot(date, ISO_YEAR);
  },
  era() {
    return undefined;
  },
  eraYear() {
    return undefined;
  },
  month(date) {
    return GetSlot(date, ISO_MONTH);
  },
  monthCode(date) {
    return buildMonthCode(GetSlot(date, ISO_MONTH));
  },
  day(date) {
    return GetSlot(date, ISO_DAY);
  },
  dayOfWeek(date) {
    return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  dayOfYear(date) {
    return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  weekOfYear(date) {
    return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  daysInWeek() {
    return 7;
  },
  daysInMonth(date) {
    return ES.ISODaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  },
  daysInYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date);
    return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  },
  monthsInYear() {
    return 12;
  },
  inLeapYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date);
    return ES.LeapYear(GetSlot(date, ISO_YEAR));
  }
};

// Note: other built-in calendars than iso8601 are not part of the Temporal
// proposal for ECMA-262. These calendars will be standardized as part of
// ECMA-402.

function monthCodeNumberPart(monthCode) {
  if (!monthCode.startsWith('M')) {
    throw new RangeError(`Invalid month code: ${monthCode}.  Month codes must start with M.`);
  }
  const month = +monthCode.slice(1);
  if (isNaN(month)) throw new RangeError(`Invalid month code: ${monthCode}`);
  return month;
}

function buildMonthCode(month, leap = false) {
  return `M${month.toString().padStart(2, '0')}${leap ? 'L' : ''}`;
}

/**
 * Safely merge a month, monthCode pair into an integer month.
 * If both are present, make sure they match.
 * This logic doesn't work for lunisolar calendars!
 * */
function resolveNonLunisolarMonth(calendarDate, overflow = undefined, monthsPerYear = 12) {
  let { month, monthCode } = calendarDate;
  if (monthCode === undefined) {
    if (month === undefined) throw new TypeError('Either month or monthCode are required');
    // The ISO calendar uses the default (undefined) value because it does
    // constrain/reject after this method returns. Non-ISO calendars, however,
    // rely on this function to constrain/reject out-of-range `month` values.
    if (overflow === 'reject') ES.RejectToRange(month, 1, monthsPerYear);
    if (overflow === 'constrain') month = ES.ConstrainToRange(month, 1, monthsPerYear);
    monthCode = buildMonthCode(month);
  } else {
    const numberPart = monthCodeNumberPart(monthCode);
    if (month !== undefined && month !== numberPart) {
      throw new RangeError(`monthCode ${monthCode} and month ${month} must match if both are present`);
    }
    if (monthCode !== buildMonthCode(numberPart)) {
      throw new RangeError(`Invalid month code: ${monthCode}`);
    }
    month = numberPart;
    if (month < 1 || month > monthsPerYear) throw new RangeError(`Invalid monthCode: ${monthCode}`);
  }
  return { ...calendarDate, month, monthCode };
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
    this.map = new Map();
    this.calls = 0;
    this.now = globalThis.performance ? globalThis.performance.now() : Date.now();
    this.hits = 0;
    this.misses = 0;
    if (cacheToClone !== undefined) {
      let i = cacheToClone.length;
      for (const entry of cacheToClone.map.entries()) {
        if (++i > OneObjectCache.MAX_CACHE_ENTRIES) break;
        this.map.set(...entry);
      }
    }
  }
  get(key) {
    const result = this.map.get(key);
    if (result) {
      this.hits++;
      this.report();
    }
    this.calls++;
    return result;
  }
  set(key, value) {
    this.map.set(key, value);
    this.misses++;
    this.report();
  }
  report() {
    /*
    if (this.calls === 0) return;
    const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - this.now;
    const hitRate = ((100 * this.hits) / this.calls).toFixed(0);
    console.log(`${this.calls} calls in ${ms.toFixed(2)}ms. Hits: ${this.hits} (${hitRate}%). Misses: ${this.misses}.`);
    */
  }
  setObject(obj) {
    if (OneObjectCache.objectMap.get(obj)) throw new RangeError('object already cached');
    OneObjectCache.objectMap.set(obj, this);
    this.report();
  }
}
OneObjectCache.objectMap = new WeakMap();
OneObjectCache.MAX_CACHE_ENTRIES = 1000;
/**
 * Returns a WeakMap-backed cache that's used to store expensive results
 * that are associated with a particular Temporal object instance.
 *
 * @param obj - object to associate with the cache
 */
OneObjectCache.getCacheForObject = function (obj) {
  let cache = OneObjectCache.objectMap.get(obj);
  if (!cache) {
    cache = new OneObjectCache();
    OneObjectCache.objectMap.set(obj, cache);
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
  isoToCalendarDate(isoDate, cache) {
    let { year: isoYear, month: isoMonth, day: isoDay } = isoDate;
    const key = JSON.stringify({ func: 'isoToCalendarDate', isoYear, isoMonth, isoDay, id: this.id });
    const cached = cache.get(key);
    if (cached) return cached;

    const dateTimeFormat = new Intl.DateTimeFormat(`en-US-u-ca-${this.id}`, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      era: this.eraLength,
      timeZone: 'UTC'
    });
    let parts, isoString;
    try {
      isoString = toUtcIsoDateString({ isoYear, isoMonth, isoDay });
      parts = dateTimeFormat.formatToParts(new Date(isoString));
    } catch (e) {
      throw new RangeError(`Invalid ISO date: ${JSON.stringify({ isoYear, isoMonth, isoDay })}`);
    }
    const result = {};
    for (let { type, value } of parts) {
      if (type === 'year') result.eraYear = +value;
      if (type === 'relatedYear') result.eraYear = +value;
      if (type === 'month') {
        const matches = /^([-0-9.]+)(.*?)$/.exec(value);
        if (!matches || matches.length != 3) throw new RangeError(`Unexpected month: ${value}`);
        result.month = +matches[1];
        if (result.month < 1) {
          throw new RangeError(
            `Invalid month ${value} from ${isoString}[u-ca-${this.id}]` +
              ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)'
          );
        }
        if (result.month > 13) {
          throw new RangeError(
            `Invalid month ${value} from ${isoString}[u-ca-${this.id}]` +
              ' (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)'
          );
        }
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
        value = value.split(' (')[0];
        result.era = value
          .normalize('NFD')
          .replace(/[^-0-9 \p{L}]/gu, '')
          .replace(' ', '-')
          .toLowerCase();
      }
    }
    if (result.eraYear === undefined) {
      // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
      // output of Intl.DateTimeFormat.formatToParts.
      throw new RangeError(
        `Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`
      );
    }
    // Translate eras that may be handled differently by Temporal vs. by Intl
    // (e.g. Japanese pre-Meiji eras). See #526 for details.
    if (this.reviseIntlEra) {
      const { era, eraYear } = this.reviseIntlEra(result, isoDate);
      result.era = era;
      result.eraYear = eraYear;
    }
    if (this.checkIcuBugs) this.checkIcuBugs(result, isoDate);

    const calendarDate = this.adjustCalendarDate(result, cache, 'constrain', true);
    if (calendarDate.year === undefined) throw new RangeError(`Missing year converting ${JSON.stringify(isoDate)}`);
    if (calendarDate.month === undefined) throw new RangeError(`Missing month converting ${JSON.stringify(isoDate)}`);
    if (calendarDate.day === undefined) throw new RangeError(`Missing day converting ${JSON.stringify(isoDate)}`);
    cache.set(key, calendarDate);
    // Also cache the reverse mapping
    ['constrain', 'reject'].forEach((overflow) => {
      const keyReverse = JSON.stringify({
        func: 'calendarToIsoDate',
        year: calendarDate.year,
        month: calendarDate.month,
        day: calendarDate.day,
        overflow,
        id: this.id
      });
      cache.set(keyReverse, isoDate);
    });
    return calendarDate;
  },
  validateCalendarDate(calendarDate) {
    let { era, month, year, day, eraYear, monthCode, monthExtra } = calendarDate;
    // When there's a suffix (e.g. "5bis" for a leap month in Chinese calendar)
    // the derived class must deal with it.
    if (monthExtra !== undefined) throw new RangeError('Unexpected `monthExtra` value');
    if (year === undefined && eraYear === undefined) throw new TypeError('year or eraYear is required');
    if (month === undefined && monthCode === undefined) throw new TypeError('month or monthCode is required');
    if (day === undefined) throw new RangeError('Missing day');
    if (monthCode !== undefined) {
      if (typeof monthCode !== 'string') {
        throw new RangeError(`monthCode must be a string, not ${ES.Type(monthCode).toLowerCase()}`);
      }
      if (!/^M([01]?\d)(L?)$/.test(monthCode)) throw new RangeError(`Invalid monthCode: ${monthCode}`);
    }
    if (this.constantEra) {
      if (era !== undefined && era !== this.constantEra) {
        throw new RangeError(`era must be ${this.constantEra}, not ${era}`);
      }
      if (eraYear !== undefined && year !== undefined && eraYear !== year) {
        throw new RangeError(`eraYear ${eraYear} does not match year ${year}`);
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
   * - no eras or a constant era defined in `.constantEra`
   * - non-lunisolar calendar (no leap months)
   * */
  adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
    if (this.calendarType === 'lunisolar') throw new RangeError('Override required for lunisolar calendars');
    this.validateCalendarDate(calendarDate);
    const largestMonth = this.monthsInYear(calendarDate, cache);
    let { month, year, eraYear, monthCode } = calendarDate;

    // For calendars that always use the same era, set it here so that derived
    // calendars won't need to implement this method simply to set the era.
    if (this.constantEra) {
      // year and eraYear always match when there's only one possible era
      if (year === undefined) year = eraYear;
      if (eraYear === undefined) eraYear = year;
      calendarDate = { ...calendarDate, era: this.constantEra, year, eraYear };
    }

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
    const key = JSON.stringify({ func: 'calendarToIsoDate', year, month, day, overflow, id: this.id });
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
      keyOriginal = JSON.stringify({
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
      // a calendar skipped days, like the Julian->Gregorian switchover. But the
      // only ICU calendars that currently skip days (japanese/roc/buddhist) is
      // a bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
      // that's currently detected by `checkIcuBugs()` which will throw. So
      // this optimization should be safe for all ICU calendars.
      let testIsoEstimate = this.addDaysIso(isoEstimate, diffDays);
      if (date.day > this.minimumMonthLength(date)) {
        // There's a chance that the calendar date is out of range. Throw or
        // constrain if so.
        let testCalendarDate = this.isoToCalendarDate(testIsoEstimate, cache);
        while (testCalendarDate.month !== month || testCalendarDate.year !== year) {
          if (overflow === 'reject') {
            throw new RangeError(`day ${day} does not exist in month ${month} of year ${year}`);
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
    // If the initial guess is not in the same month, then then bisect the
    // distance to the target, starting with 8 days per step.
    let increment = 8;
    let maybeConstrained = false;
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
          // If the calendar day is larger than the minimal length for this
          // month, then it might be larger than the actual length of the month.
          // So we won't cache it as the correct calendar date for this ISO
          // date.
          maybeConstrained = date.day > this.minimumMonthLength(date);
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
              throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...originalDate })}`);
            } else {
              // To constrain, pick the earliest value
              const order = this.compareCalendarDates(roundtripEstimate, oldRoundtripEstimate);
              // If current value is larger, then back up to the previous value.
              if (order > 0) isoEstimate = this.addDaysIso(isoEstimate, -1);
              maybeConstrained = true;
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
      throw new RangeError('Unexpected missing property');
    }
    if (!maybeConstrained) {
      // Also cache the reverse mapping
      const keyReverse = JSON.stringify({
        func: 'isoToCalendarDate',
        isoYear: isoEstimate.year,
        isoMonth: isoEstimate.month,
        isoDay: isoEstimate.day,
        id: this.id
      });
      cache.set(keyReverse, date);
    }
    return isoEstimate;
  },
  temporalToCalendarDate(date, cache) {
    const isoDate = { year: GetSlot(date, ISO_YEAR), month: GetSlot(date, ISO_MONTH), day: GetSlot(date, ISO_DAY) };
    const result = this.isoToCalendarDate(isoDate, cache);
    return result;
  },
  compareCalendarDates(date1, date2) {
    // `date1` and `date2` are already records. The calls below simply validate
    // that all three required fields are present.
    date1 = ES.PrepareTemporalFields(date1, [['day'], ['month'], ['year']]);
    date2 = ES.PrepareTemporalFields(date2, [['day'], ['month'], ['year']]);
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
    const added = ES.AddISODate(isoDate.year, isoDate.month, isoDate.day, 0, 0, 0, days, 'constrain');
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
    for (let i = 0, absMonths = Math.abs(months); i < absMonths; i++) {
      const days = months < 0 ? -this.daysInPreviousMonth(calendarDate, cache) : this.daysInMonth(calendarDate, cache);
      const isoDate = this.calendarToIsoDate(calendarDate, 'constrain', cache);
      const addedIso = this.addDaysIso(isoDate, days, cache);
      calendarDate = this.isoToCalendarDate(addedIso, cache);
      if (calendarDate.day !== day) {
        // try to retain the original day-of-month, if possible
        calendarDate = this.regulateDate({ ...calendarDate, day }, 'constrain', cache);
      }
    }
    if (overflow === 'reject' && calendarDate.day !== day) {
      throw new RangeError(`Day ${day} does not exist in resulting calendar month`);
    }
    return calendarDate;
  },
  addCalendar(calendarDate, { years = 0, months = 0, weeks = 0, days = 0 }, overflow, cache) {
    const { year, month, day } = calendarDate;
    const addedMonths = this.addMonthsCalendar({ year: year + years, month, day }, months, overflow, cache);
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
        const diffYears = calendarTwo.year - calendarOne.year;
        const diffMonths = calendarTwo.month - calendarOne.month;
        const diffDays = calendarTwo.day - calendarOne.day;
        const sign = this.compareCalendarDates(calendarTwo, calendarOne);
        if (largestUnit === 'year' && diffYears) {
          const isOneFurtherInYear = diffMonths * sign < 0 || (diffMonths === 0 && diffDays * sign < 0);
          years = isOneFurtherInYear ? diffYears - sign : diffYears;
        }
        const yearsAdded = years ? this.addCalendar(calendarOne, { years }, 'constrain', cache) : calendarOne;
        // Now we have less than one year remaining. Add one month at a time
        // until we go over the target, then back up one month and calculate
        // remaining days and weeks.
        let current;
        let next = yearsAdded;
        do {
          months++;
          current = next;
          next = this.addMonthsCalendar(current, sign, 'constrain', cache);
          if (next.day !== calendarOne.day) {
            // In case the day was constrained down, try to un-constrain it
            next = this.regulateDate({ ...next, day: calendarOne.day }, 'constrain', cache);
          }
        } while (this.compareCalendarDates(calendarTwo, next) * sign >= 0);
        months--; // correct for loop above which overshoots by 1
        const remainingDays = this.calendarDaysUntil(current, calendarTwo, cache);
        days = remainingDays % 7;
        weeks = (remainingDays - days) / 7;
        break;
      }
    }
    return { years, months, weeks, days };
  },
  daysInMonth(calendarDate, cache) {
    // Add enough days to roll over to the next month. One we're in the next
    // month, we can calculate the length of the current month. NOTE: This
    // algorithm assumes that months are continuous. It would break if a
    // calendar skipped days, like the Julian->Gregorian switchover. But the
    // only ICU calendars that currently skip days (japanese/roc/buddhist) is a
    // bug (https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)
    // that's currently detected by `checkIcuBugs()` which will throw. So this
    // code should be safe for all ICU calendars.
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
    return { year: calendarDate.year, month: 1, day: 1 };
  },
  startOfCalendarMonth(calendarDate) {
    return { year: calendarDate.year, month: calendarDate.month, day: 1 };
  },
  calendarDaysUntil(calendarOne, calendarTwo, cache) {
    const oneIso = this.calendarToIsoDate(calendarOne, 'constrain', cache);
    const twoIso = this.calendarToIsoDate(calendarTwo, 'constrain', cache);
    return this.isoDaysUntil(oneIso, twoIso);
  },
  isoDaysUntil(oneIso, twoIso) {
    const duration = ES.DifferenceISODate(
      oneIso.year,
      oneIso.month,
      oneIso.day,
      twoIso.year,
      twoIso.month,
      twoIso.day,
      'day'
    );
    return duration.days;
  },
  // The short era format works for all calendars except Japanese, which will
  // override.
  eraLength: 'short',
  // All built-in calendars except Chinese/Dangi and Hebrew use an era
  hasEra: true,
  monthDayFromFields(fields, overflow, cache) {
    let { year, month, monthCode, day, era, eraYear } = fields;
    if (monthCode === undefined) {
      if (year === undefined && (era === undefined || eraYear === undefined)) {
        throw new TypeError('`monthCode`, `year`, or `era` and `eraYear` is required');
      }
      ({ monthCode, year } = this.adjustCalendarDate({ year, month, monthCode, day, era, eraYear }, cache, overflow));
    }

    let isoYear, isoMonth, isoDay;
    let closestCalendar, closestIso;
    // Look backwards starting from the calendar year of 1972-01-01 up to 100
    // calendar years to find a year that has this month and day. Normal months
    // and days will match immediately, but for leap days and leap months we may
    // have to look for a while.
    const startDateIso = { year: 1972, month: 1, day: 1 };
    const { year: calendarYear } = this.isoToCalendarDate(startDateIso, cache);
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
    throw new RangeError(`No recent ${this.id} year with monthCode ${monthCode} and day ${day}`);
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
    const monthInfo = Object.entries(this.months).find((m) => m[1].monthCode === monthCode);
    if (monthInfo === undefined) throw new RangeError(`unmatched Hebrew month: ${month}`);
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
    let { year, eraYear, month, monthCode, day, monthExtra } = calendarDate;
    if (year === undefined) year = eraYear;
    if (eraYear === undefined) eraYear = year;
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
        if (!monthInfo) throw new RangeError(`Unrecognized month from formatToParts: ${monthExtra}`);
        month = this.inLeapYear({ year }) ? monthInfo.leap : monthInfo.regular;
      }
      monthCode = this.getMonthCode(year, month);
      const result = { year, month, day, era: undefined, eraYear, monthCode };
      return result;
    } else {
      // When called without input coming from legacy Date output, simply ensure
      // that all fields are present.
      this.validateCalendarDate(calendarDate);
      if (month === undefined) {
        if (monthCode.endsWith('L')) {
          if (monthCode !== 'M05L') {
            throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${monthCode}`);
          }
          month = 6;
          if (!this.inLeapYear({ year })) {
            if (overflow === 'reject') {
              throw new RangeError(`Hebrew monthCode M05L is invalid in year ${year} which is not a leap year`);
            } else {
              // constrain to last day of previous month (Av)
              month = 5;
              day = 30;
              monthCode = 'M05';
            }
          }
        } else {
          month = monthCodeNumberPart(monthCode);
          // if leap month is before this one, the month index is one more than the month code
          if (this.inLeapYear({ year }) && month > 6) month++;
          const largestMonth = this.monthsInYear({ year });
          if (month < 1 || month > largestMonth) throw new RangeError(`Invalid monthCode: ${monthCode}`);
        }
      } else {
        if (overflow === 'reject') {
          ES.RejectToRange(month, 1, this.monthsInYear({ year }));
          ES.RejectToRange(day, 1, this.maximumMonthLength(calendarDate));
        } else {
          month = ES.ConstrainToRange(month, 1, this.monthsInYear({ year }));
          day = ES.ConstrainToRange(day, 1, this.maximumMonthLength({ ...calendarDate, month }));
        }
        if (monthCode === undefined) {
          monthCode = this.getMonthCode(year, month);
        } else {
          const calculatedMonthCode = this.getMonthCode(year, month);
          if (calculatedMonthCode !== monthCode) {
            throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Hebrew year ${year}`);
          }
        }
      }
      return { ...calendarDate, day, month, monthCode, year, eraYear };
    }
  },
  // All built-in calendars except Chinese/Dangi and Hebrew use an era
  hasEra: false
});

/**
 * For Temporal purposes, the Islamic calendar is simple because it's always the
 * same 12 months in the same order.
 */
const helperIslamic = ObjectAssign({}, nonIsoHelperBase, {
  id: 'islamic',
  calendarType: 'lunar',
  inLeapYear(calendarDate, cache) {
    // In leap years, the 12th month has 30 days. In non-leap years: 29.
    const days = this.daysInMonth({ year: calendarDate.year, month: 12, day: 1 }, cache);
    return days === 30;
  },
  monthsInYear(/* calendarYear, cache */) {
    return 12;
  },
  minimumMonthLength: (/* calendarDate */) => 29,
  maximumMonthLength: (/* calendarDate */) => 30,
  DAYS_PER_ISLAMIC_YEAR: 354 + 11 / 30,
  DAYS_PER_ISO_YEAR: 365.2425,
  constantEra: 'ah',
  estimateIsoDate(calendarDate) {
    const { year } = this.adjustCalendarDate(calendarDate);
    return { year: Math.floor((year * this.DAYS_PER_ISLAMIC_YEAR) / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
});

const helperPersian = ObjectAssign({}, nonIsoHelperBase, {
  id: 'persian',
  calendarType: 'solar',
  inLeapYear(calendarDate, cache) {
    // Same logic (count days in the last month) for Persian as for Islamic,
    // even though Persian is solar and Islamic is lunar.
    return helperIslamic.inLeapYear(calendarDate, cache);
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
  constantEra: 'ap',
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
  constantEra: 'saka',
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
    if (monthInfo === undefined) throw new RangeError(`Invalid month: ${month}`);
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
    const isoDate = ES.AddISODate(isoYear, isoMonth, isoDay, 0, 0, 0, calendarDate.day - 1, 'constrain');
    return isoDate;
  },
  // https://bugs.chromium.org/p/v8/issues/detail?id=10529 causes Intl's Indian
  // calendar output to fail for all dates before 0001-01-01 ISO.  For example,
  // in Node 12 0000-01-01 is calculated as 6146/12/-583 instead of 10/11/-79 as
  // expected.
  vulnerableToBceBug:
    new Date('0000-01-01T00:00Z').toLocaleDateString('en-US-u-ca-indian', { timeZone: 'UTC' }) !== '10/11/-79 Saka',
  checkIcuBugs(calendarDate, isoDate) {
    if (this.vulnerableToBceBug && isoDate.year < 1) {
      throw new RangeError(
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
 * The result is an array of eras with this shape:
 * ```
 * interface Era {
 *   // name of the era
 *   name: string;
 *
 *   // alternate name of the era used in old versions of ICU data
 *   // format is `era{n}` where n is the zero-based index of the era
 *   // with the oldest era being 0.
 *   genericName: string;
 *
 *   // Signed calendar year where this era begins. Will be
 *   // 1 (or 0 for zero-based eras) for the anchor era assuming that `year`
 *   // numbering starts at the beginning of the anchor era, which is true
 *   // for all ICU calendars except Japanese. If an era starts mid-year
 *   // then a calendar month and day are included. Otherwise
 *   // `{ month: 1, day: 1 }` is assumed.
 *   anchorEpoch:  { year: number } | { year: number, month: number, day: number }
 *
 *   // ISO date of the first day of this era
 *   isoEpoch: { year: number, month: number, day: number}
 *
 *   // If present, then this era counts years backwards like BC
 *   // and this property points to the forward era. This must be
 *   // the last (oldest) era in the array.
 *   reverseOf: Era;
 *
 *   // If true, the era's years are 0-based. If omitted or false,
 *   // then the era's years are 1-based.
 *   hasYearZero: boolean = false;
 * }
 * ```
 * */
function adjustEras(eras) {
  if (eras.length === 0) {
    throw new RangeError('Invalid era data: eras are required');
  }
  if (eras.length === 1 && eras[0].reverseOf) {
    throw new RangeError('Invalid era data: anchor era cannot count years backwards');
  }
  if (eras.length === 1 && !eras[0].name) {
    throw new RangeError('Invalid era data: at least one named era is required');
  }
  if (eras.filter((e) => e.reverseOf != null).length > 1) {
    throw new RangeError('Invalid era data: only one era can count years backwards');
  }

  // Find the "anchor era" which is the era used for (era-less) `year`. Reversed
  // eras can never be anchors. The era without an `anchorEpoch` property is the
  // anchor.
  let anchorEra;
  eras.forEach((e) => {
    if (e.isAnchor || (!e.anchorEpoch && !e.reverseOf)) {
      if (anchorEra) throw new RangeError('Invalid era data: cannot have multiple anchor eras');
      anchorEra = e;
      e.anchorEpoch = { year: e.hasYearZero ? 0 : 1 };
    } else if (!e.name) {
      throw new RangeError('If era name is blank, it must be the anchor era');
    }
  });

  // If the era name is undefined, then it's an anchor that doesn't interact
  // with eras at all. For example, Japanese `year` is always the same as ISO
  // `year`.  So this "era" is the anchor era but isn't used for era matching.
  // Strip it from the list that's returned.
  eras = eras.filter((e) => e.name);

  eras.forEach((e) => {
    // Some eras are mirror images of another era e.g. B.C. is the reverse of A.D.
    // Replace the string-valued "reverseOf" property with the actual era object
    // that's reversed.
    const { reverseOf } = e;
    if (reverseOf) {
      const reversedEra = eras.find((era) => era.name === reverseOf);
      if (reversedEra === undefined) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${reverseOf}`);
      e.reverseOf = reversedEra;
      e.anchorEpoch = reversedEra.anchorEpoch;
      e.isoEpoch = reversedEra.isoEpoch;
    }
    if (e.anchorEpoch.month === undefined) e.anchorEpoch.month = 1;
    if (e.anchorEpoch.day === undefined) e.anchorEpoch.day = 1;
  });

  // Ensure that the latest epoch is first in the array. This lets us try to
  // match eras in index order, with the last era getting the remaining older
  // years. Any reverse-signed era must be at the end.
  eras.sort((e1, e2) => {
    if (e1.reverseOf) return 1;
    if (e2.reverseOf) return -1;
    return e2.isoEpoch.year - e1.isoEpoch.year;
  });

  // If there's a reversed era, then the one before it must be the era that's
  // being reversed.
  const lastEraReversed = eras[eras.length - 1].reverseOf;
  if (lastEraReversed) {
    if (lastEraReversed !== eras[eras.length - 2]) throw new RangeError('Invalid era data: invalid reverse-sign era');
  }

  // Finally, add a "genericName" property in the format "era{n} where `n` is
  // zero-based index, with the oldest era being zero. This format is used by
  // older versions of ICU data.
  eras.forEach((e, i) => {
    e.genericName = `era${eras.length - 1 - i}`;
  });

  return { eras, anchorEra: anchorEra || eras[0] };
}

function isGregorianLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** Base for all Gregorian-like calendars. */
const makeHelperGregorian = (id, originalEras) => {
  const { eras, anchorEra } = adjustEras(originalEras);
  return ObjectAssign({}, nonIsoHelperBase, {
    id,
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
      return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31;
    },
    maximumMonthLength(calendarDate) {
      return this.minimumMonthLength(calendarDate);
    },
    /** Fill in missing parts of the (year, era, eraYear) tuple */
    completeEraYear(calendarDate) {
      const checkField = (name, value) => {
        const currentValue = calendarDate[name];
        if (currentValue != null && currentValue != value) {
          throw new RangeError(`Input ${name} ${currentValue} doesn't match calculated value ${value}`);
        }
      };
      const eraFromYear = (year) => {
        let eraYear;
        const adjustedCalendarDate = { ...calendarDate, year };
        const matchingEra = this.eras.find((e, i) => {
          if (i === this.eras.length - 1) {
            if (e.reverseOf) {
              // This is a reverse-sign era (like BCE) which must be the oldest
              // era. Count years backwards.
              if (year > 0) throw new RangeError(`Signed year ${year} is invalid for era ${e.name}`);
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
        });
        if (!matchingEra) throw new RangeError(`Year ${year} was not matched by any era`);
        return { eraYear, era: matchingEra.name };
      };

      let { year, eraYear, era } = calendarDate;
      if (year != null) {
        ({ eraYear, era } = eraFromYear(year));
        checkField('era', era);
        checkField('eraYear', eraYear);
      } else if (eraYear != null) {
        const matchingEra =
          era === undefined ? undefined : this.eras.find((e) => e.name === era || e.genericName === era);
        if (!matchingEra) throw new RangeError(`Era ${era} (ISO year ${eraYear}) was not matched by any era`);
        if (eraYear < 1 && matchingEra.reverseOf) {
          throw new RangeError(`Years in ${era} era must be positive, not ${year}`);
        }
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
        throw new RangeError('Either `year` or `eraYear` and `era` are required');
      }
      return { ...calendarDate, year, eraYear, era };
    },
    adjustCalendarDate(calendarDate, cache, overflow /*, fromLegacyDate = false */) {
      // Because this is not a lunisolar calendar, it's safe to convert monthCode to a number
      const { month, monthCode } = calendarDate;
      if (month === undefined) calendarDate = { ...calendarDate, month: monthCodeNumberPart(monthCode) };
      this.validateCalendarDate(calendarDate);
      calendarDate = this.completeEraYear(calendarDate);
      calendarDate = ES.Call(nonIsoHelperBase.adjustCalendarDate, this, [calendarDate, cache, overflow]);
      return calendarDate;
    },
    estimateIsoDate(calendarDate) {
      calendarDate = this.adjustCalendarDate(calendarDate);
      const { year, month, day } = calendarDate;
      const { anchorEra } = this;
      const isoYearEstimate = year + anchorEra.isoEpoch.year - (anchorEra.hasYearZero ? 0 : 1);
      return ES.RegulateISODate(isoYearEstimate, month, day, 'constrain');
    },
    // Several calendars based on the Gregorian calendar use Julian dates (not
    // proleptic Gregorian dates) before the Julian switchover in Oct 1582. See
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1173158.
    v8IsVulnerableToJulianBug: new Date('+001001-01-01T00:00Z')
      .toLocaleDateString('en-US-u-ca-japanese', { timeZone: 'UTC' })
      .startsWith('12'),
    calendarIsVulnerableToJulianBug: false,
    checkIcuBugs(calendarDate, isoDate) {
      if (this.calendarIsVulnerableToJulianBug && this.v8IsVulnerableToJulianBug) {
        const beforeJulianSwitch = ES.CompareISODate(isoDate.year, isoDate.month, isoDate.day, 1582, 10, 15) < 0;
        if (beforeJulianSwitch) {
          throw new RangeError(
            `calendar '${this.id}' is broken for ISO dates before 1582-10-15` +
              ' (see https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)'
          );
        }
      }
    }
  });
};

const makeHelperOrthodox = (id, originalEras) => {
  const base = makeHelperGregorian(id, originalEras);
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
const helperEthioaa = makeHelperOrthodox('ethioaa', [{ name: 'era0', isoEpoch: { year: -5492, month: 7, day: 17 } }]);
const helperCoptic = makeHelperOrthodox('coptic', [
  { name: 'era1', isoEpoch: { year: 284, month: 8, day: 29 } },
  { name: 'era0', reverseOf: 'era1' }
]);
// Anchor is currently the older era to match ethioaa, but should it be the newer era?
// See https://github.com/tc39/ecma402/issues/534 for discussion.
const helperEthiopic = makeHelperOrthodox('ethiopic', [
  { name: 'era0', isoEpoch: { year: -5492, month: 7, day: 17 } },
  { name: 'era1', isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }
]);

const helperRoc = ObjectAssign(
  {},
  makeHelperGregorian('roc', [
    { name: 'minguo', isoEpoch: { year: 1912, month: 1, day: 1 } },
    { name: 'before-roc', reverseOf: 'minguo' }
  ]),
  {
    calendarIsVulnerableToJulianBug: true
  }
);

const helperBuddhist = ObjectAssign(
  {},
  makeHelperGregorian('buddhist', [{ name: 'be', hasYearZero: true, isoEpoch: { year: -543, month: 1, day: 1 } }]),
  {
    calendarIsVulnerableToJulianBug: true
  }
);

const helperGregory = ObjectAssign(
  {},
  makeHelperGregorian('gregory', [
    { name: 'ce', isoEpoch: { year: 1, month: 1, day: 1 } },
    { name: 'bce', reverseOf: 'ce' }
  ]),
  {
    reviseIntlEra(calendarDate /*, isoDate*/) {
      let { era, eraYear } = calendarDate;
      if (era === 'bc') era = 'bce';
      if (era === 'ad') era = 'ce';
      return { era, eraYear };
    }
  }
);

const helperJapanese = ObjectAssign(
  {},
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
  makeHelperGregorian('japanese', [
    // The Japanese calendar `year` is just the ISO year, because (unlike other
    // ICU calendars) there's no obvious "default era", we use the ISO year.
    { name: 'reiwa', isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } },
    { name: 'heisei', isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } },
    { name: 'showa', isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } },
    { name: 'taisho', isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } },
    { name: 'meiji', isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } },
    { name: 'ce', isoEpoch: { year: 1, month: 1, day: 1 } },
    { name: 'bce', reverseOf: 'ce' }
  ]),
  {
    // The last 3 Japanese eras confusingly return only one character in the
    // default "short" era, so need to use the long format.
    eraLength: 'long',
    calendarIsVulnerableToJulianBug: true,
    reviseIntlEra(calendarDate, isoDate) {
      const { era, eraYear } = calendarDate;
      const { year: isoYear } = isoDate;
      if (this.eras.find((e) => e.name === era)) return { era, eraYear };
      return isoYear < 1 ? { era: 'bce', eraYear: 1 - isoYear } : { era: 'ce', eraYear: isoYear };
    }
  }
);

const helperChinese = ObjectAssign({}, nonIsoHelperBase, {
  id: 'chinese',
  calendarType: 'lunisolar',
  inLeapYear(calendarDate, cache) {
    const months = this.getMonthList(calendarDate.year, cache);
    return Object.entries(months).length === 13;
  },
  monthsInYear(calendarDate, cache) {
    return this.inLeapYear(calendarDate, cache) ? 13 : 12;
  },
  minimumMonthLength: (/* calendarDate */) => 29,
  maximumMonthLength: (/* calendarDate */) => 30,
  getMonthList(calendarYear, cache) {
    if (calendarYear === undefined) {
      throw new TypeError('Missing year');
    }
    const key = JSON.stringify({ func: 'getMonthList', calendarYear, id: this.id });
    const cached = cache.get(key);
    if (cached) return cached;
    const dateTimeFormat = new Intl.DateTimeFormat(`en-US-u-ca-${this.id}`, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      era: 'short',
      timeZone: 'UTC'
    });

    const getCalendarDate = (isoYear, daysPastFeb1) => {
      const isoStringFeb1 = toUtcIsoDateString({ isoYear, isoMonth: 2, isoDay: 1 });
      const legacyDate = new Date(isoStringFeb1);
      // Now add the requested number of days, which may wrap to the next month.
      legacyDate.setUTCDate(daysPastFeb1 + 1);
      const newYearGuess = dateTimeFormat.formatToParts(legacyDate);
      const calendarMonthString = newYearGuess.find((tv) => tv.type === 'month').value;
      const calendarDay = +newYearGuess.find((tv) => tv.type === 'day').value;
      let calendarYearToVerify = newYearGuess.find((tv) => tv.type === 'relatedYear');
      if (calendarYearToVerify !== undefined) {
        calendarYearToVerify = +calendarYearToVerify.value;
      } else {
        // Node 12 has outdated ICU data that lacks the `relatedYear` field in the
        // output of Intl.DateTimeFormat.formatToParts.
        throw new RangeError(
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
    let { year, month, monthExtra, day, monthCode, eraYear } = calendarDate;
    if (fromLegacyDate) {
      // Legacy Date output returns a string that's an integer with an optional
      // "bis" suffix used only by the Chinese/Dangi calendar to indicate a leap
      // month. Below we'll normalize the output.
      year = eraYear;
      if (monthExtra && monthExtra !== 'bis') throw new RangeError(`Unexpected leap month suffix: ${monthExtra}`);
      const monthCode = buildMonthCode(month, monthExtra !== undefined);
      const monthString = `${month}${monthExtra || ''}`;
      const months = this.getMonthList(year, cache);
      const monthInfo = months[monthString];
      if (monthInfo === undefined) throw new RangeError(`Unmatched month ${monthString} in Chinese year ${year}`);
      month = monthInfo.monthIndex;
      return { year, month, day, era: undefined, eraYear, monthCode };
    } else {
      // When called without input coming from legacy Date output,
      // simply ensure that all fields are present.
      this.validateCalendarDate(calendarDate);
      if (year === undefined) year = eraYear;
      if (eraYear === undefined) eraYear = year;
      if (month === undefined) {
        const months = this.getMonthList(year, cache);
        let numberPart = monthCode.replace('L', 'bis').slice(1);
        if (numberPart[0] === '0') numberPart = numberPart.slice(1);
        let monthInfo = months[numberPart];
        month = monthInfo && monthInfo.monthIndex;
        // If this leap month isn't present in this year, constrain down to the last day of the previous month.
        if (
          month === undefined &&
          monthCode.endsWith('L') &&
          !['M01L', 'M12L', 'M13L'].includes(monthCode) &&
          overflow === 'constrain'
        ) {
          let withoutML = monthCode.slice(1, -1);
          if (withoutML[0] === '0') withoutML = withoutML.slice(1);
          monthInfo = months[withoutML];
          if (monthInfo) {
            ({ daysInMonth: day, monthIndex: month } = monthInfo);
            monthCode = buildMonthCode(withoutML);
          }
        }
        if (month === undefined) {
          throw new RangeError(`Unmatched month ${monthCode} in Chinese year ${year}`);
        }
      } else if (monthCode === undefined) {
        const months = this.getMonthList(year, cache);
        const monthEntries = Object.entries(months);
        const largestMonth = monthEntries.length;
        if (overflow === 'reject') {
          ES.RejectToRange(month, 1, largestMonth);
          ES.RejectToRange(day, 1, this.maximumMonthLength());
        } else {
          month = ES.ConstrainToRange(month, 1, largestMonth);
          day = ES.ConstrainToRange(day, 1, this.maximumMonthLength());
        }
        const matchingMonthEntry = monthEntries.find(([, v]) => v.monthIndex === month);
        if (matchingMonthEntry === undefined) {
          throw new RangeError(`Invalid month ${month} in Chinese year ${year}`);
        }
        monthCode = buildMonthCode(
          matchingMonthEntry[0].replace('bis', ''),
          matchingMonthEntry[0].indexOf('bis') !== -1
        );
      } else {
        // Both month and monthCode are present. Make sure they don't conflict.
        const months = this.getMonthList(year, cache);
        let numberPart = monthCode.replace('L', 'bis').slice(1);
        if (numberPart[0] === '0') numberPart = numberPart.slice(1);
        let monthInfo = months[numberPart];
        if (!monthInfo) throw new RangeError(`Unmatched monthCode ${monthCode} in Chinese year ${year}`);
        if (month !== monthInfo.monthIndex) {
          throw new RangeError(`monthCode ${monthCode} doesn't correspond to month ${month} in Chinese year ${year}`);
        }
      }
      return { ...calendarDate, year, eraYear, month, monthCode, day };
    }
  },
  // All built-in calendars except Chinese/Dangi and Hebrew use an era
  hasEra: false
});

// Dangi (Korean) calendar has same implementation as Chinese
const helperDangi = ObjectAssign({}, { ...helperChinese, id: 'dangi' });

/**
 * Common implementation of all non-ISO calendars.
 * Per-calendar id and logic live in `id` and `helper` properties attached later.
 * This split allowed an easy separation between code that was similar between
 * ISO and non-ISO implementations vs. code that was very different.
 */
const nonIsoGeneralImpl = {
  dateFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    const cache = new OneObjectCache();
    // Intentionally alphabetical
    fields = ES.PrepareTemporalFields(fields, [
      ['day'],
      ['era', undefined],
      ['eraYear', undefined],
      ['month', undefined],
      ['monthCode', undefined],
      ['year', undefined]
    ]);
    const { year, month, day } = this.helper.calendarToIsoDate(fields, overflow, cache);
    const result = ES.CreateTemporalDate(year, month, day, calendar);
    cache.setObject(result);
    return result;
  },
  yearMonthFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    const cache = new OneObjectCache();
    // Intentionally alphabetical
    fields = ES.PrepareTemporalFields(fields, [
      ['era', undefined],
      ['eraYear', undefined],
      ['month', undefined],
      ['monthCode', undefined],
      ['year', undefined]
    ]);
    const { year, month, day } = this.helper.calendarToIsoDate({ ...fields, day: 1 }, overflow, cache);
    const result = ES.CreateTemporalYearMonth(year, month, calendar, /* referenceISODay = */ day);
    cache.setObject(result);
    return result;
  },
  monthDayFromFields(fields, options, calendar) {
    const overflow = ES.ToTemporalOverflow(options);
    // All built-in calendars require `day`, but some allow other fields to be
    // substituted for `month`. And for lunisolar calendars, either `monthCode`
    // or `year` must be provided because `month` is ambiguous without a year or
    // a code.
    const cache = new OneObjectCache();
    fields = ES.PrepareTemporalFields(fields, [
      ['day'],
      ['era', undefined],
      ['eraYear', undefined],
      ['month', undefined],
      ['monthCode', undefined],
      ['year', undefined]
    ]);
    const { year, month, day } = this.helper.monthDayFromFields(fields, overflow, cache);
    // `year` is a reference year where this month/day exists in this calendar
    const result = ES.CreateTemporalMonthDay(month, day, calendar, /* referenceISOYear = */ year);
    cache.setObject(result);
    return result;
  },
  fields(fields) {
    if (fields.includes('year')) fields = [...fields, 'era', 'eraYear'];
    return fields;
  },
  mergeFields(fields, additionalFields) {
    const { month, monthCode, year, era, eraYear, ...original } = fields;
    const {
      month: newMonth,
      monthCode: newMonthCode,
      year: newYear,
      era: newEra,
      eraYear: newEraYear
    } = additionalFields;
    if (newMonth === undefined && newMonthCode === undefined) {
      original.month = month;
      original.monthCode = monthCode;
    }
    if (newYear === undefined && newEra === undefined && newEraYear === undefined) {
      original.year = year;
      original.era = era;
      original.eraYear = eraYear;
    }
    return { ...original, ...additionalFields };
  },
  dateAdd(date, duration, overflow, calendar) {
    const { years, months, weeks, days } = duration;
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const added = this.helper.addCalendar(calendarDate, { years, months, weeks, days }, overflow, cache);
    const isoAdded = this.helper.calendarToIsoDate(added, 'constrain', cache);
    const { year, month, day } = isoAdded;
    const newTemporalObject = ES.CreateTemporalDate(year, month, day, calendar);
    // The new object's cache starts with the cache of the old object
    const newCache = new OneObjectCache(cache);
    newCache.setObject(newTemporalObject);
    return newTemporalObject;
  },
  dateUntil(one, two, largestUnit) {
    const cacheOne = OneObjectCache.getCacheForObject(one);
    const cacheTwo = OneObjectCache.getCacheForObject(two);
    const calendarOne = this.helper.temporalToCalendarDate(one, cacheOne);
    const calendarTwo = this.helper.temporalToCalendarDate(two, cacheTwo);
    const result = this.helper.untilCalendar(calendarOne, calendarTwo, largestUnit, cacheOne);
    return result;
  },
  year(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.year;
  },
  month(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.month;
  },
  day(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.day;
  },
  era(date) {
    if (!this.helper.hasEra) return undefined;
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.era;
  },
  eraYear(date) {
    if (!this.helper.hasEra) return undefined;
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.eraYear;
  },
  monthCode(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    return calendarDate.monthCode;
  },
  dayOfWeek(date) {
    return impl['iso8601'].dayOfWeek(date);
  },
  dayOfYear(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.isoToCalendarDate(date, cache);
    const startOfYear = this.helper.startOfCalendarYear(calendarDate);
    const diffDays = this.helper.calendarDaysUntil(startOfYear, calendarDate, cache);
    return diffDays + 1;
  },
  weekOfYear(date) {
    return impl['iso8601'].weekOfYear(date);
  },
  daysInWeek(date) {
    return impl['iso8601'].daysInWeek(date);
  },
  daysInMonth(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);

    // Easy case: if the helper knows the length without any heavy calculation.
    const max = this.helper.maximumMonthLength(calendarDate);
    const min = this.helper.minimumMonthLength(calendarDate);
    if (max === min) return max;

    // The harder case is where months vary every year, e.g. islamic calendars.
    // Find the answer by calculating the difference in days between the first
    // day of the current month and the first day of the next month.
    const startOfMonthCalendar = this.helper.startOfCalendarMonth(calendarDate);
    const startOfNextMonthCalendar = this.helper.addMonthsCalendar(startOfMonthCalendar, 1, 'constrain', cache);
    const result = this.helper.calendarDaysUntil(startOfMonthCalendar, startOfNextMonthCalendar, cache);
    return result;
  },
  daysInYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date);
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const startOfYearCalendar = this.helper.startOfCalendarYear(calendarDate);
    const startOfNextYearCalendar = this.helper.addCalendar(startOfYearCalendar, { years: 1 }, 'constrain', cache);
    const result = this.helper.calendarDaysUntil(startOfYearCalendar, startOfNextYearCalendar, cache);
    return result;
  },
  monthsInYear(date) {
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const result = this.helper.monthsInYear(calendarDate, cache);
    return result;
  },
  inLeapYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date);
    const cache = OneObjectCache.getCacheForObject(date);
    const calendarDate = this.helper.temporalToCalendarDate(date, cache);
    const result = this.helper.inLeapYear(calendarDate, cache);
    return result;
  }
};

impl['hebrew'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperHebrew });
impl['islamic'] = ObjectAssign({}, nonIsoGeneralImpl, { helper: helperIslamic });
['islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc'].forEach((id) => {
  impl[id] = ObjectAssign({}, nonIsoGeneralImpl, { helper: { ...helperIslamic, id } });
});
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

const BUILTIN_CALENDAR_IDS = Object.keys(impl);

export function IsBuiltinCalendar(id) {
  return ArrayIncludes.call(BUILTIN_CALENDAR_IDS, id);
}
