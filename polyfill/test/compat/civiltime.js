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

  test('parse', ({ equal, end })=>{
    const one = CivilTime.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    equal(one instanceof CivilTime, true);
    equal(one.hour, 15);
    equal(one.minute, 23);
    equal(one.second, 30);
    equal(one.millisecond, 450);
    equal(one.nanosecond, 100);

    const two = CivilTime.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    equal(two instanceof CivilTime, true);
    equal(two.hour, 15);
    equal(two.minute, 23);
    equal(two.second, 30);
    equal(two.millisecond, 450);
    equal(two.nanosecond, 100);

    const three = CivilTime.parse('1976-11-18T15:23:30.450000100+01:00');
    equal(three instanceof CivilTime, true);
    equal(three.hour, 15);
    equal(three.minute, 23);
    equal(three.second, 30);
    equal(three.millisecond, 450);
    equal(three.nanosecond, 100);

    const four = CivilTime.parse('1976-11-18T15:23:30.450000100');
    equal(four instanceof CivilTime, true);
    equal(four.hour, 15);
    equal(four.minute, 23);
    equal(four.second, 30);
    equal(four.millisecond, 450);
    equal(four.nanosecond, 100);

    end();
  });

  end();
});
