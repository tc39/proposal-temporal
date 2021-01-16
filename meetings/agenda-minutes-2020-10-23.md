# Oct 23, 2020

## Attendees:
- Ujjwal Sharma (USA)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Shane F Carr (SFC)

## Agenda:

### Finalize rounding modes [#1038](https://github.com/tc39/proposal-temporal/issues/1038)
- PFC: Can we just make a note that the set of strings is provisional and is intended to match whatever Intl.NumberFormat does?
- RGN: Agreed, that wouldn't hold up a review.
- SFC: On the Intl.NumberFormat side JGT proposed an away-from-zero (anti-truncate) mode that is in ICU but not CSS.
- USA: `'ceil'` would work for the lawyer billing case.
- RGN: Was there a use case for this?
- JGT: On the output of difference() you need it in the case where you're not sure of the sign but you want to round up.
- RGN: That's true, but you can do `difference().abs().round({ roundingMode: 'ceil' })`.
- JGT: That's three operations, whereas if you round in difference() it's only two.
- [JGT/SFC/RGN met to follow up after the big meeting — summary is below]
- RGN: Floating vs. non-floating distinction isn’t needed.
- JGT: Add “away from zero”. Name = “expand” ?
- RGN: Good, sounds like opposite of “trunc”.  We don’t want a name that sounds signed.
- RGN: Rationale for choosing names:
  1) The main four (ceil, floor, trunc, nearest) should be not confusable with each other.
  2) We should derive the “half/tie-breaking” option names from the main four.
- SFC: Let’s add all the tie-breaking options: the main four (ceil, floor, trunc, expand) and also even/odd. Names will be halfXxx, e.g. halfExpand.
- SFC: camelCase for names?
- JGT: OK. Temporal should defer to 402 on casing rules.
- JGT: Is it OK that the default (halfExpand) is not obvious like the previous name “nearest”?
- RGN: Yes, because the default will be the least likely name to type in. 
- JGT: OK. I like the pattern of tiebreakprefixMode not modeTiebreakprefix because the former lumps all the tie-breaking modes together in auto-complete.
- SFC: OK, we have consensus, I’ll write it up and sync with Intl.

### Rename `difference` to communicate directionality [#998](https://github.com/tc39/proposal-temporal/issues/998)
- PFC: I think one of the options would be easier to implement, just renaming the method, and the other one would need to change the algorithm because the implicit relativeTo is `this`.
- SFC: I prefer durationUntil() over until().
- RGN: difference() is too vague a name, I would always be pulling up the docs to see what the sign would be. I think we can do better in Temporal.
- SFC: I personally wouldn't mind add() adding a Duration and subtract() subtracting an object of the same type.
- PFC: I don't see an overwhelming reason to change it. We changed add/subtract to match Moment so it would be odd to change this away from that.
- JGT: Java calls it until(), Moment calls it diff(), date-fns calls it difference(), .NET does what SFC suggested and calls it subtract().
- SFC: I'm not sure of the order of until() either. To be honest I'd probably write my code, write a unit test, and flip the order if it fails. We could go with diff() since it's the shortest.
- JGT: Moment's diff() is static, so you pass two arguments. That in itself would make me not want to call it diff() because people would expect it to work that way.
- SFC: Could we have both since() and until()?
- RGN: That will make for clearer author code. It will encourage people to reach for the method that matches their internal reasoning.
- JGT: That's the reason we decided to keep subtract() yesterday.
- PFC: Could that be done in a follow-up proposal? I don't agree with adding more things without an overwhelming reason.
- RGN: That may be a consequence of the review anyway. We can add one and if it feels incomplete then the other could be added later.
- (discussion of the behaviour re. rounding)
- SFC: `this` being the relativeTo for rounding is a reason to have both methods, because you can choose which operand is the relativeTo.
- PFC: My position is I'm OK to add this if it's a trivial sign-flip but if we have to add a new rounding algorithm then it's not worth delaying the review over.
- RGN: Can we commit to renaming 'difference' to 'since', and investigate whether adding 'until' will be complex?
- Consensus: We do what RGN said above, and prefer the shorter names.

### `Duration.prototype.isZero()` is a function but `DateTime.prototype.isLeapYear` is a property [#1019](https://github.com/tc39/proposal-temporal/issues/1019)
- JGT: My suggestion to address JHD's concerns was to rename the properties with 'is' in the name so they don't sound like methods.
- PFC: I'm not the biggest fan of `blank` but these sound fine.
- RGN: Do we need `isZero` if we have total methods?
- JGT: The total methods would be quite wordy for that purpose.
- JGT: While we're here, I'm not sure we need `atOffsetTransition` anyway.
- USA: I like `inLeapYear` better than `isLeapYear` anyway.
- SFC: I'd almost argue that we should remove `isLeapYear` and have `yearType` which returns a string enumeration, to accommodate e.g. the Hebrew calendar which has 3 types of years.
- JGT: I think it's useful to have a boolean showing that this is an "unusual" year.
- SFC: I just checked the Hebrew calendar and you actually need a leap variable as well as the `yearType`.
- JGT: I'd have a boolean in one place, and have the calendar be responsible for other properties. A boolean can always make sense for whatever calendar.
- SFC: A leap year means different things for different calendars. In the Gregorian calendar it means an extra day, but in many other calendars it means an extra month. I'm not sure it's correct to draw an equivalency there.
- SFC: Going back to the original question, how about `leapYear` instead of `isLeapYear`, and keeping `isZero` a function?
- JGT: How about making the property `zero`?
- SFC: My intuition says that the "zero" (as a noun) of a duration is the date where it starts, i.e. `relativeTo`, as in the "zero" of a sequence. Feel free to disregard if you don't have this sense.
- PFC: I prefer `zero` but am fine with `blank`.
- Consensus: `inLeapYear`, `blank`, and remove `isOffsetTransition`.

### Re-re-reconsider accepting non-normalized arguments in timezone methods [#1030](https://github.com/tc39/proposal-temporal/issues/1030)
- JGT: My point was that you never need to call a Calendar method directly, whereas you can sometimes need to call TimeZone methods directly. Custom time zones are an unusual case so I'm not sure we need to optimize the ergonomics of creating custom time zones rather than the ergonomics of the user code calling methods.
- RGN: I think it should be consistent everywhere, including Calendar.
- SFC: I think we should treat TimeZone and Calendar the same.
- JGT: Is there any Calendar functionality that isn't exposed in a more ergonomic way elsewhere?
- SFC: You might use only a Temporal.Calendar to write a conversion application.
- RGN: I think the built-in methods should be consistent, and accept property bags and strings. Whether the methods on custom calendars should accept property bags or strings is up to the application.
- SFC: I would also be OK with taking Ms2ger's position that TimeZone and Calendar are special, and therefore we don't convert property bags and strings.
- RGN: I agree that they are special, but I don't think that translates to a reduction in input flexibility.
- SFC: Is it possible to get the from() from the passed-in constructor?
- PFC: Yes, but not in the numerical properties like `year`.
- SFC: I have a slight preference for saying TimeZone and Calendar are internal and keeping the strict types.
- RGN: My position is that the built-in ones ought to be flexible with their input.
- SFC: If the built-in ones are flexible, then the custom ones also have to be flexible to be conformant, and I think that's problematic because it's not always clear what from() method you need to call, because of subclassing. We'd need to change all the other methods to take a constructor so that you know what from() to call.
- RGN: I will be looking at that in my review, but writing a correct polyfill is difficult. I don't think it warrants the built-in ones not being flexible with their input. You don't need the extra constructor argument because you can get the information you need from the string.
- SFC: OK, I'm convinced you don't need the extra argument.
- Consensus: both Calendar and TimeZone methods should accept flexible input types.

### withCalendar / withTimeZone [#906](https://github.com/tc39/proposal-temporal/issues/906)
- JGT, SFC, and PDL to hash this out in a separate meeting.
- (Some discussion of the algorithm)
- JGT: My point yesterday was that there is so much confusion about this, that it's never going to be clear to developers so we should just remove `timeZone` from this method.
- SFC: Acknowledged it's confusing, but I think we should start by coming up with an algorithm that everyone agrees on and doesn't produce surprising results. If it's still confusing after that, then we should consider removing it.
