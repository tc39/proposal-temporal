/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import { CALENDAR_ID, ISO_YEAR, ISO_MONTH, ISO_DAY, CreateSlots, GetSlot, HasSlot, SetSlot } from './slots.mjs';

const ArrayIncludes = Array.prototype.includes;
const ObjectAssign = Object.assign;

const BUILTIN_CALENDAR_IDS = ['gregory', 'iso8601', 'japanese'];
const impl = {};

export class Calendar {
  constructor(id) {
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
    return ES.CalendarToString(this);
  }
  dateFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { year, month, day } = impl[GetSlot(this, CALENDAR_ID)].dateFromFields(fields, overflow);
    return new constructor(year, month, day, this);
  }
  yearMonthFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { year, month } = impl[GetSlot(this, CALENDAR_ID)].yearMonthFromFields(fields, overflow);
    return new constructor(year, month, this, /* referenceISODay = */ 1);
  }
  monthDayFromFields(fields, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    if (ES.Type(fields) !== 'Object') throw new TypeError('invalid fields');
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { month, day } = impl[GetSlot(this, CALENDAR_ID)].monthDayFromFields(fields, overflow);
    return new constructor(month, day, this, /* referenceISOYear = */ 1972);
  }
  fields(fields) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    fields = ES.CreateListFromArrayLike(fields, ['String']);
    return impl[GetSlot(this, CALENDAR_ID)].fields(fields);
  }
  dateAdd(date, duration, options, constructor) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    duration = ES.ToTemporalDuration(duration, GetIntrinsic('%Temporal.Duration%'));
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const { year, month, day } = impl[GetSlot(this, CALENDAR_ID)].dateAdd(date, duration, overflow);
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
    const { years, months, weeks, days } = impl[GetSlot(this, CALENDAR_ID)].dateUntil(one, two, largestUnit);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  year(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].year(date);
  }
  month(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].month(date);
  }
  day(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].day(date);
  }
  era(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].era(date);
  }
  dayOfWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].dayOfWeek(date);
  }
  dayOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].dayOfYear(date);
  }
  weekOfYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].weekOfYear(date);
  }
  daysInWeek(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].daysInWeek(date);
  }
  daysInMonth(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].daysInMonth(date);
  }
  daysInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].daysInYear(date);
  }
  monthsInYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].monthsInYear(date);
  }
  inLeapYear(date) {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return impl[GetSlot(this, CALENDAR_ID)].inLeapYear(date);
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
    if (IsBuiltinCalendar(stringIdent)) return new Calendar(stringIdent);
    let calendar;
    try {
      ({ calendar } = ES.ParseISODateTime(stringIdent, { zoneRequired: false }));
    } catch {
      throw new RangeError(`Invalid calendar: ${stringIdent}`);
    }
    if (!calendar) calendar = 'iso8601';
    return new Calendar(calendar);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
DefineIntrinsic('Temporal.Calendar.from', Calendar.from);
DefineIntrinsic('Temporal.Calendar.prototype.fields', Calendar.prototype.fields);
DefineIntrinsic('Temporal.Calendar.prototype.toString', Calendar.prototype.toString);

impl['iso8601'] = {
  dateFromFields(fields, overflow) {
    const { year, month, day } = ES.ToRecord(fields, [['day'], ['month'], ['year']]);
    return ES.RegulateDate(year, month, day, overflow);
  },
  yearMonthFromFields(fields, overflow) {
    const { year, month } = ES.ToRecord(fields, [['month'], ['year']]);
    return ES.RegulateYearMonth(year, month, overflow);
  },
  monthDayFromFields(fields, overflow) {
    const { month, day } = ES.ToRecord(fields, [['day'], ['month']]);
    return ES.RegulateMonthDay(month, day, overflow);
  },
  fields(fields) {
    return fields;
  },
  dateAdd(date, duration, overflow) {
    const { years, months, weeks, days } = duration;
    const year = GetSlot(date, ISO_YEAR);
    const month = GetSlot(date, ISO_MONTH);
    const day = GetSlot(date, ISO_DAY);
    return ES.AddDate(year, month, day, years, months, weeks, days, overflow);
  },
  dateUntil(one, two, largestUnit) {
    return ES.DifferenceDate(
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
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_YEAR);
  },
  month(date) {
    if (!HasSlot(date, ISO_MONTH)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_MONTH);
  },
  day(date) {
    if (!HasSlot(date, ISO_DAY)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_DAY);
  },
  era(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.Date%'));
    return undefined;
  },
  dayOfWeek(date) {
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.DayOfWeek(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  dayOfYear(date) {
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.DayOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  weekOfYear(date) {
    date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.WeekOfYear(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH), GetSlot(date, ISO_DAY));
  },
  daysInWeek(date) {
    ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return 7;
  },
  daysInMonth(date) {
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    return ES.DaysInMonth(GetSlot(date, ISO_YEAR), GetSlot(date, ISO_MONTH));
  },
  daysInYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.LeapYear(GetSlot(date, ISO_YEAR)) ? 366 : 365;
  },
  monthsInYear(date) {
    if (!HasSlot(date, ISO_YEAR)) ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return 12;
  },
  inLeapYear(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return ES.LeapYear(GetSlot(date, ISO_YEAR));
  }
};

// Note: other built-in calendars than iso8601 are not part of the Temporal
// proposal for ECMA-262. These calendars will be standardized as part of
// ECMA-402.

// Implementation details for Gregorian calendar
const gre = {
  isoYear(year, era) {
    return era === 'bc' ? -(year - 1) : year;
  }
};

// 'iso8601' calendar is equivalent to 'gregory' except for ISO 8601 week
// numbering rules, which we do not currently use in Temporal, and the addition
// of BC/AD eras which means no negative years or year 0.
impl['gregory'] = ObjectAssign({}, impl['iso8601'], {
  era(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    return GetSlot(date, ISO_YEAR) < 1 ? 'bc' : 'ad';
  },
  year(date) {
    if (!HasSlot(date, ISO_YEAR)) date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    const isoYear = GetSlot(date, ISO_YEAR);
    return isoYear < 1 ? -isoYear + 1 : isoYear;
  },

  fields(fields) {
    if (fields.includes('year')) fields.push('era');
    return fields;
  },

  dateFromFields(fields, overflow) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['day'], ['era', 'ad'], ['month'], ['year']]);
    const isoYear = gre.isoYear(fields.year, fields.era);
    return impl['iso8601'].dateFromFields({ ...fields, year: isoYear }, overflow);
  },
  yearMonthFromFields(fields, overflow) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['era', 'ad'], ['month'], ['year']]);
    const isoYear = gre.isoYear(fields.year, fields.era);
    return impl['iso8601'].yearMonthFromFields({ ...fields, year: isoYear }, overflow);
  }
});

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

impl['japanese'] = ObjectAssign({}, impl['iso8601'], {
  era(date) {
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH) || !HasSlot(date, ISO_DAY)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    return jpn.eraNames[jpn.findEra(date)];
  },
  year(date) {
    if (!HasSlot(date, ISO_YEAR) || !HasSlot(date, ISO_MONTH) || !HasSlot(date, ISO_DAY)) {
      date = ES.ToTemporalDate(date, GetIntrinsic('%Temporal.PlainDate%'));
    }
    const eraIdx = jpn.findEra(date);
    return GetSlot(date, ISO_YEAR) - jpn.eraAddends[eraIdx];
  },

  fields(fields) {
    if (fields.includes('year')) fields.push('era');
    return fields;
  },

  dateFromFields(fields, overflow) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['day'], ['era'], ['month'], ['year']]);
    const isoYear = jpn.isoYear(fields.year, fields.era);
    return impl['iso8601'].dateFromFields({ ...fields, year: isoYear }, overflow);
  },
  yearMonthFromFields(fields, overflow) {
    // Intentionally alphabetical
    fields = ES.ToRecord(fields, [['era'], ['month'], ['year']]);
    const isoYear = jpn.isoYear(fields.year, fields.era);
    return impl['iso8601'].yearMonthFromFields({ ...fields, year: isoYear }, overflow);
  }
});

function IsBuiltinCalendar(id) {
  return ArrayIncludes.call(BUILTIN_CALENDAR_IDS, id);
}
