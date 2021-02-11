# Jan 19, 2021

## Attendees
- Shane F. Carr (SFC)
- Ujjwal Sharma (USA)
- Cam Tenny (CJT)
- Daniel Ehrenberg (DE)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Younies Mahmoud (YMD)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Manish Goregaokar (MG)

## Agenda

### Month / monthCode / monthIndex [#1203](https://github.com/tc39/proposal-temporal/issues/1203)
- PDL: I think that because `year` is a number, and `era` is a separate property, `month` needs to be numeric as well.
- DE: We talked about this within Igalia and see reasonable arguments for making month to be either a string or number, but the important thing for us is that one of those properties needs to be named month. PDL makes a good point about the correspondence between month and year.
- CJT: This is separate from the validation question.
- JGT: I'd like to talk about that as well, but we can do that separately.
- SFC: The answers for input and output don't necessarily need to be the same. What you accept in a property bag doesn't need to be the same as what you get out of a getter. MG and the rest of us are largely in agreement on the semantics of a month index and month code, regardless of what they're named.
- DE: Can you clarify what month code exactly means? Is it the iCal format with the L?
- SFC: I'd like to wait for MG to get here before deciding that, as he has the most up-to-date knowledge.
- JGT: The format of the string isn't that relevant for Temporal. Can we get consensus on at least these five points?
  - Having a string month code (because iCalendar does)
    - Consensus.
  - Having a consecutive month index (because there are plenty of use cases for that)
    - Consensus.
  - Both the month index and code should be usable in `from()` and `with()` (i.e. valid properties in the property bag)
    - DE: I think they should be usable under the same name. That is, the input property should be the same as the output property.
    - SFC: I had brought up that if we name them `monthCode` and `monthIndex`, we could have `month` as a combined property in `from()`.
    - DE: I'm not a fan of that.
    - JGT: Me neither.
    - Consensus.
  - The month should be fully described by a single scalar value (no two properties)
    - DE: I didn't understand why this is so bad given the situation with `era`/`year`.
    - JGT: era is awful. It's different from ISO, so people will not write code that way by default. It would essentially mean that no Temporal code would work with lunisolar calendars unless it was specifically written that way.
    - DE: OK, I understand.
    - SFC: I agree with JGT that we should make sure that code just works when applied to non-ISO calendars.
    - Consensus.
    - SFC: Asterisk, I haven't talked to MG specifically about this recently, but I think I understand his position.
  - Whichever property we call `month` should also be emitted by `getFields()`.
    - JGT: I'm less sure about this one than I was before. Let's put it aside.
- SFC: These are the options for naming:
  1. `month` is the code, `monthIndex` is the index
  2. both `monthCode` and `monthIndex` 
  3. `month` is the index, `monthCode` is the code
- JGT: Which do you prefer?
- SFC: MG's preference, which I align with, are 1, 2, 3 in order of highest to lowest. The idea of months being numbers is not a concept that applies across calendar systems, and therefore the idea that months increment is not general. Having months be strings is good for developer education and for generality, month is first and foremost a month code. We can have the index as a convenience property for the reasons that JGT mentioned.
- PDL: I don't agree. I see this as rationalizing making the API less ergonomic.
- JGT: If the goal is to have good software for end users, then those end users will depend on software libraries that need to work. Option 1 will hamstring developers who don't know about non-ISO calendars.
- CJT: Is there anyone who thinks option 2 is best? Can we eliminate that one?
- Consensus on eliminating #2.
- DE: My preferences are more like 3, 1, 2. I prefer `month` being a number, but I can see the month code as a reasonable compromise. Type coercion will make it mostly transparent.
- JGT: It's not correct that coercion will eliminate all the problems. If you compare `plainDate.month === 1`, it will always be false. I think the fact that calendar users perceive their month ordering as different from the way we do as programmers is an acceptable tradeoff if it gives end users better software.
- RGN: It's also worth pointing out that the strings we're talking about are not strings that anyone will find natural. E.g., no user will think of their month as "6L".
- SFC: I was talking to some Hebrew calendar users and "5L" and "6" for Adar I and II are not necessarily the most natural codes. But we can discuss the coding scheme separately.
- CJT: If there are no universally agreed upon semantics for `monthCode`, then having it be the default would be a barrier.
- PDL: Agreed, if it's not the natural way that the calendar user thinks about it, then it's not needed to be the default.
- SFC: This is MG's area of expertise. He's working on a scheme for month codes. I don't know what you mean by a universally understood standard.
- We pause this discussion.

### General principles [#1304](https://github.com/tc39/proposal-temporal/issues/1304)
- JGT's assumptions:
  1. Most nontrivial non-ISO-calendar code is going to depend on third-party libraries that were not written or tested with non-ISO calendars.
  2. Therefore, ISO code should "just work" for non-ISO calendars.
  3. It's OK to have to write special code for complicated calendar rules, of which the ISO calendar has few.
  4. We should avoid degrading ISO ergonomics to satisfy relatively unusual non-ISO use cases.

     Example, Japanese is the only calendar that has many eras and where another era is expected to be created in the next 100 years. Other examples, lunisolar calendars are not used as a civil calendar, and eras that count backwards are relatively rare in software.
- DE: It seems that by going through these principles, we're just repeating the same arguments again that we did in the previous discussion.
- SFC: I think it helps to clarify the competing priorities. MG and I want to make it easy to write trans-calendar code, which may be different than the code that you write for only the ISO calendar, as long as it leads programmers on the right path. This slightly overlaps with JGT's list, but it's focused differently.
- JGT: The primary disagreement that SFC and MG have is over #4, you are OK with slightly worse ergonomics in ISO calendars in order to ensure correctness for other calendars.
- SFC: I don't like that phrasing, but essentially that's correct.
- JGT: "More complex"?

### What do we do on YearMonth and MonthDay?
- SFC: PlainMonthDay is intended to represent an anniversary or birthday without a year. Month index can refer to a different actual month depending on the year.
- JGT: The way I solved this in the PR is to accept either a month index and year, or month code, on input.
- SFC: Indeed, that works on input, but on output, month index doesn't make sense.
- PDL: If I had a birthday on 5 Adar I, then the month code wouldn't exist in every year either.
- SFC: If your birthday is 5 Adar I, then your birthday is 5 Adar II in a non-leap year. Most calendars have rules for resolving this.
- JGT: I agree with SFC, the month index 7 may be Adar I or Adar II depending on the year, but the month code would always be the same.
- SFC: If `month` is the month index and `monthCode` is the code, then PlainMonthDay might have the `month` getter throw or return undefined, and `monthCode` would return the code. If `month` is the month code, then no changes are needed to PlainMonthDay. Or, `month` could return the month code as well. However, it's worth pointing out that PlainMonthDay already has weird behaviour.
- JGT: We already agreed that we shouldn't degrade the general case in order to avoid weird behaviour in PlainMonthDay.
- MG: This makes me want to default to month code even more. However, another idea is `monthType`. Or if not having a `month` getter is an option.
- PFC: Since we know what we'd do with PlainMonthDay in either case, maybe this is resolved?
- JGT: Not having a `month` getter, only `monthCode`, on PlainMonthDay might be a good way to achieve the same result we're trying to get to by only impacting the PlainMonthDay type.
- DE: I think this would be bad usability.
- PFC: I agree.
- SFC: If you think it's weird that the `month` getter on PlainMonthDay doesn't exist or throws, then that influences what we should do on PlainDate and the other types.
- JGT: Which is weirder? All Temporal types having a string month, or MonthDay not having a month?
- SFC: Inconsistency is weirder.
- DE: Why couldn't we have a month index? We have a reference year? Are you saying it would be fatally bad to calculate the month index from the reference year? I don't buy that.
- JGT: What would that month index mean, though? The same number would mean two different months depending on the reference year.
- MG: I think month codes are better for internationalization, but I do understand the doubt about ergonomics. I especially think the month field being a code will work well for PlainMonthDay. People will expect the month field to be a number, and use it like a number, and that might mess it up.
- DE: When you say about ergonomics, one example we talked about before was `=== 1`. What do you think about that?
- MG: One of the ways you can make that work is if the code is never a number, e.g. M1, M2, M3. That solves the problem of users thinking they're numbers but suddenly not. I do feel that people wouldn't like that.

### eraYear [#1231](https://github.com/tc39/proposal-temporal/issues/1231)
- JGT: The specific proposal is to make `year` a signed year. Having written test code, this assumption seems to be most handy in allowing you to write code assuming the semantics of the ISO calendar. You don't need to understand how eras work to write code that works with calendars with eras. It achieves that goal of allowing code written for the ISO calendar to work across other calendars.
- PDL: I think we should take a step back. If we are making `month` a string, then we should be consistent and make `year` a string including the era.
- DE: But you'd still want to query the era. I don't understand.
- PFC: Having `month` be a month code might be an acceptable tradeoff, but having `year` be an `"ad-2020"` string would be hugely disruptive for little benefit.
- SFC: I like the direction PDL is coming from.
- DE: Another idea would be to make different types in different calendars.
- JGT: That would guarantee that code written for ISO would not work for non-ISO.
- ???
- JGT: If `month`, `day`, and `year` are always numbers, then it makes it easier to port that code to non-ISO calendars.
- (Discussion about years as strings)
- DE: I didn't catch the rationale against having an `isLeapMonth` getter.
- JGT: That would also make it hard to write code for the ISO calendar that just works in non-ISO calendars.
- DE: I thought that was what `getFields()` was for.
- JGT: My experience in writing calendar apps is that it's a continuum. Code written for ISO is going to assume that `isLeapMonth` is always false, or whatever.
- DE: We need to document this really well.
- JGT: ???
- MG: ???
- DE: Why not make the month number repeat in the month index?
- MG: It doesn't round trip. There is a concept of "merged months" in some calendars that doesn't translate to that. `monthCode` having a string like "5L" means month 5, `monthType` L.
- JGT: Having two fields for the meaning of one thing seems like it is tough for storage.

### Ranked choice voting
We decide to inventory the champions' preferences with a ranked choice poll, and see if we can come to consensus on an option that has broad support.

#### Option 1a
- `.month` = string (`"M1"`)
- `.year` = string (`"Y2021"`)

#### Option 1b
- `.month` = string
- `.year` is a number and `.era` is a separate string

#### Option 2
- `.monthIndex` (omitted on PlainMonthDay)
- `.monthCode`
- (`year` behavior undetermined)

#### Option 3a
- `.month` = month index number (omitted on PlainMonthDay)
- Variant: with `month` on PlainMonthDay calculated from reference year
- `.monthCode`
- `.year` = signed year
- `.eraYear`, `.era`

#### Option 3b
- `.month` = index (omitted on PlainMonthDay)
- Variant: with month on PlainMonthDay calculated from reference year
- `.monthCode`
- `.year`, `.era` (no `.eraYear`)

#### Option 4
- `.year`, `.era`
- `.month` (Number but logical index in year; may repeat), `.monthType`
- Possible variant: there are convenience getters `.yearEra`, `.monthWithType`

#### "Spicy" Option 5
- `Temporal.PlainMonth`
- `Temporal.PlainYear`

Choices:

| Initials | Choices
|----------|--------
| **JGT**  | 3a, 2, 1b, 1a, 4
| **PFC**  | 3a (both variants), 3b, 1b, 4, spicy 5
| **DE**   | 4 (with variant), 3a (variant), any other kind of 3, spicy 5, 1b, 1a, 2
| **SFC**  | 1a, 3a (non-variant preferred), 2, 1b, 4, 3b
| **MG**   | 3a (non-variant preferred), 1b, spicy 5, 1a, 2, 3b
| **USA**  | 4, 3b, 3, 1b, 2, 1a
| **PDL**  | 3
| **CJT**  | 3 (both), 4, 1b, 2, 1a
| **RGN**  | 3a ≫ … ≫ 1{a,b}

Consensus on 3a.

There is still an open question about whether PlainMonthDay will have a month index based on the reference year.
- JGT: If the result of that getter is the same for different months, is that OK?
- DE: The other option is to say that the month index is in regard to a year with no leap months.
- PFC: Or a fictional year with all the months, even if it doesn't exist.
- JGT: That wouldn't allow using MonthDay as the input to anything else.
- USA: The reference year is some year that has all the ???
- JGT: All choices for MonthDay can accept (month, day, year) or (monthCode, day) in `from` and `with`. 

Choices for MonthDay getters:

#### Option 1
- `.monthCode` = string
- `.month` throws, all calendars

#### Option 2
- `.monthCode` = string
- `.month` returns undefined (nonexistent on TypeScript)

#### Option 3:
`.month` = string

Voting:

| Initials | Choices
|----------|--------
| **JGT**  | 1, 2 ≫ 3
| **PFC**  | 3, 1, 2
| **MG**   | 1 ~> 2 ≫ 3
| **SFC**  | 2, > 1, ≫ 3
| **DE**   | 2, 1 ≫ 3
| **USA**  | 2, 3, 1
| **CJT**  | 1 ~> 2 ≫ 3

Consensus on option 2.

- DE: Do we need agreement on the month code scheme or can we do that out of band?
- MG: I'm working on a scheme.
- JGT: Is is necessary to have this for Stage 3? Will the reviewers not believe that we're done with the proposal, if we do this out of band?
- DE: Could we refer to iCal scheme?
- MG: Mine is a similar scheme to iCal, but handling more calendars: number + qualifier, and also `2-merged-3`. We could use short codes like iCalendar but appearing to look like iCalendar is probably a bad idea.
- DE: Could we standardize this in the Unicode consortium?
- SFC: I would like to see the month code scheme defined somewhere, yes.
- RGN: I think it should live elsewhere and should be referred to by ECMAScript.
- DE: What we did with the ISO 8601 extension is that USA wrote an IETF draft and we refer to it in the proposal. Could you do similar with the month code scheme? That would make me happy.
- MG: I would like to standardize it. I don't think it's a hard blocker.
- DE: I don't want to have any hard blockers after Stage 3. I don't want to have open questions among us about what engines are supposed to do.
- Consensus: we'll do this out of band, aligned with the scheme that MG is working on for encoding months and eras, and work towards a normative reference.

### [Intl.DisplayNames v2](https://github.com/tc39/ecma402/blob/master/meetings/notes-2021-01-14.md#intldisplaynames-for-stage-2)
- DE: I was confused by the notes from 402 because it's not clear what we need to do in Temporal to unblock it. It seems like Intl.DisplayNames is now blocked on this month encoding scheme.
- SFC: The decision at the 402 meeting was not to move forward on month names in Intl.DisplayNames unless something changes.
- DE: I'm surprised by that. I think month names are very important.
- JGT: The idea is that you would use Temporal's toLocaleString with only the month option.
- PFC: I see, that's what was meant by "use Temporal".

### `with()` [#1235](https://github.com/tc39/proposal-temporal/issues/1235)
- JGT: In order to make `with()` work with `month` and `monthCode`, you need some way for `with()` to distinguish between fields that were already in the object and fields given as an argument.
- Consensus that we do actually need to solve this problem one way or the other.

### Overflow [#1237](https://github.com/tc39/proposal-temporal/issues/1237)
- JGT: When you have leap days and leap months, I assume the calendar should be in charge of deciding how to resolve the `overflow: 'constrain'`.
- Consensus.

### PlainMonthDay.equals [#1239](https://github.com/tc39/proposal-temporal/issues/1239)
- JGT: `PlainMonthDay.equals()` when the reference years are different. We discussed having the same `monthcode` and `day` always resolving to the same reference year.
- Consensus already reached last week.

### Passing the options through to the calendar [#1253](https://github.com/tc39/proposal-temporal/issues/1253)
Already consensus on this one.

### Era starting in the middle of the year [#1300](https://github.com/tc39/proposal-temporal/issues/1300)
- JGT: What should be the behaviour of the calendar if you provide e.g. February 1, Reiwa 1?
- SFC: MonthIndex 1 would be June in that case.
- RGN: The year is the same, though.
- PFC: This seems like it should be up to the calendar. It seems like there will be an existing cultural convention among users of the calendar.
- MG: ???
- RGN: I believe that's the way the Japanese calendar uses it; the months of year Reiwa 1 start with January and end with December.
- SFC: Month index is algorithmic, month code is for human consumption.
- JGT: We consider month index an index into the signed year.
- SFC: Point taken.
- Consensus: month index is defined as the index into the signed year.

### `getFields()` and `from()`: [#1235](https://github.com/tc39/proposal-temporal/issues/1235)
- JGT: Currently there's a limitation that in order to accept a field in `from()` it must be emitted by `getFields()`. Calendars can add a lot of convenience properties. I think it would be better to allow the calendar to accept fields that aren't emitted in `getFields()` and vice versa.
- PFC: I think `getFields()` giving you everything is exactly what makes it useful.
- JGT: I don't want to limit ourselves to what userland calendars might do.
- PFC: Can we say that the assumptions (1) `getFields()` gives you everything that the calendar puts on there and (2) returned object from `getFields()` should be able to be passed to `from()` are the boundaries in which userland calendars have to limit themselves?
- JGT: Are we concerned about the cost of storing extra fields in a database?
- RGN: I hope we're not concerned about that.
- JGT: Sounds like the answer is no, we're not concerned about this.
- SFC: It seems weird to me that `getFields()` outputs more than it needs to. One purpose of `getFields()` is to ship your date across an API boundary, e.g. serialized in JSON.
- PDL: Why do you care if there are extra fields there?
- JGT: So if you want minimal serialization you can destructure the fields, or use `toString()`.
- PDL: I'm fine with that because you should be using the ISO string for serialization.
- JGT: It will make spreading bad though. PFC, your point was that people should use `with()` for that?
- PFC: It was, but I hadn't considered the effect on spreading. I'll concede that.
- SFC: If spreading was the only reason for `getFields()` then can we remove it?
- Various people agree that it can be added in a v2 if it is necessary.
- Consensus: Unless there is a use case other than spreading that we aren't aware of right now, remove `getFields()`.

### Validation of fields [#1229](https://github.com/tc39/proposal-temporal/issues/1229)
- USA: I think it makes sense to delegate this to the calendar.
- DE: This seems largely dependent on the discussion that we just had. Flexibility has a cost so I'd prefer to keep the validation in Temporal core.
- SFC: We can validate in the ISO calendar and all the builtin calendars, and if a third party calendar doesn't do it, then that's a bug in that calendar.
- DE: I don't feel too strongly about this.
- USA: ???
- SFC: Are we talking about input or output?
- JGT: Both.
- SFC: I think for output it doesn't matter that much. We could pass whatever the calendar gives through the String or Number constructor. The point of having this would be to prevent userland calendar authors from doing something they're not supposed to do.
- JGT: That actually sounds good to me, because the callers of Temporal methods can be sure of what type they get back. That seems like a good thing.
- USA: I was making a distinction between callers of Temporal and callers using third-party calendars that might want to have different types for fields.
- JGT: Calendars have the ability to create more fields. They should do that instead.
- USA: Okay, I agree on validating year, month, and day in Temporal.
- PDL: What do we do if `month` and `monthCode` don't agree?
- JGT: In my pull request it throws if they don't agree.
- SFC: If you have `monthCode`, it's probably more intentional than month, so it should take priority.
- JGT: I disagree, that's a slippery slope.
- PDL: I brought this up to ensure we have a clear statement, and I don't care which it is. I'm fine with throwing.
- SFC: I'm not sure I agree with validating on input.
- PDL: I think we should disallow negative months and days because otherwise people might expect balance behaviour.
- Consensus:
  - `era` = string or undefined on both input and output
  - `eraYear` = number or undefined on both input and output
  - `era` and `eraYear` are tied together (either both undefined or both not undefined)
  - `monthCode` = string, always present on output, OK to be undefined on input
  - `year` = integer number, always present on output, OK to be undefined on input
  - `month`, `day` = positive integer number, always present on output, OK to be undefined on input
  - Calendars can do additional validation, but this is what Temporal core verifies.
  - Recommend that calendars throw on conflicts, e.g. `month` and `monthCode` inconsistent.
  - Require that builtin calendars throw on conflicts.

### Do we add `.era` and `.eraYear` on the ISO calendar?
- (Note: calendars may still want to add their own getters)
- PFC: I thought the consensus was to have undefined for non applicable fields.
- SFC: We've gone back and forth on this a few times.
- DE: I'm not comfortable inventing an era for the ISO calendar.
- SFC: I think `era` and `eraYear` should go together.
- Consensus: `era` and `eraYear` undefined on ISO calendar.

### Freeze status
- DE: Now that we've decided on this, from now on changes should originate from other delegates.
- JGT: There are a few things that need design work, like how we solve the problem of `with()`.
- PFC: CJT or I can prioritize solving that problem and hopefully it will be the only agenda item on Thursday.
