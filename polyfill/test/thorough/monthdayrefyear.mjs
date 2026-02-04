import { getProgressBar, temporalImpl as T, time, withSnapshotsFromFile } from './support.mjs';

const calendars = [
  'buddhist',
  'chinese',
  'coptic',
  'dangi',
  'ethioaa',
  'ethiopic',
  'gregory',
  'hebrew',
  'indian',
  'islamic-civil',
  'islamic-tbla',
  'islamic-umalqura',
  'japanese',
  'persian',
  'roc'
];

const monthCodes = [
  'M01',
  'M01L',
  'M02',
  'M02L',
  'M03',
  'M03L',
  'M04',
  'M04L',
  'M05',
  'M05L',
  'M06',
  'M06L',
  'M07',
  'M07L',
  'M08',
  'M08L',
  'M09',
  'M09L',
  'M10',
  'M10L',
  'M11',
  'M11L',
  'M12',
  'M12L',
  'M13'
];

const maxDay = 32;

const total = calendars.length * monthCodes.length * maxDay * 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./monthdayrefyear.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const calendar of calendars) {
      for (const monthCode of monthCodes) {
        for (let day = 1; day <= maxDay; day++) {
          for (const overflow of ['constrain', 'reject']) {
            const testStr = `${calendar} ${monthCode}-${day} ${overflow.slice(0, 1)}`;
            progress.tick(1, { test: testStr });
            matchSnapshotOrOutOfRange(
              () =>
                T.PlainMonthDay.from({ calendar, monthCode, day }, { overflow }).toString({ calendarName: 'never' }),
              testStr
            );
          }
        }
      }
    }
  });

  return total;
});
