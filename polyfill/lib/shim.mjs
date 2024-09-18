// This is an alternate entry point that polyfills Temporal onto the global
// object. This is used only for the browser playground and the test262 tests.
// See the note in index.mjs.

import {
  ObjectDefineProperty,
  ObjectGetOwnPropertyDescriptor,
  ObjectGetOwnPropertyNames,
  SymbolToStringTag
} from './primordials.mjs';

import * as Temporal from './temporal.mjs';
import * as Intl from './intl.mjs';
import { toTemporalInstant } from './legacydate.mjs';

ObjectDefineProperty(globalThis, 'Temporal', {
  value: {},
  writable: true,
  enumerable: false,
  configurable: true
});
copy(globalThis.Temporal, Temporal);
ObjectDefineProperty(globalThis.Temporal, SymbolToStringTag, {
  value: 'Temporal',
  writable: false,
  enumerable: false,
  configurable: true
});
copy(globalThis.Temporal.Now, Temporal.Now);
copy(globalThis.Intl, Intl);
ObjectDefineProperty(globalThis.Date.prototype, 'toTemporalInstant', {
  value: toTemporalInstant,
  writable: true,
  enumerable: false,
  configurable: true
});

function copy(target, source) {
  const props = ObjectGetOwnPropertyNames(source);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    ObjectDefineProperty(target, prop, {
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
  globalThis.Temporal.PlainDate,
  globalThis.Temporal.PlainDateTime,
  globalThis.Temporal.Duration,
  globalThis.Temporal.PlainMonthDay,
  // globalThis.Temporal.Now, // plain object (not a constructor), so no `prototype`
  globalThis.Temporal.PlainTime,
  globalThis.Temporal.PlainYearMonth,
  globalThis.Temporal.ZonedDateTime
];
for (let i = 0; i < types.length; i++) {
  const type = types[i];
  const descriptor = ObjectGetOwnPropertyDescriptor(type, 'prototype');
  if (descriptor.configurable || descriptor.enumerable || descriptor.writable) {
    descriptor.configurable = false;
    descriptor.enumerable = false;
    descriptor.writable = false;
    ObjectDefineProperty(type, 'prototype', descriptor);
  }
}

export { Temporal, Intl, toTemporalInstant };
