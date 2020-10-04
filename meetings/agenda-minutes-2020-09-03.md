Sept 3, 2020

Attendees:

Shane Carr (SFC)

Ujjwal Sharma (USA)

Richard Gibson (RGN), listening only

Philip Chimento (PFC)

Justin Grant (JGT)

Agenda:

* Remove time zone parameter from Absolute.toString? - [#741](https://github.com/tc39/proposal-temporal/issues/741) (10 min)

    * SFC: I agree with PFC's comment from July 16. (Remove the argument)

    * PFC: That is what we previously agreed on, but JGT and PDL are proposing keeping the argument and only emitting the offset in toString.

    * USA: As long as calling toString() without any options does something reasonable.

    * SFC: I don't think we actually need time zone or offset output in Absolute, if there's already an option in LocalDateTime to print a string without a bracket name. I think Absolute.toString should always print UTC.

    * USA: +1

    * PFC: That's OK with me.

    * SFC: Corollary, I think Absolute.toLocaleString should ignore the timeZone option and always print UTC.

    * USA: Does Absolute.toLocaleString actually need to exist, then?

    * SFC: Maybe the human representation of Absolute is more like "X billion seconds since the epoch"

    * USA: I think it's reasonable to convert to a "human" type like LocalDateTime or DateTime if you need human-readable output.

    * PFC: Especially if we are considering renaming Absolute to Timestamp, should you ever print a timestamp in a locale-dependent format?

    * SFC: That's fine with me.

    * PFC to post this counterproposal on the thread after the meeting.

    * SFC: Although, if you want to print out a time in the user's time zone, LocalDateTime will print in the time zone that it carries. So in order to print an Absolute in the user's time zone, you have to fetch the user's time zone and calendar in order to convert the Absolute to LocalDateTime. That would be unergonomic.

    * USA: If we kept Absolute.toLocaleString, would users expect it to take the locale's calendar into account? That's maybe an argument for removing it.

    * PFC: It's slightly weird that calling Absolute.toLocaleString effectively gives you the LocalDateTime.toLocaleString output, with a time zone and calendar magically determined from the locale. OTOH, if you provided those explicitly, you might end up doing new Intl.DateTimeFormat().resolvedOptions() anyway.

    * SFC: Do we want to have LocalDateTime.toLocaleString() have the user's time zone 'win' if the time zone of the LocalDateTime is UTC?

    * JGT: More context on the original issue, PDL and I discussed that Absolute is the domain of date, time, and offset. For example, if you get a date, time, and offset from SQL Server, you can read it in with Absolute.from, then Absolute.toString with a time zone argument is the way to get the same format back out. On the question of toLocaleString, I'm inclined to say that Absolute is a purely machine-readable type, so it seems reasonable to remove Absolute.toLocaleString.

    * SFC: My counterproposal is something like, showing a user "When did you create your account?" That's an Absolute, and you want to display it to the user in a localized way. But, if you have to convert it to LocalDateTime and get the user's time zone and calendar first, that's clunky. The question was, should we allow the user's time zone to override the LocalDateTime's time zone in toLocaleString, if the LocalDateTime's time zone is UTC?

    * JGT: I think Absolute is really not for human consumption.

    * SFC: I agree from a theoretical point of view, but I'm making a practicality argument.

    * JGT: (???)

    * SFC: That was the argument for overriding the calendar if it's ISO. ISO is a machine calendar, Gregorian is the human version of that calendar. I'd propose the same thing for UTC. GMT is the human version.

    * USA: Agreed; a LocalDateTime with UTC and ISO calendar is really an Absolute, no?

    * SFC: Here's another mental model, I'm curious if anyone buys it. DateTime has no time zone, and we also don't accept one in the toLocaleString options. Maybe the

    * JGT: I don't have a strong opinion as long as we never change the time zone in LocalDateTime. If you have a LocalDateTime with UTC, there's no way to get that other than constructing a LocalDateTime with UTC explicitly.

    * USA: My suggestion was to default Absolute.toLocalDateTime to UTC, though.

    * JGT: The reason not to do that is that nobody lives in UTC.

    * SFC: Nobody lives in the ISO calendar either, they live in the Gregorian calendar.

    * JGT: Unlike the Gregorian calendar, very little of the world lives in a time zone that is equal to UTC.

    * USA: If you don't want the default, you will find out easily enough. That's why I think it's OK to use a default that is explicitly considered overridable.

    * JGT: There is no scenario anywhere where you should be able to get a LocalDateTime where you have not explicitly opted into a time zone.

    * USA: I think we agree that LocalDateTime with UTC is an absurd time zone, though.

    * JGT: Yes.

    * USA: That's why I think it's OK to consider that an overridable value.

    * SFC: If the one is the default, then the other should be the default.

    * PFC: I buy SFC's convenience argument for having Absolute.toLocaleString. I also buy JGT's argument for why you want to parse date+time+offset into Absolute and therefore round trip it.

    * USA: I am also sold on that. I forgot that you can't parse date+time+offset into LocalDateTime because you need brackets.

* Absolute.toLocalDateTime sidebar

    * SFC: Is there a bikeshed thread for this? toLocalDateTime()? toLocalDateTimeWithTimeZoneAndCalendar() would be really long. How about localize()?

* Decisions:

    * Should Absolute.toString take a TimeZone parameter and emit only an offset (no brackets)? YES

    * Should Absolute.toLocalDateTime default to the UTC time zone?  NO

    * Should toLocaleString live on Absolute? YES, and it should use the user’s default time zone and calendar.
