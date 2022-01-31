# January 6, 2022
## Attendees
- Jesse Alama (JMN)
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)

## Agenda
### Specifying calendar operations ([#1899](https://github.com/tc39/proposal-temporal/issues/1899))
- JGT: This was on USA's plate.
- SFC: USA has been focusing on fixing the original issue that Frank filed, but we also wanted to do the Phase 1 of adding additional specification text around the interfaces. Hopefully he'll be able to work on it this quarter. USA has a design doc about this, but it's not linked in this issue. I'll try to dig that up.
- JGT: I think the main thing is that the arbitrary decisions are documented, such as which era is the default era, that would be bad if they were made in a different way across browsers.

### option of `Calendar.dateAdd` is not `undefined` but `null` ([test262#3262](https://github.com/tc39/test262/issues/3262))
PFC: I think this is covered by [#1685](https://github.com/tc39/proposal-temporal/issues/1685). I've had this on my to-do list for a while but haven't made a PR yet.

### In `until` & `since`, should `roundingIncrement` & `roundingMode` options be allowed when `smallestUnit` is undefined? ([#1900](https://github.com/tc39/proposal-temporal/issues/1900))
- JGT: In the round() method, we require `smallestUnit` to be present. In since() and until() you can specify rounding via `roundingMode` and `roundingIncrement`, but in that case `smallestUnit` is not required. This is minor, but inconsistent.
- SFC: In NumberFormat we have a precedent of always ignoring well-formed but unused options. One reason is that some developers share that they prefer to be able to have the unit present to support doing things in a data-driven way. The other reason we have that in NumberFormat is that it's not serious enough to go against precedent.
- JGT: In this case the options are used.
- PFC: `roundingMode` is not used, but you could say that we do always round, to 1 nanosecond.
- JGT: I think it's almost certainly a programmer bug if you have `roundingIncrement` but not `smallestUnit`.
- SFC: I think there's a case to be made for designing it this way, even outside the constraint of Stage 3. TC39 doesn't have a good policy about what is serious enough that we should be strict about, and where we should be more forgiving and JavaScript-y. In my opinion this is not worth changing at Stage 3.
- JGT: The ambiguity is more about what the default behaviour that the developer assumes in this case. No rounding or rounding to 1 nanosecond. Sounds like no-one thinks this is important enough to change.

### Changes to InitializeDateTimeFormat is unimplementable ([#1916](https://github.com/tc39/proposal-temporal/issues/1916))
- PFC: Reading the comments it looks like this one has a solution.

### Non-IANA time zones (fixed offset or custom): ECMA-262 allows but ECMA-402 prohibits; should that be corrected? If so, which should change?
- RGN: I ran into this while making another pull request and it's not clear which way it should go. ECMA-402 only recognizes IANA named time zones.
- SFC: Can you clarify where they're not allowed?
- RGN: They're not allowed as a string, when parsing.
- SFC: My thought is that a 402-capable implementation should follow 402 as to what time zones are allowed, just like calendars. If offset time zones are not allowed in 402, they should be.
- RGN: 402 has an IsValidTimeZone operation that returns false for all but "UTC" and IANA named time zones.
- PDL: I believe the reason 402 doesn't accept them is because they're represented by `Etc/GMT+NN`. Other time zone types like `EST` or `CET` shouldn't be accepted.
- SFC: IsValidTimeZone is specifically for the IANA zones, which includes the `Etc` zones.
- RGN: I'm not sure what you mean by "for the IANA zones". It's used in CanonicalizeTimeZoneName and that is used in InitializeDateTimeFormat.
- SFC: I mean it should only apply to IANA time zones. Do you mean this is a problem in Intl.DateTimeFormat or is it a problem in Temporal as well?
- PDL: This would be a problem if you call ZonedDateTime.toLocaleString() on a ZDT with an offset time zone.
- RGN: In Temporal we special-case offset time zones before calling IsValidTimeZoneName. The problem is that IsValidTimeZoneName is underspecified. In 262 with Temporal and without 402, it is "implementation-defined" with the only constraint that it must support UTC. Should this be highly constrained or should the 402 constraints be relaxed here?
- PDL: My opinion is that the freedom should be there if you don't do 402. If you do do 402, you're constrained by 402.
- RGN: The thing is I'm not aware of any other place where adopting 402 into an implementation could be a breaking change. In all other cases, 402 is additive or clarifying.
- PDL: If you're an implementation without 402, you don't have a list of IANA time zones.
- RGN: You could specify that the implementation must accept UTC and must not accept anything that is not an IANA time zone.
- PDL: That would be bad because you would require implementations to carry a list of IANA time zones.
- RGN: Not necessarily, it could be any hardcoded subset, or none.
- PDL: Restricting the freedom of implementations in this way doesn't sound good.
- SFC: I could see for example a 262-compliant implementation could accept BCP 47 time zone names, and a 402-compliant implementation would have to reject them.
- PDL: I think the problem is actually that Temporal reuses the IsValidTimeZone from 402. Breaking that connection should preserve the freedom of a non-402 implementation.
- RGN: I want to phrase things as a few questions. (1) Is it acceptable for ECMA-402 to require rejection of non-IANA names?
- PDL: Yes.
- RGN: (2) Is it acceptable for divergence between Temporal and 402 about what constitutes a valid time zone names?
- PDL: Yes, I'd prefer that an implementation SHOULD reject non-IANA names but not MUST.
- SFC: There's a bit of a membrane between Temporal and the toLocaleString part of 402. We don't have to enforce that until we get to toLocaleString, so it's not necessarily a breaking change. I'm not sure what we currently do with offset time zones in toLocaleString. The CLDR does provide data on how to support offset time zones, and they don't have to be whole-hour Etc time zones.
- RGN: The current behaviour in the Temporal spec is that ZonedDateTime.prototype.toLocaleString() constructs an Intl.DateTimeFormat, which does this check.
- SFC: Does it pass the stringified time zone from Temporal?
- PDL: All that being said, I would propose that we change 402 to accept offset time zones.
- SFC: If we aren't already doing it, it would be worth exploring in the 402 Temporal extension making the Intl.DateTimeFormat options bag accept a Temporal.TimeZone instance as the value of the `timeZone` option. That may be disruptive if we made resolvedOptions() return this instance as well though.
- RGN: What I'm hearing as the answer to my question, should 402 constrain these, the answer is no.
- SFC: I'm seeing two issues, (1) we should make Intl.DateTimeFormat support the formatting of offset time zones. (2) We should decouple Temporal and 402 time zone support and throw an exception at the boundary between 262 and 402.
- JGT: And (3) add a SHOULD to recommend that they correspond.
- PFC: I don't feel strongly enough to object to this, but it seems bad to me to have a different set of supported built-in time zones in Temporal and in Intl.
- SFC: I think this is a technicality because we won't see divergence in practice.
- PDL: This wouldn't be a breaking change if we didn't have toLocaleString() dummy implementations in 262. We could make toLocaleString() always throw unless 402 is present, then it wouldn't be a breaking change to adopt 402.
- RGN: I don't see that getting past the committee. Everywhere else has a degraded toLocaleString() without 402, not throwing.
- SFC: I'm OK with the 262 stub toLocaleString() breaking if 402 is adopted.
- PFC: I can go along with this although I'd prefer the approach of saying that implementations must not accept anything that isn't an IANA time zone name.
- PDL: The reason I'm happy with this is that it doesn't force e.g. Moddable to carry a list of IANA time zones.
- Rough consensus on points (1), (2), and (3) that SFC and JGT summarized.

### `halfExpand` rounding in PlainDate.p.until() doesn't actually round up at the midpoint of a month with an odd number of days ([#1949](https://github.com/tc39/proposal-temporal/issues/1949))
- JGT: I wanted to bring this up because I wasn't sure what the correct behaviour was.
- PDL: For pure PlainDate this seems correct.
- JGT: The implementation converts to PlainDateTime and runs the PlainDate logic. If you think of PlainDate as midnight on that date then the behaviour is correct. If you think of PlainDate as the 24-hour period then the behaviour is wrong.
- RGN: I don't know if this is inconsistent or if consistency is possible. Effectively, you have to pick a time within the date. I don't know if it matters which one we pick, as long as it's deterministic.
- JGT: Interesting point, if we picked 12:00 it would be consistent.
- PDL: As long as this is consistent in itself, I don't see it as an issue. I don't think consistency between round() and since() is necessary.
- JGT: I see this more as consistency with how `halfExpand` works everywhere, not just in Temporal.
- PFC: The rounding happens in RoundDuration after Calendar.dateUntil(), at which point you don't have the information about what type it originally was.
- PDL: Changing this could be inconsistent with what we do when mixing types.
- PFC: If you mix types, the argument is converted to the type of receiver.
- JGT: That's consistent with where we convert PlainDate to PlainDateTime elsewhere in Temporal.
- PDL: I'm not a fan of ever using midnight, I think it's the wrong paradigm.
- JGT: Looking at steps 11.r and 11.s of the spec text, I think the behaviour of the spec would be to round up.
- Conclusion: First of all figure out what the spec says to do, and if we should change anything.
- PDL: Unless the spec says to do something insane, we should probably leave it as is.
- JGT: The only thing that I'd think is worth a normative change is if PlainDateTime would round up at midnight.

### Latest status of mathematical values & bounds for Duration?
- PFC: I can check with SYG if he's had a chance to bring this up at the editors call yet.
