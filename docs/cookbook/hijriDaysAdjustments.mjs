/* eslint-disable no-console */
import * as Temporal from '../../polyfill/lib/temporal.mjs';

/**
 * AdjustableHijriTemporal: A class for customizing Hijri date display.
 *
 * This class allows for adjustment of Hijri dates by shifting days forward or backward.
 * It's designed to:
 * 1. Help users synchronize displayed Hijri dates with their local Hijri calendar.
 * 2. Facilitate the use of alternative Hijri calendar epochs.
 *
 * Key points:
 * - It adjusts the display of Hijri dates without modifying the underlying calendar system.
 * - The adjustment is a simple day shift and does not alter month lengths or other calendar rules.
 * - This approach is useful for visual alignment but does not implement comprehensive
 *   calendar customization or detailed Hijri calendar variants.
 *
 * Note: For more complex Hijri calendar adjustments or variants, a more sophisticated
 * implementation would be necessary.
 */

class AdjustableHijriTemporal {
  #temporal;
  #daysToShift;
  #adjustedDate;

  constructor(temporal, calendar = 'islamic-umalqura', daysToShift = 0) {
    this.#temporal = temporal.withCalendar(calendar);
    this.#daysToShift = daysToShift;
    this.#adjustedDate = this.#temporal.add({ days: this.#daysToShift });
  }

  get day() {
    return this.#adjustedDate.day;
  }
  get dayOfWeek() {
    return this.#temporal.dayOfWeek;
  }
  get dayOfYear() {
    return this.#adjustedDate.dayOfYear;
  }
  get daysInMonth() {
    return this.#adjustedDate.daysInMonth;
  }
  get daysInYear() {
    return this.#adjustedDate.daysInYear;
  }
  get month() {
    return this.#adjustedDate.month;
  }
  get monthCode() {
    return this.#adjustedDate.monthCode;
  }
  get monthsInYear() {
    return this.#adjustedDate.monthsInYear;
  }
  get year() {
    return this.#adjustedDate.year;
  }
  get inLeapYear() {
    return this.#adjustedDate.inLeapYear;
  }

  toString(options) {
    return this.#adjustedDate.toString(options);
  }

  toJSON() {
    return this.#adjustedDate.toJSON();
  }

  toLocaleString(locales, options) {
    const formatter = new Intl.DateTimeFormat(locales, options);
    const originalParts = formatter.formatToParts(this.#temporal);
    const adjustedParts = formatter.formatToParts(this.#adjustedDate);
    for (let i = 0; i < adjustedParts.length; i++) {
      if (adjustedParts[i].type === 'weekday') {
        adjustedParts[i].value = originalParts[i].value;
        break;
      }
    }
    return adjustedParts.map((part) => part.value).join('');
  }

  add(durationLike, options) {
    return this.#adjustedDate.add(durationLike, options);
  }

  subtract(durationLike, options) {
    return this.#adjustedDate.subtract(durationLike, options);
  }

  until(other, options) {
    return this.#adjustedDate.until(other, options);
  }

  since(other, options) {
    return this.#adjustedDate.since(other, options);
  }

  with(dateLike, options) {
    return this.#adjustedDate.with(dateLike, options);
  }

  withCalendar(calendar) {
    return this.#adjustedDate.withCalendar(calendar);
  }

  equals(other) {
    if (other instanceof AdjustableHijriTemporal) return this.#adjustedDate.equals(other.#adjustedDate);

    return this.#adjustedDate.equals(other);
  }
}

const Hdate = new Temporal.PlainDate(2024, 7, 6, 'islamic-umalqura');
const AHdate = new AdjustableHijriTemporal(Hdate, 'islamic-umalqura', 1);

console.log(
  Hdate.day,
  Hdate.dayOfWeek,
  Hdate.month,
  Hdate.year,
  Hdate.toLocaleString('en-SG', {
    dateStyle: 'full',
    calendar: 'islamic-umalqura'
  })
); // 30 6 12 1445 Saturday, 30 Dhuʻl-Hijjah 1445 AH
console.log(
  AHdate.day,
  AHdate.dayOfWeek,
  AHdate.month,
  AHdate.year,
  AHdate.toLocaleString('en-SG', {
    dateStyle: 'full',
    calendar: 'islamic-umalqura'
  })
); // 1 6 1 1446 Saturday, 1 Muharram 1446 AH
