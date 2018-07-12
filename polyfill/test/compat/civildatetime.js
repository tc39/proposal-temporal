const test = require('tape');
const { CivilDateTime } = require('../../');

test('CivilDateTime', ({ test, end })=>{
  test('simple', ({ equal, end })=>{
    const instance = new CivilDateTime(1976, 11, 18, 15, 23, 30);

    equal('1976-11-18T15:23:30.000000000', instance.toString());
    equal('1976-11-18T15:23:30.000000000+01:00', instance.withZone('Europe/Berlin').toString());

    const anniversary = instance.plus({ years: 3 });
    equal('1979-11-18T15:23:30.000000000', anniversary.toString());
    equal('1979-11-18T15:23:30.000000000+01:00', anniversary.withZone('Europe/Berlin').toString());

    const runup = anniversary.plus({ months: -1 });
    equal('1979-10-18T15:23:30.000000000', runup.toString());
    equal('1979-10-18T15:23:30.000000000+01:00', runup.withZone('Europe/Berlin').toString());

    const thirty = runup.plus({ days: 30 });
    equal('1979-11-17T15:23:30.000000000', thirty.toString());
    equal('1979-11-17T15:23:30.000000000+01:00', thirty.withZone('Europe/Berlin').toString());

    const preptime = anniversary.plus({ hours: -5, minutes: 37, seconds: 30, milliseconds: 4, nanoseconds: -3 });
    equal('1979-11-18T11:01:00.003999997', preptime.toString());
    equal('1979-11-18T11:01:00.003999997+01:00', preptime.withZone('Europe/Berlin').toString());

    const daybreak = anniversary.with({ hour: 0, minute: 0, second: 0 });
    equal('1979-11-18T00:00:00.000000000', daybreak.toString());
    equal('1979-11-18T00:00:00.000000000+01:00', daybreak.withZone('Europe/Berlin').toString());

    const nightfall = anniversary.with({ hour: 23, minute: 59, second: 59, millisecond: 1000, nanosecond: -1 });
    equal('1979-11-18T23:59:59.999999999', nightfall.toString());
    equal('1979-11-18T23:59:59.999999999+01:00', nightfall.withZone('Europe/Berlin').toString());

    const year = (new Date()).getFullYear()
    const birthday = instance.with({ year });
    equal(`${year}-11-18T15:23:30.000000000`, birthday.toString());
    equal(`${year}-11-18T15:23:30.000000000+01:00`, birthday.withZone('Europe/Berlin').toString());

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

  test('fromString', ({ equal, throws, end })=>{
    const one = CivilDateTime.fromString('1976-11-18T15:23:30.450000100');
    equal(one instanceof CivilDateTime, true);
    equal(one.year, 1976);
    equal(one.month, 11);
    equal(one.day, 18);
    equal(one.hour, 15);
    equal(one.minute, 23);
    equal(one.second, 30);
    equal(one.millisecond, 450);
    equal(one.nanosecond, 100);

    throws(()=>{
      CivilDateTime.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      CivilDateTime.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      CivilDateTime.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      CivilDateTime.fromString('1976-11-18T15:23:30');
    });
    throws(()=>{
      CivilDateTime.fromString('1976-11-18');
    });

    end();
  });

  end();
});
