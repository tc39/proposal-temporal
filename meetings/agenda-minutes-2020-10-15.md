# Oct 15, 2020

## Attendees:
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Justin Grant (JGT)
- Jase Williams (JWS)
- Daniel Ehrenberg (DE)
- Bradley Farias (BFS)
- Philip Chimento (PFC)

## Agenda:

### Can we come up with a better name for `difference` that communicates the directionality?
- RGN: "since" and "until" might be good names.
- PDL: This has a connection to the order-of-operations issue. I think we should only be using "add", "subtract", and "difference" if we are doing that kind of math. Otherwise we should look for words that don't have a reversibility connotation.
- PFC: The order of operations should still be reversible, so can we keep "difference"?
- RGN: The problem with "difference" is that it's not intuitive whether the result will be positive or negative.
- JWS: It seems intuitive to me.
- RGN: I think "difference" works but there's an opportunity to do better. Would "since" work?
- PFC: "since" would imply to me the opposite of what it does now.
- RGN: I don't care which way it goes, positive or negative.
- PDL: "since" is unintuitive to me. "Until" is slightly more intuitive but I still prefer "difference". "Difference" suggests the type of the return value and therefore the operation that takes place.
- RGN: "durationSince" or "durationUntil"?
- JWS: Do you need to know the direction now?
- JGT: Yes, if you don't care then you call abs() on the result.
- PDL: It's mid-October and I see this as a marginal benefit at most.
- JGT: I propose that we see some code examples in GitHub, and if there's not much enthusiasm after a week then we drop it.

### Poll results for Civil/Plain/FloatingDateTime ([#707](https://github.com/tc39/proposal-temporal/issues/707)
- JGT: Plain is the clear winner, and Floating, Civil, and "other" are approximately tied for second place. It's striking how many "other" responses there were, but Plain seems the obvious choice.
- PDL: I'm not surprised at the number of "other" responses since we had such trouble naming this.
- DE: We're back to the original Temporal naming.
- Conclusion: PlainDateTime, PlainDate, PlainTime, PlainMonthDay, PlainYearMonth.

### Anything left to discuss on order of operations? ([#993](https://github.com/tc39/proposal-temporal/issues/993) / [#913](https://github.com/tc39/proposal-temporal/issues/913))
- JGT: RGN and I have been going back and forth on the code sample in [#993](https://github.com/tc39/proposal-temporal/issues/993). I think there are subtly different expectations possible here.
- RGN: One way to phrase `largestUnit` is, make sure that no larger unit is used, and put as much as you can into the largest unit, and sometimes that may still be 0. For example, between today and tomorrow with `largestUnit: 'months'`. Surprisingly, there is still an interpretation where that is true, for a difference between a date late in January, and in March.
- JGT: I think that's more surprising than handling the intermediate balancing case.
- RGN: I agree with that.
- PDL: If you balance in between, then you don't have reversible math. Reversibility is essential for functions named "add" and "subtract". That only works if you have opposite order of operations between addition and subtractions, and if all the intermediate states between operations are valid without balancing. The other way we could go about this is to keep difference() as is, and add Duration.between() for the "messy", non-reversible case.
- JGT: What are the use cases and user intent for the kinds of differences that would result in these edge cases? If the user is using it for display, then that's bad.
- RGN: I think we should pick one option and document it. There isn't a clear correct answer. If it turns out there are use cases for both, then an option can be added later.
- PDL: I wouldn't object to that, since the default is `largestUnit: 'days'`, which gives you the mathematical behaviour, so you are already opting in to messiness.
- RGN: Observation: the model with intermediate constraining decomposes into separate operations (e.g., `.add({months: 1, days: 30})` is equivalent to `.add({months: 1}).add({days: 30})`).
- JGT: I think that’s a benefit, because people encountering separate results are likely to break things apart like that as they debug and then come to the conclusion that it’s just how things work. Further, the internal-balance model would be weird since the rest of the operations don’t balance dates like that.
- Conclusion: Decomposition-based model that does intermediate constraint (easier to explain, works like existing use of “constrain”, the messiness/lossiness only appears upon opt-in via explicit non-default `largestUnit`).
- JGT: Moving on to [#913](https://github.com/tc39/proposal-temporal/issues/913), does this affect the order of operations in subtraction?
- PDL: The order of operations was more important because of this mathematical reversibility. Once you reduce it to days-only, then that doesn't hold true anymore.
- JGT: Is there a benefit of changing it?
- PFC: What surprising result comes out, that would be fixed by changing it?
- PDL: If you get a non-exact result then the order of operations no longer helps you; the problem already happened in your call to difference(), not add() or subtract().
- RGN: This is exactly the reason that ISO 8601 added new ways to spell Durations.
- JGT: I'll write some code samples to make sure there are no surprises.
- PDL: I think it's an advantage to have the order of operations largest-first everywhere. We'll keep an eye out for funky results and maybe add an option in the future to reverse the order of operations.
- JGT: Given the above, what's the correct algorithm for difference()?
- PDL: My suggestion: first determine the sign, then use that sign to keep adding units from larger to smaller to this while it is still less than other, until they are equal.
- JGT: That would be the right algorithm, but it would be non-reversible in the case where you have an intermediate clip.
- PDL: We never do an intermediate clip.
- JGT: We start with January 31, add a month, which clips to February 28, then add a month, March 28...
- PDL: You don't clip at every step, just at the penultimate month.
- JGT: This means that you can do `.add(difference)` and get back to the other value. If you instead do the calculation from smallest to largest, then you always get a reversible result, but you can't do a `.add()` unless you know which one is the smaller.
- RGN: This is another case where neither is ideal, we just have to document it well.
- JGT: This is the same algorithm as Java.
- PDL: That would be a nice side effect, but not the top priority.
- PFC: I'm concerned about how this affects our ability to ship this month.
- PDL: I can work on the algorithms in the polyfill.
- PFC: I think it would additionally be helpful to have clear test cases showing what changes.
- JGT: I can add some test cases that cover this.

### Anything left to discuss on time zone offset in ZonedDateTime? ([#935](https://github.com/tc39/proposal-temporal/issues/935))
- JGT: Summarizing, I would suggest emitting a non-standard full-precision string for time zones with a sub-minute offset, and doing our best to parse a standard ISO string.
- PDL: As long as we don't emit the extra zeroes in time zones aligned at a minute boundary.
- RGN: We are only extending ISO 8601 when necessary to avoid data loss. It's very surprising to me that this isn't already part of the standard.
- Conclusion: As discussed in the issue, and push for ISO 8601 to standardize this.

### Resolution of withTimeZone ([#906](https://github.com/tc39/proposal-temporal/issues/906))
- JGT: We already decided this, but on the other hand the only other object that could have a `timeZone` on it is another ZonedDateTime, which you should not pass to with().
- PDL: Disagree, you can create e.g. a ZonedDate in userland.
- JGT: The only time you see `timeZone` in the object is if it's explicitly opted into, whereas you can get calendar in the object from all sorts of sources. I think we should either always disallow `timeZone` in the object, or not treat it the same as calendar.
- PDL: I think it should always be treated the same as calendar.
- JGT: What SFC suggested was, treat it differently if it's a Temporal object.
- PDL: That's possible but is bad behaviour.
- RGN: Agreed.
- PDL: The difference between `timeZone`/`calendar` and all the other properties is that the calendar and time zone contain their own logic on how to interpret the properties, but the other properties are just numbers.
- JGT: I just think that time zones are different from calendars in that they are going to be used more commonly and less deliberately, so the described behaviour would be more surprising for time zones than for calendars. I think that either throwing on `timeZone` or letting `timeZone` persist in the result would be better.
- PDL: Hard disagree. If we had a userland ZonedDate instance then this would suddenly surprisingly throw, or absorb it which is worse for the same reasons we have on calendars. We have a withTimeZone() method for a reason, so it should not be surprising that `with(timeZone)` doesn't do the same thing as withTimeZone().
- (Discussion about ZonedDate and ZonedTime)
- Conclusion: JGT to try some code with a ZonedTime type, and see if that changes his opinion. In any case throw if calendar or `timeZone` is the _only_ property provided to with(), since that wasn't clear in the previous decision)

### Resolution of ISO strings with a time zone name and no offset ([#933](https://github.com/tc39/proposal-temporal/issues/933))
- JGT: The only question left was that it seemed to me that PDL was under the impression that that format ought to be able to be parsed by `DateTime.from()`.
- PDL: Yes, it's a valid ISO string with our time zone annotation at the end.
- PFC: The time zone annotation includes an offset. If the offset isn't there, then it's just a valid ISO string with junk at the end, and we don't allow junk at the end.
- PDL: I don't see how the annotation requires an offset.
- PFC: So we change the definition of what is a 'part' of the ISO string. Previously a time zone part was a required offset and optional annotation.

### Remove plain-object time zones and calendars due to concerns from JHD? ([#925](https://github.com/tc39/proposal-temporal/issues/925))
- RGN: You cannot support only subclasses and not plain objects, because of cross-realm concerns. Objects from one realm need to work in another realm. You could use branding but I'm against that.
- JGT: One resolution to the OP is to throw if the time zone protocol object itself includes a `timeZone` property, or the calendar protocol object includes a calendar property.
- PFC: I'm OK with that. I'll follow up with JHD.
