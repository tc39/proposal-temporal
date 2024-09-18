/* global __debug__ */

import {
  ArrayPrototypeJoin,
  ArrayPrototypePush,
  ObjectDefineProperty,
  ObjectGetOwnPropertyDescriptor,
  ObjectGetOwnPropertyNames,
  SymbolFor,
  SymbolToStringTag
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';

import ESGetIntrinsic from 'es-abstract/GetIntrinsic.js';

const INTRINSICS = {};

const customUtilInspectFormatters = {
  ['Temporal.Duration'](depth, options) {
    const descr = options.stylize(this._repr_, 'special');
    if (depth < 1) return descr;
    const entries = [];
    const props = [
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
    ];
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (this[prop] !== 0) Call(ArrayPrototypePush, entries, [`  ${prop}: ${options.stylize(this[prop], 'number')}`]);
    }
    return descr + ' {\n' + Call(ArrayPrototypeJoin, entries, [',\n']) + '\n}';
  }
};

function defaultUtilInspectFormatter(depth, options) {
  return options.stylize(this._repr_, 'special');
}

export function MakeIntrinsicClass(Class, name) {
  ObjectDefineProperty(Class.prototype, SymbolToStringTag, {
    value: name,
    writable: false,
    enumerable: false,
    configurable: true
  });
  if (typeof __debug__ !== 'undefined' && __debug__) {
    ObjectDefineProperty(Class.prototype, SymbolFor('nodejs.util.inspect.custom'), {
      value: customUtilInspectFormatters[name] || defaultUtilInspectFormatter,
      writable: false,
      enumerable: false,
      configurable: true
    });
  }
  const staticNames = ObjectGetOwnPropertyNames(Class);
  for (let i = 0; i < staticNames.length; i++) {
    const prop = staticNames[i];
    const desc = ObjectGetOwnPropertyDescriptor(Class, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    ObjectDefineProperty(Class, prop, desc);
  }
  const protoNames = ObjectGetOwnPropertyNames(Class.prototype);
  for (let i = 0; i < protoNames.length; i++) {
    const prop = protoNames[i];
    const desc = ObjectGetOwnPropertyDescriptor(Class.prototype, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    ObjectDefineProperty(Class.prototype, prop, desc);
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
