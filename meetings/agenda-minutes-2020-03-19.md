Mar 19, 2020

Attendees:

Ujjwal Sharma (USA)
Philipp Dunkel (PDL)
Philip Chimento (PFC)
Jase Williams (JWS)
Shane F. Carr (SFC)

Agenda:

* [#415](https://github.com/tc39/proposal-temporal/issues/415)/[#428](https://github.com/tc39/proposal-temporal/issues/428) Accept invalid ISO strings if invalid parts are irrelevant (e.g. Date.from('2020-03-02T99:99'))?
    * PDL: last comment was from Shane asking what to do if IANA and the offset don’t match? If you do an Absolute which requires an IANA timezone and an offset, it’ll throw because it’s invalid, but if you parse it with a DateTime, it works because it ignores everything else. We don’t want to validate stuff that is ignored. It would make no sense for Date.parse to fail for the invalid Time component. I can parse stuff individually and check for myself. 24 hours should fail for Time, DateTime but not Date.
    * PFC: I see your point, but it seems to me that you should get the same date out of the same ISO string no matter in what context you parse it. For an ISO string with hour 24 meaning the next day, Temporal.PlainDateTime.parse(string).getDate() should not return a different Temporal.PlainDate than Temporal.PlainDate.parse(string).
    * PDL: I disagree because that attitude got us into this Date mess to begin with. I need an easy way to be able to do the correct thing. If you’re taking into account the Time part when parsing a Date, you’re not doing the correct thing. If I do an Absolute.parse, it should throw on an invalid TimeZone, but it shouldn’t be the case when parsing DateTime. By default, I’d encourage people to parse into an Absolute.
    * USA: Bakkot proposed that we throw on any extraneous part in the ISO string.
    * PDL: I can live with that, as long as we have *some* method to extract a given component from a larger ISO String.
    * USA: I can live with that, I’ll check back with Bakkot if they agree too.
    * PDL: Can we get consensus for that?
    * PFC: The less common use-case is fulfilled by this, but I’m not quite sure about the more common use-case.
    * PDL: The more common use case would be fulfilled by using Absolute.parse and projecting into the type that you need.
    * PFC: Absolute.parse may fail if you are parsing a time that is in the future, and the time zone changes before then.
    * PFC: I’d like to think about it more. It does seem more plausible now.
    * PDL: My biggest concerns are consistency and correctness. The actual specifics matter less.
    * PFC: My concern is that when you feed in an ISO string, you should never get out any other result than what ISO would specify for that string.
    * PDL: We can revisit this later.
    * PFC: Apart from this discussion, I believe the code originally described in #415 is a bug.
    * PDL: the IANA timezone and offset should match, let’s fix that bug.
* [#408](https://github.com/tc39/proposal-temporal/issues/408) Duration.minus, necessary and optional balance
    * PDL: Duration was just a property bag for a long time, so we need to think this through. I do expect to run into these kinds of issues by making it a type. I’d suggest you go with your instinct.
    * PFC: Feedback is appreciated on the table / pull request.
    * SFC: I couldn't think of anything for the cell marked "Nothing sensible to constrain to, throw?" I'm fine adding disambiguation modes, although should it be consistent with "reject", "balance", "constrain"? It doesn't seem right to call any of these modes "constrain".
    * PDL: We already have different disambiguation terms ("earlier" and "later") for time zone disambiguation, so it doesn't need to be consistent.
    * PFC: I can't think of any use case for reject, though we could add it for completeness, but I think we should come up with more concise names than "necessary balance" and "optional balance".
* [#244](https://github.com/tc39/proposal-temporal/issues/244) Do we still want Temporal.parse?
    * Deferred to next week while we figure out how this interacts with redesigning the parsing methods ([#428](https://github.com/tc39/proposal-temporal/issues/428)).
* [#452](https://github.com/tc39/proposal-temporal/issues/452) How to format Durations
    * SFC: This is being handled in a separate ECMA 402 proposal, Intl.DurationFormat.
    * USA: So how should we work accordingly?
    * PDL: I would proposing leaving the spec stuff to Intl.DurationFormat and just polyfilling the spec inside the Temporal polyfill.
    * USA: Okay, I’ll do that.
* Sidenote: Why do we have years and months in Durations?
    * PFC: This was discussed recently, please check notes from a few weeks ago. There are real use cases for them, but this is why we don't balance days into months and years.
    * PDL goes over the use cases.
* Volunteers to finish / review stalled pull requests
    * Everyone please take a look at these, we'll discuss next week if there are any left.
* Next steps for calendar
    * Deferred to next week.
* Can we consolidate chat channels?
    * Deferred to next week.

