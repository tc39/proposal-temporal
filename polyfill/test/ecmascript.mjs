import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, deepEqual, throws } = Assert;

import { ES } from '../lib/ecmascript.mjs';
import { GetSlot, IDENTIFIER } from '../lib/slots.mjs';

describe('ECMAScript', () => {
    describe('GetTimeZoneDateTimeParts', () => {
        describe('epoch', () => {
            test(0n, GetSlot(ES.ToTimeZone('America/Los_Angeles'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 16, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
            test(0n, GetSlot(ES.ToTimeZone('America/New_York'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 19, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
            test(0n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 1, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
            test(0n, GetSlot(ES.ToTimeZone('Europe/Berlin'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 1, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
            test(0n, GetSlot(ES.ToTimeZone('Europe/Moscow'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 3, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
            test(0n, GetSlot(ES.ToTimeZone('Asia/Tokyo'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 9, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
        });
        describe('epoch-1', () => {
            test(-1n, GetSlot(ES.ToTimeZone('America/Los_Angeles'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 15, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-1n, GetSlot(ES.ToTimeZone('America/New_York'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 18, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-1n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 0, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-1n, GetSlot(ES.ToTimeZone('Europe/Berlin'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 0, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-1n, GetSlot(ES.ToTimeZone('Europe/Moscow'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 2, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-1n, GetSlot(ES.ToTimeZone('Asia/Tokyo'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 8, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
        });
        describe('epoch+1', () => {
            test(1n, GetSlot(ES.ToTimeZone('America/Los_Angeles'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 16, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(1n, GetSlot(ES.ToTimeZone('America/New_York'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 19, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(1n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 1, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(1n, GetSlot(ES.ToTimeZone('Europe/Berlin'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 1, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(1n, GetSlot(ES.ToTimeZone('Europe/Moscow'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 3, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(1n, GetSlot(ES.ToTimeZone('Asia/Tokyo'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 9, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
        });
        describe('epoch-6300000000001', () => {
            test(-6300000000001n, GetSlot(ES.ToTimeZone('America/Los_Angeles'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 14, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-6300000000001n, GetSlot(ES.ToTimeZone('America/New_York'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 17, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-6300000000001n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 23, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-6300000000001n, GetSlot(ES.ToTimeZone('Europe/Berlin'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 23, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-6300000000001n, GetSlot(ES.ToTimeZone('Europe/Moscow'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 1, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(-6300000000001n, GetSlot(ES.ToTimeZone('Asia/Tokyo'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 7, minute: 14, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
        });
        describe('epoch+6300000000001', () => {
            test(6300000000001n, GetSlot(ES.ToTimeZone('America/Los_Angeles'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 17, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(6300000000001n, GetSlot(ES.ToTimeZone('America/New_York'), IDENTIFIER), {
                year: 1969, month: 12, day: 31,
                hour: 20, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(6300000000001n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 2, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(6300000000001n, GetSlot(ES.ToTimeZone('Europe/Berlin'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 2, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(6300000000001n, GetSlot(ES.ToTimeZone('Europe/Moscow'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 4, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
            test(6300000000001n, GetSlot(ES.ToTimeZone('Asia/Tokyo'), IDENTIFIER), {
                year: 1970, month: 1, day: 1,
                hour: 10, minute: 45, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 1
            });
        });
        describe('dst', () => {
            test(1553993999999999999n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 2019, month: 3, day: 31,
                hour: 0, minute: 59, second: 59,
                millisecond: 999, microsecond: 999, nanosecond: 999
            });
            test(1553994000000000000n, GetSlot(ES.ToTimeZone('Europe/London'), IDENTIFIER), {
                year: 2019, month: 3, day: 31,
                hour: 2, minute: 0, second: 0,
                millisecond: 0, microsecond: 0, nanosecond: 0
            });
        });

        function test(nanos, zone, expected) {
            it(`${nanos} @ ${zone}`, () => deepEqual(ES.GetTimeZoneDateTimeParts(nanos, zone), expected));
        }
    });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
    report(reporter).then((failed) => process.exit(failed ? 1 : 0));
