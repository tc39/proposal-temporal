const test = require('tape');
const { CivilTime } = require('../../');

test('CivilTime', ({ test, end })=>{
  test('construct', ({ equal, end })=>{
    const instance = new CivilTime(15, 23, 30, 450, 12345);

    equal(typeof instance, 'object');
    equal(instance instanceof CivilTime, true);
    equal(instance.year, undefined);
    equal(instance.month, undefined);
    equal(instance.day, undefined);
    equal(instance.hour, 15);
    equal(instance.minute, 23);
    equal(instance.second, 30);
    equal(instance.millisecond, 450);
    equal(instance.nanosecond, 12345);
    equal(instance.toString(), '15:23:30.450012345');

    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = CivilTime.fromString('15:23:30.450000100');
    equal(one instanceof CivilTime, true);
    equal(one.hour, 15);
    equal(one.minute, 23);
    equal(one.second, 30);
    equal(one.millisecond, 450);
    equal(one.nanosecond, 100);

    throws(()=>{
      CivilTime.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    });
    throws(()=>{
      CivilTime.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      CivilTime.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      CivilTime.fromString('1976-11-18T15:23:30.450000100');
    });
    throws(()=>{
      CivilTime.fromString('15:23:30.123');
    });
    throws(()=>{
      CivilTime.fromString('15:23:30');
    });
    throws(()=>{
      CivilTime.fromString('15:23');
    });

    end();
  });

  end();
});
