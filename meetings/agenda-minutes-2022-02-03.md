# February 3, 2022

## Attendees
- Jesse Alama (JMN)
- Shane Carr (SFC)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)

## Agenda

### IETF status
Invite USA to attend the next meeting to talk about this.
There is supposed to be a SEDATE meeting this month, but it has yet to be scheduled.

### ECMA-402 status
#### What to present at ECMA-402 monthly, 2022-02-10
- PFC: What would this audience like to know?
- SFC: [#2005](https://github.com/tc39/proposal-temporal/issues/2005) was one example of an issue we should discuss. Two things; give an overview of the 402 annex changes. Slides not necessary but wouldn't hurt, making sure everyone in TG2 is aware of the changes. Second, overview of all the open issues that concern TG2. #2005 is one, there may be more.
- JGT: [#1899](https://github.com/tc39/proposal-temporal/issues/1899) is another one.

#### Specifying calendar operations ([#1899](https://github.com/tc39/proposal-temporal/issues/1899))
JGT to review latest commits to [#1928](https://github.com/tc39/proposal-temporal/pull/1928)

#### In `.toLocaleString()` options, property-bag form of `calendar` and `timeZone` will throw ([#2005](https://github.com/tc39/proposal-temporal/issues/2005))
To discuss at next week’s 402 meeting.
- PFC: It looks like we have a clear idea of what we want.
- JGT: Including the property bag form of calendars and time zones?
- SFC: I think so.
- JGT: An overview of all the places in Temporal where we expect TG2 to care seems like it should go in the slides.

#### Clarify if / how Intl.DateTimePattern should format the time zone ([#2013](https://github.com/tc39/proposal-temporal/issues/))

### -0 in Temporal.Duration ([#1715](https://github.com/tc39/proposal-temporal/issues/1715))
- PFC: This issue is relevant again if we are storing Number values in Duration internal slots. We left off last time with the current situation being inconsistent, and would need to be resolved either consistently with -0 or without -0.
- RGN left a comment via Matrix that he thinks Duration should not have a concept of -0.
- JGT: Durations aren't conceptually IEEE floating point numbers, so I don't think -0 is appropriate here.
- SFC: In IEEE you always get the same number if you add -0. But if you add +0 to -0 it changes the sign.
- JGT: Weird.
- SFC: We already throw an exception if numbers in Duration fields have opposite signs. It seems consistent if `Duration.negated()` flips the signs of all the fields including the zeroes.
- PDL: I'm worried about mathematical implications. It's actually not that easy to get a -0 in JS in the normal course of things, but this would make it easier. I'd worry that we'd be "squirting" -0s all over the place into other contexts where they otherwise would be rare, causing side effects in other code. I'd also propose not throwing on -0 values in input, instead normalizing them to the sign of the other values.
- JGT: I think what you described matches the intuition of most people. I have worked with JS for 20 years and I didn't even know about -0 until I started working with Temporal.
- SFC: The semantics of -0 make it behave like 0, mostly. It's quite tricky to tell them apart.
- PFC: Distinguishing -0 in Temporal.Duration would introduce more opportunities where -0 and 0 didn't behave the same. For example, if you had a Duration with all -0 fields and another one with all 0 fields, you would not be able to create another Duration with fields taken from both of those.
- PDL: Right, we'd be introducing another opportunity to test whether something is a -0. I think exposing -0 where it's semantically irrelevant is a bad thing.
- SFC: We could follow the IEEE semantics of 0 + -0 equalling 0.
- JGT: Turning the question around, what is the advantage to developers of distinguishing -0 in Duration?
- PFC: I don't see one.
- SFC: If you're working in negative numbers and you perform some kind of rounding operation and you end up with zero, you retain the sign, so that when you format it the sign is printed.
- PDL: Would that be relevant in the context of Temporal?
- SFC: If you format it, you would get -0 hours. So, for example, printing and subtracting one hour you'd get -5, -4, -3, -2, -1, -0 hours.
- JGT: My problem with that is that "normal humans" don't have a concept of -0.
- SFC: I think we do agree on that. But say you have the string `-PT0S` you couldn't round-trip it.
- JGT: You can't roundtrip `PT0H` either, it comes back as `PT0S`.
- PFC: Similarly the plenary also decided that -000000 isn't a valid year.
- JMN: Is that also related to there not being a year 0?
- PFC: There is no Gregorian year 0 but there is an ISO year 0.
- SFC: Have we checked with the records & tuples champions about whether -0 is distinguished?
- PDL: Will check.
- JGT: To summarize, I don't think anyone has come up with a use case for distinguishing -0 that is worth the extra complexity.
- SFC: I think formatting -0 is worth it.
- PDL: I have an answer from records & tuples - they use SameValueZero semantics, so they don't distinguish -0.
- SFC: I'm surprised, that means records & tuples don't have bitwise equality.
- PFC: Another option if we wanted to preserve formatting -0, would be to allow the internal slot to store -0, and take it into account in formatting, but have all the getters normalize -0 to 0. That way we'd avoid leaking -0 into other contexts.
- SFC: That would be the weirdest outcome for me. Two questions, 1) If we have a -0 Duration do we automatically turn it into a 0 Duration? 2) If we have a nonzero negative duration, are the 0 fields negative or positive? The more I worked in specs in JS the more I've become amenable to the concept of -0.
- PDL: 1) Yes 2) Positive. Interesting, the more I see -0 in the real world the more I think it was a mistake to ever introduce it.
- JGT: I agree.
- PDL: I see numbers as an axis, with 0 in the middle between negative and positive, not split.
- SFC: The intuition of IEEE numbers is that the number line is closed at one end, at 0, and the sign is a separate bit.
Conclusion: no consensus yet, we'll discuss this again next time.

### Should dates whose year part is “-000000” be rejected as grammatically invalid or domain invalid? (PR [#2027](https://github.com/tc39/proposal-temporal/pull/2027))
- JMN: I wanted to check the intuition being discussed in this PR. Anyone have comments about this?
- PFC: I thought writing it explicitly with throwing an exception would be clearer to read, but that brings other problems that I didn't see before. This doesn't change any semantics, though.

### DST problem with Duration.compare (issue [#1791](https://github.com/tc39/proposal-temporal/issues/1791), PR [#2026](https://github.com/tc39/proposal-temporal/pull/2026))
- JMN: I'm not confident that this fix is the correct one. I'd like to find more cases that are either fixed or broken by this issue.
- JGT: The way the algorithm works is that you add the dates, account for the offsets, and then add the times.
- JMN: I'll keep looking for a counterexample.
- SFC: What is the consequence of throwing out the hours and lower in determining the shift?
- JMN: I'm trying to figure that out.
- SFC: I reviewed this in more detail and I think the proposed solution looks correct to me. The reason it makes sense is that in the next step we collapse all the fields down to days.

### Round-trip violation ([#1971](https://github.com/tc39/proposal-temporal/issues/1971))
Loss of information (reference day, if available, gets dropped & replaced by hardcoded value 1) makes this impossible?
- JMN: Is this a round trip violation?
- JGT: This issue is purely about the behaviour of `calendarName: 'always'`, right? I like SFC's suggestion of always showing the full date.
- JMN: However, the reference day gets dropped. Does that make it non-roundtrippable? `Temporal.PlainYearMonth.from("2019-10-31").toString({ calendarName: "always" })` gives `"2019-10-01[u-ca=iso8601]"`.
- JGT: My understanding is this matches what we intentionally decided.
- PFC: That matches my understanding as well. Unless you use the 4-argument form of the constructor, which is a low-level API intended to be used only by calendar implementations, you don't get to choose the reference day, only the calendar does.

### What's the behavior of date arithmetic around epagomenal days? ([#1994](https://github.com/tc39/proposal-temporal/issues/1994))
- JGT: This was a concern brought up by MG about e.g. the extra month at the end of the Ethiopian calendar, if you add a month to the last regular month, should it go to the extra month or back to month 1? MG's thought was that we should get information from users of that calendar.
- PFC: I'll put this in my presentation for TG2 next week.
- SFC: This is something that I hope USA's calendar spec will address.
- JGT: Certainly if there was a judgment call I'd be nervous about deviating any one calendar's behavior without clear evidence from the local calendar users, because that would make it harder to write calendar-neutral code.
- SFC: I don't know if we'll get much from discussing it next week, it requires research.
- JGT: Would be good to figure out who owns doing that research.
- SFC: Good question. MG owns the calendar arithmetic in ICU4X, USA owns the spec that we're supposed to be writing.
