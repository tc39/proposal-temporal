import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR_ID, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

export class Calendar {
  constructor(id) {
    CreateSlots(this);
    SetSlot(this, CALENDAR_ID, id);
  }
  get id() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  dateFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  yearMonthFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  monthDayFromFields(fields, options, constructor) {
    void fields;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  plus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  minus(date, duration, options, constructor) {
    void date;
    void duration;
    void options;
    void constructor;
    throw new Error('not implemented');
  }
  difference(smaller, larger, options) {
    void smaller;
    void larger;
    void options;
    throw new Error('not implemented');
  }
  year(date) {
    void date;
    throw new Error('not implemented');
  }
  month(date) {
    void date;
    throw new Error('not implemented');
  }
  day(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfWeek(date) {
    void date;
    throw new Error('not implemented');
  }
  dayOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  weekOfYear(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInMonth(date) {
    void date;
    throw new Error('not implemented');
  }
  daysInYear(date) {
    void date;
    throw new Error('not implemented');
  }
  isLeapYear(date) {
    void date;
    throw new Error('not implemented');
  }
  toString() {
    if (!ES.IsTemporalCalendar(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_ID);
  }
  static from(item) {
    if (ES.IsTemporalCalendar(item)) return item;
    const stringIdent = ES.ToString(item);
    return ES.GetBuiltinCalendar(stringIdent);
  }
}

MakeIntrinsicClass(Calendar, 'Temporal.Calendar');
