import { Error as ErrorCtor } from './primordials.mjs';

export function assert(condition, message) {
  if (!condition) throw new ErrorCtor(`assertion failure: ${message}`);
}

export function assertNotReached(message) {
  const reason = message ? ` because ${message}` : '';
  throw new ErrorCtor(`assertion failure: code should not be reached${reason}`);
}
