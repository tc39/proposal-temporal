/* eslint-disable no-console */
import * as Temporal from '../../polyfill/lib/temporal.mjs';
import ICAL from 'ical.js';

// Example of a wrapper class for Temporal.ZonedDateTime that implements custom
// time zones.
// The use case is based on Thunderbird's use of the ical.js library to parse
// iCalendar data. iCalendar uses VTIMEZONE components which define UTC offset
// transitions inside the data format. VTIMEZONE can include a TZID field, which
// may or may not be an IANA time zone ID. If it's an IANA time zone ID,
// Thunderbird uses the environment's TZDB definition and ignores the rest of
// the VTIMEZONE (in which case everything works just like
// Temporal.ZonedDateTime, as we delegate to the this.#impl object). However,
// Microsoft Exchange often generates TZID strings that aren't IANA IDs, and
// then Thunderbird falls back to the iCalendar VTIMEZONE definition (in which
// case we use ical.js to perform the time zone calculations.)

class ZonedDateTime {
  // #impl: The internal Temporal.ZonedDateTime object. If the VTIMEZONE is an
  // IANA time zone, its timeZoneId is the VTIMEZONE's TZID, and we delegate all
  // the operations to it. If not, its timeZoneId is UTC.
  #impl;
  #timeZone; // The ICAL.Timezone instance.
  #isIANA; // Convenience flag indicating whether we can delegate to #impl.

  // These properties allow the object to be used as a PlainDateTime property
  // bag if the time zone isn't IANA. For example, as a relativeTo parameter in
  // Duration methods.
  era;
  eraYear;
  year;
  month;
  monthCode;
  day;
  hour;
  minute;
  second;
  millisecond;
  microsecond;
  nanosecond;
  calendar;

  // This property additionally allows the object to be used as a ZonedDateTime
  // property bag if the time zone is IANA
  timeZone;

  constructor(epochNs, timeZone, calendar = 'iso8601') {
    this.#timeZone = timeZone;
    this.#isIANA = Intl.supportedValuesOf('timeZone').includes(timeZone.tzid);
    this.#impl = new Temporal.ZonedDateTime(epochNs, this.#isIANA ? this.#timeZone.tzid : 'UTC', calendar);

    // Define public property-bag properties
    if (this.#isIANA) {
      this.timeZone = timeZone.tzid;
    }
    this.calendar = calendar;

    const pdt = this.toPlainDateTime();
    this.era = pdt.era;
    this.eraYear = pdt.eraYear;
    this.year = pdt.year;
    this.month = pdt.month;
    this.monthCode = pdt.monthCode;
    this.day = pdt.day;
    this.hour = pdt.hour;
    this.minute = pdt.minute;
    this.second = pdt.second;
    this.millisecond = pdt.millisecond;
    this.microsecond = pdt.microsecond;
    this.nanosecond = pdt.nanosecond;
  }

  // For now, from() only clones; semantics of deserialization from string are
  // yet to be defined
  static from(item) {
    return new ZonedDateTime(item.#impl.epochNanoseconds, item.#timeZone, item.#impl.calendarId);
  }

  // Use this method instead of Instant.prototype.toZonedDateTimeISO()
  static fromInstant(instant, timeZone, calendar = 'iso8601') {
    return new ZonedDateTime(instant.epochNanoseconds, timeZone, calendar);
  }

  // Use this method instead of PlainDateTime.prototype.toZonedDateTime() and
  // PlainDate.prototype.toZonedDateTime()
  static fromPlainDateTime(pdt, timeZone, options) {
    if (Intl.supportedValuesOf('timeZone').includes(timeZone.tzid)) {
      const temporalZDT = pdt.toZonedDateTime(timeZone.tzid, options);
      return new ZonedDateTime(temporalZDT.epochNanoseconds, timeZone, pdt.calendarId);
    }
    const icalTime = new ICAL.Time(
      {
        year: pdt.year,
        month: pdt.month,
        day: pdt.day,
        hour: pdt.hour,
        minute: pdt.minute,
        second: pdt.second
      },
      timeZone
    );
    const epochSeconds = icalTime.toUnixTime(); // TODO: apply disambiguation parameter?
    const epochNanoseconds =
      BigInt(epochSeconds) * 1000000000n + BigInt(pdt.millisecond * 1e6 + pdt.microsecond * 1e3 + pdt.nanosecond);
    return new ZonedDateTime(epochNanoseconds, timeZone, pdt.calendarId);
  }

  static compare(a, b) {
    return Temporal.ZonedDateTime.compare(a.#impl, b.#impl);
  }

  toPlainDateTime() {
    if (this.#isIANA) {
      return this.#impl.toPlainDateTime();
    }
    // this.#impl with a non-IANA time zone uses UTC internally, so we can just
    // calculate the plain date-time in UTC and add the UTC offset.
    return this.#impl.toPlainDateTime().add({ nanoseconds: this.offsetNanoseconds });
  }

  get offsetNanoseconds() {
    if (this.#isIANA) {
      return this.#impl.offsetNanoseconds;
    }
    const epochSeconds = Math.floor(this.#impl.epochMilliseconds / 1000);
    const utcTime = new ICAL.Time();
    utcTime.fromUnixTime(epochSeconds);
    const time = utcTime.convertToZone(this.#timeZone);
    const offsetSeconds = this.#timeZone.utcOffset(time);
    return offsetSeconds * 1e9;
  }

  // similar to the other xOfY properties, only showing one for the example
  get dayOfWeek() {
    return this.toPlainDateTime().dayOfWeek;
  }
  // ...get dayOfYear(), etc. omitted because they are very similar to the above

  #isoDateTimePartString(n) {
    return String(n).padStart(2, '0');
  }

  get offset() {
    const offsetNs = this.offsetNanoseconds;
    const sign = offsetNs < 0 ? '-' : '+';
    const absoluteNs = Math.abs(offsetNs);
    const hour = Math.floor(absoluteNs / 3600e9);
    const minute = Math.floor(absoluteNs / 60e9) % 60;
    const second = Math.floor(absoluteNs / 1e9) % 60;
    let result = `${sign}${this.#isoDateTimePartString(hour)}:${this.#isoDateTimePartString(minute)}`;
    if (second === 0) {
      return result;
    }
    result += `:${this.#isoDateTimePartString(second)}`;
    return result;
  }

  get epochMilliseconds() {
    return this.#impl.epochMilliseconds;
  }

  get epochNanoseconds() {
    return this.#impl.epochNanoseconds;
  }

  // PlainTime property bag and string arguments omitted for brevity
  withPlainTime(time) {
    const pdt = this.toPlainDateTime();
    return ZonedDateTime.fromPlainDateTime(pdt.withPlainTime(time), this.#timeZone);
  }

  withCalendar(calendar) {
    return new ZonedDateTime(this.#impl.epochNanoseconds, this.#timeZone, calendar);
  }

  withTimeZone(timeZone) {
    return new ZonedDateTime(this.#impl.epochNanoseconds, timeZone, this.#impl.calendarId);
  }

  // Not currently implemented, for brevity: duration property bag and duration
  // string inputs
  add(duration, options) {
    if (
      this.#isIANA ||
      (duration.years === 0 && duration.months === 0 && duration.weeks === 0 && duration.days === 0)
    ) {
      // Adding non-calendar units is independent of time zone, so in that case
      // we can delegate to this.#impl even in the case of a non-IANA time zone
      const temporalZDT = this.#impl.add(duration, options);
      return new ZonedDateTime(temporalZDT.epochNanoseconds, this.#timeZone, this.#impl.calendarId);
    }
    const pdt = this.toPlainDateTime().add(
      {
        years: duration.years,
        months: duration.months,
        weeks: duration.weeks,
        days: duration.days
      },
      options
    );
    const intermediate = ZonedDateTime.fromPlainDateTime(pdt, this.#timeZone, { disambiguation: 'compatible' });
    return intermediate.add(
      Temporal.Duration.from({
        hours: duration.hours,
        minutes: duration.minutes,
        seconds: duration.seconds,
        milliseconds: duration.milliseconds,
        microseconds: duration.microseconds,
        nanoseconds: duration.nanoseconds
      })
    );
  }

  // Not currently implemented, for brevity: property bag and string inputs;
  // plural forms of largestUnit
  // largestUnit > "hours" is also not currently implemented because that would
  // require semantics for equality of two ICAL.Timezone instances (see the note
  // about equals() below)
  until(other, options) {
    const { largestUnit = 'hour' } = options ?? {};
    if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week' || largestUnit === 'day') {
      throw new Error('not implemented');
    }
    // Non-calendar largestUnit is independent of time zone, so we can delegate
    // to this.#impl even in the case of a non-IANA time zone
    return this.#impl.until(other.#impl, options);
  }

  startOfDay() {
    const pdt = this.toPlainDateTime();
    const midnight = Temporal.PlainTime.from('00:00');
    return ZonedDateTime.fromPlainDateTime(pdt.withPlainTime(midnight), this.#timeZone, {
      disambiguation: 'compatible'
    });
  }

  toInstant() {
    return this.#impl.toInstant();
  }

  toPlainDate() {
    return this.toPlainDateTime().toPlainDate();
  }

  toPlainTime() {
    return this.toPlainDateTime().toPlainTime();
  }

  valueOf() {
    throw new TypeError();
  }

  // Methods that are not implemented, and why:
  // Semantics for equality of ICAL.Timezone not defined, so omitting this
  // method for now, as its semantics would need to be better defined
  equals(other) {
    if (this.#isIANA && other.#isIANA) {
      return this.#impl.equals(other.#impl);
    }
    throw new Error('not implemented');
  }

  // Not currently implemented, for brevity
  with(zonedDateTimeLike, options) {
    if (this.#isIANA) {
      const temporalZDT = this.#impl.with(zonedDateTimeLike, options);
      return new ZonedDateTime(temporalZDT.epochNanoseconds, this.#timeZone, this.#impl.calendarId);
    }
    throw new Error('not implemented');
  }

  // Not currently implemented, for brevity
  round(options) {
    if (this.#isIANA) {
      return this.#impl.round(options);
    }
    throw new Error('not implemented');
  }

  // ICAL.Timezone doesn't yet have a method for fetching prev/next transition,
  // so omitting this method for now
  getTimeZoneTransition(direction) {
    if (this.#isIANA) {
      const temporalZDTorNull = this.#impl.getTimeZoneTransition(direction);
      if (temporalZDTorNull === null) {
        return null;
      }
      return new ZonedDateTime(temporalZDTorNull.epochNanoseconds, this.#timeZone, this.#impl.calendarId);
    }
    throw new Error('not implemented');
  }

  // Omitting these three convert-to-string methods for now, semantics of
  // (de)serialization are yet to be defined. Would also need to figure out how
  // to get localized output for toLocaleString() in particular.
  toLocaleString(locales, options) {
    if (this.#isIANA) {
      return this.#impl.toLocaleString(locales, options);
    }
    throw new Error('not implemented');
  }

  toString(options) {
    if (this.#isIANA) {
      return this.#impl.toString(options);
    }
    return this.toPlainDateTime().toString() + `[UNIMPLEMENTED: custom time zone ${this.#timeZone.tzid}]`;
  }

  toJSON() {
    return this.toString();
  }
}

const ianaCalendarEvent = ICAL.parse(`\
BEGIN:VCALENDAR
VERSION:2.0
PRODID:Zimbra-Calendar-Provider
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
BEGIN:STANDARD
DTSTART:19710101T020000
TZOFFSETTO:-0800
TZOFFSETFROM:-0700
RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11
TZNAME:PST
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19710101T020000
TZOFFSETTO:-0700
TZOFFSETFROM:-0800
RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3
TZNAME:PDT
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
UID:44c10eaa-db0b-4223-8653-cf2b63f26326
RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR
SUMMARY:Calendar
DESCRIPTION:desc
ATTENDEE;CN=XXX;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRU
 E:mailto:foo@bar.com
ATTENDEE;CN=XXXX;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TR
 UE:mailto:x@bar.com
ORGANIZER;CN=foobar:mailto:x@bar.com
DTSTART;TZID=America/Los_Angeles:20120911T103000
DTEND;TZID=America/Los_Angeles:20120911T110000
STATUS:CONFIRMED
CLASS:PUBLIC
TRANSP:OPAQUE
LAST-MODIFIED:20120911T184851Z
DTSTAMP:20120911T184851Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT5M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR
`);

const msCalendarEvent = ICAL.parse(`\
BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Microsoft Exchange Server 2010
VERSION:2.0
BEGIN:VTIMEZONE
TZID:US Mountain Standard Time
BEGIN:STANDARD
DTSTART:16010101T000000
TZOFFSETFROM:-0700
TZOFFSETTO:-0700
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T000000
TZOFFSETFROM:-0700
TZOFFSETTO:-0700
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
ORGANIZER;CN=Frank:mailto:frank@example.com
DESCRIPTION;LANGUAGE=en-US:Some description goes here
UID:040000008200E00074C2B7101A82F00800000000FA2634575E11D901000000000000000
 0100000006D3FFDF37ED86F429B8315DBBE50E4D1
SUMMARY;LANGUAGE=en-US:Technical Tag-Up
DTSTART;TZID=US Mountain Standard Time:20221221T090000
DTEND;TZID=US Mountain Standard Time:20221221T093000
CLASS:PUBLIC
PRIORITY:5
DTSTAMP:20221216T145449Z
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:0
LOCATION;LANGUAGE=en-US:Virtual - Skype Meeting
X-MICROSOFT-CDO-APPT-SEQUENCE:0
X-MICROSOFT-CDO-OWNERAPPTID:2121040890
X-MICROSOFT-CDO-BUSYSTATUS:TENTATIVE
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
X-MICROSOFT-CDO-ALLDAYEVENT:FALSE
X-MICROSOFT-CDO-IMPORTANCE:1
X-MICROSOFT-CDO-INSTTYPE:0
X-MICROSOFT-ONLINEMEETINGINFORMATION:{"OnlineMeetingChannelId":null\\,"Onlin
 eMeetingProvider":3}
X-MICROSOFT-DONOTFORWARDMEETING:FALSE
X-MICROSOFT-DISALLOW-COUNTER:FALSE
X-MICROSOFT-LOCATIONDISPLAYNAME:Virtual - Skype Meeting
X-MICROSOFT-LOCATIONSOURCE:None
X-MICROSOFT-LOCATIONS:[{"DisplayName":"Virtual - Skype Meeting"\\,"LocationA
 nnotation":""\\,"LocationUri":""\\,"LocationStreet":""\\,"LocationCity":""\\,"
 LocationState":""\\,"LocationCountry":""\\,"LocationPostalCode":""\\,"Locatio
 nFullAddress":""}]
BEGIN:VALARM
DESCRIPTION:REMINDER
TRIGGER;RELATED=START:-PT15M
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
`);

const msCalendarEvent2 = ICAL.parse(`\
BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Microsoft Exchange Server 2010
VERSION:2.0
BEGIN:VTIMEZONE
TZID:Pacific Standard Time
BEGIN:STANDARD
DTSTART:16010101T020000
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=1SU;BYMONTH=11
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T020000
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=2SU;BYMONTH=3
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
ORGANIZER;CN=Sean:mailto:sean@example.com
DESCRIPTION;LANGUAGE=en-US:\\nSome description
UID:040000008200E00074C5B7101A87E00800000000E34E497CF42CD801000000000000000
 0100000003EFD63857B13AF41A430D32A1905BE7B
RECURRENCE-ID;TZID=Pacific Standard Time:20221228T130000
SUMMARY;LANGUAGE=en-US:Weekly Backlog Review 
DTSTART;TZID=Pacific Standard Time:20221229T130000
DTEND;TZID=Pacific Standard Time:20221229T140000
CLASS:PUBLIC
PRIORITY:5
DTSTAMP:20221220T010040Z
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:22
LOCATION;LANGUAGE=en-US:
X-MICROSOFT-CDO-APPT-SEQUENCE:22
X-MICROSOFT-CDO-OWNERAPPTID:2120410083
X-MICROSOFT-CDO-BUSYSTATUS:TENTATIVE
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
X-MICROSOFT-CDO-ALLDAYEVENT:FALSE
X-MICROSOFT-CDO-IMPORTANCE:1
X-MICROSOFT-CDO-INSTTYPE:3
X-MICROSOFT-DONOTFORWARDMEETING:FALSE
X-MICROSOFT-DISALLOW-COUNTER:FALSE
X-MICROSOFT-LOCATIONS:[]
BEGIN:VALARM
DESCRIPTION:REMINDER
TRIGGER;RELATED=START:-PT15M
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
`);

[ianaCalendarEvent, msCalendarEvent, msCalendarEvent2].forEach((jcalData) => {
  const component = new ICAL.Component(jcalData);
  const event = new ICAL.Event(component.getFirstSubcomponent('vevent'));
  const instantStart = Temporal.Instant.fromEpochMilliseconds(event.startDate.toUnixTime() * 1000);
  const zdt = ZonedDateTime.fromInstant(instantStart, event.startDate.zone);
  const instantEnd = Temporal.Instant.fromEpochMilliseconds(event.endDate.toUnixTime() * 1000);
  const zdtEnd = ZonedDateTime.fromInstant(instantEnd, event.endDate.zone);

  console.log('--------');
  console.log(zdt.toString());
  console.log('fields', zdt.era, zdt.eraYear, zdt.year, zdt.month, zdt.monthCode, zdt.day);
  console.log(zdt.hour, zdt.minute, zdt.second, zdt.millisecond, zdt.microsecond, zdt.nanosecond);
  console.log('dayOfWeek', zdt.dayOfWeek);
  console.log('toPlainDateTime', zdt.toPlainDateTime().toString());
  console.log('offsetNanoseconds', zdt.offsetNanoseconds);
  console.log('offset', zdt.offset);
  console.log('epochMilliseconds', zdt.epochMilliseconds);
  console.log('epochNanoseconds', zdt.epochNanoseconds);
  console.log('startOfDay', zdt.startOfDay().toString());
  console.log('toInstant', zdt.toInstant().toString());
  console.log('toPlainDate', zdt.toPlainDate().toString());
  console.log('toPlainTime', zdt.toPlainTime().toString());
  console.log('withPlainTime', zdt.withPlainTime(Temporal.PlainTime.from('13:37')).toString());
  console.log('withCalendar', zdt.withCalendar('gregory').toString());
  console.log('add', zdt.add(Temporal.Duration.from('P1Y3DT2H30M')).toString());
  console.log('until', zdt.until(zdtEnd).toString());
  console.log(
    'use as relativeTo',
    Temporal.Duration.from('P1M15DT12H').round({ smallestUnit: 'day', relativeTo: zdt }).toString()
  );
});
