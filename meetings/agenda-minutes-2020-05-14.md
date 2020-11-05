# May 14, 2020

## Attendees

- Ujjwal Sharma (USA)
- Shane F Carr (SFC)
- Younies Mahmoud (YMD)
- Philipp Dunkel (PDL)
- Daniel Ehrenberg (DE)
- Jason Williams (JWS)
- Philip Chimento (PFC)
- Richard Gibson (RGN)

## Agenda

### What are our goals for the June TC39 meeting?
- USA: If things go well, Intl.DurationFormat will move to Stage 2 and we'll be able to produce a polyfill that can be used in the Temporal polyfill. What are our plans on the Temporal side of things?
- SFC: Are we still on the same schedule that PDL mentioned, for Stage 3 in July?
- DE: I think the polyfill has to be released on npm for a few months before we can go to Stage 3. So maybe September.
- PDL: I agree, the API needs a lot of scrutiny since it is so large.
- DE: Could we release the polyfill by the time of the June meeting?
- PFC: I've been working under the assumption that we need to have custom calendar and time zone support done. If that's the case, maybe it's possible to do that. If not, we could probably release it now-ish.
- USA: I can spend some extra time working on Temporal.parse.
- DE: That sounds like on track for September. Maybe in the June meeting we can announce it's released and bring up questions like the default calendar.
- SFC: I don't want to rush things, there are a lot of issues on the issue tracker that need to be discussed.
- DE: Can we get through all the issues before the June meeting?
- PFC: I don't think most of the issues on the tracker need to be discussed.
- SFC: I think at least half. There's a long tail that aren't labeled.
- USA: I can go through more of the issues, close old ones.
- **Action for SFC:** Add the meeting label to issues that should be discussed.
- PDL: Can we create a milestone for Stage 3?
- USA: We had one but it hasn't been used for a while.
- **Action for USA:** Add issues that are requirements for Stage 3 to the Stage 3 milestone.
- DE: Do we need to discuss everything in the meeting?
- SFC: If people respond on the issue tracker and come to agreement there then we can handle an issue in 60 seconds in the meeting.
- PFC: I don't think we need to discuss everything in the meeting, but either way it speeds things up if people respond on the issue tracker.

**Goals:**

- Work through the existing Stage 3 issues before the June meeting
- Announce a polyfill and spec text during the meeting
- September meeting is the deadline for stage advancement

## [#517](https://github.com/tc39/proposal-temporal/issues/517), comparison operators - follow up?
- USA: MPT and MAJ need more time to think about the issue, but MPT's first intuition was to not have valueOf: the idea is to do whatever makes the user realize quickly that whatever they are doing is wrong (error early).
- SFC: That's good feedback. If we do go that route, I'd prefer to have valueOf throw a TypeError, whether it's actually on valueOf or `[Symbol.toPrimitive]`.
- RGN: I think it belongs on valueOf.

## [#532](https://github.com/tc39/proposal-temporal/issues/532), weeks in Temporal.Duration
- PFC: *Enumerates the points discussed on the issue tracker*
- JSW: What was the “compelling case”?
- SFC: YMD posted a few cases lower down in the thread.
- YMD: This is actually driven by Intl.DurationFormat.
- PDL: Can we speed past this issue? There are no modern calendars where a week isn’t 7 days long. A week is a standard unit of time. Can we assume that a week is always 7 days long?
- DE: How do you want this to work with Intl.DurationFormat? A few of us work on it and it would have implications.
- SFC: One of the high bits of this decision is that in 402 we have identified that weeks are important for serialization. If Temporal champions don’t allow weeks, we’ll have to figure out another way to do it. It opens up a big can of worms on the Intl.DurationFormat side of things.
- PDL: If I pass a duration of 90 minutes, Intl.DurationFormat should handle how to render that.
- SFC: I’m arguing that we should keep math in Duration and Intl.DurationFormat should not have to deal with that. It gets a lot cleaner that way and muddy otherwise.
- DE: I agree with SFC. We should support a similar mechanism for Decimal.
- PDL: I disagree on both counts. For me, Intl is “what should the output look like?” These are questions that only concern presentation, and we’re sort of mixing concerns here. We’re mixing the data model with presentational concerns.
- SFC: Intl.DurationFormat doesn’t have the required tools to do a lot of this math. I do see their point here. Maybe locales should be able to decide which units to use.
- PFC: Summarizing, there are three options:
  - Don't include weeks in Temporal.Duration, leave them up to DurationFormat
  - Include weeks in Temporal.Duration but don't integrate into the data model.
  - Fully support weeks, including parsing the ISO year-week notation.
- SFC: Even aside from DurationFormat, I think it's worth having weeks in Duration.
- USA: The third option is not that bad of an option, other libraries such as moment.js support weeks. It will introduce some churn and will delay the polyfill and spec a bit, but it could be quite useful.
- PDL: The only reason we never put it in was that a week is always 7 days, so I always thought of it as redundant.
- SFC: By that logic, days are a redundant unit of hours, and hours are a redundant unit of minutes.
- PDL: You can go from minutes to hours to days via integer multiples, but not from days to weeks to months.
- SFC: A month is just as much 4 weeks as it is 30 days.
- DE: Is it harmful to have that?
- PDL: No, this is just the reason that I never did it before.
- DE: At this point, do you think it would be harmful to add it to the data model?
- PDL: In theory no, but it depends on the discussion with Intl.DurationFormat. I do think there shouldn't be a difference between, say, 90 minutes and 1 hour 30 minutes, same for 7 days vs. a week. If we use those differences to trigger different behaviour in DurationFormat, then those differences become important.
- JWS: Is everyone essentially supporting weeks except for the issue that PDL mentioned? Were there other concerns?
- PFC: I'm not against it, but I listed some practical concerns in the issue that I'm not sure how we would solve.
- SFC: Given what PDL mentioned, why is Duration then not always doing balancing?
- PDL: The original version did do that, up to months.
- SFC: I'm in favour of using that distinction that you mentioned, for the purpose of Intl.

### [#407](https://github.com/tc39/proposal-temporal/issues/407), feedback from users about DateTime arithmetic
- USA: We had previously discussed DateTime arithmetic as confusing and likely to be misused. Previous conclusion was that we do need to educate users on when to use which one, but that DateTime arithmetic is still a valid use case even if it's not the common one. We've gotten some feedback from Justin Grant, a user who has been trying out the Temporal polyfill, that it is confusing. SFC has made some suggestions in this issue including adding a time zone to DateTime arithmetic.
- SFC: This is an issue that keeps coming up over and over again: users are not going to understand the difference between a timestamp and a wall clock time. It's our responsibility to make the usage as clear as possible. One issue is that the term DateTime is overloaded, in other contexts it often means a timestamp which it doesn't mean here.
- PDL: In most databases it doesn't actually include a time zone, it's interpreted in the local time zone.
- SFC: Nonetheless, it's likely to be conflated with other things. The feedback we got from this user is that accidentally using wall-clock arithmetic would be disastrous.
- PDL: I agree that's a good data point. On the other hand, kaizhu256 has been insisting that not working with strings is disastrous for a long time.
- SFC: At the very least, entertaining a different name for DateTime would go a long way towards mitigating this.
- PDL: You think calling it DateAndTime would improve it?
- SFC: We can talk about the name, but I think DateTime is easily associated with a timestamp.
- JWS: I'm not convinced that changing the name alone is sufficient.
- PFC: How about a flowchart along the lines of "which STL container do I use?" I think regardless of the name, the main issue is that it's hard to wrap your head around all the types of Temporal. We need to provide that information up front and prominently.
- SFC: One thing that was mentioned was considering DST arithmetic for days and higher, and wall-clock arithmetic for hours and lower?
- PDL: The mixed thing is an invitation to chaos. I agree with Justin that DateTime isn't ideal but I think of DateTime as the least of all evils.
- RGN: This is the only point where Justin's feedback seems in serious disagreement with our decisions and goals thus far.
- USA: SFC, how do you feel about keeping DateTime and focusing on education for this issue?
- SFC: I think that that stance can be extended to the question about comparison operators. There we decided to prevent users from making mistakes rather than solving the problem through education. A well-designed API should be self-explanatory and doesn't lean so much on education. I also think DateTime and the current data model is very good, so I'd prefer to explore different naming rather than changing the data model.
- PDL: I agree, and I'm hesitant to accept education as a solution as well. However, a good API design is self-explanatory for a person educated in the subject matter. What we're hinting at here is that it needs to be self-explanatory if I don't know what I'm doing, and that I don't agree with.
- SFC: The issue is that users will assume they know how dates and times work, and will think DateTime is something it's not when they see it.
- JWS: I think people will try to get information on what the different types do.
- PDL: Do we cater to the people who approach it like JWS or people who prefer to just use things without caring? That's a philosophical question that we maybe have to answer at the TC39 level.
- SFC: We try to cater to both.
- PDL: They are in opposition here.
- JWS: Will people still expect DST changes on a renamed DateTime?
- SFC: I do think changing the name will eliminate some false preconceptions, although I don't have data to back that up.
- PDL: I'll be intentionally absurd, but should we rename Date to CalendarDateWithoutTime, and Time to ClockTimeWithoutDate?
- RGN: That wasn't absurd a year ago when we were discussing what to name them.
- SFC: Right, and we namespaced them in the Temporal object. I'm suggesting we go one step further and adjust the name of DateTime to help eliminate preconceptions.
- JWS: I'm not convinced that that would help where better documentation or a flowchart wouldn't.
- PDL: Let's approach it backwards. What if the issue is that DateTime has a suggestive name and the thing you usually want (Absolute) doesn't? What if we renamed Temporal.Absolute to Temporal.PlainTimestamp?
- SFC: I think that would help, or we could do both. I think the thought process of someone new to Temporal is "I want to store a date and time. What do I pick? Temporal.Absolute? I don't know what that is. Temporal.PlainDateTime? Sounds right."
- DE: I agree, but I'm not sure "DateAndTime" signifies enough. People still have to learn about calendar date and wall time.
- PDL: I think we're talking about instinct, and running out of words.
- SFC: Let's continue this discussion on [#569](https://github.com/tc39/proposal-temporal/issues/569) which I opened for this.
