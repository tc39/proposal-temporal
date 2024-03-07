# September 14, 2023

## Attendees
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Justin Grant (JGT)

## Agenda

### Status report
- IETF
- Pending PRs - status [https://github.com/tc39/proposal-temporal/issues/2628](https://github.com/tc39/proposal-temporal/issues/2628)
    - User code calls part 2 merged. Part 3 is ready. Part 4 will be the last and unblock several other things.

### Make a decision on fixup of #2500 ([#2664](https://github.com/tc39/proposal-temporal/issues/2664))
- SFC: I'd like to start by understanding why RGN places value on alignment between the from() method and monthDayFromFields().
- RGN: In 2.ii you implicitly ask for the ISO calendar where there is always alignment between monthCode and month, so you can omit monthCode. 5.i is the same operation only with monthDayFromFields(), so I feel strongly that that should succeed without monthCode as well.
- JGT: Given that there is already a special case for PlainMonthDay.from which substitutes iso8601 for undefined calendar, why couldn't that same spec text also substitute monthCode for month?
- SFC: My feeling is that 5.i could succeed, I have no problem with that. JGT brings up an interesting point about transforming it.
- RGN: I don't think that fully gets around it. Iso8601 means month and day without monthCode are sufficient.
- SFC: Any objections to 5.i succeeding?
- JGT: No opinion, that's an advanced API. My strong opinions are about 3 and 4.
- RGN: Consider 4.i and 4.iii then. In 2, the calendar is implicitly selected. In 4, it's explicitly selected. They should be the same.
- JGT: I see it differently. It's not an attribute of the calendar being ISO, it's an attribute of the calendar being undefined.
- RGN: If you don't have information about the calendar, then you can't perform that operation. It only works because the default calendar is ISO8601.
- JGT: That's technically true. But 99% of code out there is not going to use a calendar. Because the vast majority of all code is not going to specify a calendar, I don't think it necessarily holds that the behaviour must be the same between undefined and explicit calendar.
- SFC: Temporal.MonthDay semantics are primarily rooted in how the Gregorian calendar thinks about months and days. When you think about this type in the context of non-Gregorian calendar systems, you should be thinking about monthCodes. We give this convenience to developers writing code in the ISO calendar, which they opt in to by passing undefined. If specifying a calendar, which is advanced, then you should do it the right way with monthCode. Especially if the calendar is an object, we have no way to know whether it supports omitting the monthCode.
- RGN: The implementation doesn't need to know, it just delegates that responsibility to monthDayFromFields.
- JGT: As for data driven exceptions, the pattern of omitting the calendar is one shape, and providing the calendar is another shape.
- RGN: Do you consider passing a value of undefined equivalent to an absent value?
- JGT: I don't really consider that because I think about TypeScript shapes.
- RGN: So you are talking about absence of the field vs presence with a particular type. So you want to require non-undefined calendar and non-undefined monthCode, or non-undefined calendar and non-undefined year, or undefined/absent calendar.
- JGT: Yes.
- SFC: Are there other cases in the API where we check the shape of the fields? Or is it always the case that we delegate to the calendar?
- PFC: We check the shapes of Calendar and TimeZone objects.
- RGN: It might not be distinguishable. For ZonedDateTime, it is fully specified, you must have year-month-day or year-monthCode-day.
- SFC: Where is that enforced?
- RGN: In ToTemporalDate, PrepareTemporalFields doesn't require the fields, it's delegated to the calendar in CalendarDateFromFields. Day, month, monthCode, and year are passed, along with any other fields returned from calendar.fields().
- SFC: Could one argue that we have a similar type of data-driven exception in PlainDate.from(), because calendars may require other fields? I guess it's different because with PlainDate you always at least need year, month[Code], day. The problem with PlainMonthDay has always been that the shape of the fields is different between ISO and everything else.
- RGN: With PlainDate, it's fully under the control of the calendar. It can succeed even in the absence of any of the required fields if the calendar implements that.
- SFC: We don't expect that behaviour from any of the CLDR calendars, though.
- RGN: This could lead to the situation where you could construct a PlainDate from a set of properties in a custom calendar, but constructing a PlainMonthDay would fail, because it's not delegated to the calendar.
- SFC: I guess we justify that by saying that for all the built-in calendars the shape of PlainDate data is the same but the shape of PlainMonthDay data can be different.
- JGT: That makes sense.
- RGN: Does the argument for built-in calendars apply to one data type and not the other?
- JGT: All of the calendars we know about can construct a PlainDate from day, month, and year.
- RGN: All calendars require that, but the from() function doesn't enforce it. The calendar method enforces it. That's different with PlainMonthDay, where from() enforces the shape.
- JGT: We have had a design principle for a long time saying that PlainMonthDay is weird and consistency is less of a priority.
- RGN: I don't think that tradeoff applies here, because there's no other cost to making this consistent in PlainMonthDay.
- JGT: With PlainDate we didn't need to worry about enforcing this in from() because all the calendars treated it the same.
- RGN: Another angle, what is the benefit of enforcing this in PlainMonthDay.from()?
- JGT: It helps userland developers write their code in a way that doesn't assume that all calendars are ISO. Either they omit the calendar and pretend that calendars don't exist, or they supply a calendar which may change in the future depending on input.
- SFC: Another proposal is to be more strict, I don't think PDL would like this. We could reject 2.ii and 5.i. Built-in calendars would all require monthCode and not month.
- RGN: If PlainMonthDay always requires a monthCode, then the rest is consistent. It's a data model that restricts developers in a way that the current one doesn't, though.
- JGT: For me it comes down to where you want the consistency to be. If 2.ii is 99% of people using PlainMonthDay, it's weird to restrict that in the name of consistency with all the more unusual cases.
- PFC: I agree with JGT here.
- SFC: I have to sign off. I understand RGN's position a bit better now. I'm less strongly for doing the shape checking in PlainMonthDay.from().
- JGT: I care more about the usability of the non-calendar case and less about the calendar-present case. I think it's OK for that to bring more complexity. I do think it's OK to optimize calendar-present code so that it behaves as similarly as possible for all built-in calendars. So I'm for 3 and 4 throwing, but I don't care all that much.
- RGN: I still don't fully understand the benefit that you perceive, of rejecting month-day-calendar.
- JGT: The main benefit is, if you're writing an app, and you choose to specify a non-undefined calendar, it likely comes from external input. So it's helpful to not have something that works in ISO and doesn't work in another calendar, because you're tempted to write your tests using ISO. It helps userland developers write code that works across all calendars.
- RGN: I understand now. PlainDate.from({month, day, calendar}) will just work, if your custom calendar's dateFromFields doesn't require a year. However that same flexibility doesn't exist in PlainMonthDay.from(). But because PlainDate behaves the same across calendars and PlainMonthDay doesn't, you have this potential test gap. Does PlainYearMonth behave the same across calendars?
- PFC: Yes.
- JGT: You can always default the day to 1.
- RGN: But PlainYearMonth is a similar footgun because you might get a different monthCode?
- JGT: It's different. PlainDate and PlainYearMonth can always convert to an ISO date, so there's no ambiguity. PlainMonthDay cannot, because there is no reasonable default for the year.
- RGN: I'm not saying there's ambiguity, I'm saying there's developer surprise. E.g. month: 13 will work in some years but not others.
- JGT: I'm not particularly worried about getting an unexpected result due to using a month instead of a monthCode. The confusion is that in PlainMonthDay you need the year to figure out what the monthCode is, while in PlainYearMonth you don't need the day.
- RGN: If it's OK to assume the developer knows what they're doing in one case, then why not in the other case?
- JGT: Silly example, a month picker. You pick the calendar, pick the year, and pick the month. The output is a PlainYearMonth. Now consider a birthday picker, the PlainMonthDay equivalent of that UI. The challenge is without the year, you can't figure out what the month code is. None of that complexity exists in the PlainYearMonth case. It's much harder for the userland developer to screw up.
- RGN: I don't see how it makes this easier if PlainMonthDay is strongly opinionated about its input.
- JGT: It makes it more likely, if I write my app with the ISO calendar in mind first, that it will work for other calendars.
- PFC: You mean, if you are porting a calendar-agnostic app to use calendars, it's helpful to get the exception as soon as you add the calendar parameter?
- RGN: People naively porting code to use calendars are going to get other things wrong anyway.
- JGT: There's this long list of painstaking bullet points about how to write cross-calendar code. You would have to ask for the year anyway.
- RGN: I see what you're saying, but I think it's helpful to a narrow range of developers who read some of those bullet points but not all.
- JGT: I agree with that.
- RGN: Looking at 4, I don't see much benefit to this middle ground, but it's no longer privileging the ISO calendar with 5.i. The workaround is that you can go straight to calendar.monthDayFromFields().
- JGT: I think I agree with you. Maybe a bigger problem is 3.iii. If we allowed 3.iv, it would be a total disaster, so I think we all agree it must be rejected. Because of that, I think it's a lot easier for developers to understand what a calendar suffix is, if there's always a full date before it. So I'd be nervous about allowing 3.iii.
- RGN: I'm not arguing that 3.iii should be accepted, it's been rejected for a long time. The only argument for it is that in 2.iii the `08` is acting as a monthCode, so why not in 3.iii? But I don't think that argument holds up.
- JGT: I think 3.iii being rejected implies that 3.i must be rejected.
- RGN: I agree with that too. The argument for 4.i feels weaker to me, because I think it is justified to have differences between string calendars and object calendars. Object calendars can be custom, and string calendars can't.
- JGT: Everywhere else in Temporal, we treat them the same. The purpose of string calendars was only a performance optimization. It would be weird to attach observable behaviour differences to objects.
- RGN: I can see that, but it's also already the case, because objects are mutable. Passing the string "gregorian" guarantees the behaviour, whereas Temporal.Calendar.from("gregorian") can be mutated.
- JGT: Interchangeability between strings and objects seems pretty common whereas people mutating their objects seems quite rare.
- RGN: It's not foundationless to have them behave differently.
- JGT: Let's rephrase to say that strings should behave the same as pristine non-mutated objects.
- RGN: Agreed.
- RGN: I have more discomfort than you and SFC about calendar details leaking into PlainMonthDay.from(). But I can live with accepting 5.i and rejecting all the other questions.
- Documenting this conclusion on the Github issue.