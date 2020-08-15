#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal, throws } = assert;

import * as Temporal from 'proposal-temporal';

describe('TimeZone', () => {
  describe('Structure', () => {
    it('Temporal.TimeZone is a function', () => equal(typeof Temporal.TimeZone, 'function'));
    it('Temporal.TimeZone has prototype', () => equal(typeof Temporal.TimeZone.prototype, 'object'));
    describe('Temporal.TimeZone.prototype', () => {
      it('Temporal.TimeZone.prototype has name', () => assert('name' in Temporal.TimeZone.prototype));
      it('Temporal.TimeZone.prototype has getOffsetNanosecondsFor', () =>
        equal(typeof Temporal.TimeZone.prototype.getOffsetNanosecondsFor, 'function'));
      it('Temporal.TimeZone.prototype has getOffsetStringFor', () =>
        equal(typeof Temporal.TimeZone.prototype.getOffsetStringFor, 'function'));
      it('Temporal.TimeZone.prototype has getDateTimeFor', () =>
        equal(typeof Temporal.TimeZone.prototype.getDateTimeFor, 'function'));
      it('Temporal.TimeZone.prototype has getAbsoluteFor', () =>
        equal(typeof Temporal.TimeZone.prototype.getAbsoluteFor, 'function'));
      it('Temporal.TimeZone.prototype has getPossibleAbsolutesFor', () =>
        equal(typeof Temporal.TimeZone.prototype.getPossibleAbsolutesFor, 'function'));
      it('Temporal.TimeZone.prototype has getNextTransition', () =>
        equal(typeof Temporal.TimeZone.prototype.getNextTransition, 'function'));
      it('Temporal.TimeZone.prototype has getPreviousTransition', () =>
        equal(typeof Temporal.TimeZone.prototype.getPreviousTransition, 'function'));
      it('Temporal.TimeZone.prototype has toString', () =>
        equal(typeof Temporal.TimeZone.prototype.toString, 'function'));
    });
    it('Temporal.TimeZone has from', () => equal(typeof Temporal.TimeZone.from, 'function'));
  });
  describe('Construction', () => {
    test('+01:00');
    test('-01:00');
    test('+0330');
    test('-0650');
    test('-08');
    test('\u221201:00');
    test('\u22120650');
    test('\u221208');
    test('Europe/Vienna');
    test('America/New_York');
    test('Africa/CAIRO'); // capitalization
    test('Asia/Ulan_Bator'); // IANA Link Name
    test('UTC');
    test('GMT');
    function test(zone) {
      it(`${zone} is a zone`, () => equal(typeof new Temporal.TimeZone(zone), 'object'));
    }
  });
  describe('.name property', () => {
    test('+01:00');
    test('-01:00');
    test('+0330', '+03:30');
    test('-0650', '-06:50');
    test('-08', '-08:00');
    test('\u221201:00', '-01:00');
    test('\u22120650', '-06:50');
    test('\u221208', '-08:00');
    test('Europe/Vienna');
    test('America/New_York');
    test('Africa/CAIRO', 'Africa/Cairo');
    test('Asia/Ulan_Bator', 'Asia/Ulaanbaatar');
    test('UTC');
    test('GMT', 'UTC');
    function test(zone, name = zone) {
      it(`${zone} has name ${name}`, () => equal(new Temporal.TimeZone(zone).name, name));
    }
  });
  describe('TimeZone.from(identifier)', () => {
    test('+01:00');
    test('-01:00');
    test('+0330');
    test('-0650');
    test('-08');
    test('\u221201:00');
    test('\u22120650');
    test('\u221208');
    test('Europe/Vienna');
    test('America/New_York');
    test('Africa/CAIRO');
    test('Asia/Ulan_Bator');
    test('UTC');
    test('GMT');
    function test(zone) {
      const timezoneFrom = Temporal.TimeZone.from(zone);
      const timezoneObj = new Temporal.TimeZone(zone);
      it(`TimeZone.from(${zone}) is a time zone`, () => equal(typeof timezoneFrom, 'object'));
      it(`TimeZone.from(${zone}) does the same thing as new TimeZone(${zone})`, () =>
        equal(timezoneFrom.name, timezoneObj.name));
    }
    it('TimeZone.from throws with bad identifier', () => {
      throws(() => Temporal.TimeZone.from('local'));
      throws(() => Temporal.TimeZone.from('Z'));
      throws(() => Temporal.TimeZone.from('-08:00[America/Vancouver]'));
    });
  });
  describe('TimeZone.from(ISO string)', () => {
    test('1994-11-05T08:15:30-05:00', '-05:00');
    test('1994-11-05T08:15:30-05:00[America/New_York]', 'America/New_York');
    test('1994-11-05T08:15:30-05[America/New_York]', 'America/New_York');
    test('1994-11-05T08:15:30\u221205:00', '-05:00');
    test('1994-11-05T08:15:30\u221205:00[America/New_York]', 'America/New_York');
    test('1994-11-05T08:15:30\u221205[America/New_York]', 'America/New_York');
    test('1994-11-05T13:15:30Z', 'UTC');
    function test(isoString, name) {
      const tz = Temporal.TimeZone.from(isoString);
      it(`TimeZone.from(${isoString}) is a time zone`, () => equal(typeof tz, 'object'));
      it(`TimeZone.from(${isoString}) has name ${name}`, () => equal(tz.name, name));
    }
    it('offset disagreeing with IANA name throws', () => {
      throws(() => Temporal.TimeZone.from('1994-11-05T08:15:30-05:00[UTC]'), RangeError);
      throws(() => Temporal.TimeZone.from('1994-11-05T13:15:30+00:00[America/New_York]'), RangeError);
      throws(() => Temporal.TimeZone.from('1994-11-05T13:15:30-03[Europe/Brussels]'), RangeError);
    });
  });
  describe('+01:00', () => {
    const zone = new Temporal.TimeZone('+01:00');
    const abs = Temporal.Absolute.fromEpochSeconds(Math.floor(Math.random() * 1e9));
    const dtm = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it(`${zone} has name ${zone}`, () => equal(zone.name, `${zone}`));
    it(`${zone} has offset +01:00 in ns`, () => equal(zone.getOffsetNanosecondsFor(abs), 3600e9));
    it(`${zone} has offset +01:00`, () => equal(zone.getOffsetStringFor(abs), '+01:00'));
    it(`(${zone}).getDateTimeFor(${abs})`, () => assert(zone.getDateTimeFor(abs) instanceof Temporal.DateTime));
    it(`(${zone}).getAbsoluteFor(${dtm})`, () => assert(zone.getAbsoluteFor(dtm) instanceof Temporal.Absolute));
    it(`(${zone}).getNextTransition(${abs})`, () => zone.getNextTransition(abs), null);
    it(`(${zone}).getPreviousTransition(${abs})`, () => zone.getPreviousTransition(abs), null);
    it('wraps around to the next day', () =>
      equal(`${zone.getDateTimeFor(Temporal.Absolute.from('2020-02-06T23:59Z'))}`, '2020-02-07T00:59'));
  });
  describe('UTC', () => {
    const zone = new Temporal.TimeZone('UTC');
    const abs = Temporal.Absolute.fromEpochSeconds(Math.floor(Math.random() * 1e9));
    const dtm = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it(`${zone} has name ${zone}`, () => equal(zone.name, `${zone}`));
    it(`${zone} has offset +00:00 in ns`, () => equal(zone.getOffsetNanosecondsFor(abs), 0));
    it(`${zone} has offset +00:00`, () => equal(zone.getOffsetStringFor(abs), '+00:00'));
    it(`(${zone}).getDateTimeFor(${abs})`, () => assert(zone.getDateTimeFor(abs) instanceof Temporal.DateTime));
    it(`(${zone}).getAbsoluteFor(${dtm})`, () => assert(zone.getAbsoluteFor(dtm) instanceof Temporal.Absolute));
    it(`(${zone}).getNextTransition(${abs})`, () => zone.getNextTransition(abs), null);
    it(`(${zone}).getPreviousTransition(${abs})`, () => zone.getPreviousTransition(abs), null);
  });
  describe('America/Los_Angeles', () => {
    const zone = new Temporal.TimeZone('America/Los_Angeles');
    const abs = Temporal.Absolute.fromEpochSeconds(0n);
    const dtm = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it(`${zone} has name ${zone}`, () => equal(zone.name, `${zone}`));
    it(`${zone} has offset -08:00 in ns`, () => equal(zone.getOffsetNanosecondsFor(abs), -8 * 3600e9));
    it(`${zone} has offset -08:00`, () => equal(zone.getOffsetStringFor(abs), '-08:00'));
    it(`(${zone}).getDateTimeFor(${abs})`, () => assert(zone.getDateTimeFor(abs) instanceof Temporal.DateTime));
    it(`(${zone}).getAbsoluteFor(${dtm})`, () => assert(zone.getAbsoluteFor(dtm) instanceof Temporal.Absolute));
    it(`(${zone}).getNextTransition() x 4 transitions`, () => {
      for (let i = 0, txn = abs; i < 4; i++) {
        const transition = zone.getNextTransition(txn);
        assert(transition);
      }
    });
    it(`(${zone}).getPreviousTransition() x 4 transitions`, () => {
      for (let i = 0, txn = abs; i < 4; i++) {
        const transition = zone.getPreviousTransition(txn);
        assert(transition);
      }
    });
  });
  describe('with DST change', () => {
    it('clock moving forward', () => {
      const zone = new Temporal.TimeZone('Europe/Berlin');
      const dtm = new Temporal.DateTime(2019, 3, 31, 2, 45);
      equal(`${zone.getAbsoluteFor(dtm)}`, '2019-03-31T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'earlier' })}`, '2019-03-31T00:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'later' })}`, '2019-03-31T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'compatible' })}`, '2019-03-31T01:45Z');
      throws(() => zone.getAbsoluteFor(dtm, { disambiguation: 'reject' }), RangeError);
    });
    it('clock moving backward', () => {
      const zone = new Temporal.TimeZone('America/Sao_Paulo');
      const dtm = new Temporal.DateTime(2019, 2, 16, 23, 45);
      equal(`${zone.getAbsoluteFor(dtm)}`, '2019-02-17T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'earlier' })}`, '2019-02-17T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'later' })}`, '2019-02-17T02:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'compatible' })}`, '2019-02-17T01:45Z');
      throws(() => zone.getAbsoluteFor(dtm, { disambiguation: 'reject' }), RangeError);
    });
  });
  describe('Casting', () => {
    const zone = Temporal.TimeZone.from('+03:30');
    it("getOffsetNanosecondsFor() doesn't cast its argument", () => {
      throws(() => zone.getOffsetNanosecondsFor(0n), TypeError);
      throws(() => zone.getOffsetNanosecondsFor('2019-02-17T01:45Z'), TypeError);
      throws(() => zone.getOffsetNanosecondsFor({}), TypeError);
    });
    it("getOffsetStringFor() doesn't cast its argument", () => {
      throws(() => zone.getOffsetStringFor(0n), TypeError);
      throws(() => zone.getOffsetStringFor('2019-02-17T01:45Z'), TypeError);
      throws(() => zone.getOffsetStringFor({}), TypeError);
    });
    it("getDateTimeFor() doesn't cast its argument", () => {
      throws(() => zone.getDateTimeFor(0n), TypeError);
      throws(() => zone.getDateTimeFor('2019-02-17T01:45Z'), TypeError);
      throws(() => zone.getDateTimeFor({}), TypeError);
    });
  });
  describe('TimeZone.getAbsoluteFor() works', () => {
    it('recent date', () => {
      const dt = Temporal.DateTime.from('2019-10-29T10:46:38.271986102');
      const tz = Temporal.TimeZone.from('Europe/Amsterdam');
      equal(`${tz.getAbsoluteFor(dt)}`, '2019-10-29T09:46:38.271986102Z');
    });
    it('year ≤ 99', () => {
      const dt = Temporal.DateTime.from('+000098-10-29T10:46:38.271986102');
      const tz = Temporal.TimeZone.from('+06:00');
      equal(`${tz.getAbsoluteFor(dt)}`, '+000098-10-29T04:46:38.271986102Z');
    });
    it('year < 1', () => {
      let dt = Temporal.DateTime.from('+000000-10-29T10:46:38.271986102');
      const tz = Temporal.TimeZone.from('+06:00');
      equal(`${tz.getAbsoluteFor(dt)}`, '+000000-10-29T04:46:38.271986102Z');
      dt = Temporal.DateTime.from('-001000-10-29T10:46:38.271986102');
      equal(`${tz.getAbsoluteFor(dt)}`, '-001000-10-29T04:46:38.271986102Z');
    });
    it('year 0 leap day', () => {
      const dt = Temporal.DateTime.from('+000000-02-29T00:00');
      const tz = Temporal.TimeZone.from('Europe/London');
      equal(`${tz.getAbsoluteFor(dt)}`, '+000000-02-29T00:01:15Z');
    });
  });
  describe('getAbsoluteFor disambiguation', () => {
    const dtm = new Temporal.DateTime(2019, 2, 16, 23, 45);
    it('with constant offset', () => {
      const zone = Temporal.TimeZone.from('+03:30');
      for (const disambiguation of [undefined, 'compatible', 'earlier', 'later', 'reject']) {
        assert(zone.getAbsoluteFor(dtm, { disambiguation }) instanceof Temporal.Absolute);
      }
    });
    it('with daylight saving change - Fall', () => {
      const zone = Temporal.TimeZone.from('America/Sao_Paulo');
      equal(`${zone.getAbsoluteFor(dtm)}`, '2019-02-17T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'earlier' })}`, '2019-02-17T01:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'later' })}`, '2019-02-17T02:45Z');
      equal(`${zone.getAbsoluteFor(dtm, { disambiguation: 'compatible' })}`, '2019-02-17T01:45Z');
      throws(() => zone.getAbsoluteFor(dtm, { disambiguation: 'reject' }), RangeError);
    });
    it('with daylight saving change - Spring', () => {
      const dtmLA = new Temporal.DateTime(2020, 3, 8, 2, 30);
      const zone = Temporal.TimeZone.from('America/Los_Angeles');
      equal(`${zone.getAbsoluteFor(dtmLA)}`, '2020-03-08T10:30Z');
      equal(`${zone.getAbsoluteFor(dtmLA, { disambiguation: 'earlier' })}`, '2020-03-08T09:30Z');
      equal(`${zone.getAbsoluteFor(dtmLA, { disambiguation: 'later' })}`, '2020-03-08T10:30Z');
      equal(`${zone.getAbsoluteFor(dtmLA, { disambiguation: 'compatible' })}`, '2020-03-08T10:30Z');
      throws(() => zone.getAbsoluteFor(dtmLA, { disambiguation: 'reject' }), RangeError);
    });
    it('throws on bad disambiguation', () => {
      const zone = Temporal.TimeZone.from('+03:30');
      ['', 'EARLIER', 'test', 3, null].forEach((disambiguation) =>
        throws(() => zone.getAbsoluteFor(dtm, { disambiguation }), RangeError)
      );
    });
  });
  describe('getPossibleAbsolutesFor', () => {
    it('with constant offset', () => {
      const zone = Temporal.TimeZone.from('+03:30');
      const dt = Temporal.DateTime.from('2019-02-16T23:45');
      deepEqual(
        zone.getPossibleAbsolutesFor(dt).map((a) => `${a}`),
        ['2019-02-16T20:15Z']
      );
    });
    it('with clock moving forward', () => {
      const zone = Temporal.TimeZone.from('Europe/Berlin');
      const dt = Temporal.DateTime.from('2019-03-31T02:45');
      deepEqual(zone.getPossibleAbsolutesFor(dt), []);
    });
    it('with clock moving backward', () => {
      const zone = Temporal.TimeZone.from('America/Sao_Paulo');
      const dt = Temporal.DateTime.from('2019-02-16T23:45');
      deepEqual(
        zone.getPossibleAbsolutesFor(dt).map((a) => `${a}`),
        ['2019-02-17T01:45Z', '2019-02-17T02:45Z']
      );
    });
  });
  describe('getNextTransition works as expected', () => {
    it('should not have bug #510', () => {
      // See https://github.com/tc39/proposal-temporal/issues/510 for more.
      const nyc = Temporal.TimeZone.from('America/New_York');
      const a1 = Temporal.Absolute.from('2019-04-16T21:01Z');
      const a2 = Temporal.Absolute.from('1800-01-01T00:00Z');

      equal(nyc.getNextTransition(a1).toString(), '2019-11-03T06:00Z');
      equal(nyc.getNextTransition(a2).toString(), '1883-11-18T17:00Z');
    });
  });

  describe('getPreviousTransition works as expected', () => {
    it('should return first and last transition', () => {
      const london = Temporal.TimeZone.from('Europe/London');
      const a1 = Temporal.Absolute.from('2020-06-11T21:01Z');
      const a2 = Temporal.Absolute.from('1848-01-01T00:00Z');

      equal(london.getPreviousTransition(a1).toString(), '2020-03-29T01:00Z');
      equal(london.getPreviousTransition(a2).toString(), '1847-12-01T00:01:15Z');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
