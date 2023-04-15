import { ES } from './ecmascript.mjs';
import { Instant } from './instant.mjs';

import bigInt from 'big-integer';

export function toTemporalInstant() {
  // Observable access to valueOf is not correct here, but unavoidable
  const epochNanoseconds = bigInt(+this).multiply(1e6);
  return new Instant(ES.BigIntIfAvailable(epochNanoseconds));
}
