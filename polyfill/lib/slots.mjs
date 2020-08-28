// Absolute
export const EPOCHNANOSECONDS = 'slot-epochNanoSeconds';

// TimeZone
export const TIMEZONE_ID = 'slot-timezone-identifier';
export const OFFSET_NANOSECONDS = 'slot-offset-nanoseconds';

// DateTime, Date, Time, YearMonth, MonthDay
export const ISO_YEAR = 'slot-year';
export const ISO_MONTH = 'slot-month';
export const ISO_DAY = 'slot-day';
export const HOUR = 'slot-hour';
export const MINUTE = 'slot-minute';
export const SECOND = 'slot-second';
export const MILLISECOND = 'slot-millisecond';
export const MICROSECOND = 'slot-microsecond';
export const NANOSECOND = 'slot-nanosecond';
export const REF_ISO_YEAR = 'slot-ref-iso-year';
export const REF_ISO_DAY = 'slot-ref-iso-day';
export const CALENDAR = 'slot-calendar';

// Duration
export const YEARS = 'slot-years';
export const MONTHS = 'slot-months';
export const WEEKS = 'slot-weeks';
export const DAYS = 'slot-days';
export const HOURS = 'slot-hours';
export const MINUTES = 'slot-minutes';
export const SECONDS = 'slot-seconds';
export const MILLISECONDS = 'slot-milliseconds';
export const MICROSECONDS = 'slot-microseconds';
export const NANOSECONDS = 'slot-nanoseconds';

// Calendar
export const CALENDAR_ID = 'slot-calendar-identifier';

const slots = new WeakMap();
export function CreateSlots(container) {
  slots.set(container, Object.create(null));
}
function GetSlots(container) {
  return slots.get(container);
}
export function HasSlot(container, ...ids) {
  if (!container || 'object' !== typeof container) return false;
  const myslots = GetSlots(container);
  return !!myslots && ids.reduce((all, id) => all && id in myslots, true);
}
export function GetSlot(container, id) {
  return GetSlots(container)[id];
}
export function SetSlot(container, id, value) {
  GetSlots(container)[id] = value;
}
