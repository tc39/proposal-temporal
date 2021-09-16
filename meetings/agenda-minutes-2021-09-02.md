# September 2, 2021

## Attendees
- Cam Tenny (CJT)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Frank Yung-Fong Tang (FYT)
- Philipp Dunkel (PDL)

## Agenda
### IETF update
(Skipped as USA is absent)

### Storing nanoseconds as time zone offsets ([#1699](https://github.com/tc39/proposal-temporal/issues/1699))
- FYT: The key thing is that no real government body would ever set time zone offsets at a precision below seconds. Some software packages in the past might have allowed millisecond precision. With millisecond precision, you need to store a number that covers 48 hours, which is not really useful in the implementation. You can create an offset time zone with a nanosecond offset, so the spec requires that we store the nanoseconds. I'm hoping the spec can be relaxed in this regard.
- JGT: When we store this, does it have to be fixed-length in the data structure? All modern time zones can store their offset in 1 byte because they are all on 15-minute boundaries, which is by far the common case. If you have a variable length data structure then you can optimize this.
- CJT: Indeed, can you detect if the precision is needed and allocate a different data structure?
- PDL: I think we only did nanosecond precision in time zones because we did everything else in nanosecond precision and there wasn't a good reason not to. Is it the case that the maximum useful precision, even with something like leap seconds, is seconds?
- PFC: An example use case might be a TAI time zone, where the offset is a fraction of a second.
- RGN: The finest granularity expressible in the interchange format is one minute. If you are going to allow finer granularity than one minute, then I don't see a reason to limit the granularity to anything but nanoseconds, if the reason isn't interchange.
- FYT: Of course we can do a variable length data structure, but that also has costs. You need a flag and a pointer, which is 64-bits. So the pointer itself would be larger than the nanosecond value I'm trying to optimize.
- PDL: If the minimum size is 64-bits then what's the benefit of making it smaller if the struct is aligned at 64-bit boundaries anyway? We do want to support use cases, so even if we supported second granularity, we're already at a bit size that makes me question whether there's anything to be gained.
- RGN: What's the cardinality? How many of these are we talking about in any given program?
- FYT: I don't know, but it seems like wasting memory for no reason. We can have it, but it seems inefficient if we don't need it.
- CJT: In 2021 is it that inefficient to have 16 more bits? We don't expect there to be millions of time zone objects causing memory pressure.
- FYT: If it's important I won't argue with it, but I think this is an issue. There are no use cases for this. The other issue is that our internal structure is easier to store with 32-bits and a little harder with 64-bits.
- CJT: The TAI is a use case.
- FYT: Does anybody actually use TAI as a time zone?
- RGN: It's conceivable. It's difficult to predict. But the limitation should either be minutes or nanoseconds.
- FYT: I'm not talking about imposing a limitation, I'm talking about relaxing the spec text so that the browser can store it with reduced precision. The TimeZone constructor should be able to say that it stores 0 if you give an offset string of +00:00:00.000000001.
- RGN: If implementations were allowed to vary on this question, it would be a security issue, because it allows the same code to run differently based on where it is running.
- FYT: There's a lot of implementation dependence in the 262 spec already.
- CJT: Those have to have good reasons, and I think this would be a premature optimization reason.
- PFC: Another reason not to allow the implementation latitude to drop the precision is that people would just have to work around it by making a custom time zone and implementing `getOffsetNanosecondsFor()`. In that case we might as well remove the feature.
- FYT: That would be fine with me.
- JGT: IETF feedback was that there is a mechanism
- Conclusion: We see enough use cases or potential use cases to keep this, and don't see a problem with spending a few more bytes in these probably-rare objects.

### Restrict the return value of Calendar.fields? ([#1610](https://github.com/tc39/proposal-temporal/issues/1610))
FYT to follow up about security issue.

### Revisit the [[Calendar]] slot of PlainTime? ([#1588](https://github.com/tc39/proposal-temporal/issues/1588))
- FYT: The question is why we always have to create the calendar object?
- PFC: Could you lazily create it the first time the calendar property is accessed?
- FYT: Maybe.
- JGT: The question is, is this needed at all? We originally put this in to prevent breaking the web in the future in the case of object spreading. But we don't do object spreading anymore. Is this something we could add later without breaking the web?
- PFC: I'm not confident enough to say that we could add it later without breaking the web, but maybe we could determine that?
- PDL: As for the current state of affairs, there is no reason. But if/when time calendars will happen, we will need this. The question is whether we want to have this now in order to avoid changing the internal shape of objects in the future.
- FYT: So this is for potential forward compatibility. I'm happy to move on, I understand why we have it.
- JGT: I would like to dig into this more. Is it actually an advantage if times without calendars would have the calendar property undefined? So you could tell the difference between Temporal V1 times and V2 times.
- PDL: I see pros and cons.
- PFC: I'd also prefer to remove it if it is indeed the case that we can add it later without breaking the web. I suspect that that now may be the case, but I'm not confident.
- Conclusion: Bring this up at next meeting and try to determine definitively if there would be a web compatibility issue with adding calendars to PlainTime in the future, if we didn't have this property.

### `Duration.negate()` should produce -0? ([#1715](https://github.com/tc39/proposal-temporal/issues/1715))
- JGT: I think -0 is evil so I'm in support of having this be +0, and never have -0 anywhere in Temporal.
- PFC: I agree with JHD that zero should be consistent within JS, but I also agree with Anba that this should be consistent with the Duration constructor. We are inconsistent either way.
- JGT: Would duration.sign() return -0 in that case? Math.sign() does. It's terrible.
- FYT: The documentation is not correct on this count either, so that should be changed.
- PFC: This is a lot more complicated than I originally thought. I propose that we come up with a proposal for what exactly needs to change, including `duration.sign()` and `duration.blank`, and the Duration.constructor.
- JGT: I would propose that we never return any -0 from Temporal, anywhere.
- FYT: That's a bold statement.
- JGT: Where does -0 have any effect on code in JS? Other than `Object.is()`?
- PFC: We could look at what records and tuples did regarding deep equality of -0 and +0 within their structure.
- RGN: Given the logical basis of almost everything in this library being treated as mathematical values, and specifically bigint usage of them, conversion at the boundaries is probably the most logically consistent approach.
- JGT: Agreed, and I would also ask what use cases are improved by the presence of -0.
- PFC: I don't think it improves anything, but this is the kind of question that stirs up a big storm in committee. I don't think we can count on use cases being persuasive.
- Conclusion: We'll write up an overview of what would need to change either way in order to be consistent.

### Ambiguity of "according to ISO 8601" ([#1641](https://github.com/tc39/proposal-temporal/issues/1641))
- JGT: Could we solve this with a note?
- FYT: At least a reference to the section number and title within ISO 8601.
- Conclusion: We'll do that.
