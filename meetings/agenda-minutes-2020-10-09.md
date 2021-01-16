# Oct 9, 2020

## Attendees:
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Shane F. Carr (SFC)

## Agenda:

### Addendum to [#933](https://github.com/tc39/proposal-temporal/issues/933)
- RGN: PDL isn't here, but I'll try to represent his position since I've raised the same issue. When you pass a string, it's treated as if it were a property bag with all the same fields as in the string. Therefore, extending that argument, this format should also be acceptable.
- JGT: PDL's position was also that this string should be allowed when parsing into a DateTime but not a ZonedDateTime.
- RGN: This really depends on what we have specified exactly as the valid format.
- USA: This format is invalid.
- PFC: I think what RGN said applies when the string is valid but contains extraneous units, but here we indeed decided yesterday that the string itself is invalid. So it should not be accepted by either ZonedDateTime or DateTime. I think the resolution should be that we write a cookbook recipe, but it will be different from the two-line one that PDL suggested yesterday.
- This is our tentative conclusion, unless people who aren't here object.

### Handling TZ database updates [#629](https://github.com/tc39/proposal-temporal/issues/629)
- JGT: How does 262 think about these things?
- RGN: In 262 this is unspecified. There isn't any place I know of in the spec where it is important. This situation doesn't exist with legacy Date because the objects themselves carry a time zone. It seems reasonable and expected that if I invoke `Temporal.now.zonedDateTime()` before and after updating the tzdata, I get a different result. On the other hand, there's a strong reason to say that with Temporal.TimeZone, if the tzdata changes, the object itself remains the same.
- USA: Does anyone know of a host environment that can hot-update the tzdata? Node.js and browsers don't, that I know of.
- JGT: Linux does.
- USA: The operating system in general does, but I would not expect the tzdata inside of Node to change in a long-running process. Node loads the icudata at startup time.
- JGT: Is tzdata included in icudata?
- PFC: I think only the localizations for time zone names.
- RGN: In the end it doesn't matter whether hot-swapping is possible. I think it should be impossible to do `Temporal.TimeZone.from('America/New_York')` before and after a hot-swap and get a different New York time zone. If you read `America/New_York` before the hot-swap and Asia/Tokyo after, then it seems acceptable that they might be from different versions of tzdata.
- PFC: Can the conclusion be that we specify what RGN said? If you load the same time zone before and after a tzdata update, the objects behave identically.
- JGT: How does that work with IoT devices that may be running for months? Can they just not get updates?
- PFC: It's up to the implementation. They may cache one time zone when it's fetched, or cache the whole tzdata, or not have updates.
- USA: The particulars are not our responsibility to specify, it's up to the implementation.
- (missed a bit of the discussion)
- RGN: I think that what we should specify is that any observable built-in Temporal.TimeZone access should be constant in the same process across tzdata updates.
- USA: I think it should be up to the host.
- RGN: If we don't make any guarantees, then code cannot be portable from host to host.
- PFC: I like this approach of specifying the minimum requirement, because it's the only thing we care about.
- USA: As long as it doesn't affect round tripping, for example, Instant to DateTime.
- JGT: Should we expose the version number of tzdata?
- RGN: I don't think it's necessary, and it might overconstrain things if we expose it.
- JGT: There is a canonical version.
- PFC: The version might be meaningless, for example in environments that only provide UTC and offset time zones.
- JGT: The version number doesn't have to have any meaning, but you could specify that if it changes then you may get different results.
- RGN: What about custom time zones?
- JGT: Custom time zones need to be responsible for their own caching. We could say that the whole built-in tzdata needs to be cached, but that might be a problem for low-memory environments.
- RGN: Agreed. I don't see a problem with specifying that it's stable across individual time zones, but implementations may do more.
- JGT: What if you have multiple time zones in the same country, one cached, and one not cached, and the country gets rid of DST?
- RGN: I think that's an acceptable tradeoff. We can encourage caching the whole thing, but say that the minimum is that individual time zones must be stable.
- JGT: What about time zone aliases?
- RGN: I think divergence is okay there.
- PFC: If you request an alias time zone, you get one with the canonical name.
- RGN: It sorts itself out, then.

### Options for toString [#703](https://github.com/tc39/proposal-temporal/issues/703)
- RGN: If specifying the number of digits effectively forces rounding, a rounding mode must be chosen in any case. Is anyone opposed to adding a `roundingMode` argument, even if the default is to truncate?
- JGT: I'm not opposed to this.
- PFC: The proposal is to add a `roundingMode` option?
- RGN: `roundingMode` and `smallestUnit`.
PFC: `smallestUnit` will conflict with `fractionalSecondDigits`.
- JGT: Can we get away with having `smallestUnit` and not `fractionalSecondDigits`?
- SFC: Intl.DateTimeFormat supports `fractionalSecondDigits`, it would be surprising for Temporal not to support it since there's not a good reason not to. It's common for systems to operate with 2 fractional digits.
- RGN: That's a solved problem within Temporal, using the rounding options.
- PFC: It would not print out with 2 fractional digits.
- JGT: We could special-case a rounding increment that's a multiple of 10 or 100. It would be less discoverable than `fractionalSecondDigits`.
- RGN: `fractionalSecondDigits` is an output concern, but it's an output concern that brings in rounding. We could punt on `roundingIncrement` and `smallestUnit` and just have `fractionalSecondDigits`.
- JGT: We could support `smallestUnit` and base the default of `fractionalSecondDigits` on that value.
- RGN: That would make sense, but I don't think it is necessary.
- JGT: I think it's better to have consistency between the rounding options.
- PFC: I'm not opposed to having `smallestUnit` but I don't think we should bring in `roundingIncrement`, because rounding isn't an output concern, like RGN said. If you do `datetime.toString({ smallestUnit: 'months' })` then you get an invalid ISO string for that type, for example. I'd rather have `smallestUnit` only be allowed to be seconds, milliseconds, microseconds, and nanoseconds, and have that be an alias for `fractionalSecondDigits`.
- JGT: I think we should allow `smallestUnit` to be minutes, in that case. That's a common output use case.
- PFC: We did decide last week not to allow that.
- JGT: I think the rationale was that it was too difficult to express in `fractionalSecondDigits`, but we could easily do it with `smallestUnit`.
- RGN: I don't see the exact rationale in the minutes from last week, but we did decide that `'auto'` would always show seconds. By the way, NumberFormat has `minimumFractionDigits` and `maximumFractionDigits`, not "fractional".
- PFC: Which option wins if `fractionalSecondDigits` and `smallestUnit` are both present?
- JGT: `fractionalSecondDigits`.
- RGN: So the defaults are `roundingMode: 'trunc', smallestUnit: 'nanoseconds', fractionalSecondDigits: 'auto'`. The default is truncate to avoid the concern with larger fields changing in the default mode.
- JGT: In the ECMA-402 meeting it sounded like having `false` as an option was not necessarily a pattern to be emulated. Should we avoid emulating it here as well?
- RGN: That was my reading as well. Having `false` for `fractionalSecondDigits` doesn't seem very valuable to me now that we've taken out the units. We do need a way to specify a number of digits, and also `'auto'`.
- PFC: You could say that if you pass a number it goes through ToString and the numeric string is the valid option.
- RGN: We'd want to avoid that though. ToNumber produces valid numbers for other strings like hex expressions.
- JGT: How about the other options? And how about `true`?
- RGN: The intuitive understanding is that false would correspond to `'never'`; and true would correspond to `'always'` if that value is available, and otherwise `'auto'`.
- JGT: There's ambiguity because undefined is falsey.
- RGN: Have you read about [boolean traps](https://ariya.io/2011/08/hall-of-api-shame-boolean-trap)? This seems like an intentional introduction of boolean traps. It seems like `'never'` is a perfectly good value.
- PFC: Should we go ahead with `'never'` and if SFC feels strongly about it then he can advocate for it separately?
- RGN: I don't feel too strongly about it, though I'd personally avoid `false` in my code if it were allowed.
- Consensus: add `roundingMode` and `smallestUnit` as described, and not `roundingIncrement`, due to it not being core to the output concern. Remove unit values from `fractionalSecondDigits`. Default behavior emits seconds and all smaller nonzero fields (as before), and is equivalent to `{smallestUnit: "nanosecond", fractionalSecondDigits: "auto", roundingMode: "trunc"}`.

### Inconsistency in Duration balancing [#974](https://github.com/tc39/proposal-temporal/issues/974)
- JGT: My preference is to remove balancing from from() and with(), or to add the rounding options to from() and with().
- RGN: Removing it completely, given that there's a dedicated method, is the simplest way.
- PFC: We only had that balancing because there was no other way to balance a Duration. Now that we have that way, it's fine with me to remove it.

### Non-integer Duration fields [#938](https://github.com/tc39/proposal-temporal/issues/938)
- PFC: When we specified which variations of ISO to accept, we decided to accept fractions only in seconds. The reason being that the data model is integers.
- JGT: A use case is a punch card system that works in increments of 0.25 hours, for example.
- RGN: It seems reasonable to support it in string parsing, but keep the data model the same. I don't find it important to support it in output.
- PFC: If it's only in string parsing, I still don't find it important to support, but my 'no' is less strong.
- RGN: It occurs in other types of ISO strings that Duration, as well.
- JGT: I think the only use cases are regarding durations, in things like time clocks. I think it's OK to support it only in Duration.
- RGN: I don't feel strongly.
- JGT: Talking about totals, I did find it was harder than I thought it would be to express a duration as a non-integer total. Maybe a total() method would cover this use case. Most other libraries have this.
- RGN: That seems like a reasonable convenience to offer. 
- PFC: This is a reasonable use case, but I don't see it as vital, and I think it would just add more delay until we are able to present the proposal for review.
- JGT: There are hard cases that it would cover as well, for example the total of hours with a relativeTo ZonedDateTime. For me that tips it into something that should be included.
- (back to fractional values in from())
- PFC: I'm not a fan of this because we would be bringing rounding in to string parsing.
- RGN: One of the things that has concerned me for a while is that you can pass in 1.5 hours to the Duration constructor and you get back 1 hour. This would at least make it fractional-aware, which would be an improvement.
- JGT: Would we have multiple fractional units?
- RGN: That's not supported in ISO 8601, so no need.
- JGT: I would support it only for Durations despite other ISO strings supporting it.
- PFC: I'm not a fan of this because for some fractional units, you need a calendar to resolve what it turns into.
- RGN: I think it should only be supported for days or smaller, so you don't need a calendar. We are just opting into enough of ISO 8601 to provide the use cases that seem relevant. We could also defer this altogether, provided that we changed the current behaviour to throw on non-integer values. That needs to change regardless.
- JGT: I think it's important to have this.
- RGN: Days and smaller or hours and smaller?
- PFC: There's no place to put relativeTo in the constructor.
- JGT: Hours and smaller, then. Only the smallest nonzero unit of hours or smaller may be a non-integer. If any other non-integers are specified, then it will throw.

### getEpochXxxSeconds property getters [#750](https://github.com/tc39/proposal-temporal/issues/750)
- RGN: I would feel so much better about this if we were dealing with own properties that were spreadable.
- JGT: What distinguishes getEpochMilliseconds from hoursInDay?
RGN: I don't think anything distinguishes them. I don't think either should be a property. To me, properties are the things that define the value, and anything else should be a method.
- JGT: For me, dealing with legacy Date for years and typing getThis, getThat, is frustrating.
- RGN: Indeed, it's annoying. It feels more like Java than JavaScript.
- JGT: We've gotten a lot of feedback about brevity, and most of the feedback has to do with exactly this use case. Given that context, that's what's makes it more than a nice-to-have for me.
- PFC: I think we've gotten a disproportionate amount of feedback about the brevity of exactly this use case because people are too used to legacy Date. They won't need it if they are using Temporal correctly, except for interoperation. That said I was convinced in favour of properties by the consistency arguments on this thread.
- Consensus: For consistency, we'll make these into properties.

### Instant property getters on LocalDateTime [#932](https://github.com/tc39/proposal-temporal/issues/932)
- PFC: The way that I interpret MJP's argument is that from his experience in Moment, people expect the Unix timestamp 0 to be at January 1 1970 in their local time zone.
- JGT: That's almost so wrong that it should fail. Why should the intuition be different with Instant?
- PFC: Instant doesn't have a time zone, so people with this wrong understanding would be less confused.
- Consensus: We think tentatively that these properties should be included on ZonedDateTime, but we'll invite MJP to advocate again for not including them since we might not be understanding the rationale.

### Own properties [#917](https://github.com/tc39/proposal-temporal/issues/917)
Deferred.

### TimeZone.from and Calendar.from [#925](https://github.com/tc39/proposal-temporal/issues/925)
Deferred.
