// Absolute
export const EPOCHNANOSECONDS = 'slot-epochNanoSeconds';

// TimeZone
export const IDENTIFIER = 'slot-identifier';

// DateTime, Date, Time, YearMonth, MonthDay
export const YEAR = 'slot-year';
export const MONTH = 'slot-month';
export const DAY = 'slot-day';
export const HOUR = 'slot-hour';
export const MINUTE = 'slot-minute';
export const SECOND = 'slot-second';
export const MILLISECOND = 'slot-millisecond';
export const MICROSECOND = 'slot-microsecond';
export const NANOSECOND = 'slot-nanosecond';

// Duration
export const YEARS = 'slot-years';
export const MONTHS = 'slot-months';
export const DAYS = 'slot-days';
export const HOURS = 'slot-hours';
export const MINUTES = 'slot-minutes';
export const SECONDS = 'slot-seconds';
export const MILLISECONDS = 'slot-milliseconds';
export const MICROSECONDS = 'slot-microseconds';
export const NANOSECONDS = 'slot-nanoseconds';

const SLOTS = ('undefined' === typeof Symbol) ? '_SLOTS' : Symbol('SLOTS');
const slots = ('function' === typeof WeakMap) ? new WeakMap() : null;
export function CreateSlots(container) {
  if (!slots) {
    container[SLOTS] = {};
  } else {
    slots.set(container, {});
  }
}
export function GetSlot(container, id) {
  if (!slots) {
    return container[SLOTS][id];
  } else {
    return slots.get(container)[id];
  }
}
export function SetSlot(container, id, value) {
  if (!slots) {
    container[SLOTS][id] = value;
  } else {
    slots.get(container)[id] = value;
  }
}
