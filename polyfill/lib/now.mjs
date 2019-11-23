import { ES } from './ecmascript.mjs';
const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');

export const now = {
    absolute: getAbsolute,
    dateTime: getDateTime,
    date: getDate,
    time: getTime,
    timeZone: getTimeZone
};

function getAbsolute() {
    const ns = ES.SystemUTCEpochNanoSeconds();
    return new Absolute(ns);
}
function getDateTime(timeZone = getTimeZone()) {
    timeZone = ES.ToTimeZone(timeZone);
    const absolute = getAbsolute();
    let dateTime = timeZone.getDateTimeFor(absolute);
    return dateTime;
}
function getDate(timeZone) {
    return getDateTime(timeZone).getDate();
}
function getTime(timeZone) {
    return getDateTime(timeZone).getTime();
}
function getTimeZone() {
    let timeZone = ES.SystemTimeZone();
    return timeZone;
}
