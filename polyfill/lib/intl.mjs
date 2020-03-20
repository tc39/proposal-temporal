import { ES } from './ecmascript.mjs';
import { assign as ObjectAssign } from './compat.mjs';
import { TimeZone } from './timezone.mjs';

const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
const Date = ES.GetIntrinsic('%Temporal.Date%');
const Time = ES.GetIntrinsic('%Temporal.Time%');
const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
const Duration = ES.GetIntrinsic('%Temporal.Duration%');

const DATE = Symbol('date');
const YM = Symbol('ym');
const MD = Symbol('md');
const TIME = Symbol('time');
const DATETIME = Symbol('datetime');
const DURATION = Symbol('duration');
const ORIGINAL = Symbol('original');
const TIMEZONE = Symbol('timezone');

const IntlDateTimeFormat = Intl.DateTimeFormat;

export function DateTimeFormat(locale = IntlDateTimeFormat().resolvedOptions().locale, options = {}) {
  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);

  this[ORIGINAL] = new IntlDateTimeFormat(locale, options);
  this[TIMEZONE] = new TimeZone(this.resolvedOptions().timeZone);
  this[DATE] = new IntlDateTimeFormat(locale, dateAmend(options, {}));
  this[YM] = new IntlDateTimeFormat(locale, dateAmend(options, { day: false }));
  this[MD] = new IntlDateTimeFormat(locale, dateAmend(options, { year: false }));
  this[TIME] = new IntlDateTimeFormat(locale, timeAmend(options));
  this[DATETIME] = new IntlDateTimeFormat(locale, datetimeAmend(options));
}
DateTimeFormat.supportedLocalesOf = function(...args) {
  return IntlDateTimeFormat.supportedLocalesOf(...args);
};
const properties = {
  resolvedOptions: {
    value: resolvedOptions,
    enumerable: true,
    writable: false,
    configurable: true
  },
  format: {
    value: format,
    enumerable: true,
    writable: false,
    configurable: true
  },
  formatRange: {
    value: formatRange,
    enumerable: true,
    writable: false,
    configurable: true
  }
};
if ('formatToParts' in IntlDateTimeFormat.prototype) {
  properties.formatToParts = {
    value: formatToParts,
    enumerable: true,
    writable: false,
    configurable: true
  };
}
if ('formatRangeToParts' in IntlDateTimeFormat.prototype) {
  properties.formatRangeToParts = {
    value: formatRangeToParts,
    enumerable: true,
    writable: false,
    configurable: true
  };
}
DateTimeFormat.prototype = Object.create(IntlDateTimeFormat.prototype, properties);

function resolvedOptions() {
  return this[ORIGINAL].resolvedOptions();
}
function format(datetime, ...rest) {
  const { absolute, formatter } = extractOverrides(datetime, this);
  if (absolute && formatter) {
    return formatter.format(absolute.getEpochMilliseconds());
  }
  if (datetime instanceof Duration) {
    return this[DURATION].format(datetime, ...rest);
  }
  return this[ORIGINAL].format(datetime, ...rest);
}
function formatToParts(datetime, ...rest) {
  const { absolute, formatter } = extractOverrides(datetime, this);
  if (absolute && formatter) return formatter.formatToParts(absolute.getEpochMilliseconds());
  if (datetime instanceof Duration) {
    return this[DURATION].formatToParts(datetime, ...rest);
  }
  return this[ORIGINAL].formatToParts(datetime, ...rest);
}
function formatRange(a, b) {
  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const { absolute: aa, formatter: aformatter } = extractOverrides(a, this);
    const { absolute: bb, formatter: bformatter } = extractOverrides(b, this);
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      return aformatter.formatRange(aa.getEpochMilliseconds(), bb.getEpochMilliseconds());
    }
  }
  return this[ORIGINAL].formatRange(a, b);
}
function formatRangeToParts(a, b) {
  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const { absolute: aa, formatter: aformatter } = extractOverrides(a, this);
    const { absolute: bb, formatter: bformatter } = extractOverrides(b, this);
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      return aformatter.formatRangeToParts(aa.getEpochMilliseconds(), bb.getEpochMilliseconds());
    }
  }
  return this[ORIGINAL].formatRangeToParts(a, b);
}

function amend(options = {}, amended = {}) {
  options = ObjectAssign({}, options);
  for (let opt of ['year', 'month', 'day', 'hour', 'minute', 'second']) {
    options[opt] = opt in amended ? amended[opt] : options[opt];
    if (options[opt] === false || options[opt] === undefined) delete options[opt];
  }
  return options;
}
function timeAmend(options) {
  options = amend(options, { year: false, month: false, day: false });
  if (!hasTimeOptions(options)) {
    options = ObjectAssign(options, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}
function dateAmend(options, amendments) {
  options = amend(options, { hour: false, minute: false, second: false });
  if (!hasDateOptions(options)) {
    options = ObjectAssign(options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  options = amend(options, amendments);
  return options;
}
function datetimeAmend(options) {
  options = ObjectAssign({}, options);
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
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

function hasDateOptions(options) {
  return 'year' in options || 'month' in options || 'day' in options;
}
function hasTimeOptions(options) {
  return 'hour' in options || 'minute' in options || 'second' in options;
}
function extractOverrides(datetime, main) {
  let formatter;
  if (datetime instanceof Time) {
    datetime = datetime.withDate(new Date(1970, 1, 1));
    formatter = main[TIME];
  }
  if (datetime instanceof YearMonth) {
    datetime = datetime.withDay(1);
    formatter = main[YM];
  }
  if (datetime instanceof MonthDay) {
    datetime = datetime.withYear(2004); // use a leap-year for maximum range
    formatter = main[MD];
  }
  if (datetime instanceof Date) {
    datetime = datetime.withTime(new Time(12, 0));
    formatter = formatter || main[DATE];
  }
  if (datetime instanceof DateTime) {
    formatter = formatter || main[DATETIME];
    datetime = main[TIMEZONE].getAbsoluteFor(datetime, 'earlier');
  }
  if (datetime instanceof Absolute) {
    formatter = formatter || main[DATETIME];
    return { absolute: datetime, formatter };
  } else {
    return {};
  }
}
