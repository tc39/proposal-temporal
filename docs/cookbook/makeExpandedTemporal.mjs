function bigIntAbs(n) {
  if (n < 0n) return -n;
  return n;
}

// The years are unlimited, but for output purposes we assume 10 digits,
// because ISO 8601 requires the expanded year format to pick a consistent
// number of digits.
function formatExpandedYear(year) {
  let yearString;
  if (year < 0 || year > 9999) {
    let sign = year < 0 ? '-' : '+';
    let yearNumber = bigIntAbs(year);
    yearString = sign + `${yearNumber}`.padStart(10, '0');
  } else {
    yearString = `${year}`.padStart(4, '0');
  }
  return yearString;
}

function isLeapYear(year) {
  const isDiv4 = year % 4n === 0n;
  const isDiv100 = year % 100n === 0n;
  const isDiv400 = year % 400n === 0n;
  return isDiv4 && (!isDiv100 || isDiv400);
}

// This checks to see if the ISO string matches our 10-digit expanded year
// format, and if so, returns both the expanded year as a BigInt, and a new
// ISO string with an in-range year that can be passed to the original
// Temporal string parsing functions.
// The in-range year is 1972 if the expanded year is a leap year, and
// otherwise 1970, so that the rules for February 29 remain correct.
// See the note about the number of digits in formatExpandedYear().
function parseExpandedYear(isoString) {
  const matchExpandedYear = /^[-+\u2212]\d{10}/;
  const result = matchExpandedYear.exec(isoString);
  if (!result) return { isoString };
  const expandedYear = BigInt(result[0]);
  const isoYear = isLeapYear(expandedYear) ? 1972 : 1970;
  return {
    expandedYear,
    isoString: isoString.replace(matchExpandedYear, isoYear.toString())
  };
}

// This is a map of Temporal objects to their expanded year (as BigInt).
// The data model consists of the Temporal object (with the ISO year set
// internally to 1970 or 1972) and the expanded year. This map is used to
// associate Temporal objects with their expanded years, instead of defining
// extra properties on the Temporal object.
const expandedYears = new WeakMap();

class ExpandedPlainDate extends Temporal.PlainDate {
  // The expanded-year versions of the Temporal types are limited to using the
  // ISO 8601 calendar.
  constructor(year, isoMonth, isoDay) {
    year = BigInt(year);
    const isoYear = isLeapYear(year) ? 1972 : 1970;
    super(isoYear, isoMonth, isoDay, 'iso8601');
    expandedYears.set(this, year);
  }

  static _convert(plainDate, expandedYear) {
    if (plainDate instanceof ExpandedPlainDate) return plainDate;
    const iso = plainDate.withCalendar('iso8601');
    return new ExpandedPlainDate(expandedYear, iso.month, iso.day);
  }

  static from(item) {
    if (typeof item === 'string') {
      const { expandedYear, isoString } = parseExpandedYear(item);
      item = Temporal.PlainDate.from(isoString);
      if (expandedYear) return this._convert(item, expandedYear);
    }
    if (item instanceof Temporal.PlainDate) {
      return this._convert(item, BigInt(item.year));
    }
    const expandedYear = BigInt(item.year);
    const isoYear = isLeapYear(expandedYear) ? 1972 : 1970;
    const result = super.from({ ...item, year: isoYear });
    return this._convert(result, expandedYear);
  }

  // This overrides the .year property to return the expanded year instead. If
  // you were doing this with a calendar, you would instead need to make a
  // separate field. (But Instant doesn't have a calendar, so that solution
  // wouldn't be able to completely expand Temporal.)
  get year() {
    return expandedYears.get(this);
  }

  toString() {
    const year = formatExpandedYear(this.year);
    const iso = this.withCalendar('iso8601');
    const month = `${iso.month}`.padStart(2, '0');
    const day = `${iso.day}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

class ExpandedPlainDateTime extends Temporal.PlainDateTime {
  constructor(year, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond) {
    year = BigInt(year);
    const isoYear = isLeapYear(year) ? 1972 : 1970;
    super(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond, 'iso8601');
    expandedYears.set(this, year);
  }

  static _convert(plainDateTime, expandedYear) {
    if (plainDateTime instanceof ExpandedPlainDateTime) return plainDateTime;
    const iso = plainDateTime.withCalendar('iso8601');
    return new ExpandedPlainDateTime(
      expandedYear,
      iso.month,
      iso.day,
      plainDateTime.hour,
      plainDateTime.minute,
      plainDateTime.second,
      plainDateTime.millisecond,
      plainDateTime.microsecond,
      plainDateTime.nanosecond
    );
  }

  static from(item) {
    if (typeof item === 'string') {
      const { expandedYear, isoString } = parseExpandedYear(item);
      item = Temporal.PlainDateTime.from(isoString);
      if (expandedYear) return this._convert(item, expandedYear);
    }
    if (item instanceof Temporal.PlainDateTime) {
      return this._convert(item, BigInt(item.year));
    }
    const expandedYear = BigInt(item.year);
    const isoYear = isLeapYear(expandedYear) ? 1972 : 1970;
    const result = super.from({ ...item, year: isoYear });
    return this._convert(result, expandedYear);
  }

  get year() {
    return expandedYears.get(this);
  }

  toString(options = {}) {
    const dateString = this.toPlainDate().toString({
      ...options,
      showCalendar: 'never'
    });
    const timeString = this.toPlainTime().toString(options);
    return `${dateString}T${timeString}`;
  }

  toPlainDate() {
    return ExpandedPlainDate._convert(super.toPlainDate(), this.year);
  }
}

function makeExpandedTemporal() {
  return {
    ...Temporal,
    PlainDate: ExpandedPlainDate,
    PlainDateTime: ExpandedPlainDateTime
  };
}

const ExpandedTemporal = makeExpandedTemporal();

const date = ExpandedTemporal.PlainDate.from({ year: 635427810, month: 2, day: 2 });
assert.equal(date.toString(), '+0635427810-02-02');
const dateFromString = ExpandedTemporal.PlainDateTime.from('-0075529144-02-29T12:53:27.55');
assert.equal(dateFromString.year, -75529144n);
