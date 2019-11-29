import { ES } from './ecmascript.mjs';
const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');

export const now = {
    absolute,
    dateTime,
    date,
    time,
    timeZone
};

function absolute() {
    const ns = ES.SystemUTCEpochNanoSeconds();
    return new Absolute(ns);
}
function dateTime(zone = timeZone()) {
    zone = ES.ToTimeZone(zone);
    const abs = absolute();
    const dateTime = zone.getDateTimeFor(abs);
    return dateTime;
}
function date(zone) {
    return dateTime(zone).getDate();
}
function time(zone) {
    return dateTime(zone).getTime();
}
function timeZone() {
    return ES.SystemTimeZone();
}
