# June 18, 2020

## Attendees

- Ujjwal Sharma (USA)
- Philipp Dunkel (PDL)
- Justin Grant (JGT)
- Shane Carr (SFC)
- Philip Chimento (PFC)
- Leo Balter (LBR)
- Jase Williams (JWS)

## Agenda

### TC39 presentation

- USA: The presentation went pretty well. There was a request from members of the committee to give them time to review the proposal.
- PDL: That's exactly what we're doing, so good.
- USA: We talked about it as well, and our plan to give two months' notice at the July meeting seems OK.
- PFC: I'd like to understand more about the 'exotic internal slot hazard' and whether it affects us.
- SFC: My understanding is the action is on RGN right now, to discuss it with the SES people.
- USA: The question about subclassing may also affect us.

### Publicity and gathering feedback on polyfill

- PFC: The idea is to have a blog post that can be linked to in a number of places and publicized with instructions about how to try the polyfill out. We also want a survey for people who have tested a polyfill, which is new for me. Would anyone like to contribute to the blogpost?
- SFC: I am interested in reviewing.
- USA: We want to have the survey ready before we publicize the blog post. I'm also working on a talk that I will give in a couple of places in the next weeks. So we intend to publish the survey soon.
- PFC: Our timeline is fairly tight so in order to allow plenty of time for feedback to come in, we need to get the publicity out as soon as possible.
- USA: If anyone wants to see the presentation let me know.

### [#664](https://github.com/tc39/proposal-temporal/issues/664) Clipping behaviour at end of calendar range

- PFC: This was SFC's idea, to have dates outside the supported range always throw.
- SFC: I think we're overloading the word 'constrain'. We want to 'constrain' the fields to be internally consistent, such as not putting 40 days in a month. On the other hand, we also 'constrain' the date to the range of legacy Date, which is really a different kind of constraint. We should split this because the latter should be the responsibility of the core Temporal types, not of the calendar, and the former should (could?) be the responsibility of the calendar.
- JGT: As a new user of the API I was also confused by that.
- PFC: I agree with SFC.
- SFC: Also, why don't we use a bigint to represent the year, and not have a range at all?
- PDL: I agree with the original suggestion, but we made the decision to have a range for interoperability. RGN would be able to explain it better since he was asking for it. So, the real limit if we didn't enforce anything would be `year <= MAX_SAFE_INTEGER`. I think we introduced the limit in order to have something less arbitrary.
- SFC: Assuming that we do keep a limit, my suggestion would be to just always reject if any of the wall-clock types were outside the limit. Alternatively, we could set `±Infinity` as the year field on overflow.
- PFC: The simplest way to split the responsibility of the calendar and the core types is the former. I'll make a PR. Any objections?
- SFC: Does this also remove the problem of making two calls to `calendar.dateTimeFromFields()`?
- PFC: I believe so.

## [#574](https://github.com/tc39/proposal-temporal/issues/574) Should Absolute and DateTime have different names for `inTimeZone` ?

- USA: The current proposal is to rename all methods named `withX` to `toY`. That is, rename methods from what they take in, to the type they convert to. I have a slight preference for the latter.
- JGT: There are two classes of APIs, `withX` and `inX`. The more I used Temporal and understood why the types were important, the more I found myself needing to know how to convert between types. Finding out how to convert is easier if the method is named after the type you're converting to. I agree with USA it's low-ish priority, except for `inTimeZone`, because that one is extra confusing because you don't know whether the thing you're calling it on is an Absolute or DateTime.
- USA: Indeed, that was what the issue was originally about. The middle ground approach would be to just rename `inTimeZone`. Although, note that with renaming `inTimeZone` you still have the same problem since there would be methods named `toDateTime` on both Absolute and Date.
- LBR: I'm just observing, but from my background in functional programming I'd definitely suggest using `toX`.
JGT: One nice thing about `toX` is the IDE experience, since you can see what types are available when you type "to" and see the autocomplete box. That's a nice discoverability mechanism.
- PFC: On the other hand, I can literally visualize a Date and Time being tacked together into DateTime when I see `date.withTime` and `time.withDate`, and this helped me learn the relationships between Temporal types. I don't know if this should outweigh the above arguments, though.
- USA: There are advantages to both, certainly. I propose that we rename `inTimeZone` right now, since there is a very strong reason to rename it, and keep the option open to rename the others.
- SFC: I have a slight preference for renaming everything for consistency.
- JGT: Agreed, and we should either do this at the beginning or end of the feedback period since it's quite disruptive.
- JWS: Agreed.
- USA: OK, the proposal is to rename everything for consistency. I will work on a PR.

### RFC 5545 vs. Temporal overview

- USA: JGT, before you start, is there any news about establishing a liaison relationship between ECMA and the CalDAV standard?
- SFC: I am not sure whether it appeared on the ECMA GA agenda this week. I will check in with DE.
- USA: I was thinking that if we could get their input on this, then that would lend any decisions we made here more authority.
- JGT: For context, I'm working on a calendar app and I recently learned about this standard. Here's an overview:
  - RFC 5545 = 2009 IETF standard defining data interop between calendar apps
    - Other cal-related standards (e.g. CalDAV) use RFC 5545 data model
    - JSCalendar will be JSON equivalent of RFC 5545 
  - Specifies both “Nominal” (like DateTime) vs. “Exact” (like Absolute) data
  - Disambiguation: like legacy Date: Spring DST=>later, Fall DST=>earlier
  - Durations use ISO 8601 syntax except:
    - No months/years
    - Negatives OK via prefix: e.g. -P1DT8H. No intra-duration negative units.
  - Duration math
    - Date units are considered nominal, time units are exact
    - Order of operations: add dates before adding times
    - Leap seconds are ignored
  - Challenges with Temporal
    - DST disambiguation not supported w/o custom code
    - RFC 5545 duration math is hard to get right, not ergonomic 
    - It's not much code that has to be written, but very challenging to figure out exactly what the code needs to do, so rolling your own is error-prone
- JGT: This is the only standard I've been able to find on this topic, so maybe it's worth matching it.
  - What do you think about matching the RFC 5545 behaviours with DateTime→Absolute disambiguation?
  - ...and order of operations?
  - What do you think about changing the duration math?
- PDL: Re. disambiguation, we just wanted to be consistent. I don't have any negative or positive comments on this. Let's change it over so long as we keep the parameter that lets you choose. I'm happy for it to be the default, but not the only thing.
- USA: I had a discussion with DE about this some time ago. In my talk I speak really highly of moment-js and Luxon, about how you can parse and emit many different formats. I believe people care about these things and we have enough API surface to have them, so if we do want to interoperate with RFC 5545 then I think we can. However there's also an advantage to having a small core.
- JGT: I think there are two separate classes of questions. One is "when there's a default behaviour that we need to choose, which arbitrary default do we choose?" That's a low-stakes question if there's not an obvious answer. The other kind is "do we need new functionality to support this?" as in negative durations. How about we consider these "mini-proposals" one at a time?
- PFC: I'm fine with the disambiguation change.
- JGT: I'll make a PR for that.
- JGT: Next one is order of operations. We should postpone this because PDL has a strong opinion about it and he just left, but I'll describe it now and we can talk about it next week. Basically it's "largest first".
