# October 12, 2023

## Attendees
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Justin Grant (JGT)

## Agenda

### Status report
- IETF
    - Opsdir telechat review of v10 is now "Ready". We're not sure what this means concretely but it seems to be still moving along slowly.
- Pending PRs [#2628](https://github.com/tc39/proposal-temporal/issues/2628) 
    - PFC: Part 3 of user code was merged. Part 4 remains. There are 5 PRs outstanding: [#2663](https://github.com/tc39/proposal-temporal/pull/2663), [#2519](https://github.com/tc39/proposal-temporal/pull/2519), [#2571](https://github.com/tc39/proposal-temporal/pull/2571), and two parts of the Duration refactor.

### TAB's finding about default rounding mode
- PFC: TAB was writing some Temporal code just before the last plenary and discovered that Math.round as a justification for halfExpand is incorrect. Math.round corresponds to halfCeil. Temporal aligns with NumberFormat with a default of halfExpand.
- JGT: halfExpand is what everybody learns in school, though.
- SFC: NumberFormat has done that for a long time.
- Consensus: Keep the behaviour, change the inaccurate sentence in the documentation.

### Use case for overflow constrain in PlainMonthDay.toPlainDate ([#2706](https://github.com/tc39/proposal-temporal/issues/2706))
- JGT: This is the first issue I've seen in months that might actually justify a normative change.
- SFC: I don't think the behaviour is wrong, although it would be nice to give people the option to choose the behaviour here.
- JGT: There's an inconsistency with e.g. add() where the default is constrain.
- PFC: add() has an options bag, toPlainDate() doesn't.
- SFC: I'm OK with the current behaviour, we can document that if you want the other behaviour there's another way to do it. I wouldn't know what to do in this case if starting with a Hebrew calendar day in the month Adar I, for example.
- JGT: I think it's weird that there's the inconsistency.
- SFC: PlainMonthDay is already a weird type.
- JGT: The use case mentioned in the issue is really valid, though. The code using toPlainDate() will work fine for everyone's birthday except on leap day. Generally we lean on not throwing unless there's more information we need from the user.
- PFC: Can we agree on the statement that we'd give this method an options bag if we were still in stage 2?
- JGT: I'm not sure I'd even agree with that. My mental model of toPlainDate() is that it's a shortcut for from().
- SFC: That's not my mental model. I'd support adding an options bag if we were still in stage 2. My mental model is, `.from` and `.with` interpret the input as a bunch of random data and let the calendar make sense of it, but the conversion functions perform a specific operation with more semantic meaning.
- JGT: PlainYearMonth also has the same behaviour, so clearly there was thought behind this. Would like to understand the original reasons.
- JGT: Do any other conversion methods have this problem?
- PFC: PlainDate/PlainDateTime.p.toZonedDateTime does.
- JGT: In that case there was a standardized behaviour to follow, `{ disambiguation: 'compatible' }`, and if you want something different there's the TimeZone.p.getInstantFor method. In this case there isn't a standard behaviour.
- JGT: My main concern is that it's weird that we have different behaviour for the 'sugar' method than we do for from(). My secondary concern is that everybody has a birthday every year.
- PFC: That secondary concern is my main concern.
- RGN: Is there an analogous case for the month?
- PFC: SFC gave one, with Adar I in the Hebrew calendar.
- JGT: What do we do in that case?
- PFC: We pass a synthetic options bag with `{ overflow: "reject" }` to dateFromFields(), so for the builtin calendar that should throw.
- JGT: I feel strongly that the calendar should decide when your birthday is in that case. I did some research on the Hebrew calendar and it seems that you would usually pick the same day in Adar II.
- RGN: So, implementation variance?
- JGT: We should at least specify it in the default calendar, and rely on 402 to specify the other built-in calendars.
- RGN: Can we come up with any other examples that might seem counterintuitive?
- JGT: I signed a lease on a particular day, when do I move out? Annual billing in financial software, etc. Crashing in that case would seem really bad.
- RGN: Is there any case where the opposite behaviour would be wanted?
- JGT: Celebrating your birthday on March 1 if you were born on leap day. People probably want their cake earlier! I could imagine in a financial context you might want to do something on the last day of a month that actually exists.
- RGN: I'm going to say that depending on what the PlainMonthDay represents, you might have a different preference for what PlainDate should match it in any given year. But, I'll also say that since this is a convenience method, you should get _some_ answer.
- JGT: If you want to customize it, you can use from().
- RGN: Nobody gets to skip a bill because of a computer error.
- PFC: It seems like we agree that we want to change this, the question is when? In November TC39 plenary? An alternative is to propose an update as soon as we get to stage 4, since this is a web-compatible change.
- JGT: It can result in real-world bugs, so I would not delay for that long.
- Conclusion: Fix this and put some version of the text at [https://tc39.es/proposal-temporal/docs/calendar.html#handling-unusual-dates-leap-days-leap-months-and-skipped-or-repeated-periods](https://tc39.es/proposal-temporal/docs/calendar.html#handling-unusual-dates-leap-days-leap-months-and-skipped-or-repeated-periods) into the spec text, in CalendarMonthDayToISOReferenceDate.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT: My understanding of the current behaviour, is that we optimize for reversibility, so that you can undo an operation.
- RGN: I largely agreed with ABL. If you're going from e.g. 01-29 to 02-28, so less than a full month, you shouldn't have an answer that's 1 month.
- SFC: (via chat): No strong opinion here; I think JGT's analysis of the invariants we are trying to uphold makes sense to me.
- JGT: Can we agree on the reversibility principle "In other words, for two dates A and B, and a duration D, if `A.add(D)` is B then `B.subtract(D)` is A"?
- RGN: I think there are restatements of that principle that seem equivalent but aren't.
- PFC: My memory was that that principle should hold for the default largestUnit.
- JGT: I remember spending a ridiculous amount of time on this. The other variable was that the iCalendar spec required adding larger units first, so adding years-months-days should be indistinguishable from adding years, months, and days separately in order.
- RGN: We didn't work through that for subtraction.
- PFC: Subtraction has to be equivalent to addition of the negation of the duration, though.
- RGN: That's one of those things that may not be equivalent.
- JGT: But we did decide on that, in order not to have different results for those cases.
- PFC: In any of the examples, if you pass `{ overflow: 'reject' }`, is there any possibility to get a non-throwing result that is different from what you would get from Java?
- JGT: I don't think so.
- RGN: There's no bounds checking in the middle of an operation, so if you start with 2020-02-29 and add P1Y1M, you will get 2021-03-29 and not reject because an intermediate operation lands on 2021-02-29.
- JGT: I think there's a different reason for that. For `Temporal.PlainDate.from('2023-01-31').add({months: 1, days: 1})`, we get the same result regardless of the algorithm whether you constrain the intermediate values or not.
- PFC: That doesn't hold for RGN's example. If you constrained intermediate values you'd get 2021-02-28.
- RGN: The current behaviour is that overflow applies only at the end, and I agree that that's the right thing to do. But Anba points out that there's a case where this does not seem to be true: too eagerly upgrading to a larger unit in such a way that it breaks reversibility.
- RGN: For 01-29 until 02-28, I'd expect the result to be 30 days, not 1 month. For 12-29 until 02-28, I'd expect 1 month 30 days, not 2 months.
- PFC: I mostly care that the operation is reversible if largestUnit is the default, which is days.
- RGN: The longer I think about this, the worse I think the behaviour is. Especially with the second block of tests, from 01-27 to 02-27, it looks like we treat the last day of the month specially.
- JGT: Looking at the meeting notes from 3 years ago, we are making many of the same points as today very consistently.
- RGN: What's new for me as of today, is that we need bijection, in other words no algorithm is taking distinguishable inputs and mapping them to indistinguishable outputs.
- JGT: Isn't it always true if you add 1 month to 01-28 through 01-31 in a common year, you get 02-28?
- PFC: We have the overflow option on add() and subtract() if you don't want that behaviour.
- RGN: Right, it's configurable for add() and subtract() but not for until() and since(). until() and since() should not return the same durations for the same start date with different end dates.
- JGT: Let's summarize where this is currently at. The Temporal behaviour is different from Java, the behaviour is unintuitive for at least one person who has dug into it, and the behaviour in the spec doesn't seem to match what we thought one of the intended invariants was. My proposal is that I'll do a bit more research to find out why the current implementation doesn't match the invariants that we thought it should, and come back to the group with a proposal.
- PFC: Do you think that this might be a bug in the algorithm after all?
- JGT: Not necessarily. The invariants we chose might not be possible to hold all together, or a later decision broke the invariant.
- PFC: I'll also propose that I look at plain date implementations in other languages/platforms, to see if they solved this in a different way. If everybody matches Java except us then that's a strong hint that we got something wrong.