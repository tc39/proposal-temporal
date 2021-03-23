/* global __debug__ */

import ESGetIntrinsic from 'es-abstract/GetIntrinsic.js';

const INTRINSICS = {};

const customUtilInspectFormatters = {
  ['Temporal.Duration'](depth, options) {
    const descr = options.stylize(`${this[Symbol.toStringTag]} <${this}>`, 'special');
    if (depth < 1) return descr;
    const entries = [];
    for (const prop of [
      'years',
      'months',
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ]) {
      if (this[prop] !== 0) entries.push(`  ${prop}: ${options.stylize(this[prop], 'number')}`);
    }
    return descr + ' {\n' + entries.join(',\n') + '\n}';
  }
};

function defaultUtilInspectFormatter(depth, options) {
  return options.stylize(`${this[Symbol.toStringTag]} <${this}>`, 'special');
}

export function MakeIntrinsicClass(Class, name) {
  Object.defineProperty(Class.prototype, Symbol.toStringTag, {
    value: name,
    writable: false,
    enumerable: false,
    configurable: true
  });
  if (typeof __debug__ !== 'undefined' && __debug__) {
    Object.defineProperty(Class.prototype, Symbol.for('nodejs.util.inspect.custom'), {
      value: customUtilInspectFormatters[name] || defaultUtilInspectFormatter,
      writable: false,
      enumerable: false,
      configurable: true
    });
  }
  for (let prop of Object.getOwnPropertyNames(Class)) {
    const desc = Object.getOwnPropertyDescriptor(Class, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(Class, prop, desc);
  }
  for (let prop of Object.getOwnPropertyNames(Class.prototype)) {
    const desc = Object.getOwnPropertyDescriptor(Class.prototype, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(Class.prototype, prop, desc);
  }

  DefineIntrinsic(name, Class);
  DefineIntrinsic(`${name}.prototype`, Class.prototype);
}

export function DefineIntrinsic(name, value) {
  const key = `%${name}%`;
  if (INTRINSICS[key] !== undefined) throw new Error(`intrinsic ${name} already exists`);
  INTRINSICS[key] = value;
}

export function GetIntrinsic(intrinsic) {
  return intrinsic in INTRINSICS ? INTRINSICS[intrinsic] : ESGetIntrinsic(intrinsic);
}
