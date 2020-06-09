# May 21, 2020

## Attendees

- Ujjwal Sharma (USA)
- Jase Williams (JWS)
- Shane Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Daniel Ehrenberg (DE)
- Philipp Dunkel (PDL)

## Agenda

### Add Justin Grant to the distribution list?
- PFC: Would he have to jump through the hoops to become an invited expert?
- SFC: It's not a difficult process, there's an IPR form to fill out.
- USA: It seems a bit overkill, usually invited experts join the TC39 meetings as well and invest lots of time. Is there a simpler way to let him participate?
- SFC: I think it's up to Justin, but we should just ask if he is interested and fill out the form if so.
- DE: Since he's raised lots of issues, it would be faster to work through them in the meeting.
- JWS: We wouldn't want to go over lots of old ground, but if we stick to the agenda then that shouldn't be a distraction.
- **Action, PFC:** Reach out to Justin and ask if he'd like to join this call.

### [#262](https://github.com/tc39/proposal-temporal/issues/262) Calendar systems for toLocaleString() on Temporal types
- PFC: I think SFC's most recent comment is reasonable to ship the polyfill with.
- DE: How do we feel conceptually about ISO being a "null calendar"?
- SFC: I think that's how we should think of it. If you have a non-ISO calendar in your locale, then you probably want to use the locale calendar. If you created a Temporal object with a non-ISO calendar, then you probably want that calendar.
- DE: I'd like to reconfirm this before Stage 3, but we should ship the polyfill with this.

### [#293](https://github.com/tc39/proposal-temporal/issues/293) Time zone and calendar hint in ISO strings
- PFC: Was there any objection to using the bracketed `[c=...]` hint?
- RGN: If it's intended for interchange, then I do have a problem with it.
- SFC: If we put something in the string, it would probably be option 4.i or 5.i from the table.
- DE: How about 3.ii?
- RGN: If we can separate toString() and toISOString(), then I wouldn't be opposed to putting something in the string. But anything other than an IANA time zone name in the bracketed part, is bad for interchange.
- DE: I feel strongly that we should not develop another interchange format, so I'm opposed to `[c=...]`.
- RGN: Agreed.
- DE: If we keep only one method, then our choices are to return undefined, return a fixed string, or throw.
- SFC: Throw always, or throw only if the calendar is non-ISO?
- DE: Non-ISO.
- SFC: I don't agree with changing the behaviour based on the calendar.
- DE: Or we could not have a toString().
- SFC: We have to have a toString().
- DE: If we didn't have one, then it would fall back to Object.prototype.toString() and use toStringTag.
- PDL: Strongly opposed to that. Our data model is ISO, so you can always print an ISO string. (Option 5.ii.)
- DE: That seems implicitly broken, because the user isn't really thinking about the refYear. I'm fine with 5.ii shipping in the polyfill and revisiting it before Stage 3.
- SFC: We can't do calendar conversion with YearMonth and MonthDay, they are sort of the most calendar-dependent types that we have. We have the refYear/refDay to solve the data model problem, but really they are calendar-bound. It makes no sense for Cheshvan 25 to print out as '12-15'.
- DE: Which option are you in favour of?
- PDL: How about reconsidering dropping YearMonth and MonthDay? (Option 6.)
- SFC: I think the use cases have been established and have proponents. I think this problem is surmountable. That said, I don't personally have an attachment to these types. I'd be OK with 1, 2, 3.i, 5.i, or 6.
- DE: Could we go with 5.i and eat the cost of adding the `[c=...]` syntax, recognizing that it wouldn't be able to roundtrip through all systems but it would through ours?
- RGN: I'd want to add a separate method for interchange then.
- SFC: How about 5.i but if the calendar is ISO then you don't print out the extra field? Propose that we ship 5.i with that change in the polyfill, and I will take an action to reach out to the appropriate standards bodies. I agree we should suggest our ideas to more people and reach out for comment.
- RGN: I think that works.
- SFC: And for non-YearMonth-MonthDay we do the same, 5.i?
- RGN: Yes.
- DE: Conclusion is that we go with 5.i with the `[c=...]` and the proposed modification tentatively, and reach out to other standards bodies to get something that's generally acceptable across the board.

### [#292](https://github.com/tc39/proposal-temporal/issues/292) What about the default calendar?
- SFC: I've updated the calendar draft doc. I've been talking with the Intl team and no-one really likes options 1, 2, 3, and 4, so I've added options 5 and 6. The question is really, what are the semantics of the different ways that you can construct Temporal objects? I have a list of the different constructors in one of the doc sections. You can require a calendar (option 2 or 6) or require a calendar only when you do something calendar-dependent (option 3 or 5). See the table under "Methods of Construction". Temporal.now.date and absolute.inTimeZone are the two most interesting ones because that's where the intent of the programmer is least clear.
- JWS: I'd like to +1 the ISO default on from(fields). When working with momentjs in the past we've sometimes created dates from options bags, and if people don't set a calendar then they want ISO. So I think it's good that the calendar can be set in those options bags, but not required.
- PDL: Do I understand correctly that option 6 differs from option 2 by creating a mirror ISO method rather than a required parameter?
- DE: So instead of a required parameter it's shorter?
- SFC: We're acknowledging that the ISO calendar is the common use case so it gets its own method.
- PDL: Every method on an object needs to justify its own value.
- DE: The equivalent, then, would be option 2, where you're required to make it explicit.
- PDL: Option 6 to me is the compromise where nobody gets what they want.
- SFC: With options 3 and 5, the way you would write your code is pretty similar, but one of them introduces new types and one of them doesn't. The idea is there are a lot of operations where you don't actually need to know the calendar system. The difference is that option 5 makes separate types for the calendar-independent states where in option 3 you'd have a Temporal type with the partial ISO calendar. Option 5 applies strong typing to the situation where the calendar is unknown, but adds to complexity. However, it would be neatly combinable with ZonedAbsolute if we decided to add that.
- DE: What's the assessment of your coworkers in the Google Intl team on these options?
- SFC: FYT suggested option 5 and Mark Davis suggested option 6. We think it's important to prevent the sorts of bugs that I detailed in the next section.
- DE: Is there an example of a bug that popped up in the field?
- PDL: My opinion is that these examples of bugs are not likely to be important in the field.
- DE: I think it would be good to see if there are any bugs from the field. I'm not sure if option 6 avoids the problems since people copy-and-paste the factory methods anyway.
- SFC: When we're thinking about what's best for i18n correctness, we weren't 100% happy about option 6, but it is better than option 1.
- DE: Is there anyone besides SFC with concerns about option 1?
- PFC: I still prefer option 1 over anything else, but I disagree that the examples of bugs in the doc wouldn't occur in the wild. I think we would need to address them somehow.
- PDL: I didn't say they wouldn't show up in the field, I said that the costs (extra surprise factor) would outweigh the benefits.
- SFC: I don't understand what you mean by surprise factor.
- PDL: I spoke to a Saudi developer who would have found it surprising to get a custom calendar unless they had explicitly requested it.
- SFC: The "surprise" option would be option 4.
- DE: I think option 4 is the only one that would be very weird. 2, 3, 5, and 6, are all essentially asking people to insert the word "iso" somewhere, and I think that wouldn't be meaningful to programmers.
- PDL: I think in option 3 you'd have to insert less "iso".
- DE: I think SFC is pretty well versed in this, having written out all the examples. But my claim is that inserting "iso" is not a meaningful decision point for programmers.
- SFC: But that's the decision point that we have to have, for programmers to write an i18n-specific application.
- DE: I don't think copy-pasting "iso" into your code is a meaningful decision.
- SFC: People will do that, but it does make it obvious even in copy-pasted code what i18n-friendly programmers need to do.
- JWS: Going back to the fields example, to me it makes sense to default to the ISO calendar field. If people want to have a different calendar, they will put it explicitly in the fields.
- SFC: I have to drop off, but my closing note is that we're only really talking about Temporal.now.date and absolute.inTimeZone. Option 2 or 6 would address the i18n correctness concerns, but if that's considered unergonomic then we have option 3 or 5.
- DE: Would it be OK to ship option 1 in the polyfill and revisit this before stage 3?
- SFC: I consider option 1 to have insurmountable problems.
- PDL: I consider the same about options 2 through 6.
- SFC: I would suggest taking a closer look at option 5. I personally think option 5 checks everyone's boxes, including PDL.
- DE: That's my least favourite one. The number of types is already confusing and I don't want to add 50% more. Would we be OK with bringing this to committee?
- SFC: I was hoping that option 5 or 6 would address the concerns and that wouldn't be necessary.
- PDL: I'll revisit options 5 and 6 before next week.
- SFC: Also note that I opened a pull request editing the cookbook to show how it would change.
- USA: Note that choosing option 5 would affect the ability to ship the polyfill before TC39.
- SFC: Note that if we don't go with option 5, we'd need to close all of Justin Grant's issues about ZonedAbsolute.
- DE: I don't agree with that. MPT for example was supporting adding a ZonedDateTime separately.
- RGN: I will post this to GitHub, but ZonedAbsolute should be a complete non-starter because it breaks for future values where the time zone changes between serialization and deserialization (e.g., Brazil announced in April 2019 that the November transition to DST would not happen, causing the absolute timestamp associated with 2020-01-01T00:00 in America/Sao_Paulo to shift between tzdata 2019a and 2019b). But ZonedDateTime might work.
