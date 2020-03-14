import { ES } from './ecmascript.mjs';
const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');

export function parse(isoString) {
  if (typeof isoString !== 'string') {
    throw new TypeError('Expected string.');
  }
  const zIndex = isoString.indexOf('Z');
  if (zIndex < 0) {
    throw new RangeError('Not a valid ISO string.');
  }
  return {
    DateTime: DateTime.from(isoString.slice(0, zIndex)),
    TimeZone: new TimeZone(isoString.slice(zIndex + 1))
  };
}
