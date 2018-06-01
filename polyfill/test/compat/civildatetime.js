const test = require('tape');
const { CivilDateTime } = require('../../');

test('CivilDateTime', ({ test, end })=>{
  test('simple', ({ equal, end })=>{
    const instance = new CivilDateTime(1976, 11, 18, 15, 23, 30);

    equal('1976-11-18T15:23:30.000000000', instance.toString());
    equal('1976-11-18T15:23:30.000000000+01:00[Europe/Berlin]', instance.withZone('Europe/Berlin').toString());

    const anniversary = instance.plus({ years: 3 });
    equal('1979-11-18T15:23:30.000000000', anniversary.toString());
    equal('1979-11-18T15:23:30.000000000+01:00[Europe/Berlin]', anniversary.withZone('Europe/Berlin').toString());

    const runup = anniversary.plus({ months: -1 });
    equal('1979-10-18T15:23:30.000000000', runup.toString());
    equal('1979-10-18T15:23:30.000000000+01:00[Europe/Berlin]', runup.withZone('Europe/Berlin').toString());

    const thirty = runup.plus({ days: 30 });
    equal('1979-11-17T15:23:30.000000000', thirty.toString());
    equal('1979-11-17T15:23:30.000000000+01:00[Europe/Berlin]', thirty.withZone('Europe/Berlin').toString());

    const preptime = anniversary.plus({ hours: -5, minutes: 37, seconds: 30, milliseconds: 4, nanoseconds: -3 });
    equal('1979-11-18T11:01:00.003999997', preptime.toString());
    equal('1979-11-18T11:01:00.003999997+01:00[Europe/Berlin]', preptime.withZone('Europe/Berlin').toString());

    const daybreak = anniversary.with({ hour: 0, minute: 0, second: 0 });
    equal('1979-11-18T00:00:00.000000000', daybreak.toString());
    equal('1979-11-18T00:00:00.000000000+01:00[Europe/Berlin]', daybreak.withZone('Europe/Berlin').toString());

    const nightfall = anniversary.with({ hour: 23, minute: 59, second: 59, millisecond: 1000, nanosecond: -1 });
    equal('1979-11-18T23:59:59.999999999', nightfall.toString());
    equal('1979-11-18T23:59:59.999999999+01:00[Europe/Berlin]', nightfall.withZone('Europe/Berlin').toString());

    const year = (new Date()).getFullYear()
    const birthday = instance.with({ year });
    equal(`${year}-11-18T15:23:30.000000000`, birthday.toString());
    equal(`${year}-11-18T15:23:30.000000000+01:00[Europe/Berlin]`, birthday.withZone('Europe/Berlin').toString());

    end();
  });

  test('construct', ({ equal, end })=>{
    const instance = new CivilDateTime(1976, 11, 18, 15, 23, 30, 450, 12345);

    equal(typeof instance, 'object');
    equal(instance instanceof CivilDateTime, true);
    equal(instance.year, 1976);
    equal(instance.month, 11);
    equal(instance.day, 18);
    equal(instance.hour, 15);
    equal(instance.minute, 23);
    equal(instance.second, 30);
    equal(instance.millisecond, 450);
    equal(instance.nanosecond, 12345);
    equal(instance.toString(), '1976-11-18T15:23:30.450012345');

    end();
  });

  test('parse', ({ equal, end })=>{
    const one = CivilDateTime.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    equal(one instanceof CivilDateTime, true);
    equal(one.year, 1976);
    equal(one.month, 11);
    equal(one.day, 18);
    equal(one.hour, 15);
    equal(one.minute, 23);
    equal(one.second, 30);
    equal(one.millisecond, 450);
    equal(one.nanosecond, 100);

    const two = CivilDateTime.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    equal(two instanceof CivilDateTime, true);
    equal(two.year, 1976);
    equal(two.month, 11);
    equal(two.day, 18);
    equal(two.hour, 15);
    equal(two.minute, 23);
    equal(two.second, 30);
    equal(two.millisecond, 450);
    equal(two.nanosecond, 100);

    const three = CivilDateTime.parse('1976-11-18T15:23:30.450000100+01:00');
    equal(three instanceof CivilDateTime, true);
    equal(three.year, 1976);
    equal(three.month, 11);
    equal(three.day, 18);
    equal(three.hour, 15);
    equal(three.minute, 23);
    equal(three.second, 30);
    equal(three.millisecond, 450);
    equal(three.nanosecond, 100);

    const four = CivilDateTime.parse('1976-11-18T15:23:30.450000100');
    equal(four.year, 1976);
    equal(four.month, 11);
    equal(four.day, 18);
    equal(four.hour, 15);
    equal(four.minute, 23);
    equal(four.second, 30);
    equal(four.millisecond, 450);
    equal(four.nanosecond, 100);

    end();
  });

  end();
});
