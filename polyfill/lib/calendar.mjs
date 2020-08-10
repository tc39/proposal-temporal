/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import { CALENDAR_ID, ISO_YEAR, ISO_MONTH, ISO_DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

export class Calendar {
  constructor(id) {
    CreateSlots(this);
    SetSlot(this, CALENDAR_ID, id);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  dateFromFields(fields, options, constructor) {
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
  datePlus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  dateMinus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  dateDifference(one, two, options) {
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
  era(date) {
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
  daysInMonth(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInYear(date) {
    void date;
    throw new Error('not implemented');
  }
  isLeapYear(date) {
    void date;
    throw new Error('not implemented');
  }
  toString() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  static from(item) {
    if (ES.IsTemporalCalendar(item) || (typeof item === 'object' && item)) return item;
    const stringIdent = ES.ToString(item);
    return GetBuiltinCalendar(stringIdent);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
DefineIntrinsic('Temporal.Calendar.from', Calendar.from);

class ISO8601 extends Calendar {
  constructor(id = 'iso8601') {
    // Needs to be subclassable, that's why the ID is a default argument
    super(id);
  }
  dateFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { year, month, day } = ES.ToTemporalDateRecord(fields);
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    return new constructor(year, month, day, this);
  }
  yearMonthFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { year, month } = ES.ToTemporalYearMonthRecord(fields);
    ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
    return new constructor(year, month, this, /* refIsoDay = */ 1);
  }
  monthDayFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    // Intentionally alphabetical
    let { month, day } = ES.ToTemporalMonthDayRecord(fields);
    ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
    return new constructor(month, day, this, /* refIsoYear = */ 1972);
  }
  datePlus(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days } = duration;
    ES.RejectDurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    if (sign < 0) {
      ({ year, month, day } = ES.SubtractDate(year, month, day, -years, -months, -weeks, -days, disambiguation));
    } else {
      ({ year, month, day } = ES.AddDate(year, month, day, years, months, weeks, days, disambiguation));
    }
    return new constructor(year, month, day, this);
  }
  dateMinus(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days } = duration;
    ES.RejectDurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    let year = GetSlot(date, ISO_YEAR);
    let month = GetSlot(date, ISO_MONTH);
    let day = GetSlot(date, ISO_DAY);
    if (sign < 0) {
      ({ year, month, day } = ES.AddDate(year, month, day, -years, -months, -weeks, -days, disambiguation));
    } else {
      ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, weeks, days, disambiguation));
    }
    return new constructor(year, month, day, this);
  }
  dateDifference(one, two, options) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days', [
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ]);
    const { years, months, weeks, days } = ES.DifferenceDate(one, two, largestUnit);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  year(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_YEAR);
  }
  month(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_MONTH);
  }
  day(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(date, ISO_DAY);
  }
  era(date) {
    void date;
    return undefined;
  }
  dayOfWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  dayOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  weekOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  }
  daysInMonth(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  }
  daysInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  }
  isLeapYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(date, ISO_YEAR));
  }
}

// According to documentation for Intl.Locale.prototype.calendar on MDN,
// 'iso8601' calendar is equivalent to 'gregory' except for ISO 8601 week
// numbering rules, which we do not currently use in Temporal.
class Gregorian extends ISO8601 {
  constructor() {
    super('gregory');
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
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
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

class Japanese extends ISO8601 {
  constructor() {
    super('japanese');
  }

  era(date) {
    return jpn.eraNames[jpn.findEra(date)];
  }
  year(date) {
    const eraIdx = jpn.findEra(date);
    return GetSlot(date, ISO_YEAR) - jpn.eraAddends[eraIdx];
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
  iso8601: ISO8601,
  japanese: Japanese
  // To be filled in as builtin calendars are implemented
};

function GetBuiltinCalendar(id) {
  if (!(id in BUILTIN_CALENDARS)) throw new RangeError(`unknown calendar ${id}`);
  return new BUILTIN_CALENDARS[id]();
}
export function GetDefaultCalendar() {
  return GetBuiltinCalendar('iso8601');
}
