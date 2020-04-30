import { absolute as regex } from './regex.mjs';

export function parse(isoString) {
  const match = regex.exec(isoString);
  if (!match) throw new RangeError(`Invalid ISO 8601 string: ${isoString}`);
  return {
    absolute: match[0],
    dateTime: match[1],
    date: match[2],
    yearMonth: `${match[3]}-${match[4]}`,
    monthDay: `${match[4]}-${match[5]}`,
    time: match[6],
    zone: match[13]
  };
}
