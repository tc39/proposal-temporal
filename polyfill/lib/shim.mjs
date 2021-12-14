// This is an alternate entry point that polyfills Temporal onto the global
// object. This is used only for the browser playground and the test262 tests.
// See the note in index.mjs.

import * as Temporal from './temporal.mjs';
import * as Intl from './intl.mjs';
import { toTemporalInstant } from './legacydate.mjs';

Object.defineProperty(globalThis, 'Temporal', {
  value: {},
  writable: true,
  enumerable: false,
  configurable: true
});
copy(globalThis.Temporal, Temporal);
Object.defineProperty(globalThis.Temporal, Symbol.toStringTag, {
  value: 'Temporal',
  writable: false,
  enumerable: false,
  configurable: true
});
copy(globalThis.Temporal.Now, Temporal.Now);
copy(globalThis.Intl, Intl);
Object.defineProperty(globalThis.Date.prototype, 'toTemporalInstant', {
  value: toTemporalInstant,
  writable: true,
  enumerable: false,
  configurable: true
});

function copy(target, source) {
  for (const prop of Object.getOwnPropertyNames(source)) {
    Object.defineProperty(target, prop, {
      value: source[prop],
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
}

// Work around https://github.com/babel/babel/issues/2025.
const types = [
  globalThis.Temporal.Instant,
  globalThis.Temporal.Calendar,
  globalThis.Temporal.PlainDate,
  globalThis.Temporal.PlainDateTime,
  globalThis.Temporal.Duration,
  globalThis.Temporal.PlainMonthDay,
  // globalThis.Temporal.Now, // plain object (not a constructor), so no `prototype`
  globalThis.Temporal.PlainTime,
  globalThis.Temporal.TimeZone,
  globalThis.Temporal.PlainYearMonth,
  globalThis.Temporal.ZonedDateTime
];
for (const type of types) {
  const descriptor = Object.getOwnPropertyDescriptor(type, 'prototype');
  if (descriptor.configurable || descriptor.enumerable || descriptor.writable) {
    descriptor.configurable = false;
    descriptor.enumerable = false;
    descriptor.writable = false;
    Object.defineProperty(type, 'prototype', descriptor);
  }
}

export { Temporal, Intl, toTemporalInstant };
