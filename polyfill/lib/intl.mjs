import { ES } from './ecmascript.mjs';
import { assign as ObjectAssign } from './compat.mjs';
import { IDENTIFIER, GetSlot } from './slots.mjs';
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

class DurationFormat {
  constructor(locale, options = {}) {
    this.locale = locale;
    this.options = options;
  }
  format(duration) {
    console.error('Intl.DateTimeFormat.format with a Duration is not fully polyfilled!');
    return this.formatToParts(duration)
      .map((item) => item.value)
      .join('');
  }
  formatToParts(duration) {
    console.error('Intl.DateTimeFormat.formatToParts with a Duration is not fully polyfilled!');
    const locale = this.locale
      .split('-')
      .shift()
      .toLowerCase();
    const strings = DurationFormat[locale] || DurationFormat.en;
    const parts = [];
    if (duration.years && this.options.year) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'years', value: `${duration.years}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.years === 1 ? strings.year : strings.years });
    }
    if (duration.months && this.options.month) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'months', value: `${duration.months}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.months === 1 ? strings.month : strings.months });
    }
    if (duration.days && this.options.day) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'days', value: `${duration.days}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.days === 1 ? strings.day : strings.days });
    }
    if (duration.hours && this.options.hour) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'hours', value: `${duration.hours}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.hours === 1 ? strings.hour : strings.hours });
    }
    if (duration.minutes && this.options.minute) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'minutes', value: `${duration.minutes}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.minutes === 1 ? strings.minute : strings.minutes });
    }
    if (duration.seconds && this.options.second) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'seconds', value: `${duration.seconds}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.seconds === 1 ? strings.second : strings.seconds });
    }
    if (duration.milliseconds && this.options.millisecond) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'milliseconds', value: `${duration.milliseconds}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.milliseconds === 1 ? strings.millisecond : strings.milliseconds });
    }
    if (duration.microseconds && this.options.microsecond) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'microseconds', value: `${duration.microseconds}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.microseconds === 1 ? strings.microsecond : strings.microseconds });
    }
    if (duration.nanoseconds && this.options.nanosecond) {
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'nanoseconds', value: `${duration.nanoseconds}` });
      parts.push({ type: 'literal', value: ' ' });
      parts.push({ type: 'literal', value: duration.nanoseconds === 1 ? strings.nanosecond : strings.nanoseconds });
    }
    return parts.slice(1);
  }
  static get en() {
    return {
      year: 'year',
      years: 'years',
      month: 'month',
      months: 'months',
      day: 'day',
      days: 'days',
      hour: 'hour',
      hours: 'hours',
      minute: 'minute',
      minutes: 'minutes',
      second: 'second',
      seconds: 'seconds',
      millisecond: 'millisecond',
      milliseconds: 'milliseconds',
      microsecond: 'microsecond',
      microseconds: 'microseconds',
      nanosecond: 'nanosecond',
      nanoseconds: 'nanoseconds'
    };
  }
  static get de() {
    return {
      year: 'Jahr',
      years: 'Jahre',
      month: 'Monat',
      months: 'Monate',
      day: 'Tag',
      days: 'Tage',
      hour: 'Stunde',
      hours: 'Stunden',
      minute: 'Minute',
      minutes: 'Minuten',
      second: 'Sekunde',
      seconds: 'Sekunden',
      millisecond: 'Millisekunde',
      milliseconds: 'Millisekunden',
      microsecond: 'Mikrosekunde',
      microseconds: 'Mikrosekunden',
      nanosecond: 'Nanosekunde',
      nanoseconds: 'Nanosekunden'
    };
  }
}
export function DateTimeFormat(locale = IntlDateTimeFormat().resolvedOptions().locale, options = {}) {
  if (!(this instanceof DateTimeFormat)) return new DateTimeFormat(locale, options);

  this[ORIGINAL] = new IntlDateTimeFormat(locale, datetimeAmend(options));
  this[TIMEZONE] = new TimeZone(this.resolvedOptions().timeZone);
  this[DATE] = new IntlDateTimeFormat(locale, dateAmend(options, {}));
  this[YM] = new IntlDateTimeFormat(locale, dateAmend(options, { day: false }));
  this[MD] = new IntlDateTimeFormat(locale, dateAmend(options, { year: false }));
  this[TIME] = new IntlDateTimeFormat(locale, timeAmend(options));
  this[DATETIME] = new IntlDateTimeFormat(locale, datetimeAmend(options));
  this[DURATION] = new DurationFormat(locale, datetimeAmend(options));
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
if (formatToParts in IntlDateTimeFormat.prototype) {
  properties.formatToParts = {
    value: formatToParts,
    enumerable: true,
    writable: false,
    configurable: true
  };
}
if (formatRangeToParts in IntlDateTimeFormat.prototype) {
  properties.formatRangeToParts = {
    value: formatToParts,
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
      return formatter.formatRange(aa, ba);
    }
  }
  return this[ORIGINAL].formatRange(a, b);
}
function formatRangeToParts(a, b) {
  if ('object' === typeof a && 'object' === typeof b && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const { absolute: aa, formatter: aformatter } = extractOverrides(a, this);
    const { absolute: bb, formatter: bformatter } = extractOverrides(a, this);
    if (aa && bb && aformatter && bformatter && aformatter === bformatter) {
      return formatter.formatRangeToParts(aa, ba);
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
