import * as Temporal from './temporal.mjs';
import * as Intl from './intl.mjs';

export { Temporal, Intl };
export function setup(global = globalThis) {
  Object.defineProperty(global, "Temporal", {
    value: {},
    writable: true,
    enumerable: false,
    configurable: true,
  });
  copy(global.Temporal, Temporal);
  copy(global.Intl, Intl);

  function copy(target, source) {
    for (const prop of Object.getOwnPropertyNames(source)) {
      Object.defineProperty(target, prop, {
        value: source[prop],
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }
}
