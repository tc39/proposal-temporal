import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal, throws } = assert;

import bigInt from 'big-integer';
import { readFileSync } from 'fs';

import * as ES from '../lib/ecmascript.mjs';
import { GetSlot, TIMEZONE_ID } from '../lib/slots.mjs';
import { TimeZone } from '../lib/timezone.mjs';

describe('ECMAScript', () => {
  describe('GetFormatterParts', () => {
    // https://github.com/tc39/proposal-temporal/issues/575
    test(1589670000000, GetSlot(TimeZone.from('Europe/London'), TIMEZONE_ID), {
      year: 2020,
      month: 5,
      day: 17,
      hour: 0,
      minute: 0,
      second: 0
    });

    function test(nanos, zone, expected) {
      it(`${nanos} @ ${zone}`, () => deepEqual(ES.GetFormatterParts(zone, nanos), expected));
    }
  });

  describe('GetOptionsObject', () => {
    it('Options parameter can only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('1'), 1n].forEach((options) =>
        throws(() => ES.GetOptionsObject(options), TypeError)
      );
    });
  });

  describe('RoundNumberToIncrement', () => {
    const increment = bigInt(100);
    const testValues = [-150, -100, -80, -50, -30, 0, 30, 50, 80, 100, 150];
    const expectations = {
      ceil: [-100, -100, 0, 0, 0, 0, 100, 100, 100, 100, 200],
      floor: [-200, -100, -100, -100, -100, 0, 0, 0, 0, 100, 100],
      trunc: [-100, -100, 0, 0, 0, 0, 0, 0, 0, 100, 100],
      expand: [-200, -100, -100, -100, -100, 0, 100, 100, 100, 100, 200],
      halfCeil: [-100, -100, -100, 0, 0, 0, 0, 100, 100, 100, 200],
      halfFloor: [-200, -100, -100, -100, 0, 0, 0, 0, 100, 100, 100],
      halfTrunc: [-100, -100, -100, 0, 0, 0, 0, 0, 100, 100, 100],
      halfExpand: [-200, -100, -100, -100, 0, 0, 0, 100, 100, 100, 200],
      halfEven: [-200, -100, -100, 0, 0, 0, 0, 0, 100, 100, 200]
    };
    for (const roundingMode of Object.keys(expectations)) {
      describe(roundingMode, () => {
        testValues.forEach((value, ix) => {
          const expected = expectations[roundingMode][ix];
          it(`rounds ${value} to ${expected}`, () => {
            const result = ES.RoundNumberToIncrement(bigInt(value), increment, roundingMode);
            equal(result.toJSNumber(), expected);
          });
        });
      });
    }
  });

  describe('GetAvailableNamedTimeZoneIdentifier', () => {
    it('Case-normalizes time zone IDs', () => {
      // eslint-disable-next-line max-len
      // curl -s https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-bcp47/bcp47/timezone.json > cldr-timezone.json
      const cldrTimeZonePath = new URL('./cldr-timezone.json', import.meta.url);
      const cldrTimeZoneJson = JSON.parse(readFileSync(cldrTimeZonePath));

      // get CLDR's time zone IDs
      const cldrIdentifiers = Object.entries(cldrTimeZoneJson.keyword.u.tz)
        .filter((z) => !z[0].startsWith('_')) // ignore metadata elements
        .map((z) => z[1]._alias) // pull out the list of IANA IDs for each CLDR zone
        .filter(Boolean) // CLDR deprecated zones no longer have an IANA ID
        .flatMap((ids) => ids.split(' ')) // expand all space-delimited IANA IDs for each zone
        .filter((id) => !['America/Ciudad_Juarez'].includes(id)) // exclude IDs that are too new to be supported
        .filter((id) => !['Etc/Unknown'].includes(id)); // see https://github.com/tc39/proposal-canonical-tz/pull/25

      // These 4 legacy IDs are in TZDB, in Wikipedia, and accepted by ICU, but they're not in CLDR data.
      // Not sure where they come from, perhaps hard-coded into ICU, but we'll test them anyway.
      const missingFromCLDR = ['CET', 'EET', 'MET', 'WET'];

      // All IDs that we know about
      const ids = [...new Set([...missingFromCLDR, ...cldrIdentifiers, ...Intl.supportedValuesOf('timeZone')])];

      for (const id of ids) {
        const lower = id.toLowerCase();
        const upper = id.toUpperCase();
        equal(ES.GetAvailableNamedTimeZoneIdentifier(id)?.identifier, id);
        equal(ES.GetAvailableNamedTimeZoneIdentifier(upper)?.identifier, id);
        equal(ES.GetAvailableNamedTimeZoneIdentifier(lower)?.identifier, id);
      }
    });
    it('Returns canonical IDs', () => {
      const ids = Intl.supportedValuesOf('timeZone');
      for (const id of ids) {
        equal(ES.GetAvailableNamedTimeZoneIdentifier(id).primaryIdentifier, id);
      }
      const knownAliases = [
        ['America/Atka', 'America/Adak'],
        ['America/Knox_IN', 'America/Indiana/Knox'],
        ['Asia/Ashkhabad', 'Asia/Ashgabat'],
        ['Asia/Dacca', 'Asia/Dhaka'],
        ['Asia/Istanbul', 'Europe/Istanbul'],
        ['Asia/Macao', 'Asia/Macau'],
        ['Asia/Thimbu', 'Asia/Thimphu'],
        ['Asia/Ujung_Pandang', 'Asia/Makassar'],
        ['Asia/Ulan_Bator', 'Asia/Ulaanbaatar']
      ];
      for (const [identifier, primaryIdentifier] of knownAliases) {
        const record = ES.GetAvailableNamedTimeZoneIdentifier(identifier);
        equal(record.identifier, identifier);
        equal(record.primaryIdentifier, primaryIdentifier);
      }
    });
  });

  describe('ToRelativeTemporalObject', () => {
    it('bare date-time string', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({ relativeTo: '2019-11-01T00:00' });
      equal(`${plainRelativeTo}`, '2019-11-01');
      equal(zonedRelativeTo, undefined);
    });

    it('bare date-time property bag', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: { year: 2019, month: 11, day: 1 }
      });
      equal(`${plainRelativeTo}`, '2019-11-01');
      equal(zonedRelativeTo, undefined);
    });

    it('date-time + offset string', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: '2019-11-01T00:00-07:00'
      });
      equal(`${plainRelativeTo}`, '2019-11-01');
      equal(zonedRelativeTo, undefined);
    });

    it('date-time + offset property bag', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: { year: 2019, month: 11, day: 1, offset: '-07:00' }
      });
      equal(`${plainRelativeTo}`, '2019-11-01');
      equal(zonedRelativeTo, undefined);
    });

    it('date-time + annotation string', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: '2019-11-01T00:00[-07:00]'
      });
      equal(plainRelativeTo, undefined);
      equal(`${zonedRelativeTo}`, '2019-11-01T00:00:00-07:00[-07:00]');
    });

    it('date-time + annotation property bag', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: { year: 2019, month: 11, day: 1, timeZone: '-07:00' }
      });
      equal(plainRelativeTo, undefined);
      equal(`${zonedRelativeTo}`, '2019-11-01T00:00:00-07:00[-07:00]');
    });

    it('date-time + offset + annotation string', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: '2019-11-01T00:00+00:00[UTC]'
      });
      equal(plainRelativeTo, undefined);
      equal(`${zonedRelativeTo}`, '2019-11-01T00:00:00+00:00[UTC]');
    });

    it('date-time + offset + annotation property bag', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: { year: 2019, month: 11, day: 1, offset: '+00:00', timeZone: 'UTC' }
      });
      equal(plainRelativeTo, undefined);
      equal(`${zonedRelativeTo}`, '2019-11-01T00:00:00+00:00[UTC]');
    });

    it('date-time + Z + offset', () => {
      const { plainRelativeTo, zonedRelativeTo } = ES.ToRelativeTemporalObject({
        relativeTo: '2019-11-01T00:00Z[-07:00]'
      });
      equal(plainRelativeTo, undefined);
      equal(`${zonedRelativeTo}`, '2019-10-31T17:00:00-07:00[-07:00]');
    });

    it('date-time + Z', () => {
      throws(() => ES.ToRelativeTemporalObject({ relativeTo: '2019-11-01T00:00Z' }), RangeError);
    });

    it('string offset does not agree', () => {
      throws(() => ES.ToRelativeTemporalObject({ relativeTo: '2019-11-01T00:00+04:15[UTC]' }), RangeError);
    });

    it('property bag offset does not agree', () => {
      throws(
        () =>
          ES.ToRelativeTemporalObject({
            relativeTo: { year: 2019, month: 11, day: 1, offset: '+04:15', timeZone: 'UTC' }
          }),
        RangeError
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
