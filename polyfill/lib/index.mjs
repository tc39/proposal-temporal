import * as Temporal from './temporal.mjs';
import * as Intl from './intl.mjs';

export { Temporal, Intl };
export function setup(global = globalThis) {
  global.Temporal = {};
  copy(global.Temporal, Temporal);
  copy(global.Intl, Intl);

  function copy(target, source) {
    for (const prop of Object.getOwnPropertyNames(source)) {
      target[prop] = source[prop];
    }
  }
}
