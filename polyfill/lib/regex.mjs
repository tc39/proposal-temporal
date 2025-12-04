import { RegExp as RegExpCtor, ArrayPrototypeJoin } from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';

const offsetIdentifierNoCapture = /(?:[+-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/;
const tzComponent = /[A-Za-z._][A-Za-z._0-9+-]*/;
export const timeZoneID = new RegExpCtor(
  `(?:${offsetIdentifierNoCapture.source}|(?:${tzComponent.source})(?:\\/(?:${tzComponent.source}))*)`
);

const yearpart = /(?:[+-]\d{6}|\d{4})/;
const monthpart = /(?:0[1-9]|1[0-2])/;
const daypart = /(?:0[1-9]|[12]\d|3[01])/;
export const datesplit = new RegExpCtor(
  Call(
    ArrayPrototypeJoin,
    [
      `(?<yearpart>${yearpart.source})`,
      `(?:-(?<monthpart>${monthpart.source})-`,
      `(?<daypart>${daypart.source})|`,
      `(?<monthpart>${monthpart.source})(?<daypart>${daypart.source}))`
    ],
    ['']
  )
);
const sep = /:/;
const hourminute = new RegExpCtor(`(?<hour>\\d{2})(?:(?:${sep.source})?(?<minute>\\d{2}))?`);
const second2 = /(?<second>\d{2})/;
const fraction = /(?:[.,](?<fraction>\d{1,9}))/;
const secondsfraction = new RegExpCtor(`(?:${sep.source}?${second2.source}${fraction.source}?)`);
const millismicrosfraction = /(?<millis>\d{2})(?:(?<micros>\d{2}))(?:[.,](?<nanos>\d{1,9}))?/;
const secondspart = new RegExpCtor(`${secondsfraction.source}|${millismicrosfraction.source}`);
const timesplit = new RegExpCtor(`(?:${hourminute.source})(?:${secondspart.source})?`);
const sign = /[+-]/;
const hour = /[01][0-9]|2[0-3]/;
const minute = /[0-5][0-9]/;
const second = minute;
const subseconds = /(?:[.,](?<subseconds>\d{1,9})?)/;
const optionalMinSecWithSep = new RegExpCtor(
  `(?:${sep.source})(?<minute>${minute.source})(?:${sep.source}(?<second>${second.source})${subseconds.source}?)?`
);
const optionalMinSecNoSep = new RegExpCtor(
  `(?<minute>${minute.source})(?<second>${second.source}${subseconds.source}?)?`
);
const optionalMinSec = new RegExpCtor(`(?:${optionalMinSecWithSep.source})|(?:${optionalMinSecNoSep.source})`);
const optionalMinSecWithSepNoCapture = new RegExpCtor(
  `(?:${sep.source})(?:${minute.source})(?:${sep.source}(?:${second.source}${subseconds.source}?))?`
);
const optionalMinSecNoSepNoCapture = new RegExpCtor(`(?:${minute.source})(?:${second.source}${subseconds.source}?)?`);
const optionalMinSecNoCapture = new RegExpCtor(
  `${optionalMinSecWithSepNoCapture.source}|${optionalMinSecNoSepNoCapture.source}`
);
export const offsetWithParts = new RegExpCtor(
  `^(?<sign>${sign.source})(?<hour>${hour.source})(?:${optionalMinSec.source})?$`
);
export const offset = new RegExpCtor(
  `(?<offset>(?:${sign.source})(?:${hour.source})(?:${optionalMinSecNoCapture.source})?)`
);
const offsetpart = new RegExpCtor(`(?<z>[zZ])|${offset.source}?`);
export const offsetIdentifier = /([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/;
export const annotation = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g;

export const zoneddatetime = new RegExpCtor(
  Call(
    ArrayPrototypeJoin,
    [
      `^${datesplit.source}`,
      `(?:(?:[tT]|\\s+)${timesplit.source}(?:${offsetpart.source})?)?`,
      `(?:\\[!?(?<timeZoneID>${timeZoneID.source})\\])?`,
      `(?<annotation>(?:${annotation.source})*)$`
    ],
    ['']
  )
);

export const time = new RegExpCtor(
  Call(
    ArrayPrototypeJoin,
    [
      `^[tT]?${timesplit.source}`,
      `(?:${offsetpart.source})?`,
      `(?:\\[!?((?<timeZoneID>${timeZoneID.source}))\\])?`,
      `(?<annotation>(?:${annotation.source})*)$`
    ],
    ['']
  )
);

// The short forms of YearMonth and MonthDay are only for the ISO calendar, but
// annotations are still allowed, and will throw if the calendar annotation is
// not ISO.
// Non-ISO calendar YearMonth and MonthDay have to parse as a Temporal.PlainDate,
// with the reference fields.
// YYYYMM forbidden by ISO 8601 because ambiguous with YYMMDD, but allowed by
// RFC 3339 and we don't allow 2-digit years, so we allow it.
// Not ambiguous with HHMMSS because that requires a 'T' prefix
// UTC offsets are not allowed, because they are not allowed with any date-only
// format; also, YYYY-MM-UU is ambiguous with YYYY-MM-DD
export const yearmonth = new RegExpCtor(
  `^(${yearpart.source})-?(${monthpart.source})(?:\\[!?${timeZoneID.source}\\])?((?:${annotation.source})*)$`
);
export const monthday = new RegExpCtor(
  `^(?:--)?(${monthpart.source})-?(${daypart.source})(?:\\[!?${timeZoneID.source}\\])?((?:${annotation.source})*)$`
);

const fraction1 = /(\d+)(?:[.,](\d{1,9}))?/;

const durationDate = /(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/;
const durationTime = new RegExpCtor(`(?:${fraction1.source}H)?(?:${fraction1.source}M)?(?:${fraction1.source}S)?`);
export const duration = new RegExpCtor(`^([+-])?P${durationDate.source}(?:T(?!$)${durationTime.source})?$`, 'i');
