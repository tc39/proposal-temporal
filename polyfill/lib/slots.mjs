// Absolute
export const EPOCHNANOSECONDS = Symbol('slot-epochNanoSeconds');

// TimeZone
export const IDENTIFIER = Symbol('slot-identifier');

// DateTime, Date, Time, YearMonth, MonthDay
export const YEAR = Symbol('slot-year');
export const MONTH = Symbol('slot-month');
export const DAY = Symbol('slot-day');
export const HOUR = Symbol('slot-hour');
export const MINUTE = Symbol('slot-minute');
export const SECOND = Symbol('slot-second');
export const MILLISECOND = Symbol('slot-millisecond');
export const MICROSECOND = Symbol('slot-microsecond');
export const NANOSECOND = Symbol('slot-nanosecond');

// Duration
export const YEARS = Symbol('slot-years');
export const MONTHS = Symbol('slot-months');
export const DAYS = Symbol('slot-days');
export const HOURS = Symbol('slot-hours');
export const MINUTES = Symbol('slot-minutes');
export const SECONDS = Symbol('slot-seconds');
export const MILLISECONDS = Symbol('slot-milliseconds');
export const MICROSECONDS = Symbol('slot-microseconds');
export const NANOSECONDS = Symbol('slot-nanoseconds');

const slots = new WeakMap();
export function CreateSlots(container) {
  slots.set(container, {});
}
export function GetSlot(container, id) {
  return slots.get(container)[id];
}
export function SetSlot(container, id, value) {
  slots.get(container)[id] = value;
}
