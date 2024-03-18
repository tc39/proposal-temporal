// Generates 1000 valid ISO 8601 strings according to the EBNF grammar and
// tries to parse them

// Run with:
// node test/validStrings.mjs

import assert from 'assert';
import * as ES from '../lib/ecmascript.mjs';

const timezoneNames = Intl.supportedValuesOf('timeZone');
const calendarNames = Intl.supportedValuesOf('calendar');

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

// Return a productionLike that defers to another productionLike for generation
// but filters out any result that a validator function
// rejects with SyntaxError.
function withSyntaxConstraints(productionLike, validatorFunc) {
  return { generate: filtered };

  function filtered(data) {
    let dataClone = { ...data };
    let result = productionLike.generate(dataClone);
    try {
      validatorFunc(result, dataClone);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // Generated result violated a constraint; try again
        // (but allow crashing if the call stack gets too deep).
        return filtered(data);
      } else {
        // Propagate any other error.
        throw e;
      }
    }

    // Copy properties that were modified on the cloned input data.
    for (let key of Reflect.ownKeys(dataClone)) {
      data[key] = dataClone[key];
    }

    return result;
  }
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
function lcalpha() {
  return new CharacterClass('abcdefghijklmnopqrstuvwxyz');
}
function alpha() {
  return new CharacterClass('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
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
function zeroOrMore(production) {
  return new ZeroOrMore(production);
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
const temporalSign = character('+-−');
const hour = zeroPaddedInclusive(0, 23, 2);
const minuteSecond = zeroPaddedInclusive(0, 59, 2);
const temporalDecimalSeparator = character('.,');
const daysDesignator = character('Dd');
const hoursDesignator = character('Hh');
const minutesDesignator = character('Mm');
const monthsDesignator = character('Mm');
const durationDesignator = character('Pp');
const secondsDesignator = character('Ss');
const dateTimeSeparator = character(' Tt');
const timeDesignator = character('Tt');
const weeksDesignator = character('Ww');
const yearsDesignator = character('Yy');
const utcDesignator = withCode(character('Zz'), (data) => {
  data.z = true;
});
const annotationCriticalFlag = character('!');
const temporalDecimalFraction = seq(temporalDecimalSeparator, between(1, 9, digit()));

const dateFourDigitYear = repeat(4, digit());

const dateExtendedYear = withSyntaxConstraints(seq(temporalSign, repeat(6, digit())), (result) => {
  if (result === '-000000' || result === '−000000') {
    throw new SyntaxError('Negative zero extended year');
  }
});
const dateYear = withCode(
  choice(dateFourDigitYear, dateExtendedYear),
  (data, result) => (data.year = +result.replace('\u2212', '-'))
);
const dateMonth = withCode(zeroPaddedInclusive(1, 12, 2), (data, result) => (data.month = +result));
const dateDay = withCode(zeroPaddedInclusive(1, 31, 2), (data, result) => (data.day = +result));

function saveHour(data, result) {
  data.hour = +result;
}
function saveMinute(data, result) {
  data.minute = +result;
}
function saveSecond(data, result) {
  data.second = +result;
  if (data.second === 60) data.second = 59;
}
const timeHour = withCode(hour, saveHour);
const timeMinute = withCode(minuteSecond, saveMinute);
const timeSecond = withCode(choice(minuteSecond, '60'), saveSecond);
const timeFraction = withCode(temporalDecimalFraction, (data, result) => {
  result = result.slice(1);
  const fraction = result.padEnd(9, '0');
  data.millisecond = +fraction.slice(0, 3);
  data.microsecond = +fraction.slice(3, 6);
  data.nanosecond = +fraction.slice(6, 9);
});
function saveOffset(data, result) {
  data.offset = ES.ParseDateTimeUTCOffset(result);
}
const utcOffsetSubMinutePrecision = withCode(
  seq(
    temporalSign,
    hour,
    choice(
      [minuteSecond, [minuteSecond, [temporalDecimalFraction]]],
      seq(':', minuteSecond, [':', minuteSecond, [temporalDecimalFraction]])
    )
  ),
  saveOffset
);
const dateTimeUTCOffset = choice(utcDesignator, utcOffsetSubMinutePrecision);
const timeZoneUTCOffsetName = seq(temporalSign, hour, choice([minuteSecond], seq(':', minuteSecond)));
const timeZoneIANAName = choice(...timezoneNames);
const timeZoneIdentifier = withCode(
  choice(timeZoneUTCOffsetName, timeZoneIANAName),
  (data, result) => (data.tzAnnotation = result)
);
const timeZoneAnnotation = seq('[', [annotationCriticalFlag], timeZoneIdentifier, ']');
const aKeyLeadingChar = choice(lcalpha(), character('_'));
const aKeyChar = choice(lcalpha(), digit(), character('_-'));
const aValChar = choice(alpha(), digit());
const annotationKey = seq(aKeyLeadingChar, zeroOrMore(aKeyChar));
const annotationValueComponent = oneOrMore(aValChar);
const annotationValue = seq(annotationValueComponent, zeroOrMore(seq('-', annotationValueComponent)));
const annotation = seq('[', /*[annotationCriticalFlag],*/ annotationKey, '=', annotationValue, ']');
const calendarName = withCode(choice(...calendarNames), (data, result) => {
  if (!data.calendar) data.calendar = result;
});
const calendarAnnotation = seq('[', [annotationCriticalFlag], 'u-ca=', calendarName, ']');
const annotations = withSyntaxConstraints(oneOrMore(choice(calendarAnnotation, annotation)), (result) => {
  const numCalendarAnnotations = (result.match(/u-ca=/g) ?? []).length;
  if (numCalendarAnnotations > 1 && /\[!u-ca=/.test(result)) {
    throw new SyntaxError('more than one calendar annotation and at least one critical');
  }
});
const timeSpec = seq(
  timeHour,
  choice([':', timeMinute, [':', timeSecond, [timeFraction]]], seq(timeMinute, [timeSecond, [timeFraction]]))
);
const timeSpecWithOptionalOffsetNotAmbiguous = withSyntaxConstraints(seq(timeSpec, [dateTimeUTCOffset]), (result) => {
  if (/^(?:(?!02-?30)(?:0[1-9]|1[012])-?(?:0[1-9]|[12][0-9]|30)|(?:0[13578]|10|12)-?31)$/.test(result)) {
    throw new SyntaxError('valid PlainMonthDay');
  }
  if (/^(?![−-]000000)(?:[0-9]{4}|[+−-][0-9]{6})-?(?:0[1-9]|1[012])$/.test(result)) {
    throw new SyntaxError('valid PlainYearMonth');
  }
});

function validateDayOfMonth(result, { year, month, day }) {
  if (day > ES.ISODaysInMonth(year, month)) throw SyntaxError('retry if bad day of month');
}
const dateSpecMonthDay = withSyntaxConstraints(seq(['--'], dateMonth, ['-'], dateDay), validateDayOfMonth);
const dateSpecYearMonth = seq(dateYear, ['-'], dateMonth);
const date = withSyntaxConstraints(
  choice(seq(dateYear, '-', dateMonth, '-', dateDay), seq(dateYear, dateMonth, dateDay)),
  validateDayOfMonth
);
const dateTime = seq(date, [dateTimeSeparator, timeSpec, [dateTimeUTCOffset]]);
const annotatedTime = choice(
  seq(timeDesignator, timeSpec, [dateTimeUTCOffset], [timeZoneAnnotation], [annotations]),
  seq(timeSpecWithOptionalOffsetNotAmbiguous, [timeZoneAnnotation], [annotations])
);
const annotatedDateTime = seq(dateTime, [timeZoneAnnotation], [annotations]);
const annotatedDateTimeTimeRequired = seq(
  date,
  dateTimeSeparator,
  timeSpec,
  [dateTimeUTCOffset],
  [timeZoneAnnotation],
  [annotations]
);
const annotatedYearMonth = withSyntaxConstraints(
  seq(dateSpecYearMonth, [timeZoneAnnotation], [annotations]),
  (result, data) => {
    if (data.calendar !== undefined && data.calendar !== 'iso8601') {
      throw new SyntaxError('retry if YYYY-MM with non-ISO calendar');
    }
  }
);
const annotatedMonthDay = withSyntaxConstraints(
  seq(dateSpecMonthDay, [timeZoneAnnotation], [annotations]),
  (result, data) => {
    if (data.calendar !== undefined && data.calendar !== 'iso8601') {
      throw new SyntaxError('retry if MM-DD with non-ISO calendar');
    }
  }
);

const durationSecondsFraction = withCode(temporalDecimalFraction, (data, result) => {
  result = result.slice(1);
  const fraction = result.padEnd(9, '0');
  data.milliseconds = +fraction.slice(0, 3) * data.factor;
  data.microseconds = +fraction.slice(3, 6) * data.factor;
  data.nanoseconds = +fraction.slice(6, 9) * data.factor;
});
const durationMinutesFraction = withCode(temporalDecimalFraction, (data, result) => {
  result = result.slice(1);
  const ns = +result.padEnd(9, '0') * 60;
  data.seconds = Math.trunc(ns / 1e9) * data.factor;
  data.milliseconds = Math.trunc((ns % 1e9) / 1e6) * data.factor;
  data.microseconds = Math.trunc((ns % 1e6) / 1e3) * data.factor;
  data.nanoseconds = Math.trunc(ns % 1e3) * data.factor;
});
const durationHoursFraction = withCode(temporalDecimalFraction, (data, result) => {
  result = result.slice(1);
  const ns = +result.padEnd(9, '0') * 3600;
  data.minutes = Math.trunc(ns / 6e10) * data.factor;
  data.seconds = Math.trunc((ns % 6e10) / 1e9) * data.factor;
  data.milliseconds = Math.trunc((ns % 1e9) / 1e6) * data.factor;
  data.microseconds = Math.trunc((ns % 1e6) / 1e3) * data.factor;
  data.nanoseconds = Math.trunc(ns % 1e3) * data.factor;
});

const uint32Digits = withSyntaxConstraints(between(1, 10, digit()), (result) => {
  if (+result >= 2 ** 32) throw new SyntaxError('try again for an uint32');
});
const timeDurationDigits = (factor) =>
  withSyntaxConstraints(between(1, 16, digit()), (result) => {
    if (!Number.isSafeInteger(+result * factor)) throw new SyntaxError('try again on unsafe integer');
  });
const durationSeconds = seq(
  withCode(timeDurationDigits(1), (data, result) => (data.seconds = +result * data.factor)),
  [durationSecondsFraction],
  secondsDesignator
);
const durationMinutes = seq(
  withCode(timeDurationDigits(60), (data, result) => (data.minutes = +result * data.factor)),
  choice(seq(minutesDesignator, [durationSeconds]), seq(durationMinutesFraction, minutesDesignator))
);
const durationHours = seq(
  withCode(timeDurationDigits(3600), (data, result) => (data.hours = +result * data.factor)),
  choice(seq(hoursDesignator, [choice(durationMinutes, durationSeconds)]), seq(durationHoursFraction, hoursDesignator))
);
const durationTime = seq(timeDesignator, choice(durationHours, durationMinutes, durationSeconds));
const durationDays = seq(
  withCode(timeDurationDigits(86400), (data, result) => (data.days = +result * data.factor)),
  daysDesignator
);
const durationWeeks = seq(
  withCode(uint32Digits, (data, result) => (data.weeks = +result * data.factor)),
  weeksDesignator,
  [durationDays]
);
const durationMonths = seq(
  withCode(uint32Digits, (data, result) => (data.months = +result * data.factor)),
  monthsDesignator,
  [choice(durationWeeks, durationDays)]
);
const durationYears = seq(
  withCode(uint32Digits, (data, result) => (data.years = +result * data.factor)),
  yearsDesignator,
  [choice(durationMonths, durationWeeks, durationDays)]
);
const durationDate = seq(choice(durationYears, durationMonths, durationWeeks, durationDays), [durationTime]);
const duration = withSyntaxConstraints(
  seq(
    withCode([temporalSign], (data, result) => (data.factor = result === '-' || result === '\u2212' ? -1 : 1)),
    durationDesignator,
    choice(durationDate, durationTime)
  ),
  (_, data) => {
    try {
      ES.RejectDuration(
        data.years ?? 0,
        data.months ?? 0,
        data.weeks ?? 0,
        data.days ?? 0,
        data.hours ?? 0,
        data.minutes ?? 0,
        data.seconds ?? 0,
        data.milliseconds ?? 0,
        data.microseconds ?? 0,
        data.nanoseconds ?? 0
      );
    } catch (e) {
      if (e instanceof RangeError) throw new SyntaxError('duration too large, try again');
      throw e;
    }
  }
);

const instant = seq(date, dateTimeSeparator, timeSpec, dateTimeUTCOffset, [timeZoneAnnotation], [annotations]);
const zonedDateTime = seq(dateTime, timeZoneAnnotation, [annotations]);

// goal elements
const goals = {
  Instant: instant,
  Date: annotatedDateTime,
  DateTime: annotatedDateTime,
  Duration: duration,
  MonthDay: choice(annotatedMonthDay, annotatedDateTime),
  Time: choice(annotatedTime, annotatedDateTimeTimeRequired),
  TimeZone: choice(timeZoneIdentifier, zonedDateTime, instant),
  YearMonth: choice(annotatedYearMonth, annotatedDateTime),
  ZonedDateTime: zonedDateTime
};

const dateItems = ['year', 'month', 'day'];
const timeItems = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];
const comparisonItems = {
  Instant: [...dateItems, ...timeItems, 'offset', 'z'],
  Date: [...dateItems, 'calendar'],
  DateTime: [...dateItems, ...timeItems, 'calendar'],
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
  MonthDay: ['month', 'day', 'calendar'],
  Time: [...timeItems],
  TimeZone: ['offset', 'tzAnnotation', 'z'],
  YearMonth: ['year', 'month', 'calendar'],
  ZonedDateTime: [...dateItems, ...timeItems, 'offset', 'z', 'tzAnnotation', 'calendar']
};
const plainModes = ['Date', 'DateTime', 'MonthDay', 'Time', 'YearMonth'];

function fuzzMode(mode) {
  console.log('// starting to fuzz ' + mode);
  for (let count = 0; count < 1000; count++) {
    let generatedData, fuzzed;
    do {
      generatedData = {};
      fuzzed = goals[mode].generate(generatedData);
    } while (plainModes.includes(mode) && /[0-9][zZ]/.test(fuzzed));
    try {
      const parsingMethod = ES[`ParseTemporal${mode}StringRaw`] ?? ES[`ParseTemporal${mode}String`];
      const parsed = parsingMethod(fuzzed);
      for (let prop of comparisonItems[mode]) {
        let expected = generatedData[prop];
        if (!['tzAnnotation', 'offset', 'calendar'].includes(prop)) expected ??= prop === 'z' ? false : 0;
        if (prop === 'offset') {
          const parsedResult = parsed[prop] === undefined ? undefined : ES.ParseDateTimeUTCOffset(parsed[prop]);
          assert.equal(parsedResult, expected, prop);
        } else {
          assert.equal(parsed[prop], expected, prop);
        }
      }
      console.log(`${fuzzed} => ok`);
    } catch (e) {
      if (e instanceof assert.AssertionError) {
        console.log(`${fuzzed} => ${e.message} parsed wrong: expected`, e.expected, 'actual', e.actual);
        console.log('generated data:', generatedData);
      } else {
        console.log(`${fuzzed} failed!`, e);
      }
      return 0;
    }
  }
  console.log('// done fuzzing ' + mode);
  return 1;
}

process.exit(Object.keys(goals).every(fuzzMode) ? 0 : 1);
