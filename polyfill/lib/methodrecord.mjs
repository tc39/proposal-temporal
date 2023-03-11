import GetMethod from 'es-abstract/2022/GetMethod.js';

import { GetIntrinsic } from './intrinsicclass.mjs';

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
