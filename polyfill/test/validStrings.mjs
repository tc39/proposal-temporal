// Generates 1000 valid ISO 8601 strings according to the EBNF grammar and
// tries to parse them

// Run with:
// node --experimental-modules --no-warnings --icu-data-dir \
//    ./node_modules/full-icu/ test/validStrings.mjs

import assert from 'assert';
import { ES } from '../lib/ecmascript.mjs';
import timezoneData from 'timezones.json';

const timezoneNames = new Set(timezoneData.reduce((list, entry) => list.concat(entry.utc), []));
// Remove names that are not recognized by Node (which is sourced from CLDR)
const bad = ['Antarctica/McMurdo', 'CST6CDT', 'EST5EDT', 'MST7MDT', 'PST8PDT'];
bad.forEach((name) => timezoneNames.delete(name));

const calendarNames = [
  'buddhist',
  'chinese',
  'coptic',
  'dangi',
  'ethioaa',
  'ethiopic',
  'gregory',
  'hebrew',
  'indian',
  'islamic',
  'islamic-umalqura',
  'islamic-tbla',
  'islamic-civil',
  'islamic-rgsa',
  'iso8601',
  'japanese',
  'persian',
  'roc',
  'islamicc'
];

function toProduction(productionLike) {
  if (typeof productionLike === 'string') return new Literal(productionLike);
  if (Array.isArray(productionLike)) {
    if (productionLike.length === 1) return new Optional(productionLike[0]);
    return new Optional(seq(...productionLike));
  }
  return productionLike;
}

class FromFunction {
  constructor(func, productionLike = null) {
    this.func = func;
    if (productionLike) this.production = toProduction(productionLike);
  }
  generate(data) {
    if (this.production) {
      const result = this.production.generate(data);
      this.func(data, result);
      return result;
    }
    return this.func(data);
  }
}
function withCode(productionLike, func) {
  return new FromFunction(func, productionLike);
}

class Literal {
  constructor(str) {
    this.str = str;
  }
  generate() {
    return this.str;
  }
}

class Optional {
  constructor(productionLike) {
    this.production = toProduction(productionLike);
  }
  generate(data) {
    return Math.random() >= 0.5 ? this.production.generate(data) : '';
  }
}

class Choice {
  constructor(...options) {
    this.options = options.reduce((acc, production) => {
      production = toProduction(production);
      // collapse nested Choices
      if (production instanceof Choice) return acc.concat(production.options);
      return acc.concat([production]);
    }, []);
  }
  generate(data) {
    return this.options[Math.floor(Math.random() * this.options.length)].generate(data);
  }
}
function choice(...options) {
  return new Choice(...options);
}
function zeroPaddedInclusive(start, end, len) {
  const range = new Array(end - start + 1).fill().map((_, ix) => ix + start);
  const padded = range.map((num) => new Literal(`${num}`.padStart(len, '0')));
  return new Choice(...padded);
}

class CharacterClass extends Choice {
  constructor(codePoints) {
    super(...[...codePoints].map((l) => new Literal(l)));
  }
}
function character(str) {
  return new CharacterClass(str);
}
function digit() {
  return new CharacterClass('0123456789');
}

class Repeat {
  constructor(n, productionLike) {
    this.n = n;
    this.production = toProduction(productionLike);
  }
  generate(data) {
    let retval = '';
    for (let count = 0; count < this.n; count++) {
      retval += this.production.generate(data);
    }
    return retval;
  }
}
function repeat(n, production) {
  return new Repeat(n, production);
}

class ZeroOrMore {
  constructor(productionLike, max = 500) {
    this.production = toProduction(productionLike);
    this.max = max;
  }
  generate(data) {
    let retval = '';
    let num = Math.floor(Math.exp(1 / (2 * Math.sqrt(Math.random()))) - 1);
    if (this.max > -1) num = Math.min(num, this.max);
    for (let count = 0; count < num; count++) {
      retval += this.production.generate(data);
    }
    return retval;
  }
}
function oneOrMore(production) {
  return seq(production, new ZeroOrMore(production));
}
function between(min, max, production) {
  return seq(repeat(min, production), new ZeroOrMore(production, max - min));
}

class Sequence {
  constructor(...productions) {
    this.productions = productions.reduce((acc, production) => {
      production = toProduction(production);
      // collapse nested Sequences
      if (production instanceof Sequence) return acc.concat(production.productions);
      return acc.concat([production]);
    }, []);
  }
  generate(data) {
    return this.productions.map((p) => p.generate(data)).join('');
  }
}
function seq(...productions) {
  return new Sequence(...productions);
}

// Grammar productions, based on the grammar in RFC 3339

// characters
const sign = character('+-−');
const hour = zeroPaddedInclusive(0, 23, 2);
const minuteSecond = zeroPaddedInclusive(0, 59, 2);
const decimalSeparator = character('.,');
const daysDesignator = character('Dd');
const hoursDesignator = character('Hh');
const minutesDesignator = character('Mm');
const monthsDesignator = character('Mm');
const durationDesignator = character('Pp');
const secondsDesignator = character('Ss');
const dateTimeSeparator = character(' Tt');
const durationTimeDesignator = character('Tt');
const weeksDesignator = character('Ww');
const yearsDesignator = character('Yy');
const utcDesignator = withCode(character('Zz'), (data) => {
  data.z = 'Z';
  data.offset = '+00:00';
});
const timeFractionalPart = between(1, 9, digit());
const fraction = seq(decimalSeparator, timeFractionalPart);

const dateFourDigitYear = repeat(4, digit());
const dateExtendedYear = seq(sign, repeat(6, digit()));
const dateYear = withCode(
  choice(dateFourDigitYear, dateExtendedYear),
  (data, result) => (data.year = +result.replace('\u2212', '-'))
);
const dateMonth = withCode(zeroPaddedInclusive(1, 12, 2), (data, result) => (data.month = +result));
const dateDay = withCode(zeroPaddedInclusive(1, 31, 2), (data, result) => (data.day = +result));

const timeHour = withCode(hour, (data, result) => (data.hour = +result));
const timeMinute = withCode(minuteSecond, (data, result) => (data.minute = +result));
const timeSecond = withCode(choice(minuteSecond, '60'), (data, result) => {
  data.second = +result;
  if (data.second === 60) data.second = 59;
});
const timeFraction = withCode(fraction, (data, result) => {
  result = result.slice(1);
  const fraction = result.padEnd(9, '0');
  data.millisecond = +fraction.slice(0, 3);
  data.microsecond = +fraction.slice(3, 6);
  data.nanosecond = +fraction.slice(6, 9);
});
const timeZoneUTCOffsetSign = withCode(
  sign,
  (data, result) => (data.offsetSign = result === '-' || result === '\u2212' ? '-' : '+')
);
const timeZoneUTCOffsetHour = withCode(hour, (data, result) => (data.offsetHour = +result));
const timeZoneUTCOffsetMinute = withCode(minuteSecond, (data, result) => (data.offsetMinute = +result));
const timeZoneUTCOffsetSecond = withCode(minuteSecond, (data, result) => (data.offsetSecond = +result));
const timeZoneUTCOffsetFraction = withCode(fraction, (data, result) => {
  result = result.slice(1);
  const fraction = result.padEnd(9, '0');
  data.offsetFraction = +fraction;
});
const timeZoneNumericUTCOffset = withCode(
  seq(
    timeZoneUTCOffsetSign,
    timeZoneUTCOffsetHour,
    choice(
      [timeZoneUTCOffsetMinute, [timeZoneUTCOffsetSecond, [timeZoneUTCOffsetFraction]]],
      seq(':', timeZoneUTCOffsetMinute, [':', timeZoneUTCOffsetSecond, [timeZoneUTCOffsetFraction]])
    )
  ),
  (data) => {
    if (data.offsetSign !== undefined && data.offsetHour !== undefined) {
      const h = `${data.offsetHour}`.padStart(2, '0');
      const m = `${data.offsetMinute || 0}`.padStart(2, '0');
      const s = `${data.offsetSecond || 0}`.padStart(2, '0');
      data.offset = `${data.offsetSign}${h}:${m}`;
      if (data.offsetFraction) {
        let fraction = `${data.offsetFraction}`.padStart(9, '0');
        while (fraction.endsWith('0')) fraction = fraction.slice(0, -1);
        data.offset += `:${s}.${fraction}`;
      } else if (data.offsetSecond) {
        data.offset += `:${s}`;
      }
      if (data.offset === '-00:00') data.offset = '+00:00';
    }
  }
);
const timeZoneUTCOffset = choice(utcDesignator, timeZoneNumericUTCOffset);
const timeZoneUTCOffsetName = seq(
  sign,
  hour,
  choice([minuteSecond, [minuteSecond, [fraction]]], seq(':', minuteSecond, [':', minuteSecond, [fraction]]))
);
const timeZoneBracketedName = withCode(
  choice(timeZoneUTCOffsetName, ...timezoneNames),
  (data, result) => (data.ianaName = ES.GetCanonicalTimeZoneIdentifier(result).toString())
);
const timeZoneBracketedAnnotation = seq('[', timeZoneBracketedName, ']');
const timeZoneIANAName = withCode(
  choice(...timezoneNames),
  (data, result) => (data.ianaName = ES.GetCanonicalTimeZoneIdentifier(result).toString())
);
const timeZone = withCode(
  choice(timeZoneUTCOffset, seq([timeZoneNumericUTCOffset], timeZoneBracketedAnnotation)),
  (data) => {
    if (!('offset' in data)) data.offset = undefined;
  }
);
const timeZoneOffsetRequired = withCode(
  choice(utcDesignator, seq(timeZoneNumericUTCOffset, [timeZoneBracketedAnnotation])),
  (data) => {
    if (!('offset' in data)) data.offset = undefined;
  }
);
const temporalTimeZoneIdentifier = withCode(choice(timeZoneNumericUTCOffset, timeZoneIANAName), (data) => {
  if (!('offset' in data)) data.offset = undefined;
});
const calendarName = withCode(choice(...calendarNames), (data, result) => (data.calendar = result));
const calendar = seq('[u-ca=', calendarName, ']');
const timeSpec = seq(
  timeHour,
  choice([':', timeMinute, [':', timeSecond, [timeFraction]]], seq(timeMinute, [timeSecond, [timeFraction]]))
);

const dateSpecMonthDay = seq(['--'], dateMonth, ['-'], dateDay);
const dateSpecYearMonth = seq(dateYear, ['-'], dateMonth);
const date = choice(seq(dateYear, '-', dateMonth, '-', dateDay), seq(dateYear, dateMonth, dateDay));
const time = seq(timeSpec, [timeZone]);
const dateTime = seq(date, [seq(dateTimeSeparator, timeSpec)], [timeZone]);
const calendarDateTime = seq(dateTime, [calendar]);

const durationFractionalPart = withCode(between(1, 9, digit()), (data, result) => {
  const fraction = result.padEnd(9, '0');
  data.milliseconds = +fraction.slice(0, 3) * data.factor;
  data.microseconds = +fraction.slice(3, 6) * data.factor;
  data.nanoseconds = +fraction.slice(6, 9) * data.factor;
});
const durationFraction = seq(decimalSeparator, durationFractionalPart);
const durationSeconds = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.seconds = +result * data.factor)),
  [durationFraction],
  secondsDesignator
);
const durationMinutes = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.minutes = +result * data.factor)),
  minutesDesignator,
  [durationSeconds]
);
const durationHours = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.hours = +result * data.factor)),
  hoursDesignator,
  [durationMinutes]
);
const durationTime = seq(durationTimeDesignator, choice(durationHours, durationMinutes, durationSeconds));
const durationDays = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.days = +result * data.factor)),
  daysDesignator
);
const durationWeeks = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.weeks = +result * data.factor)),
  weeksDesignator,
  [durationDays]
);
const durationMonths = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.months = +result * data.factor)),
  monthsDesignator,
  [durationWeeks]
);
const durationYears = seq(
  withCode(oneOrMore(digit()), (data, result) => (data.years = +result * data.factor)),
  yearsDesignator,
  [durationMonths]
);
const durationDate = seq(choice(durationYears, durationMonths, durationWeeks, durationDays), [durationTime]);
const duration = seq(
  withCode([sign], (data, result) => (data.factor = result === '-' || result === '\u2212' ? -1 : 1)),
  durationDesignator,
  choice(durationDate, durationTime)
);

const instant = seq(date, [seq(dateTimeSeparator, timeSpec)], timeZoneOffsetRequired);
const zonedDateTime = seq(
  date,
  seq([dateTimeSeparator, timeSpec]),
  [timeZoneNumericUTCOffset],
  timeZoneBracketedAnnotation,
  [calendar]
);

// goal elements
const goals = {
  Instant: instant,
  Date: calendarDateTime,
  DateTime: calendarDateTime,
  Duration: duration,
  MonthDay: choice(dateSpecMonthDay, dateTime),
  Time: choice(time, dateTime),
  TimeZone: choice(temporalTimeZoneIdentifier, instant),
  YearMonth: choice(dateSpecYearMonth, dateTime),
  ZonedDateTime: zonedDateTime
};

const dateItems = ['year', 'month', 'day'];
const timeItems = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];
const comparisonItems = {
  Instant: [...dateItems, ...timeItems, 'offset'],
  Date: [...dateItems, 'calendar'],
  DateTime: [...dateItems, ...timeItems],
  Duration: [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
    'microseconds',
    'nanoseconds'
  ],
  MonthDay: ['month', 'day'],
  Time: timeItems,
  TimeZone: ['offset', 'ianaName'],
  YearMonth: ['year', 'month'],
  ZonedDateTime: [...dateItems, ...timeItems, 'offset', 'ianaName', 'calendar']
};

const mode = 'Instant';

for (let count = 0; count < 1000; count++) {
  const generatedData = {};
  const fuzzed = goals[mode].generate(generatedData);
  try {
    const parsed = ES[`ParseTemporal${mode}String`](fuzzed);
    for (let prop of comparisonItems[mode]) {
      let expected = generatedData[prop];
      if (prop !== 'ianaName' && prop !== 'offset' && prop !== 'calendar') expected = expected || 0;
      assert.equal(parsed[prop], expected);
    }
    console.log(`${fuzzed} => ok`);
  } catch (e) {
    if (e instanceof assert.AssertionError) {
      console.log(`${fuzzed} => parsed wrong: expected`, e.expected, 'actual', e.actual);
      console.log('generated data:', generatedData);
    } else {
      console.log(`${fuzzed} failed!`, e);
    }
    break;
  }
}
