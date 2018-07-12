const test = require('tape');

const { toEpoch, fromEpoch, zoneOffset } = require('./epoch.js');

test('toEpoch', ({ test, end })=>{
  test('standard-time', ({ equal, end })=>{
    const timestamp = Date.parse('2018-11-18T14:23:30.100Z');

    equal(
      toEpoch({ year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, 'Europe/Vienna'),
      timestamp
    );

    equal(
      toEpoch({ year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, 'Europe/Berlin'),
      timestamp
    );

    equal(
      toEpoch({ year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, '+01:00'),
      timestamp
    );

    equal(
      toEpoch({ year: 1976, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, '+01:00'),
      Date.parse('1976-11-18T14:23:30.100Z')
    );

    equal(
      toEpoch({ year: 2018, month: 11, day: 18, hour: 14, minute: 23, second: 30, millisecond: 100 }, 'UTC'),
      timestamp
    );

    end();
  });

  test('savings-time', ({ equal, end })=>{
    const timestamp = Date.parse('2018-07-18T13:23:30.100Z');

    equal(
      toEpoch({ year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, 'Europe/Vienna'),
      timestamp
    );

    equal(
      toEpoch({ year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, 'Europe/Berlin'),
      timestamp
    );

    equal(
      toEpoch({ year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }, '+02:00'),
      timestamp
    );

    equal(
      toEpoch({ year: 2018, month: 7, day: 18, hour: 13, minute: 23, second: 30, millisecond: 100 }, 'UTC'),
      timestamp
    );

    end();
  });

  end();
});

test('fromEpoch', ({ test, deepEqual, end })=>{
  test('standard-time', ({ deepEqual, end })=>{
    const timestamp = Date.parse('2018-11-18T14:23:30.100Z');

    deepEqual(
      fromEpoch(timestamp, 'Europe/Vienna'),
      { year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, 'Europe/Berlin'),
      { year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, '+01:00'),
      { year: 2018, month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, 'UTC'),
      { year: 2018, month: 11, day: 18, hour: 14, minute: 23, second: 30, millisecond: 100 }
    );

    end();
  });

  test('savings-time', ({ deepEqual, end })=>{
    const timestamp = Date.parse('2018-07-18T13:23:30.100Z');

    deepEqual(
      fromEpoch(timestamp, 'Europe/Vienna'),
      { year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, 'Europe/Berlin'),
      { year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, '+02:00'),
      { year: 2018, month: 7, day: 18, hour: 15, minute: 23, second: 30, millisecond: 100 }
    );

    deepEqual(
      fromEpoch(timestamp, 'UTC'),
      { year: 2018, month: 7, day: 18, hour: 13, minute: 23, second: 30, millisecond: 100 }
    );

    end();
  });

  end();
});

test('zoneOffset', ({ equal, end })=>{
  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'Europe/Vienna'),
    '+01:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'Europe/Vienna'),
    '+02:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'Europe/London'),
    '+00:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'Europe/London'),
    '+01:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'America/New_York'),
    '-05:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'America/New_York'),
    '-04:00'
  );

  equal(
    zoneOffset(Date.parse('2018-11-18T15:23:30.100Z'), 'America/Los_Angeles'),
    '-08:00'
  );

  equal(
    zoneOffset(Date.parse('2018-07-18T15:23:30.100Z'), 'America/Los_Angeles'),
    '-07:00'
  );

  end();
});
