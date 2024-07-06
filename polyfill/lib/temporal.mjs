/* global __isTest262__ */

import './calendar.mjs';
export { Instant } from './instant.mjs';
export { PlainDate } from './plaindate.mjs';
export { PlainDateTime } from './plaindatetime.mjs';
export { Duration } from './duration.mjs';
export { PlainMonthDay } from './plainmonthday.mjs';
export { Now } from './now.mjs';
export { PlainTime } from './plaintime.mjs';
export { PlainYearMonth } from './plainyearmonth.mjs';
export { ZonedDateTime } from './zoneddatetime.mjs';

if (typeof __isTest262__ === 'undefined' || !__isTest262__) {
  // eslint-disable-next-line no-console
  console.warn(
    'This polyfill should only be used to run tests or to experiment in the browser devtools console.\n' +
      'To polyfill Temporal in your own projects, see https://github.com/tc39/proposal-temporal#polyfills.'
  );
}
