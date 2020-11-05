/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import * as REGEX from './regex.mjs';
import {
  CALENDAR,
  CALENDAR_ID,
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
  TIME_ZONE,
  CreateSlots,
  GetSlot,
  HasSlot,
  SetSlot
} from './slots.mjs';

const ID_REGEX = new RegExp(`^${REGEX.calendarID.source}$`);

export class Calendar {
  constructor(id) {
    if (!ID_REGEX.exec(id)) throw new RangeError(`invalid calendar identifier ${id}`);
    CreateSlots(this);
    id = ES.ToString(id);
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
    return ES.CalendarToString(this);
  }
  dateFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  timeFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  yearMonthFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  monthDayFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  fields(fields) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.CreateListFromArrayLike(fields, ['String']);
  }
  dateAdd(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  dateUntil(one, two, options) {
    void one;
    void two;
    void options;
    throw new Error('not implemented');
  }
  timeAdd(time, duration, options, constructor) {
    void time;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  timeUntil(one, two, options) {
    void one;
    void two;
    void options;
    throw new Error('not implemented');
  }
  year(date) {
    void date;
    throw new Error('not implemented');
  }
  month(date) {
    void date;
    throw new Error('not implemented');
  }
  day(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfWeek(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  weekOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInWeek(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInMonth(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInYear(date) {
    void date;
    throw new Error('not implemented');
  }
  monthsInYear(date) {
    void date;
    throw new Error('not implemented');
  }
  inLeapYear(date) {
    void date;
    throw new Error('not implemented');
  }
  hour(time) {
    void time;
    throw new Error('not implemented');
  }
  minute(time) {
    void time;
    throw new Error('not implemented');
  }
  second(time) {
    void time;
    throw new Error('not implemented');
  }
  millisecond(time) {
    void time;
    throw new Error('not implemented');
  }
  microsecond(time) {
    void time;
    throw new Error('not implemented');
  }
  nanosecond(time) {
    void time;
    throw new Error('not implemented');
  }
  toString() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  static from(item) {
    if (ES.Type(item) === 'Object') {
      if (!('calendar' in item)) return item;
      item = item.calendar;
      if (ES.Type(item) === 'Object' && !('calendar' in item)) return item;
    }
    const stringIdent = ES.ToString(item);
    if (IsBuiltinCalendar(stringIdent)) return GetBuiltinCalendar(stringIdent);
    let calendar;
    try {
      ({ calendar } = ES.ParseISODateTime(stringIdent, { zoneRequired: false }));
    } catch {
      throw new RangeError(`Invalid calendar: ${stringIdent}`);
    }
    if (!calendar) calendar = 'iso8601';
    return GetBuiltinCalendar(calendar);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
DefineIntrinsic('Temporal.Calendar.from', Calendar.from);
DefineIntrinsic('Temporal.Calendar.prototype.fields', Calendar.prototype.fields);
DefineIntrinsic('Temporal.Calendar.prototype.toString', Calendar.prototype.toString);

class ISO8601Calendar extends Calendar {
  constructor(id = 'iso8601') {
    // Needs to be subclassable, that's why the ID is a default argument
    id = ES.ToString(id);
    super(id);
  }
  dateFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    let { year, month, day } = ES.ToRecord(fields, [['day'], ['month'], ['year']]);
    ({ year, month, day } = ES.RegulateDate(year, month, day, overflow));
    return new constructor(year, month, day, this);
  }
  timeFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ES.ToTemporalTimeRecord(fields);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
    return new constructor(hour, minute, second, millisecond, microsecond, nanosecond, this);
  }
  yearMonthFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    let { year, month } = ES.ToRecord(fields, [['month'], ['year']]);
    ({ year, month } = ES.RegulateYearMonth(year, month, overflow));
    return new constructor(year, month, this, /* referenceISODay = */ 1);
  }
  monthDayFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    let { month, day } = ES.ToRecord(fields, [['day'], ['month']]);
    ({ month, day } = ES.RegulateMonthDay(month, day, overflow));
    return new constructor(month, day, this, /* referenceISOYear = */ 1972);
  }
  dateAdd(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    duration = ES.ToTemporalDuration(duration, GetIntrinsic('%Temporal.Duration%'));
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { years, months, weeks, days } = duration;
    ES.RejectDurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, weeks, days, overflow));
    return new constructor(year, month, day, this);
  }
  dateUntil(one, two, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    one = ES.ToTemporalDate(one, GetIntrinsic('%Temporal.PlainDate%'));
    two = ES.ToTemporalDate(two, GetIntrinsic('%Temporal.PlainDate%'));
    options = ES.NormalizeOptionsObject(options);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days', [
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ]);
    const { years, months, weeks, days } = ES.DifferenceDate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY),
      largestUnit
    );
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  timeAdd(time, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    time = ES.ToTemporalTime(time, GetIntrinsic('%Temporal.PlainTime%'));
    duration = ES.ToTemporalDuration(duration, GetIntrinsic('%Temporal.Duration%'));
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    let hour = GetSlot(time, ISO_HOUR);
    let minute = GetSlot(time, ISO_MINUTE);
    let second = GetSlot(time, ISO_SECOND);
    let millisecond = GetSlot(time, ISO_MILLISECOND);
    let microsecond = GetSlot(time, ISO_MICROSECOND);
    let nanosecond = GetSlot(time, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
    return new constructor(hour, minute, second, millisecond, microsecond, nanosecond, this);
  }
  timeUntil(one, two) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    one = ES.ToTemporalTime(one, GetIntrinsic('%Temporal.PlainTime%'));
    two = ES.ToTemporalTime(two, GetIntrinsic('%Temporal.PlainTime%'));
    let { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(one, ISO_HOUR),
      GetSlot(one, ISO_MINUTE),
      GetSlot(one, ISO_SECOND),
      GetSlot(one, ISO_MILLISECOND),
      GetSlot(one, ISO_MICROSECOND),
      GetSlot(one, ISO_NANOSECOND),
      GetSlot(two, ISO_HOUR),
      GetSlot(two, ISO_MINUTE),
      GetSlot(two, ISO_SECOND),
      GetSlot(two, ISO_MILLISECOND),
      GetSlot(two, ISO_MICROSECOND),
      GetSlot(two, ISO_NANOSECOND)
    );
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, 0, 0, deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  year(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_YEAR);
  }
  month(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_MONTH)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_MONTH);
  }
  day(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_DAY)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_DAY);
  }
  hour(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_HOUR);
  }
  minute(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_MINUTE);
  }
  second(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_SECOND);
  }
  millisecond(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_MILLISECOND);
  }
  microsecond(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_MICROSECOND);
  }
  nanosecond(time) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(time, ISO_NANOSECOND);
  }
  dayOfWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  dayOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  weekOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  daysInWeek(date) {
    ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return 7;
  }
  daysInMonth(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    return ES.DaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  }
  daysInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  }
  monthsInYear(date) {
    if (!HasSlot(date, ISO_YEAR)) ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return 12;
  }
  inLeapYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.LeapYear(GetSlot(date, ISO_YEAR));
  }
}

MakeIntrinsicClass(ISO8601Calendar, 'Temporal.ISO8601Calendar');

// Note: other built-in calendars than iso8601 are not part of the Temporal
// proposal for ECMA-262. These calendars will be standardized as part of
// ECMA-402.

function addCustomPropertyGetter(type, name) {
  Object.defineProperty(GetIntrinsic(`%Temporal.${type}.prototype%`), name, {
    get() {
      return GetSlot(this, CALENDAR)[name](this);
    },
    configurable: true
  });
}

function addEraProperties() {
  addCustomPropertyGetter('PlainDate', 'era');
  addCustomPropertyGetter('PlainDateTime', 'era');
  addCustomPropertyGetter('PlainYearMonth', 'era');
  Object.defineProperty(GetIntrinsic('%Temporal.ZonedDateTime.prototype%'), 'era', {
    get() {
      const calendar = GetSlot(this, CALENDAR);
      const dateTime = ES.GetTemporalDateTimeFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT), calendar);
      return calendar.era(dateTime);
    },
    configurable: true
  });
}

// Implementation details for Gregorian calendar
const gre = {
  isoYear(year, era) {
    return era === 'bc' ? -(year - 1) : year;
  }
};

// 'iso8601' calendar is equivalent to 'gregory' except for ISO 8601 week
// numbering rules, which we do not currently use in Temporal, and the addition
// of BC/AD eras which means no negative years or year 0.
class Gregorian extends ISO8601Calendar {
  constructor() {
    super('gregory');
    addEraProperties();
  }

  era(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_YEAR) < 1 ? 'bc' : 'ad';
  }
  year(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    const isoYear = GetSlot(date, ISO_YEAR);
    return isoYear < 1 ? -isoYear + 1 : isoYear;
  }

  fields(fields) {
    fields = super.fields(fields);
    if (fields.includes('year')) fields.push('era');
    return fields;
  }

  dateFromFields(fields, options, constructor) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['day'], ['era', 'ad'], ['month'], ['year']]);
    const isoYear = gre.isoYear(fields.year, fields.era);
    return super.dateFromFields({ ...fields, year: isoYear }, options, constructor);
  }
  yearMonthFromFields(fields, options, constructor) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['era', 'ad'], ['month'], ['year']]);
    const isoYear = gre.isoYear(fields.year, fields.era);
    return super.yearMonthFromFields({ ...fields, year: isoYear }, options, constructor);
  }
}

// Implementation details for Japanese calendar
//
// NOTE: For convenience, this hacky class only supports the most recent five
// eras, those of the modern period. For the full list, see:
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
const jpn = {
  eraStartDates: ['1868-09-08', '1912-07-30', '1926-12-25', '1989-01-08', '2019-05-01'],
  eraAddends: [1867, 1911, 1925, 1988, 2018],

  // This is what API consumers pass in as the value of the 'era' field. We use
  // string constants consisting of the romanized name
  // Unfortunately these are not unique throughout history, so this should be
  // solved: https://github.com/tc39/proposal-temporal/issues/526
  // Otherwise, we'd have to introduce some era numbering system, which (as far
  // as I can tell from Wikipedia) the calendar doesn't have, so would be
  // non-standard and confusing, requiring API consumers to figure out "now what
  // number is the Reiwa (current) era?" My understanding is also that this
  // starting point for eras (0645-06-19) is not the only possible one, since
  // there are unofficial eras before that.
  // https://en.wikipedia.org/wiki/Japanese_era_name
  eraNames: ['meiji', 'taisho', 'showa', 'heisei', 'reiwa'],
  // Note: C locale era names available at
  // https://github.com/unicode-org/icu/blob/master/icu4c/source/data/locales/root.txt#L1582-L1818

  compareDate(one, two) {
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
  },

  findEra(date) {
    const TemporalDate = GetIntrinsic('%Temporal.PlainDate%');
    const idx = jpn.eraStartDates.findIndex((dateStr) => {
      const { year, month, day } = ES.ParseTemporalDateString(dateStr);
      const startDate = new TemporalDate(year, month, day);
      return jpn.compareDate(date, startDate) < 0;
    });
    if (idx === -1) return jpn.eraStartDates.length - 1;
    if (idx === 0) return 0;
    return idx - 1;
  },

  isoYear(year, era) {
    const eraIdx = jpn.eraNames.indexOf(era);
    if (eraIdx === -1) throw new RangeError(`invalid era ${era}`);

    return year + jpn.eraAddends[eraIdx];
  }
};

class Japanese extends ISO8601Calendar {
  constructor() {
    super('japanese');
    addEraProperties();
  }

  era(date) {
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH) || !HasSlot(date, ISO_DAY)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    return jpn.eraNames[jpn.findEra(date)];
  }
  year(date) {
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH) || !HasSlot(date, ISO_DAY)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    const eraIdx = jpn.findEra(date);
    return GetSlot(date, ISO_YEAR) - jpn.eraAddends[eraIdx];
  }

  fields(fields) {
    fields = super.fields(fields);
    if (fields.includes('year')) fields.push('era');
    return fields;
  }

  dateFromFields(fields, options, constructor) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['day'], ['era'], ['month'], ['year']]);
    const isoYear = jpn.isoYear(fields.year, fields.era);
    return super.dateFromFields({ ...fields, year: isoYear }, options, constructor);
  }
  yearMonthFromFields(fields, options, constructor) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['era'], ['month'], ['year']]);
    const isoYear = jpn.isoYear(fields.year, fields.era);
    return super.yearMonthFromFields({ ...fields, year: isoYear }, options, constructor);
  }
}

const BUILTIN_CALENDARS = {
  gregory: Gregorian,
  iso8601: ISO8601Calendar,
  japanese: Japanese
  // To be filled in as builtin calendars are implemented
};

function IsBuiltinCalendar(id) {
  return id in BUILTIN_CALENDARS;
}
function GetBuiltinCalendar(id) {
  if (!(id in BUILTIN_CALENDARS)) throw new RangeError(`unknown calendar ${id}`);
  return new BUILTIN_CALENDARS[id]();
}
export function GetISO8601Calendar() {
  return GetBuiltinCalendar('iso8601');
}
