#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2022 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { after, before, describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, notEqual, throws } = assert;

import * as Temporal from 'proposal-temporal';

describe('Built-in calendars', () => {
  it('do not have Calendar.prototype as their prototype', () => {
    const cal = Temporal.Calendar.from('iso8601');
    notEqual(Object.getPrototypeOf(cal), Temporal.Calendar.prototype);
  });

  describe('sharedness', () => {
    it('is shared between instances of the same Temporal type', () => {
      const cal1 = Temporal.Now.plainDateISO().calendar;
      const cal2 = new Temporal.PlainDate(1981, 12, 15).calendar;
      equal(cal1, cal2);
    });

    it('is shared regardless of whether the calendar was explicitly specified', () => {
      const cal1 = new Temporal.PlainDate(1981, 12, 15).calendar;
      const cal2 = new Temporal.PlainDate(1981, 12, 15, 'iso8601').calendar;
      equal(cal1, cal2);
    });

    it('is shared between instances of different Temporal types', () => {
      const cal1 = Temporal.Calendar.from('iso8601');
      const cal2 = new Temporal.PlainDate(1981, 12, 15).calendar;
      const cal3 = new Temporal.PlainMonthDay(7, 1).calendar;
      equal(cal1, cal2);
      equal(cal1, cal3);
    });

    it('is not shared when constructed explicity using the constructor', () => {
      const cal1 = Temporal.Calendar.from('iso8601');
      const cal2 = new Temporal.Calendar('iso8601');
      notEqual(cal1, cal2);
    });

    it('constructor always returns a new object', () => {
      const cal1 = new Temporal.Calendar('iso8601');
      const cal2 = new Temporal.Calendar('iso8601');
      notEqual(cal1, cal2);
    });
  });

  describe('frozenness', () => {
    const cal = Temporal.Calendar.from('iso8601');

    it('the built-in calendar itself is frozen', () => {
      assert(Object.isFrozen(cal));
    });

    it('the built-in calendar methods are frozen', () => {
      assert(Object.isFrozen(cal.dateFromFields));
    });

    it('the built-in calendar prototype is frozen', () => {
      const proto = Object.getPrototypeOf(cal);
      assert(Object.isFrozen(proto));
    });

    it('the built-in calendar constructor is frozen', () => {
      const ctor = cal.constructor;
      assert(Object.isFrozen(ctor));
    });
  });

  describe('built-in calendar methods', () => {
    const cal = Temporal.Calendar.from('iso8601');

    it('come from the built-in calendar prototype', () => {
      const proto = Object.getPrototypeOf(cal);
      equal(cal.dateFromFields, proto.dateFromFields);
    });

    it('are not the same objects as Calendar.prototype methods', () => {
      notEqual(cal.dateFromFields, Temporal.Calendar.prototype.dateFromFields);
    });
  });

  describe('monkey-patchability', () => {
    it('built-in calendars cannot be patched with own properties (throws in strict mode)', () => {
      const cal = Temporal.Calendar.from('iso8601');
      throws(
        () =>
          (cal.dateFromFields = function () {
            return new Temporal.PlainDate(1900, 1, 1, this);
          }),
        TypeError
      );
    });

    it('user calendars can still be patched with own properties', () => {
      const cal = new Temporal.Calendar('iso8601');
      cal.dateFromFields = function () {
        return new Temporal.PlainDate(1900, 1, 1, this);
      };
      equal(`${cal.dateFromFields({ year: 1999, month: 12, day: 31 })}`, '1900-01-01');
    });

    describe('when monkey-patching Calendar.prototype', () => {
      let oldDateFromFields;
      before(() => {
        oldDateFromFields = Temporal.Calendar.prototype.dateFromFields;
        Temporal.Calendar.prototype.dateFromFields = function () {
          return new Temporal.PlainDate(1900, 1, 1, this);
        };
      });

      it('built-in calendars are unaffected by monkey-patching Calendar.prototype', () => {
        const cal = Temporal.Calendar.from('iso8601');
        equal(`${cal.dateFromFields({ year: 1999, month: 12, day: 31 })}`, '1999-12-31');
      });

      it('user calendars can still be affected by monkey-patching Calendar.prototype', () => {
        class C extends Temporal.Calendar {
          constructor() {
            super('iso8601');
          }
          toString() {
            return 'my-cal';
          }
        }
        const cal = new C();
        equal(`${cal.dateFromFields({ year: 1999, month: 12, day: 31 })}`, '1900-01-01[u-ca=my-cal]');
      });

      after(() => {
        Temporal.Calendar.prototype.dateFromFields = oldDateFromFields;
      });
    });
  });

  describe('prevents action at a distance', () => {
    it('via the calendar object itself', () => {
      const cal1 = Temporal.Calendar.from('iso8601');
      const cal2 = Temporal.Now.plainDateISO().calendar;

      throws(() => (cal1.foo = 'read me'), TypeError);
      notEqual(cal2.foo, 'read me');
    });

    it('via its methods', () => {
      const cal1 = Temporal.Calendar.from('iso8601');
      const cal2 = Temporal.Now.plainDateISO().calendar;

      throws(() => (cal1.dateFromFields.foo = 'read me'), TypeError);
      notEqual(cal2.dateFromFields.foo, 'read me');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
