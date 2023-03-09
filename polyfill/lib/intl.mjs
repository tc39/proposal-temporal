import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';
import {
  GetSlot,
  INSTANT,
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  CALENDAR,
  TIME_ZONE
} from './slots.mjs';
import { TimeZone } from './timezone.mjs';

const DATE = Symbol('date');
const YM = Symbol('ym');
const MD = Symbol('md');
const TIME = Symbol('time');
const DATETIME = Symbol('datetime');
const ZONED = Symbol('zoneddatetime');
const INST = Symbol('instant');
const ORIGINAL = Symbol('original');
const TZ_RESOLVED = Symbol('timezone');
const TZ_GIVEN = Symbol('timezone-id-given');
const CAL_ID = Symbol('calendar-id');
const LOCALE = Symbol('locale');
const OPTIONS = Symbol('options');

const descriptor = (value) => {
  return {
    value,
    enumerable: true,
    writable: false,
    configurable: true
  };
};

const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
const ObjectAssign = Object.assign;

// Construction of built-in Intl.DateTimeFormat objects is sloooooow,
// so we'll only create those instances when we need them.
// See https://bugs.chromium.org/p/v8/issues/detail?id=6528
function getPropLazy(obj, prop) {
  let val = obj[prop];
  if (typeof val === 'function') {
    val = new IntlDateTimeFormat(obj[LOCALE], val(obj[OPTIONS]));
    obj[prop] = val;
  }
  return val;
}
// Similarly, lazy-init TimeZone instances.
function getResolvedTimeZoneLazy(obj) {
  let val = obj[TZ_RESOLVED];
  if (typeof val === 'string') {
    val = new TimeZone(val);
    obj[TZ_RESOLVED] = val;
  }
  return val;
}

export function DateTimeFormat(locale = undefined, options = undefined) {
  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);
  const hasOptions = typeof options !== 'undefined';
  options = hasOptions ? ObjectAssign({}, options) : {};
  const original = new IntlDateTimeFormat(locale, options);
  const ro = original.resolvedOptions();

  // DateTimeFormat instances are very expensive to create. Therefore, they will
  // be lazily created only when needed, using the locale and options provided.
  // But it's possible for callers to mutate those inputs before lazy creation
  // happens. For this reason, we clone the inputs instead of caching the
  // original objects. To avoid the complexity of deep cloning any inputs that
  // are themselves objects (e.g. the locales array, or options property values
  // that will be coerced to strings), we rely on `resolvedOptions()` to do the
  // coercion and cloning for us. Unfortunately, we can't just use the resolved
  // options as-is because our options-amending logic adds additional fields if
  // the user doesn't supply any unit fields like year, month, day, hour, etc.
  // Therefore, we limit the properties in the clone to properties that were
  // present in the original input.
  if (hasOptions) {
    const clonedResolved = ObjectAssign({}, ro);
    for (const prop in clonedResolved) {
      if (!ES.HasOwnProperty(options, prop)) delete clonedResolved[prop];
    }
    this[OPTIONS] = clonedResolved;
  } else {
    this[OPTIONS] = options;
  }

  this[TZ_GIVEN] = options.timeZone ? options.timeZone : null;
  this[LOCALE] = ro.locale;
  this[ORIGINAL] = original;
  this[TZ_RESOLVED] = ro.timeZone;
  this[CAL_ID] = ro.calendar;
  this[DATE] = dateAmend;
  this[YM] = yearMonthAmend;
  this[MD] = monthDayAmend;
  this[TIME] = timeAmend;
  this[DATETIME] = datetimeAmend;
  this[ZONED] = zonedDateTimeAmend;
  this[INST] = instantAmend;
}

DateTimeFormat.supportedLocalesOf = function (...args) {
  return IntlDateTimeFormat.supportedLocalesOf(...args);
};

const properties = {
  resolvedOptions: descriptor(resolvedOptions),
  format: descriptor(format),
  formatRange: descriptor(formatRange)
};

if ('formatToParts' in IntlDateTimeFormat.prototype) {
  properties.formatToParts = descriptor(formatToParts);
}

if ('formatRangeToParts' in IntlDateTimeFormat.prototype) {
  properties.formatRangeToParts = descriptor(formatRangeToParts);
}

DateTimeFormat.prototype = Object.create(IntlDateTimeFormat.prototype, properties);

Object.defineProperty(DateTimeFormat, 'prototype', {
  writable: false,
  enumerable: false,
  configurable: false
});

function resolvedOptions() {
  return this[ORIGINAL].resolvedOptions();
}

function adjustFormatterTimeZone(formatter, timeZone) {
  if (!timeZone) return formatter;
  const options = formatter.resolvedOptions();
  if (options.timeZone === timeZone) return formatter;
  return new IntlDateTimeFormat(options.locale, { ...options, timeZone });
}

function format(datetime, ...rest) {
  let { instant, formatter, timeZone } = extractOverrides(datetime, this);
  if (instant && formatter) {
    formatter = adjustFormatterTimeZone(formatter, timeZone);
    return formatter.format(instant.epochMilliseconds);
  }
  return this[ORIGINAL].format(datetime, ...rest);
}

function formatToParts(datetime, ...rest) {
  let { instant, formatter, timeZone } = extractOverrides(datetime, this);
  if (instant && formatter) {
    formatter = adjustFormatterTimeZone(formatter, timeZone);
    return formatter.formatToParts(instant.epochMilliseconds);
  }
  return this[ORIGINAL].formatToParts(datetime, ...rest);
}

function formatRange(a, b) {
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeError('Intl.DateTimeFormat.formatRange accepts two values of the same type');
    }
    const { instant: aa, formatter: aformatter, timeZone: atz } = extractOverrides(a, this);
    const { instant: bb, formatter: bformatter, timeZone: btz } = extractOverrides(b, this);
    if (atz && btz && atz !== btz) {
      throw new RangeError('cannot format range between different time zones');
    }
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      const formatter = adjustFormatterTimeZone(aformatter, atz);
      return formatter.formatRange(aa.epochMilliseconds, bb.epochMilliseconds);
    }
  }
  return this[ORIGINAL].formatRange(a, b);
}

function formatRangeToParts(a, b) {
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeError('Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type');
    }
    const { instant: aa, formatter: aformatter, timeZone: atz } = extractOverrides(a, this);
    const { instant: bb, formatter: bformatter, timeZone: btz } = extractOverrides(b, this);
    if (atz && btz && atz !== btz) {
      throw new RangeError('cannot format range between different time zones');
    }
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      const formatter = adjustFormatterTimeZone(aformatter, atz);
      return formatter.formatRangeToParts(aa.epochMilliseconds, bb.epochMilliseconds);
    }
  }
  return this[ORIGINAL].formatRangeToParts(a, b);
}

function amend(options = {}, amended = {}) {
  options = ObjectAssign({}, options);
  for (let opt of [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'weekday',
    'dayPeriod',
    'timeZoneName',
    'dateStyle',
    'timeStyle'
  ]) {
    options[opt] = opt in amended ? amended[opt] : options[opt];
    if (options[opt] === false || options[opt] === undefined) delete options[opt];
  }
  return options;
}

function timeAmend(options) {
  options = amend(options, {
    year: false,
    month: false,
    day: false,
    weekday: false,
    timeZoneName: false,
    dateStyle: false
  });
  if (!hasTimeOptions(options)) {
    options = ObjectAssign({}, options, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}

function yearMonthAmend(options) {
  options = amend(options, {
    day: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    dateStyle: false,
    timeStyle: false
  });
  if (!('year' in options || 'month' in options)) {
    options = ObjectAssign(options, { year: 'numeric', month: 'numeric' });
  }
  return options;
}

function monthDayAmend(options) {
  options = amend(options, {
    year: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    dateStyle: false,
    timeStyle: false
  });
  if (!('month' in options || 'day' in options)) {
    options = ObjectAssign({}, options, { month: 'numeric', day: 'numeric' });
  }
  return options;
}

function dateAmend(options) {
  options = amend(options, {
    hour: false,
    minute: false,
    second: false,
    dayPeriod: false,
    timeZoneName: false,
    timeStyle: false
  });
  if (!hasDateOptions(options)) {
    options = ObjectAssign({}, options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  return options;
}

function datetimeAmend(options) {
  options = amend(options, { timeZoneName: false });
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign({}, options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}

function zonedDateTimeAmend(options) {
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign({}, options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    if (options.timeZoneName === undefined) options.timeZoneName = 'short';
  }
  return options;
}

function instantAmend(options) {
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    options = ObjectAssign({}, options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}

function hasDateOptions(options) {
  return 'year' in options || 'month' in options || 'day' in options || 'weekday' in options || 'dateStyle' in options;
}

function hasTimeOptions(options) {
  return (
    'hour' in options || 'minute' in options || 'second' in options || 'timeStyle' in options || 'dayPeriod' in options
  );
}

function isTemporalObject(obj) {
  return (
    ES.IsTemporalDate(obj) ||
    ES.IsTemporalTime(obj) ||
    ES.IsTemporalDateTime(obj) ||
    ES.IsTemporalZonedDateTime(obj) ||
    ES.IsTemporalYearMonth(obj) ||
    ES.IsTemporalMonthDay(obj) ||
    ES.IsTemporalInstant(obj)
  );
}

function sameTemporalType(x, y) {
  if (!isTemporalObject(x) || !isTemporalObject(y)) return false;
  if (ES.IsTemporalTime(x) && !ES.IsTemporalTime(y)) return false;
  if (ES.IsTemporalDate(x) && !ES.IsTemporalDate(y)) return false;
  if (ES.IsTemporalDateTime(x) && !ES.IsTemporalDateTime(y)) return false;
  if (ES.IsTemporalZonedDateTime(x) && !ES.IsTemporalZonedDateTime(y)) return false;
  if (ES.IsTemporalYearMonth(x) && !ES.IsTemporalYearMonth(y)) return false;
  if (ES.IsTemporalMonthDay(x) && !ES.IsTemporalMonthDay(y)) return false;
  if (ES.IsTemporalInstant(x) && !ES.IsTemporalInstant(y)) return false;
  return true;
}

function extractOverrides(temporalObj, main) {
  const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');

  if (ES.IsTemporalTime(temporalObj)) {
    const hour = GetSlot(temporalObj, ISO_HOUR);
    const minute = GetSlot(temporalObj, ISO_MINUTE);
    const second = GetSlot(temporalObj, ISO_SECOND);
    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
    const datetime = new DateTime(1970, 1, 1, hour, minute, second, millisecond, microsecond, nanosecond, main[CAL_ID]);
    return {
      instant: ES.GetInstantFor(getResolvedTimeZoneLazy(main), datetime, 'compatible'),
      formatter: getPropLazy(main, TIME)
    };
  }

  if (ES.IsTemporalYearMonth(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const referenceISODay = GetSlot(temporalObj, ISO_DAY);
    const calendar = ES.ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
    if (calendar !== main[CAL_ID]) {
      throw new RangeError(
        `cannot format PlainYearMonth with calendar ${calendar} in locale with calendar ${main[CAL_ID]}`
      );
    }
    const datetime = new DateTime(isoYear, isoMonth, referenceISODay, 12, 0, 0, 0, 0, 0, calendar);
    return {
      instant: ES.GetInstantFor(getResolvedTimeZoneLazy(main), datetime, 'compatible'),
      formatter: getPropLazy(main, YM)
    };
  }

  if (ES.IsTemporalMonthDay(temporalObj)) {
    const referenceISOYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const calendar = ES.ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
    if (calendar !== main[CAL_ID]) {
      throw new RangeError(
        `cannot format PlainMonthDay with calendar ${calendar} in locale with calendar ${main[CAL_ID]}`
      );
    }
    const datetime = new DateTime(referenceISOYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, calendar);
    return {
      instant: ES.GetInstantFor(getResolvedTimeZoneLazy(main), datetime, 'compatible'),
      formatter: getPropLazy(main, MD)
    };
  }

  if (ES.IsTemporalDate(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const calendar = ES.ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
    if (calendar !== 'iso8601' && calendar !== main[CAL_ID]) {
      throw new RangeError(`cannot format PlainDate with calendar ${calendar} in locale with calendar ${main[CAL_ID]}`);
    }
    const datetime = new DateTime(isoYear, isoMonth, isoDay, 12, 0, 0, 0, 0, 0, main[CAL_ID]);
    return {
      instant: ES.GetInstantFor(getResolvedTimeZoneLazy(main), datetime, 'compatible'),
      formatter: getPropLazy(main, DATE)
    };
  }

  if (ES.IsTemporalDateTime(temporalObj)) {
    const isoYear = GetSlot(temporalObj, ISO_YEAR);
    const isoMonth = GetSlot(temporalObj, ISO_MONTH);
    const isoDay = GetSlot(temporalObj, ISO_DAY);
    const hour = GetSlot(temporalObj, ISO_HOUR);
    const minute = GetSlot(temporalObj, ISO_MINUTE);
    const second = GetSlot(temporalObj, ISO_SECOND);
    const millisecond = GetSlot(temporalObj, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalObj, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalObj, ISO_NANOSECOND);
    const calendar = ES.ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
    if (calendar !== 'iso8601' && calendar !== main[CAL_ID]) {
      throw new RangeError(
        `cannot format PlainDateTime with calendar ${calendar} in locale with calendar ${main[CAL_ID]}`
      );
    }
    let datetime = temporalObj;
    if (calendar === 'iso8601') {
      datetime = new DateTime(
        isoYear,
        isoMonth,
        isoDay,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        main[CAL_ID]
      );
    }
    return {
      instant: ES.GetInstantFor(getResolvedTimeZoneLazy(main), datetime, 'compatible'),
      formatter: getPropLazy(main, DATETIME)
    };
  }

  if (ES.IsTemporalZonedDateTime(temporalObj)) {
    const calendar = ES.ToTemporalCalendarIdentifier(GetSlot(temporalObj, CALENDAR));
    if (calendar !== 'iso8601' && calendar !== main[CAL_ID]) {
      throw new RangeError(
        `cannot format ZonedDateTime with calendar ${calendar} in locale with calendar ${main[CAL_ID]}`
      );
    }

    let timeZone = GetSlot(temporalObj, TIME_ZONE);
    const objTimeZone = ES.ToString(timeZone);
    if (main[TZ_GIVEN] && main[TZ_GIVEN] !== objTimeZone) {
      throw new RangeError(`timeZone option ${main[TZ_GIVEN]} doesn't match actual time zone ${objTimeZone}`);
    }

    return {
      instant: GetSlot(temporalObj, INSTANT),
      formatter: getPropLazy(main, ZONED),
      timeZone: objTimeZone
    };
  }

  if (ES.IsTemporalInstant(temporalObj)) {
    return {
      instant: temporalObj,
      formatter: getPropLazy(main, INST)
    };
  }

  return {};
}
