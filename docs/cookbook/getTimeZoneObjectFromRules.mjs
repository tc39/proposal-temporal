import { strict as assert } from 'assert';

class RulesTimeZone extends Temporal.TimeZone {
  constructor(id) {
    if (!RulesTimeZone._zones || !RulesTimeZone._rules) {
      throw new Error('Must load time zone rules data before creating an instance');
    }
    super(id);
    if (!(id in RulesTimeZone._zones)) throw new RangeError(`unknown time zone identifier ${id}`);
    this._zoneRecord = RulesTimeZone._zones[id];
  }

  // Load TimeZone rules data //////////////////////////////////////////////////

  static MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  static WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  static _parseZoneLine(line) {
    let [stdoff, rules, format, ...until] = line.split(/\s+/);
    let sign = 1;
    if (stdoff.startsWith('-')) {
      sign = -1;
      stdoff = stdoff.slice(1);
    }
    let [hours, minutes, seconds = '0'] = stdoff.split(':');
    hours = +hours;
    minutes = +minutes;
    seconds = +seconds;
    let nanoseconds = 0;
    if (!Number.isInteger(seconds)) {
      const rounded = Math.floor(seconds);
      nanoseconds = (seconds - rounded) * 1e9;
      seconds = rounded;
    }
    stdoff = Temporal.Duration.from({ hours, minutes, seconds, nanoseconds }, { disambiguation: 'balance' });
    if (rules === '-') rules = null;
    if (until.length) {
      let [year, month = 'Jan', day = 1, time = ''] = until;
      year = +year;
      month = this.MONTHS.indexOf(month) + 1;
      day = +day;
      let [hour = 0, minute = 0, second = 0] = time.split(':');
      hour = +hour;
      minute = +minute;
      second = +second;
      until = Temporal.DateTime.from({ year, month, day, hour, minute, second });
    } else {
      until = null;
    }
    return { stdoff, sign, rules, format, until };
  }

  static load(data) {
    this._rules = {};
    this._zones = {};

    let activeZone = null;
    const lines = data.split('\n');
    for (let line of lines) {
      // Strip comments
      const commentIndex = line.indexOf('#');
      if (commentIndex > -1) line = line.slice(0, commentIndex);
      // Skip blanks
      line = line.trim();
      if (line.length === 0) continue;

      if (activeZone) {
        const result = this._parseZoneLine(line);
        this._zones[activeZone].push(result);
        if (!result.until) activeZone = null;
      } else if (line.startsWith('Zone')) {
        const [, name, ...rest] = line.split(/\s+/);
        if (!(name in this._zones)) this._zones[name] = [];
        const result = this._parseZoneLine(rest.join(' '));
        this._zones[name].push(result);
        if (result.until) activeZone = name; // following lines belong to this zone
      } else if (line.startsWith('Rule')) {
        let [, name, from, to, , month, day, time, save, letter] = line.split(/\s+/);
        if (!(name in this._rules)) this._rules[name] = [];
        from = +from;
        if (to === 'only') {
          to = from;
        } else if (to === 'max') {
          to = null;
        } else {
          to = +to;
        }
        month = this.MONTHS.indexOf(month) + 1;
        if (!Number.isNaN(+day)) day = +day;
        let timeZone = null; // default is wall-clock time
        if (time.endsWith('u')) {
          timeZone = Temporal.TimeZone.from('UTC');
          time = time.slice(0, -1);
        }
        // FIXME: handle 's' suffix for the time zone's standard time
        let [hour, minute] = time.split(':');
        hour = +hour;
        minute = +minute;
        time = Temporal.Time.from({ hour, minute });
        let [hours, minutes = 0] = save.split(':');
        hours = +hours;
        minutes = +minutes;
        save = Temporal.Duration.from({ hours, minutes });

        this._rules[name].push({ from, to, month, day, time, timeZone, save, letter });
      }
    }
  }

  // Helper functions //////////////////////////////////////////////////////////

  static _formatOffsetString(offset, sign) {
    const hours = `${offset.hours}`.padStart(2, '0');
    const minutes = `${offset.minutes}`.padStart(2, '0');
    return `${sign < 0 ? '-' : '+'}${hours}:${minutes}`;
  }

  static _offsetFromSignDurationAndSavings(sign, stdoff, save) {
    const offset = sign < 0 ? stdoff.plus(save) : stdoff.minus(save);
    return this._formatOffsetString(offset, sign);
  }

  static _getDSTRules(year, ruleSet) {
    const result = [];
    for (const { from, to, month, day, time, timeZone, save } of ruleSet) {
      if (year < from || year > to) continue;

      let transitionDate;
      if (day.startsWith('last')) {
        const weekday = this.WEEKDAYS.indexOf(day.slice(4)) + 1;
        const lastPossible = Temporal.Date.from({ year, month, day: 31 }, { disambiguation: 'constrain' });
        transitionDate = lastPossible.minus({ days: (7 + lastPossible.dayOfWeek - weekday) % 7 });
      } else if (day.includes('>=')) {
        const split = day.split('>=');
        const weekday = this.WEEKDAYS.indexOf(split[0]) + 1;
        const firstPossible = Temporal.Date.from({ year, month, day: +split[1] });
        transitionDate = firstPossible.plus({ days: (7 + weekday - firstPossible.dayOfWeek) % 7 });
      } else {
        transitionDate = Temporal.Date.from({ year, month, day });
      }

      const transitionDateTime = transitionDate.withTime(time); // FIXME use timeZone
      result.push({ transitionDateTime, save });
    }
    return result.sort((a, b) => Temporal.DateTime.compare(a.transitionDateTime, b.transitionDateTime));
  }

  // Private helper methods ////////////////////////////////////////////////////

  _getRuleSetInEffect(absolute) {
    for (const record of this._zoneRecord) {
      const { stdoff, sign, until } = record;
      if (until === null) return record; // last line

      const stateEndsUTC = sign < 0 ? until.minus(stdoff) : until.plus(stdoff);
      const stateEndsAbsolute = stateEndsUTC.inTimeZone('UTC');

      if (Temporal.Absolute.compare(absolute, stateEndsAbsolute) <= 0) return record;
    }
  }

  // Implementations of TimeZone protocol //////////////////////////////////////

  getOffsetFor(absolute) {
    const { stdoff, sign, rules: ruleSetID } = this._getRuleSetInEffect(absolute);
    const offsetString = RulesTimeZone._formatOffsetString(stdoff, sign);

    if (!ruleSetID) return offsetString; // no DST change rules are in effect

    const standardDateTime = absolute.inTimeZone(offsetString);

    const ruleSet = RulesTimeZone._rules[ruleSetID];
    // List of all DST change rules that would apply for last year and this year
    const dstRules = RulesTimeZone._getDSTRules(standardDateTime.year - 1, ruleSet).concat(
      RulesTimeZone._getDSTRules(standardDateTime.year, ruleSet)
    );
    if (dstRules.length === 0) return offsetString; // no DST change rules in effect

    const save = dstRules.reduce((current, { transitionDateTime, save }) =>
      Temporal.DateTime.compare(standardDateTime, transitionDateTime) < 0 ? save : current
    );
    return RulesTimeZone._offsetFromSignDurationAndSavings(sign, stdoff, save);
  }

  getDateTimeFor(absolute) {
    const offset = this.getOffsetFor(absolute);
    return absolute.inTimeZone(Temporal.TimeZone.from(offset));
  }

  getAbsoluteFor(dateTime, options = undefined) {

  }

  *getTransitions(startingPoint) {
    let currentOffset = this.getOffsetFor(startingPoint);
    while (true) {
      const currentTimeZone = Temporal.TimeZone.from(currentOffset);
      const { stdoff, sign, rules: ruleSetID, until } = this._getRuleSetInEffect(startingPoint);
      console.log(`rule set in effect for ${startingPoint}: ${ruleSetID}`);
      if (!ruleSetID && !until) return null; // no more transitions ever

      if (!ruleSetID) {
        startingPoint = until.inTimeZone(Temporal.TimeZone.from(currentOffset));
        continue;
      }

      const ruleSet = RulesTimeZone._rules[ruleSetID];
      const dateTime = startingPoint.inTimeZone(currentTimeZone);
      const dstRules = RulesTimeZone._getDSTRules(dateTime.year, ruleSet);
      if (dstRules.length === 0) {
        const newDateTime = Temporal.DateTime.from({ year: dateTime.year + 1, month: 1, day: 1 });
        startingPoint = newDateTime.inTimeZone(currentTimeZone);
        continue;
      }
      for (const { transitionDateTime, save } of dstRules) {
        console.log(`considering ${transitionDateTime}, ${sign}*${stdoff} + ${save}`);
        if (Temporal.DateTime.compare(dateTime, transitionDateTime) > 0) continue;
        const offset = RulesTimeZone._offsetFromSignDurationAndSavings(sign, stdoff, save);
        if (offset !== currentOffset) {
          startingPoint = transitionDateTime.inTimeZone(currentTimeZone);
          currentOffset = offset;
          yield startingPoint;
          break;
        }
      }
    }
  }
}

// https://data.iana.org/time-zones/tz-how-to.html
const data = `\
#Rule NAME    FROM TO   TYPE IN  ON      AT   SAVE LETTER
Rule  Chicago 1920 only  -   Jun 13      2:00 1:00 D
Rule  Chicago 1920 1921  -   Oct lastSun 2:00 0    S
Rule  Chicago 1921 only  -   Mar lastSun 2:00 1:00 D
Rule  Chicago 1922 1966  -   Apr lastSun 2:00 1:00 D
Rule  Chicago 1922 1954  -   Sep lastSun 2:00 0    S
Rule  Chicago 1955 1966  -   Oct lastSun 2:00 0    S

#Rule NAME FROM TO   TYPE IN  ON        AT   SAVE LETTER/S
Rule  US   1918 1919  -   Mar lastSun  2:00  1:00 D
Rule  US   1918 1919  -   Oct lastSun  2:00  0    S
Rule  US   1942 only  -   Feb 9        2:00  1:00 W # War
Rule  US   1945 only  -   Aug 14      23:00u 1:00 P # Peace
Rule  US   1945 only  -   Sep 30       2:00  0    S
Rule  US   1967 2006  -   Oct lastSun  2:00  0    S
Rule  US   1967 1973  -   Apr lastSun  2:00  1:00 D
Rule  US   1974 only  -   Jan 6        2:00  1:00 D
Rule  US   1975 only  -   Feb 23       2:00  1:00 D
Rule  US   1976 1986  -   Apr lastSun  2:00  1:00 D
Rule  US   1987 2006  -   Apr Sun>=1   2:00  1:00 D
Rule  US   2007 max   -   Mar Sun>=8   2:00  1:00 D
Rule  US   2007 max   -   Nov Sun>=1   2:00  0    S

#Zone       NAME      STDOFF   RULES FORMAT [UNTIL]
Zone  America/Chicago -5:50:36 -       LMT  1883 Nov 18 12:09:24
                      -6:00    US      C%sT 1920
                      -6:00    Chicago C%sT 1936 Mar  1  2:00
                      -5:00    -       EST  1936 Nov 15  2:00
                      -6:00    Chicago C%sT 1942
                      -6:00    US      C%sT 1946
                      -6:00    Chicago C%sT 1967
                      -6:00    US      C%sT
`;

RulesTimeZone.load(data);

function getTimeZoneObjectFromRules(id) {
  return new RulesTimeZone(id);
}

const chicago = Temporal.TimeZone.from('America/Chicago');
const fauxChicago = getTimeZoneObjectFromRules('America/Chicago');

const start = Temporal.DateTime.from('1900-01-01').inTimeZone('UTC'); // FIXME 1800
const expected = chicago.getTransitions(start);
const actual = fauxChicago.getTransitions(start);

for (let ix = 0; ix < 20; ix++) {
  const result1 = expected.next();
  const result2 = actual.next();
  if (result1.done !== result2.done) {
    console.log('Unequal length');
    break;
  }
  if (result1.done) {
    console.log('Done');
    break;
  }
  if (Temporal.Absolute.compare(result1.value, result2.value) !== 0) {
    console.log(`${result1.value} - ${result2.value}`);
    break;
  }
  console.log(`${result1.value}`);
}

// check:

function replacer(key, value) {
  if (value instanceof Temporal.Date) return `Temporal.Date.from('${value.toJSON()}')`;
  if (value instanceof Temporal.DateTime) return `Temporal.DateTime.from('${value.toJSON()}')`;
  if (value instanceof Temporal.Duration) return `Temporal.Duration.from('${value.toJSON()}')`;
  if (value instanceof Temporal.Time) return `Temporal.Time.from('${value.toJSON()}')`;
  return value;
}

function check(actual, expected) {
  const actualString = JSON.stringify(actual, replacer, 2);
  const expectedString = JSON.stringify(expected, replacer, 2);
  assert.equal(actualString, expectedString);
}

check(RulesTimeZone._rules, {
  Chicago: [
    {
      from: 1920,
      to: 1920,
      month: 6,
      day: 13,
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1920,
      to: 1921,
      month: 10,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    },
    {
      from: 1921,
      to: 1921,
      month: 3,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1922,
      to: 1966,
      month: 4,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1922,
      to: 1954,
      month: 9,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    },
    {
      from: 1955,
      to: 1966,
      month: 10,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    }
  ],
  US: [
    {
      from: 1918,
      to: 1919,
      month: 3,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1918,
      to: 1919,
      month: 10,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    },
    {
      from: 1942,
      to: 1942,
      month: 2,
      day: 9,
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'W'
    },
    {
      from: 1945,
      to: 1945,
      month: 8,
      day: 14,
      time: Temporal.Time.from('23:00'),
      timeZone: Temporal.TimeZone.from('UTC'),
      save: Temporal.Duration.from('PT1H'),
      letter: 'P'
    },
    {
      from: 1945,
      to: 1945,
      month: 9,
      day: 30,
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    },
    {
      from: 1967,
      to: 2006,
      month: 10,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    },
    {
      from: 1967,
      to: 1973,
      month: 4,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1974,
      to: 1974,
      month: 1,
      day: 6,
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1975,
      to: 1975,
      month: 2,
      day: 23,
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1976,
      to: 1986,
      month: 4,
      day: 'lastSun',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 1987,
      to: 2006,
      month: 4,
      day: 'Sun>=1',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 2007,
      to: null,
      month: 3,
      day: 'Sun>=8',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT1H'),
      letter: 'D'
    },
    {
      from: 2007,
      to: null,
      month: 11,
      day: 'Sun>=1',
      time: Temporal.Time.from('02:00'),
      timeZone: null,
      save: Temporal.Duration.from('PT0S'),
      letter: 'S'
    }
  ]
});

check(RulesTimeZone._zones, {
  'America/Chicago': [
    {
      stdoff: Temporal.Duration.from('PT5H50M36S'),
      sign: -1,
      rules: null,
      format: 'LMT',
      until: Temporal.DateTime.from('1883-11-18T12:09:24')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'US',
      format: 'C%sT',
      until: Temporal.DateTime.from('1920-01-01')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'Chicago',
      format: 'C%sT',
      until: Temporal.DateTime.from('1936-03-01T02:00')
    },
    {
      stdoff: Temporal.Duration.from('PT5H'),
      sign: -1,
      rules: null,
      format: 'EST',
      until: Temporal.DateTime.from('1936-11-15T02:00')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'Chicago',
      format: 'C%sT',
      until: Temporal.DateTime.from('1942-01-01')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'US',
      format: 'C%sT',
      until: Temporal.DateTime.from('1946-01-01')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'Chicago',
      format: 'C%sT',
      until: Temporal.DateTime.from('1967-01-01')
    },
    {
      stdoff: Temporal.Duration.from('PT6H'),
      sign: -1,
      rules: 'US',
      format: 'C%sT',
      until: null
    }
  ]
});
