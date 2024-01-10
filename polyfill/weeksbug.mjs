/* eslint-disable no-console */
import * as Temporal from './lib/temporal.mjs';

function formatRounded(d, largestUnit, smallestUnit) {
  const relativeTo = Temporal.PlainDate.from('2023-06-01');
  const roundingMode = 'floor';
  const options = { relativeTo, roundingMode };
  return d
    .round({ ...options, largestUnit, smallestUnit })
    .toString()
    .padEnd(8);
}

function buildTable(d) {
  const yy = formatRounded(d, 'years', 'years');
  const ym = formatRounded(d, 'years', 'months');
  const yw = formatRounded(d, 'years', 'weeks');
  const yn = formatRounded(d, 'years', undefined);
  const mm = formatRounded(d, 'months', 'months');
  const mw = formatRounded(d, 'months', 'weeks');
  const mn = formatRounded(d, 'months', undefined);
  const ww = formatRounded(d, 'weeks', 'weeks');
  const wn = formatRounded(d, 'weeks', undefined);
  console.log(`\
| largest → smallest ↓ | years    | months   | weeks    |
| -------------------- | -------- | -------- | -------- |
|                years | ${yy   } | -        | -        |
|               months | ${ym   } | ${mm   } | -        |
|                weeks | ${yw   } | ${mw   } | ${ww   } |
|                 none | ${yn   } | ${mn   } | ${wn   } |
`);
}

console.log('\n=== Case 1: months + big weeks ===');
const d1 = Temporal.Duration.from({ months: 1, weeks: 9, days: 15 });
buildTable(d1);

console.log('\n== Case 2: months + zero weeks ===');
const d2 = Temporal.Duration.from({ months: 3, days: 12 });
buildTable(d2);

console.log('\n=== Case 3: zero years + zero months + big weeks ===');
const d3 = Temporal.Duration.from({ weeks: 52, days: 20 });
buildTable(d3);
