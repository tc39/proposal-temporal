import { ES } from './ecmascript.mjs';

const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
const Date = ES.GetIntrinsic('%Temporal.Date%');
const Time = ES.GetIntrinsic('%Temporal.Time%');
const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');

const DATE = Symbol('date');
const YM = Symbol('ym');
const MD = Symbol('md');
const TIME = Symbol('time');
const DATETIME = Symbol('datetime');
const ORIGINAL = Symbol('original');

const IntlDateTimeFormat = Intl.DateTimeFormat;
export function DateTimeFormat(locale = IntlDateTimeFormat().resolvedOptions().locale, options = {}) {
  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);
  this[ORIGINAL] = new IntlDateTimeFormat(locale, options);
  this[DATE] = new IntlDateTimeFormat(locale, dateAmmend(options, {}));
  this[YM] = new IntlDateTimeFormat(locale, dateAmmend(options, { day: false }));
  this[MD] = new IntlDateTimeFormat(locale, dateAmmend(options, { year: false }));
  this[TIME] = new IntlDateTimeFormat(locale, timeAmmend(options));
  this[DATETIME] = new IntlDateTimeFormat(locale, datetimeAmmend(options));
}
DateTimeFormat.supportedLocalesOf = function(...args) {
  return IntlDateTimeFormat.supportedLocalesOf(...args);
};
DateTimeFormat.prototype = Object.create(IntlDateTimeFormat.prototype, {
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
  formatToParts: {
    value: formatToParts,
    enumerable: true,
    writable: false,
    configurable: true
  },
  formatRange: {
    value: formatRange,
    enumerable: true,
    writable: false,
    configurable: true
  },
  formatRangeToParts: {
    value: formatRangeToParts,
    enumerable: true,
    writable: false,
    configurable: true
  }
});

function resolvedOptions() {
  return this[ORIGINAL].resolvedOptions();
}
function format(datetime, ...rest) {
  const { absolute, formatter } = extractOverrides(datetime, this);
  if (absolute && formatter) {
    return formatter.format(absolute.getEpochMilliseconds());
  }
  return this[ORIGINAL].format(datetime, ...rest);
}
function formatToParts(datetime, ...rest) {
  const { absolute, formatter } = extractOverrides(datetime, this);
  if (absolute && formatter) return formatter.formatToParts(absolute.getEpochMilliseconds());
  return this[ORIGINAL].formatToParts(datetime, ...rest);
}
function formatRange(a, b) {
  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const { absolute: aa, formatter } = extractOverrides(a, this);
    if (aa && formatter) {
      const { absolute: ba } = extractOverrides(b, this);
      return formatter.formatRange(aa, ba);
    }
  }
  return this[ORIGINAL].formatRange(a, b);
}
function formatRangeToParts(a, b) {
  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const { absolute: aa, formatter } = extractOverrides(a, this);
    if (aa && formatter) {
      const { absolute: ba } = extractOverrides(b, this);
      return formatter.formatRangeToParts(aa, ba);
    }
  }
  return this[ORIGINAL].formatRangeToParts(a, b);
}

function ammend(options = {}, ammended = {}) {
  options = Object.assign({}, options);
  for (let opt of ['year', 'month', 'day', 'hour', 'minute', 'second']) {
    options[opt] = opt in ammended ? ammended[opt] : options[opt];
    if (options[opt] === false || options[opt] === undefined) delete options[opt];
  }
  return options;
}
function timeAmmend(options) {
  options = ammend(options, { year: false, month: false, day: false });
  if (!hasTimeOptions(options)) {
    options = Object.assign(options, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
  return options;
}
function dateAmmend(options, ammendments) {
  options = ammend(options, { hour: false, minute: false, second: false });
  if (!hasDateOptions(options)) {
    options = Object.assign(options, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  options = ammend(options, ammendments);
  return options;
}
function datetimeAmmend(options) {
  options = Object.assign({}, options);
  if (!hasTimeOptions(options) && !hasDateOptions(options)) {
    Object.assign(options, {
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
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = datetime;
    const found = ES.GetTimeZoneEpochNanoseconds(
      main.resolvedOptions().timeZone,
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    );
    formatter = formatter || main[DATETIME];
    if (!found.length) throw new RangeError(`invalid datetime in ${timezone}`);
    datetime = new Absolute(found[0]);
  }
  if (datetime instanceof Absolute) {
    formatter = formatter || main[DATETIME];
    return { absolute: datetime, formatter };
  } else {
    return {};
  }
}
