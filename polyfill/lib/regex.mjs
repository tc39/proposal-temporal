const yearpart = /(?:[+-]\d{6}|\d{4})/;
const datepart = new RegExp(`(?:${yearpart.source}-\\d{2}-\\d{2})`);
const timepart = /(?:\d{2}\:\d{2}(?:\:\d{2}(?:\.\d{3}(?:\d{3}(?:\d{3})?)?)?)?)/;
const zonepart = /(?:Z|(?:[+-]\d{1,2}\:?\d{2}(?:\[[^\]\s]+\])?))/;

const datesplit = new RegExp(`(${yearpart.source})-(\\d{2})-(\\d{2})`);
const timesplit = /(\d{2})\:(\d{2})(?:\:(\d{2})(?:\.(\d{3})(\d{3})?(\d{3})?)?)?/;
const zonesplit = /(?:Z|(?:([+-]\d{1,2}\:?\d{2})(?:\[([^\]\s]+)\])?))/;

export const absolute = new RegExp(`^${datesplit.source}(?:T|\\s+)${timesplit.source}${zonesplit.source}$`);
export const datetime = new RegExp(`^${datesplit.source}(?:T|\\s+)${timesplit.source}(?:${zonepart.source})?$`);
export const date = new RegExp(`^${datesplit.source}(?:(?:T|\\s+)${timepart.source}${zonepart.source}?)?$`);
export const time = new RegExp(`^(?:${datepart.source}(?:T|\\s+))?${timesplit.source}(?:${zonepart.source})?$`);
export const timezone = new RegExp(`^(?:${datepart.source}(?:T|\\s+)${timepart.source})?${zonesplit.source}$`);
export const yearmonth = new RegExp(
  `^(${yearpart.source})-(\\d{2})(?:-\\d{2}(?:(?:T|\\s+)${timepart.source}${zonepart.source}?)?)?$`
);

export const monthday = new RegExp(
  '^' +
    [
      new RegExp(`(?:${yearpart.source}-(\\d{2})-(\\d{2})(?:(?:T|\\s+)${timepart.source}${zonepart.source}?)?)`).source,
      new RegExp(`(?:(\\d{2})-(\\d{2}))`).source
    ].join('|') +
    '$'
);

export const offset = /([+-][01]?[0-9]):?([0-5][0-9])/;
export const duration = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;
