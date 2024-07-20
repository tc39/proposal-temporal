/* eslint-disable no-console */
import * as Temporal from '../../polyfill/lib/temporal.mjs';

/**
 * AdjustableHijriPlainDate: A class for customizing Hijri date display.
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

  constructor(temporal, calendar = 'islamic-umalqura', daysToShift = 0) {
    this.#temporal = temporal.withCalendar(calendar);
    this.#daysToShift = daysToShift;
  }

  #getAdjustedDate() {
    return this.#temporal.add({ days: this.#daysToShift });
  }

  get day() {
    return this.#getAdjustedDate().day;
  }
  get dayOfYear() {
    return this.#getAdjustedDate().dayOfYear;
  }
  get daysInMonth() {
    return this.#getAdjustedDate().daysInMonth;
  }
  get daysInYear() {
    return this.#getAdjustedDate().daysInYear;
  }
  get month() {
    return this.#getAdjustedDate().month;
  }
  get monthCode() {
    return this.#getAdjustedDate().monthCode;
  }
  get monthsInYear() {
    return this.#getAdjustedDate().monthsInYear;
  }
  get year() {
    return this.#getAdjustedDate().year;
  }
  get inLeapYear() {
    return this.#getAdjustedDate().inLeapYear;
  }

  toString(options) {
    return this.#getAdjustedDate().toString(options);
  }

  toJSON() {
    return this.#getAdjustedDate().toJSON();
  }

  toLocaleString(locales, options) {
    return this.#getAdjustedDate().toLocaleString(locales, options);
  }

  toPlainYearMonth() {
    return this.#getAdjustedDate().toPlainYearMonth();
  }

  toPlainMonthDay() {
    return this.#getAdjustedDate().toPlainMonthDay();
  }

  add(durationLike, options) {
    return this.#getAdjustedDate().add(durationLike, options);
  }

  subtract(durationLike, options) {
    return this.#getAdjustedDate().subtract(durationLike, options);
  }

  until(other, options) {
    return this.#getAdjustedDate().until(other, options);
  }

  since(other, options) {
    return this.#getAdjustedDate().since(other, options);
  }

  with(dateLike, options) {
    return this.#getAdjustedDate().with(dateLike, options);
  }

  withCalendar(calendar) {
    return this.#getAdjustedDate().withCalendar(calendar);
  }

  equals(other) {
    if (other instanceof AdjustableHijriTemporal) return this.#getAdjustedDate().equals(other.#getAdjustedDate());

    return this.#getAdjustedDate().equals(other);
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
  Hdate.dayOfWeek,
  AHdate.month,
  AHdate.year,
  AHdate.toLocaleString('en-SG', {
    dateStyle: 'full',
    calendar: 'islamic-umalqura'
  })
); // 1 6 1 1446 Sunday, 1 Muharram 1446 AH
