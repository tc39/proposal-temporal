import { DatePrototypeValueOf } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { Instant } from './instant.mjs';

import bigInt from 'big-integer';

export function toTemporalInstant() {
  const epochNanoseconds = bigInt(ES.Call(DatePrototypeValueOf, this, [])).multiply(1e6);
  return new Instant(ES.BigIntIfAvailable(epochNanoseconds));
}
