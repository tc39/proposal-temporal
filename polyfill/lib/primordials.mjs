import Call from 'es-abstract/2024/Call.js';

// Function Properties of the Global Object
export const { isFinite, isNaN, parseFloat, parseInt } = globalThis;

// Constructor Properties of the Global Object
export const {
  Array,
  BigInt,
  Date,
  Function,
  Map,
  Number,
  Object,
  Promise,
  RegExp,
  Set,
  String,
  Symbol,
  WeakMap,
  WeakSet
} = globalThis;

// Error constructors
export const { Error, RangeError, SyntaxError, TypeError } = globalThis;

// Other Properties of the Global Object
export const { Intl, JSON, Math, Reflect } = globalThis;

export const {
  assign: ObjectAssign,
  create: ObjectCreate,
  getOwnPropertyDescriptor: ObjectGetOwnPropertyDescriptor,
  getOwnPropertyNames: ObjectGetOwnPropertyNames,
  defineProperty: ObjectDefineProperty,
  defineProperties: ObjectDefineProperties,
  entries: ObjectEntries,
  keys: ObjectKeys
} = Object;

export const {
  from: ArrayFrom,
  prototype: {
    concat: ArrayPrototypeConcat,
    filter: ArrayPrototypeFilter,
    every: ArrayPrototypeEvery,
    find: ArrayPrototypeFind,
    flatMap: ArrayPrototypeFlatMap,
    forEach: ArrayPrototypeForEach,
    includes: ArrayPrototypeIncludes,
    indexOf: ArrayPrototypeIndexOf,
    join: ArrayPrototypeJoin,
    map: ArrayPrototypeMap,
    push: ArrayPrototypePush,
    reduce: ArrayPrototypeReduce,
    slice: ArrayPrototypeSlice,
    sort: ArrayPrototypeSort
  }
} = Array;
export const {
  now: DateNow,
  prototype: {
    getTime: DatePrototypeGetTime,
    getUTCFullYear: DatePrototypeGetUTCFullYear,
    getUTCMonth: DatePrototypeGetUTCMonth,
    getUTCDate: DatePrototypeGetUTCDate,
    getUTCHours: DatePrototypeGetUTCHours,
    getUTCMinutes: DatePrototypeGetUTCMinutes,
    getUTCSeconds: DatePrototypeGetUTCSeconds,
    getUTCMilliseconds: DatePrototypeGetUTCMilliseconds,
    setUTCFullYear: DatePrototypeSetUTCFullYear,
    setUTCMonth: DatePrototypeSetUTCMonth,
    setUTCDate: DatePrototypeSetUTCDate,
    setUTCHours: DatePrototypeSetUTCHours,
    setUTCMinutes: DatePrototypeSetUTCMinutes,
    setUTCSeconds: DatePrototypeSetUTCSeconds,
    setUTCMilliseconds: DatePrototypeSetUTCMilliseconds,
    toLocaleDateString: DatePrototypeToLocaleDateString,
    valueOf: DatePrototypeValueOf
  },
  UTC: DateUTC
} = Date;
export const {
  supportedValuesOf: IntlSupportedValuesOf,
  DateTimeFormat: IntlDateTimeFormat,
  DurationFormat: IntlDurationFormat
} = Intl;
export const { get: IntlDateTimeFormatPrototypeGetFormat } =
  ObjectGetOwnPropertyDescriptor(IntlDateTimeFormat?.prototype || ObjectCreate(null), 'format') || ObjectCreate(null);
export const {
  formatRange: IntlDateTimeFormatPrototypeFormatRange,
  formatRangeToParts: IntlDateTimeFormatPrototypeFormatRangeToParts,
  formatToParts: IntlDateTimeFormatPrototypeFormatToParts,
  resolvedOptions: IntlDateTimeFormatPrototypeResolvedOptions
} = IntlDateTimeFormat?.prototype || ObjectCreate(null);
export const { stringify: JSONStringify } = JSON;
export const {
  prototype: { entries: MapPrototypeEntries, get: MapPrototypeGet, has: MapPrototypeHas, set: MapPrototypeSet }
} = Map;
export const {
  abs: MathAbs,
  floor: MathFloor,
  log10: MathLog10,
  max: MathMax,
  min: MathMin,
  sign: MathSign,
  trunc: MathTrunc
} = Math;
export const {
  MAX_SAFE_INTEGER: NumberMaxSafeInteger,
  isFinite: NumberIsFinite,
  isInteger: NumberIsInteger,
  isNaN: NumberIsNaN,
  isSafeInteger: NumberIsSafeInteger,
  parseInt: NumberParseInt,
  prototype: { toPrecision: NumberPrototypeToPrecision, toString: NumberPrototypeToString }
} = Number;
export const {
  prototype: { exec: RegExpPrototypeExec, test: RegExpPrototypeTest }
} = RegExp;
export const {
  prototype: { add: SetPrototypeAdd, has: SetPrototypeHas, values: SetPrototypeValues }
} = Set;
export const {
  fromCharCode: StringFromCharCode,
  prototype: {
    charCodeAt: StringPrototypeCharCodeAt,
    endsWith: StringPrototypeEndsWith,
    indexOf: StringPrototypeIndexOf,
    match: StringPrototypeMatch,
    normalize: StringPrototypeNormalize,
    padStart: StringPrototypePadStart,
    repeat: StringPrototypeRepeat,
    replace: StringPrototypeReplace,
    slice: StringPrototypeSlice,
    split: StringPrototypeSplit,
    startsWith: StringPrototypeStartsWith,
    toLowerCase: StringPrototypeToLowerCase,
    toUpperCase: StringPrototypeToUpperCase
  }
} = String;
export const { iterator: SymbolIterator, for: SymbolFor, toStringTag: SymbolToStringTag } = Symbol;
export const {
  prototype: { get: WeakMapPrototypeGet, set: WeakMapPrototypeSet }
} = WeakMap;

export const MapIterator = Call(MapPrototypeEntries, new Map(), []);
export const MapIteratorPrototypeNext = MapIterator.next;
export const SetIterator = Call(SetPrototypeValues, new Set(), []);
export const SetIteratorPrototypeNext = SetIterator.next;

export const { console, performance } = globalThis;
export const { log, warn } = console;
export const now = performance && performance.now ? performance.now.bind(performance) : Date.now;
