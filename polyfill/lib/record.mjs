import IsCallable from 'es-abstract/2020/IsCallable.js';
import Type from 'es-abstract/2020/Type.js';

function requireCallable(obj, prop) {
  const value = obj[prop];
  if (!IsCallable(value)) throw new TypeError(`${prop} property must be callable`);
  return value;
}

function requireCallableOrUndefined(obj, prop) {
  const value = obj[prop];
  if (value === undefined) return undefined;
  if (!IsCallable(value)) throw new TypeError(`${prop} property must be callable or undefined`);
  return value;
}

export class CalendarRecord {
  constructor(calendar) {
    if (Type(calendar) !== 'Object') throw new TypeError('calendar must be an object');
    this.object = calendar;
    this.dateFromFields = requireCallable(calendar, 'dateFromFields');
    this.yearMonthFromFields = requireCallable(calendar, 'yearMonthFromFields');
    this.monthDayFromFields = requireCallable(calendar, 'monthDayFromFields');
    this.fields = requireCallableOrUndefined(calendar, 'fields');
    this.mergeFields = requireCallableOrUndefined(calendar, 'mergeFields');
    this.dateAdd = requireCallable(calendar, 'dateAdd');
    this.dateUntil = requireCallable(calendar, 'dateUntil');
    this.year = requireCallable(calendar, 'year');
    this.month = requireCallable(calendar, 'month');
    this.monthCode = requireCallable(calendar, 'monthCode');
    this.day = requireCallable(calendar, 'day');
    this.era = requireCallable(calendar, 'era');
    this.eraYear = requireCallable(calendar, 'eraYear');
    this.dayOfWeek = requireCallable(calendar, 'dayOfWeek');
    this.dayOfYear = requireCallable(calendar, 'dayOfYear');
    this.weekOfYear = requireCallable(calendar, 'weekOfYear');
    this.daysInWeek = requireCallable(calendar, 'daysInWeek');
    this.daysInMonth = requireCallable(calendar, 'daysInMonth');
    this.daysInYear = requireCallable(calendar, 'daysInYear');
    this.monthsInYear = requireCallable(calendar, 'monthsInYear');
    this.inLeapYear = requireCallable(calendar, 'inLeapYear');
    this.toString = requireCallable(calendar, 'toString');
  }
}
