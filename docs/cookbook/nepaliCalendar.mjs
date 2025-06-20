/**
 * This implementation is based on World-Calendars library by Keith Wood:
 * https://github.com/kbwood/world-calendars
 * And multi-calendar-dates which originally implemented a custom Temporal.Calendar:
 * https://github.com/dhis2/multi-calendar-dates/blob/main/src/custom-calendars/nepaliCalendar.ts
 */

/**
 * First, some data for the Nepali calendar. (Just scroll past this.)
 *
 * - The key (1970...) is the Nepali year.
 * - The first colummn is what day the year starts in Paush.
 *    - The year always starts in Paush (the 9th month) but it is somewhere
 *      between 17 to 19th of Paush.
 * - The other 12 columns show how many days are in each month.
 *
 * The data goes from 1970 (1913 in ISO calendar) to 2100 (2044 in ISO.) It's an
 * abbreviated range, a real calendar implementation should have more data.
 */
var NEPALI_CALENDAR_DATA = {
  // These data are from http://www.ashesh.com.np
  1970: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1971: [18, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  1972: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  1973: [19, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1974: [19, 31, 31, 32, 30, 31, 31, 30, 29, 30, 29, 30, 30],
  1975: [18, 31, 31, 32, 32, 30, 31, 30, 29, 30, 29, 30, 30],
  1976: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1977: [18, 31, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  1978: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1979: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1980: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1981: [18, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  1982: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1983: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1984: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1985: [18, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  1986: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1987: [18, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1988: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1989: [18, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  1990: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1991: [18, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  // These data are from http://nepalicalendar.rat32.com/index.php
  1992: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1993: [18, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  1994: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1995: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  1996: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1997: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1998: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1999: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2000: [17, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [17, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2006: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2009: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2010: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2013: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2014: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2017: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2018: [18, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2021: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2022: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2023: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2024: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [18, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2026: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2027: [17, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2028: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [18, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2030: [17, 31, 32, 31, 32, 31, 30, 30, 30, 30, 30, 30, 31],
  2031: [17, 31, 32, 31, 32, 31, 31, 31, 31, 31, 31, 31, 31],
  2032: [17, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32],
  2033: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2034: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2035: [17, 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2036: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2037: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2038: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2039: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2040: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2041: [18, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2042: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2043: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2044: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2045: [18, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2046: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2047: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2048: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2049: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2050: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2051: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2052: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2053: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2054: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2055: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 29, 30],
  2056: [17, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2057: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2058: [17, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2059: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2060: [17, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2062: [17, 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2063: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [17, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2065: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2066: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2067: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2068: [17, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2069: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2070: [17, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2071: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [17, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2074: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [16, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [17, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [16, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  // These data are from http://www.ashesh.com.np/nepali-calendar/
  2081: [17, 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [17, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [17, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [17, 31, 32, 31, 32, 31, 31, 30, 30, 29, 30, 30, 30],
  2086: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [16, 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2088: [16, 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2089: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2091: [16, 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2092: [16, 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2093: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2094: [17, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2095: [17, 31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
  2096: [17, 30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2097: [17, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2098: [17, 31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 31],
  2099: [17, 31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30],
  2100: [17, 31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30]
};

// Helpers for consuming the months table
const supportedNepaliYears = Object.keys(NEPALI_CALENDAR_DATA);
const firstSupportedNepaliYear = Number(supportedNepaliYears[0]);
const lastSupportedNepaliYear = Number(supportedNepaliYears[supportedNepaliYears.length - 1]);
function getNepaliYearData(nepaliYear) {
  if (nepaliYear < firstSupportedNepaliYear || nepaliYear > lastSupportedNepaliYear) {
    throw new Error(
      `Conversions are only possible between ${firstSupportedNepaliYear}` +
        ` and ${lastSupportedNepaliYear} in Nepali calendar`
    );
  }
  return NEPALI_CALENDAR_DATA[nepaliYear];
}

class NepaliPlainDate {
  #iso; // The underlying Temporal.PlainDate instance, using the ISO calendar
  constructor(isoYear, isoMonth, isoDay) {
    this.#iso = new Temporal.PlainDate(isoYear, isoMonth, isoDay);
  }

  get calendarId() {
    return 'nepali'; // Note this is not a built-in calendar ID
  }

  // era and eraYear not implemented; from localization data it looks like there
  // is an epoch in the Nepali calendar, but this calendar implementation only
  // supports a small range of years anyway.
  get year() {
    return this.#isoToNepali().year;
  }
  get month() {
    return this.#isoToNepali().month;
  }
  get monthCode() {
    return `M${this.month.toString().padStart(2, '0')}`;
  }
  get day() {
    return this.#isoToNepali().day;
  }

  // dayOfWeek delegates to Temporal.PlainDate directly. Nepali calendars seem
  // to use ISO days of the week, with localized names.
  get dayOfWeek() {
    return this.#iso.dayOfWeek;
  }
  get daysInWeek() {
    return 7;
  }

  get dayOfYear() {
    const { year, month, day } = this.#isoToNepali();
    const yearData = getNepaliYearData(year);
    let result = 0;
    for (let monthCounter = 1; monthCounter < month; monthCounter++) {
      result += yearData[monthCounter];
    }
    result += day;
    return result;
  }
  get weekOfYear() {
    return undefined;
  }
  get yearOfWeek() {
    return undefined;
  }
  get daysInMonth() {
    const { year, month } = this.#isoToNepali();
    const yearData = getNepaliYearData(year);
    return yearData[month];
  }
  get daysInYear() {
    const yearData = getNepaliYearData(this.year);
    let result = 0;
    for (let monthCounter = 1; monthCounter <= 12; monthCounter++) {
      result += yearData[monthCounter];
    }
    return result;
  }
  get monthsInYear() {
    return 12;
  }
  get inLeapYear() {
    return this.daysInYear !== 365;
  }

  // withCalendar delegated to Temporal.PlainDate directly:
  withCalendar(calendar) {
    return this.#iso.withCalendar(calendar);
  }

  equals(other) {
    return other instanceof NepaliPlainDate && this.#iso.equals(other.#iso);
  }

  toString({ showCalendar = 'auto', ...options } = {}) {
    let result = this.#iso.toString({ ...options, showCalendar: 'never' });
    if (showCalendar !== 'never') {
      result += '[u-ca=nepali]';
    }
    return result;
    // Note: if [u-ca=nepali] is appended, the string cannot be deserialized.
    // You would implement deserialization in from().
  }

  toJSON() {
    return this.#iso.toString({ showCalendar: 'never' }) + '[u-ca=nepali]';
  }

  // Note: for brevity, deserialization from a string and conversion from
  // year-monthCode-day are not implemented.
  static from(fields, { overflow = 'constrain' } = {}) {
    let { year: nepaliYear, month: nepaliMonth, day: nepaliDay } = fields;

    let yearData = getNepaliYearData(nepaliYear);
    const maxDay = yearData[nepaliMonth];
    if (nepaliDay > maxDay) {
      if (overflow === 'reject') {
        throw new RangeError(`month ${nepaliMonth} has ${maxDay} days, not ${nepaliDay}`);
      }
      nepaliDay = maxDay;
    }

    let isoDayOfYear = 0;

    let monthCounter = nepaliMonth;
    const isoYear = nepaliYear - (nepaliMonth > 9 || (monthCounter === 9 && nepaliDay >= yearData[0]) ? 56 : 57);

    // First we add the amount of days in the actual Nepali month as the day of
    // year in the ISO one because at least these days are gone since the 1st Jan.
    if (nepaliMonth !== 9) {
      isoDayOfYear = nepaliDay;
      monthCounter--;
    }

    // Now we loop through all Nepali months and add the amount of days to
    // isoDayOfYear. We do this till we reach Paush (9th month). 1st January
    // always falls in this month.
    while (monthCounter !== 9) {
      if (monthCounter <= 0) {
        monthCounter = 12;
        nepaliYear--;
        yearData = getNepaliYearData(nepaliYear);
      }
      isoDayOfYear += yearData[monthCounter];
      monthCounter--;
    }

    // If the date that has to be converted is in Paush (month no. 9) we have to
    // do some other calculation
    if (nepaliMonth === 9) {
      // Add the days that are passed since the first day of Paush and substract
      // the amount of days that lie between 1st Jan and 1st Paush
      isoDayOfYear += nepaliDay - yearData[0];
      // For the first days of Paush we are now in negative values, because in the
      // end of the ISO year we subtract 365 or 366 days
      if (isoDayOfYear < 0) {
        isoDayOfYear += new Temporal.PlainDate(isoYear, 1, 1).daysInYear;
      }
    } else {
      isoDayOfYear += yearData[9] - yearData[0];
    }

    const isoDate = new Temporal.PlainDate(isoYear, 1, 1).add({ days: isoDayOfYear });
    return new NepaliPlainDate(isoDate.year, isoDate.month, isoDate.day);
  }

  // Use this method instead of plainDate.withCalendar('nepali').
  static fromTemporalPlainDate(plainDate) {
    const iso = plainDate.withCalendar('iso8601');
    return new NepaliPlainDate(iso.year, iso.month, iso.day);
  }

  static compare(one, two) {
    return Temporal.PlainDate.compare(one, two);
  }

  #isoToNepali() {
    const isoDayOfYear = this.#iso.dayOfYear;
    let nepaliYear = this.#iso.year + 56;
    // This is not final, it could be also +57 but +56 is always true for 1st Jan.
    let yearData = getNepaliYearData(nepaliYear);

    // Jan 1 always falls in Nepali month Paush which is the 9th month of Nepali
    // calendar.
    let nepaliMonth = 9;

    // Get the Nepali day in Paush (month 9) of 1st January
    const dayOfFirstJanInPaush = yearData[0];
    // Check how many days are left of Paush.
    // Days calculated from 1st Jan till the end of the actual Nepali month,
    // we use this value to check if the ISO date is in the actual Nepali month.
    let daysSinceJanFirstToEndOfNepaliMonth = yearData[nepaliMonth] - dayOfFirstJanInPaush + 1;

    // If the Gregorian day-of-year is smaller than or equal to the sum of days
    // between the 1st January and the end of the actual Nepali month we have
    // found the correct Nepali month.
    // Example:
    // The 4th February 2011 is the isoDayOfYear 35 (31 days of January + 4)
    // 1st January 2011 is in the Nepali year 2067, where 1st January is the
    // 17th day of Paush (9th month).
    // In 2067 Paush has 30 days, which means (30-17+1=14) there are 14 days
    // between 1st January and end of Paush (including 17th January).
    // The isoDayOfYear (35) is bigger than 14, so we check the next month.
    // The next Nepali month (Mangh) has 29 days
    // 29+14=43, this is bigger than isoDayOfYear (35) so, we have found the
    // correct Nepali month.
    while (isoDayOfYear > daysSinceJanFirstToEndOfNepaliMonth) {
      nepaliMonth++;
      if (nepaliMonth > 12) {
        nepaliMonth = 1;
        nepaliYear++;
        yearData = getNepaliYearData(nepaliYear);
      }
      daysSinceJanFirstToEndOfNepaliMonth += yearData[nepaliMonth];
    }
    // The last step is to calculate the Nepali day-of-month.
    // To continue our example from before:
    // we calculated there are 43 days from 1st January (17 Paush) till end of
    // Mangh (29 days). When we subtract from this 43 days the day-of-year of
    // the ISO date (35), we know how far the searched day is away from the end
    // of the Nepali month. So we simply subtract this number from the amount of
    // days in this month (30).
    const nepaliDayOfMonth = yearData[nepaliMonth] - (daysSinceJanFirstToEndOfNepaliMonth - isoDayOfYear);

    return { year: nepaliYear, month: nepaliMonth, day: nepaliDayOfMonth };
  }

  // Some methods omitted for brevity:

  // with() could be implemented without too much trouble, but resolving the
  // month/monthCode pair takes up a lot of space without being really relevant
  // to this example
  with(dateLike, { overflow = 'constrain' } = {}) {
    void this.#iso.with(dateLike, { overflow });
    throw new Error('not implemented');
  }

  // toLocaleString() is omitted because I don't know how to localize dates in
  // this calendar
  toLocaleString(locales = undefined, options = undefined) {
    void locales, options;
    throw new Error('unimplemented');
  }

  // The conversion methods are omitted. They could be made to work by
  // implementing NepaliPlainDateTime, etc. It depends on your use case whether
  // you would need this or not.
  toPlainDateTime(plainTime) {
    void plainTime;
    throw new Error('unimplemented');
  }
  toZonedDateTime(options) {
    void options;
    throw new Error('unimplemented');
  }
  toPlainYearMonth() {
    throw new Error('unimplemented');
  }
  toPlainMonthDay() {
    throw new Error('unimplemented');
  }

  // The arithmetic methods are omitted. World-Calendars doesn't have date
  // arithmetic as far as I can tell. These could be made to work by someone
  // who is familiar with the conventions of date arithmetic in this calendar.
  add(duration, { overflow = 'constrain' } = {}) {
    void this.#iso.add(duration, { overflow });
    throw new Error('not implemented');
  }
  subtract(duration, { overflow = 'constrain' } = {}) {
    void this.#iso.subtract(duration, { overflow });
    throw new Error('not implemented');
  }
  until(other, { largestUnit = 'day' } = {}) {
    void this.#iso.until(other.#iso, { largestUnit });
    throw new Error('not implemented');
  }
  since(other, { largestUnit = 'day' } = {}) {
    void this.#iso.since(other.#iso, { largestUnit });
    throw new Error('not implemented');
  }
}

// Here we run a number of tests, to check that the implementation above makes
// sense.

const n = NepaliPlainDate.from({ year: 2081, month: 3, day: 11 });
assert.equal(n.toString(), '2024-06-24[u-ca=nepali]');
assert.equal(n.era, undefined);
assert.equal(n.eraYear, undefined);
assert.equal(n.year, 2081);
assert.equal(n.month, 3);
assert.equal(n.monthCode, 'M03');
assert.equal(n.day, 11);
assert.equal(n.dayOfWeek, 1);
assert.equal(n.daysInWeek, 7);
assert.equal(n.weekOfYear, undefined);
assert.equal(n.yearOfWeek, undefined);
assert.equal(n.daysInMonth, 32);
assert.equal(n.daysInYear, 366);
assert.equal(n.monthsInYear, 12);
assert.equal(n.inLeapYear, true);
const withBuiltinCalendar = n.withCalendar('gregory');
assert.equal(withBuiltinCalendar.toString(), '2024-06-24[u-ca=gregory]');
assert(withBuiltinCalendar instanceof Temporal.PlainDate, 'withCalendar returns real PlainDate');
assert(n.equals(n), 'equals self');
assert(n.equals(NepaliPlainDate.from(n)), 'equals new instance of self');
assert(!n.equals(withBuiltinCalendar), 'does not equal real PlainDate');
assert.equal(n.toJSON(), '2024-06-24[u-ca=nepali]');
