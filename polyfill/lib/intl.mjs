import {
  // constructors and similar
  Symbol as SymbolCtor,

  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ArrayPrototypeSlice,
  IntlDateTimeFormat,
  IntlDateTimeFormatPrototypeGetFormat,
  IntlDateTimeFormatPrototypeFormatRange,
  IntlDateTimeFormatPrototypeFormatRangeToParts,
  IntlDateTimeFormatPrototypeFormatToParts,
  IntlDateTimeFormatPrototypeResolvedOptions,
  ObjectAssign,
  ObjectCreate,
  ObjectDefineProperties,
  ObjectDefineProperty,
  ObjectKeys
} from './primordials.mjs';
import { assert } from './assert.mjs';
import * as ES from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CreateSlots,
  GetSlot,
  HasSlot,
  EPOCHNANOSECONDS,
  ISO_DATE,
  ISO_DATE_TIME,
  SetSlot,
  TIME,
  CALENDAR
} from './slots.mjs';

const DATE = SymbolCtor('date');
const YM = SymbolCtor('ym');
const MD = SymbolCtor('md');
const TIME_FMT = SymbolCtor('time');
const DATETIME = SymbolCtor('datetime');
const INST = SymbolCtor('instant');
const ORIGINAL = SymbolCtor('original');
const TZ_CANONICAL = SymbolCtor('timezone-canonical');
const TZ_ORIGINAL = SymbolCtor('timezone-original');
const CAL_ID = SymbolCtor('calendar-id');
const LOCALE = SymbolCtor('locale');
const OPTIONS = SymbolCtor('options');

// Construction of built-in Intl.DateTimeFormat objects is sloooooow,
// so we'll only create those instances when we need them.
// See https://bugs.chromium.org/p/v8/issues/detail?id=6528
function getSlotLazy(obj, slot) {
  let val = GetSlot(obj, slot);
  if (typeof val === 'function') {
    val = new IntlDateTimeFormat(GetSlot(obj, LOCALE), val(GetSlot(obj, OPTIONS)));
    SetSlot(obj, slot, val);
  }
  return val;
}

function createDateTimeFormat(dtf, locale, options) {
  const hasOptions = typeof options !== 'undefined';
  if (hasOptions) {
    // Read all the options in the expected order and copy them to a
    // null-prototype object with which we can do further operations
    // unobservably
    const props = [
      'localeMatcher',
      'calendar',
      'numberingSystem',
      'hour12',
      'hourCycle',
      'timeZone',
      'weekday',
      'era',
      'year',
      'month',
      'day',
      'dayPeriod',
      'hour',
      'minute',
      'second',
      'fractionalSecondDigits',
      'timeZoneName',
      'formatMatcher',
      'dateStyle',
      'timeStyle'
    ];
    options = ES.ToObject(options);
    const newOptions = ObjectCreate(null);
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (ES.HasOwnProperty(options, prop)) {
        newOptions[prop] = options[prop];
      }
    }
    options = newOptions;
  } else {
    options = ObjectCreate(null);
  }

  const original = new IntlDateTimeFormat(locale, options);
  const ro = ES.Call(IntlDateTimeFormatPrototypeResolvedOptions, original, []);

  CreateSlots(dtf);

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
    const clonedResolved = ObjectAssign(ObjectCreate(null), ro);
    for (const prop in clonedResolved) {
      if (!ES.HasOwnProperty(options, prop)) delete clonedResolved[prop];
    }
    SetSlot(dtf, OPTIONS, clonedResolved);
  } else {
    SetSlot(dtf, OPTIONS, options);
  }

  SetSlot(dtf, LOCALE, ro.locale);
  SetSlot(dtf, ORIGINAL, original);
  SetSlot(dtf, TZ_CANONICAL, ro.timeZone);
  SetSlot(dtf, CAL_ID, ro.calendar);
  SetSlot(dtf, DATE, dateAmend);
  SetSlot(dtf, YM, yearMonthAmend);
  SetSlot(dtf, MD, monthDayAmend);
  SetSlot(dtf, TIME_FMT, timeAmend);
  SetSlot(dtf, DATETIME, datetimeAmend);
  SetSlot(dtf, INST, instantAmend);

  // Save the original time zone, for a few reasons:
  // - Clearer error messages
  // - More clearly follows the spec for InitializeDateTimeFormat
  // - Because it follows the spec more closely, will make it easier to integrate
  //   support of offset strings and other potential changes like proposal-canonical-tz.
  const timeZoneOption = hasOptions ? options.timeZone : undefined;
  if (timeZoneOption === undefined) {
    SetSlot(dtf, TZ_ORIGINAL, ro.timeZone);
  } else {
    const id = ES.ToString(timeZoneOption);
    if (ES.IsOffsetTimeZoneIdentifier(id)) {
      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
      throw new RangeErrorCtor('Intl.DateTimeFormat does not currently support offset time zones');
    }
    const record = ES.GetAvailableNamedTimeZoneIdentifier(id);
    if (!record) throw new RangeErrorCtor(`Intl.DateTimeFormat formats built-in time zones, not ${id}`);
    SetSlot(dtf, TZ_ORIGINAL, record.identifier);
  }
}

class DateTimeFormatImpl {
  constructor(locales = undefined, options = undefined) {
    createDateTimeFormat(this, locales, options);
  }

  get format() {
    if (!HasSlot(this, ORIGINAL)) throw new TypeErrorCtor('invalid receiver');
    const boundFormat = (...args) => ES.Call(format, this, args);
    ObjectDefineProperties(boundFormat, {
      length: { value: 1, enumerable: false, writable: false, configurable: true },
      name: { value: '', enumerable: false, writable: false, configurable: true }
    });
    return boundFormat;
  }

  formatRange(a, b) {
    if (!HasSlot(this, ORIGINAL)) throw new TypeErrorCtor('invalid receiver');
    return ES.Call(formatRange, this, [a, b]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatToParts(datetime, ...rest) {
    if (!HasSlot(this, ORIGINAL)) throw new TypeErrorCtor('invalid receiver');
    const args = ES.Call(ArrayPrototypeSlice, arguments, []);
    return ES.Call(formatToParts, this, args);
  }

  formatRangeToParts(a, b) {
    if (!HasSlot(this, ORIGINAL)) throw new TypeErrorCtor('invalid receiver');
    return ES.Call(formatRangeToParts, this, [a, b]);
  }

  resolvedOptions() {
    if (!HasSlot(this, ORIGINAL)) throw new TypeErrorCtor('invalid receiver');
    return ES.Call(resolvedOptions, this, []);
  }
}

if (!('formatToParts' in IntlDateTimeFormat.prototype)) {
  delete DateTimeFormatImpl.prototype.formatToParts;
}

if (!('formatRangeToParts' in IntlDateTimeFormat.prototype)) {
  delete DateTimeFormatImpl.prototype.formatRangeToParts;
}

// A non-class constructor is needed because Intl.DateTimeFormat must be able to
// be called without 'new'
export function DateTimeFormat(locales = undefined, options = undefined) {
  return new DateTimeFormatImpl(locales, options);
}
DateTimeFormatImpl.prototype.constructor = DateTimeFormat;

ObjectDefineProperty(DateTimeFormat, 'prototype', {
  value: DateTimeFormatImpl.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});
DateTimeFormat.supportedLocalesOf = IntlDateTimeFormat.supportedLocalesOf;
MakeIntrinsicClass(DateTimeFormat, 'Intl.DateTimeFormat');

function resolvedOptions() {
  const resolved = ES.Call(IntlDateTimeFormatPrototypeResolvedOptions, GetSlot(this, ORIGINAL), []);
  resolved.timeZone = GetSlot(this, TZ_ORIGINAL);
  return resolved;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function format(datetime, ...rest) {
  let { epochNs, formatter } = extractOverrides(datetime, this);
  let formatArgs;
  if (formatter) {
    formatArgs = [ES.epochNsToMs(epochNs, 'floor')];
  } else {
    formatter = GetSlot(this, ORIGINAL);
    formatArgs = ES.Call(ArrayPrototypeSlice, arguments, []);
  }
  const boundFormat = ES.Call(IntlDateTimeFormatPrototypeGetFormat, formatter, []);
  return ES.Call(boundFormat, formatter, formatArgs);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatToParts(datetime, ...rest) {
  let { epochNs, formatter } = extractOverrides(datetime, this);
  let formatArgs;
  if (formatter) {
    formatArgs = [ES.epochNsToMs(epochNs, 'floor')];
  } else {
    formatter = GetSlot(this, ORIGINAL);
    formatArgs = ES.Call(ArrayPrototypeSlice, arguments, []);
  }
  return ES.Call(IntlDateTimeFormatPrototypeFormatToParts, formatter, formatArgs);
}

function formatRange(a, b) {
  let formatArgs = [a, b];
  let formatter;
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeErrorCtor('Intl.DateTimeFormat.formatRange accepts two values of the same type');
    }
    const { epochNs: aa, formatter: aformatter } = extractOverrides(a, this);
    const { epochNs: bb, formatter: bformatter } = extractOverrides(b, this);
    if (aformatter) {
      assert(bformatter == aformatter, 'formatters for same Temporal type should be identical');
      formatter = aformatter;
      formatArgs = [ES.epochNsToMs(aa, 'floor'), ES.epochNsToMs(bb, 'floor')];
    }
  } else {
    formatter = GetSlot(this, ORIGINAL);
  }
  return ES.Call(IntlDateTimeFormatPrototypeFormatRange, formatter, formatArgs);
}

function formatRangeToParts(a, b) {
  let formatArgs = [a, b];
  let formatter;
  if (isTemporalObject(a) || isTemporalObject(b)) {
    if (!sameTemporalType(a, b)) {
      throw new TypeErrorCtor('Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type');
    }
    const { epochNs: aa, formatter: aformatter } = extractOverrides(a, this);
    const { epochNs: bb, formatter: bformatter } = extractOverrides(b, this);
    if (aformatter) {
      assert(bformatter == aformatter, 'formatters for same Temporal type should be identical');
      formatter = aformatter;
      formatArgs = [ES.epochNsToMs(aa, 'floor'), ES.epochNsToMs(bb, 'floor')];
    }
  } else {
    formatter = GetSlot(this, ORIGINAL);
  }
  return ES.Call(IntlDateTimeFormatPrototypeFormatRangeToParts, formatter, formatArgs);
}

function amend(options = {}, amended = {}) {
  options = ObjectAssign({}, options);
  const props = [
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
  ];
  for (let i = 0; i < props.length; i++) {
    const opt = props[i];
    options[opt] = opt in amended ? amended[opt] : options[opt];
    if (options[opt] === false || options[opt] === undefined) delete options[opt];
  }
  return options;
}

function timeAmend(originalOptions) {
  const options = amend(originalOptions, {
    year: false,
    month: false,
    day: false,
    weekday: false,
    timeZoneName: false,
    dateStyle: false
  });
  if (options.timeStyle === 'long' || options.timeStyle === 'full') {
    // Try to fake what timeStyle should do if not printing the time zone name
    delete options.timeStyle;
    ObjectAssign(options, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }
  if (!hasTimeOptions(options)) {
    if (hasAnyDateTimeOptions(originalOptions)) {
      throw new TypeError(`cannot format Temporal.PlainTime with options [${ObjectKeys(originalOptions)}]`);
    }
    ObjectAssign(options, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}

function yearMonthAmend(originalOptions) {
  // Try to fake what dateStyle should do for dates without a day. This is not
  // accurate for locales that always print the era
  const dateStyleHacks = {
    short: { year: '2-digit', month: 'numeric' },
    medium: { year: 'numeric', month: 'short' },
    long: { year: 'numeric', month: 'long' },
    full: { year: 'numeric', month: 'long' }
  };
  const options = amend(originalOptions, {
    day: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    timeStyle: false
  });
  if ('dateStyle' in options) {
    const style = options.dateStyle;
    delete options.dateStyle;
    ObjectAssign(options, dateStyleHacks[style]);
  }
  if (!('year' in options || 'month' in options || 'era' in options)) {
    if (hasAnyDateTimeOptions(originalOptions)) {
      throw new TypeError(`cannot format PlainYearMonth with options [${ObjectKeys(originalOptions)}]`);
    }
    ObjectAssign(options, { year: 'numeric', month: 'numeric' });
  }
  return options;
}

function monthDayAmend(originalOptions) {
  // Try to fake what dateStyle should do for dates without a day
  const dateStyleHacks = {
    short: { month: 'numeric', day: 'numeric' },
    medium: { month: 'short', day: 'numeric' },
    long: { month: 'long', day: 'numeric' },
    full: { month: 'long', day: 'numeric' }
  };
  const options = amend(originalOptions, {
    year: false,
    hour: false,
    minute: false,
    second: false,
    weekday: false,
    dayPeriod: false,
    timeZoneName: false,
    timeStyle: false
  });
  if ('dateStyle' in options) {
    const style = options.dateStyle;
    delete options.dateStyle;
    ObjectAssign(options, dateStyleHacks[style]);
  }
  if (!('month' in options || 'day' in options)) {
    if (hasAnyDateTimeOptions(originalOptions)) {
      throw new TypeError(`cannot format PlainMonthDay with options [${ObjectKeys(originalOptions)}]`);
    }
    ObjectAssign(options, { month: 'numeric', day: 'numeric' });
  }
  return options;
}

function dateAmend(originalOptions) {
  const options = amend(originalOptions, {
    hour: false,
    minute: false,
    second: false,
    dayPeriod: false,
    timeZoneName: false,
    timeStyle: false
  });
  if (!hasDateOptions(options)) {
    if (hasAnyDateTimeOptions(originalOptions)) {
      throw new TypeError(`cannot format PlainDate with options [${ObjectKeys(originalOptions)}]`);
    }
    ObjectAssign(options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  return options;
}

function datetimeAmend(originalOptions) {
  const options = amend(originalOptions, { timeZoneName: false });
  if (options.timeStyle === 'long' || options.timeStyle === 'full') {
    // Try to fake what timeStyle should do if not printing the time zone name
    delete options.timeStyle;
    ObjectAssign(options, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    if (hasAnyDateTimeOptions(originalOptions)) {
      throw new TypeError(`cannot format PlainDateTime with options [${ObjectKeys(originalOptions)}]`);
    }
    ObjectAssign(options, {
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
  return (
    'year' in options ||
    'month' in options ||
    'day' in options ||
    'weekday' in options ||
    'dateStyle' in options ||
    'era' in options
  );
}

function hasTimeOptions(options) {
  return (
    'hour' in options ||
    'minute' in options ||
    'second' in options ||
    'timeStyle' in options ||
    'dayPeriod' in options ||
    'fractionalSecondDigits' in options
  );
}

function hasAnyDateTimeOptions(originalOptions) {
  return (
    hasDateOptions(originalOptions) ||
    hasTimeOptions(originalOptions) ||
    'dateStyle' in originalOptions ||
    'timeStyle' in originalOptions ||
    'timeZoneName' in originalOptions
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
  if (ES.IsTemporalTime(temporalObj)) {
    const isoDateTime = {
      isoDate: { year: 1970, month: 1, day: 1 },
      time: GetSlot(temporalObj, TIME)
    };
    return {
      epochNs: ES.GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
      formatter: getSlotLazy(main, TIME_FMT)
    };
  }

  if (ES.IsTemporalYearMonth(temporalObj)) {
    const calendar = GetSlot(temporalObj, CALENDAR);
    const mainCalendar = GetSlot(main, CAL_ID);
    if (calendar !== mainCalendar) {
      throw new RangeErrorCtor(
        `cannot format PlainYearMonth with calendar ${calendar} in locale with calendar ${mainCalendar}`
      );
    }
    const isoDateTime = ES.CombineISODateAndTimeRecord(GetSlot(temporalObj, ISO_DATE), ES.NoonTimeRecord());
    return {
      epochNs: ES.GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
      formatter: getSlotLazy(main, YM)
    };
  }

  if (ES.IsTemporalMonthDay(temporalObj)) {
    const calendar = GetSlot(temporalObj, CALENDAR);
    const mainCalendar = GetSlot(main, CAL_ID);
    if (calendar !== mainCalendar) {
      throw new RangeErrorCtor(
        `cannot format PlainMonthDay with calendar ${calendar} in locale with calendar ${mainCalendar}`
      );
    }
    const isoDateTime = ES.CombineISODateAndTimeRecord(GetSlot(temporalObj, ISO_DATE), ES.NoonTimeRecord());
    return {
      epochNs: ES.GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
      formatter: getSlotLazy(main, MD)
    };
  }

  if (ES.IsTemporalDate(temporalObj)) {
    const calendar = GetSlot(temporalObj, CALENDAR);
    const mainCalendar = GetSlot(main, CAL_ID);
    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
      throw new RangeErrorCtor(
        `cannot format PlainDate with calendar ${calendar} in locale with calendar ${mainCalendar}`
      );
    }
    const isoDateTime = ES.CombineISODateAndTimeRecord(GetSlot(temporalObj, ISO_DATE), ES.NoonTimeRecord());
    return {
      epochNs: ES.GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
      formatter: getSlotLazy(main, DATE)
    };
  }

  if (ES.IsTemporalDateTime(temporalObj)) {
    const calendar = GetSlot(temporalObj, CALENDAR);
    const mainCalendar = GetSlot(main, CAL_ID);
    if (calendar !== 'iso8601' && calendar !== mainCalendar) {
      throw new RangeErrorCtor(
        `cannot format PlainDateTime with calendar ${calendar} in locale with calendar ${mainCalendar}`
      );
    }
    const isoDateTime = GetSlot(temporalObj, ISO_DATE_TIME);
    return {
      epochNs: ES.GetEpochNanosecondsFor(GetSlot(main, TZ_CANONICAL), isoDateTime, 'compatible'),
      formatter: getSlotLazy(main, DATETIME)
    };
  }

  if (ES.IsTemporalZonedDateTime(temporalObj)) {
    throw new TypeErrorCtor(
      'Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.'
    );
  }

  if (ES.IsTemporalInstant(temporalObj)) {
    return {
      epochNs: GetSlot(temporalObj, EPOCHNANOSECONDS),
      formatter: getSlotLazy(main, INST)
    };
  }

  return {};
}
