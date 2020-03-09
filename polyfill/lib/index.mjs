import * as Temporal from './temporal.mjs';
import * as Intl from './intl.mjs';

Object.defineProperty(globalThis, 'Temporal', {
  value: {},
  writable: true,
  enumerable: false,
  configurable: true
});
copy(globalThis.Temporal, Temporal);
copy(globalThis.Intl, Intl);

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

export { Temporal, Intl };
