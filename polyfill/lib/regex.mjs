const tzComponent = /\.[-A-Za-z_]|\.\.[-A-Za-z._]{1,12}|\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}/;
const offsetNoCapture = /(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\d{1,9})?)?)?)/;
export const timeZoneID = new RegExp(
  '(?:' +
    [
      `(?:${tzComponent.source})(?:\\/(?:${tzComponent.source}))*`,
      'Etc/GMT(?:0|[-+]\\d{1,2})',
      'GMT[-+]?0',
      'EST5EDT',
      'CST6CDT',
      'MST7MDT',
      'PST8PDT',
      offsetNoCapture.source
    ].join('|') +
    ')'
);

const yearpart = /(?:[+\u2212-]\d{6}|\d{4})/;
const monthpart = /(?:0[1-9]|1[0-2])/;
const daypart = /(?:0[1-9]|[12]\d|3[01])/;
export const datesplit = new RegExp(
  `(${yearpart.source})(?:-(${monthpart.source})-(${daypart.source})|(${monthpart.source})(${daypart.source}))`
);
const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
export const offset = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/;
const zonesplit = new RegExp(`(?:([zZ])|(?:${offset.source})?)(?:\\[!?(${timeZoneID.source})\\])?`);
export const annotation = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;

export const zoneddatetime = new RegExp(
  `^${datesplit.source}(?:(?:T|\\s+)${timesplit.source})?${zonesplit.source}((?:${annotation.source})*)$`,
  'i'
);

export const time = new RegExp(`^T?${timesplit.source}(?:${zonesplit.source})?((?:${annotation.source})*)$`, 'i');

// The short forms of YearMonth and MonthDay are only for the ISO calendar.
// Non-ISO calendar YearMonth and MonthDay have to parse as a Temporal.PlainDate,
// with the reference fields.
// YYYYMM forbidden by ISO 8601 because ambiguous with YYMMDD, but allowed by
// RFC 3339 and we don't allow 2-digit years, so we allow it.
// Not ambiguous with HHMMSS because that requires a 'T' prefix
export const yearmonth = new RegExp(`^(${yearpart.source})-?(${monthpart.source})$`);
export const monthday = new RegExp(`^(?:--)?(${monthpart.source})-?(${daypart.source})$`);

const fraction = /(\d+)(?:[.,](\d{1,9}))?/;

const durationDate = /(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/;
const durationTime = new RegExp(`(?:${fraction.source}H)?(?:${fraction.source}M)?(?:${fraction.source}S)?`);
export const duration = new RegExp(`^([+\u2212-])?P${durationDate.source}(?:T(?!$)${durationTime.source})?$`, 'i');
