import GetMethod from 'es-abstract/2022/GetMethod.js';

import { GetIntrinsic } from './intrinsicclass.mjs';
import { CALENDAR, GetSlot } from './slots.mjs';

class MethodRecord {
  constructor(recordType, receiver, methodNames) {
    this.recordType = recordType;
    this.receiver = receiver;

    const nMethods = methodNames.length;
    for (let ix = 0; ix < nMethods; ix++) {
      this.lookup(methodNames[ix]);
    }
  }

  isBuiltIn() {
    return typeof this.receiver === 'string';
  }

  hasLookedUp(methodName) {
    return !!this[`_${methodName}`];
  }

  lookup(methodName) {
    if (this.hasLookedUp(methodName)) {
      throw new Error(`assertion failure: ${methodName} already looked up`);
    }
    if (this.isBuiltIn()) {
      this[`_${methodName}`] = GetIntrinsic(`%Temporal.${this.recordType}.prototype.${methodName}%`);
    } else {
      const method = GetMethod(this.receiver, methodName);
      if (!method) {
        // GetMethod may return undefined if method is null or undefined
        throw new TypeError(`${methodName} should be present on ${this.recordType}`);
      }
      this[`_${methodName}`] = method;
    }
  }

  call(methodName, args) {
    if (!this.hasLookedUp(methodName)) {
      throw new Error(`assertion failure: ${methodName} should have been looked up`);
    }
    let receiver = this.receiver;
    if (this.isBuiltIn()) {
      const cls = GetIntrinsic(`%Temporal.${this.recordType}%`);
      receiver = new cls(receiver);
    }
    return this[`_${methodName}`].apply(receiver, args);
  }
}

export class TimeZoneMethodRecord extends MethodRecord {
  constructor(timeZone, methodNames = []) {
    super('TimeZone', timeZone, methodNames);
  }

  getOffsetNanosecondsFor(instant) {
    return this.call('getOffsetNanosecondsFor', [instant]);
  }

  getPossibleInstantsFor(dateTime) {
    return this.call('getPossibleInstantsFor', [dateTime]);
  }
}

export class CalendarMethodRecord extends MethodRecord {
  constructor(calendar, methodNames = []) {
    super('Calendar', calendar, methodNames);
  }

  static CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, methodNames = []) {
    const relativeTo = zonedRelativeTo ?? plainRelativeTo;
    if (!relativeTo) return undefined;
    return new this(GetSlot(relativeTo, CALENDAR), methodNames);
  }

  dateAdd(date, duration, options) {
    return this.call('dateAdd', [date, duration, options]);
  }

  dateFromFields(fields, options) {
    return this.call('dateFromFields', [fields, options]);
  }

  dateUntil(one, two, options) {
    return this.call('dateUntil', [one, two, options]);
  }

  day(date) {
    return this.call('day', [date]);
  }

  fields(fieldNames) {
    return this.call('fields', [fieldNames]);
  }

  mergeFields(fields, additionalFields) {
    return this.call('mergeFields', [fields, additionalFields]);
  }

  monthDayFromFields(fields, options) {
    return this.call('monthDayFromFields', [fields, options]);
  }

  yearMonthFromFields(fields, options) {
    return this.call('yearMonthFromFields', [fields, options]);
  }
}
