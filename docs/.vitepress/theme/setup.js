import '../../../polyfill/dist/playground.js'

if (typeof window !== 'undefined') {
  window.Temporal = { ...temporal.Temporal };
  Object.assign(Intl, temporal.Intl);

  // Customize output of Temporal objects for Chrome DevTools
  if (!window.devtoolsFormatters)
    window.devtoolsFormatters = [];
  window.devtoolsFormatters.push({
    header (x) {
      for (const type of [
        Temporal.Instant,
        Temporal.Calendar,
        Temporal.PlainDate,
        Temporal.PlainDateTime,
        Temporal.Duration,
        Temporal.PlainMonthDay,
        Temporal.PlainTime,
        Temporal.TimeZone,
        Temporal.PlainYearMonth
      ]) {
        if (x instanceof type) return ['span', {}, `${x[Symbol.toStringTag]} <${x}>`];
      }
      return null;
    },
    hasBody (x) {
      return x instanceof Temporal.Duration;
    },
    body (x) {
      const out = ['ol', { style: 'list-style-type: none;' }];
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
        if (x[prop] !== 0) out.push([
          'li',
          {},
          ['span', { style: 'color: purple;' }, prop],
          `: `,
          ['span', { style: 'color: blue;' }, x[prop]]
        ]);
      }
      return out;
    }
  });
}
