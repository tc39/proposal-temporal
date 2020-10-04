Aug 20, 2020

Attendees:

Ujjwal Sharma (USA)

Shane F Carr (SFC)

Justin Grant (JGT)

Richard Gibson (RGN)

Agenda + Notes:

* [#716](https://github.com/tc39/proposal-temporal/issues/716) - Should Absolute.from() have an option to resolve offset vs. timezone conflicts?

    * USA: I agree with the Temporal.parse as an approach but unfortunately that’s not the existing reality for Temporal.

    * RGN: This is an under-developed idea, but maybe we should do sloppy parsing in a single centralized parser instead of sprinkling it across the library.

    * PDL: What do you think would be the absolute value in this case?

    * RGN: Well, undefined, as long as it’s well documented, it’s not a problem.

    * PDL: But the problem remains the same, the error has just become harder to spot.

    * RGN: I disagree, you can parse just with the offset by default for Absolute.

    * PDL: That approach makes sense to me, should we retain the ability of `from` to accept property bags?

    * RGN: We should, yes.

    * PDL: We ignore the extraneous properties in the property bags, what’s different with ignoring extraneous components in strings?

    * RGN: It is different, because it is a string.

    * PDL: If anything, the strings are stricter because they need to be compliant to the grammar.

    * RGN: I see your point.

    * **CONCLUSION**

    * A) Should Absolute.from have an option to resolve offset vs. timezone conflicts?

    * Ans: No.

    * B) What should be the default behavior when there is an offset vs. timezone conflicts?

    * Ans: offset wins.

* For LocalDateTime

    * SFC: reject is a bad idea, we should prefer offset.

    * RGN: ???

    * USA: I think we should prefer the IANA string, but also, why is failing a bad idea again?

    * PDL: I agree, crashing is not the worst thing that could happen.

    * JGT: I don’t have a strong idea, but I prefer that we prefer the offset. What about abrupt tzdata updates?

    * PDL: Let me assure you that this never happens unconsciously. Instead, I’m more worried about the "Sao Paulo problem".

    * JGT: I now agree with reject for default.

    * PDL: I have a novel idea. What about making the error point to a document for additional information?

    * USA: that has no spec precedence. Should we talk to the editors about this?

    * SFC: We could create precedence.

    * USA: but implementers choose their own error messages.

    * SFC: that would also have localization problems maybe.

    * PDL: I agree that this sounds less appealing now. What about just reject?

    * EVERYONE AGREES.

* [#827](https://github.com/tc39/proposal-temporal/issues/827) Proposal: Rounding method (and rounding for `difference` and `toString`) for non-Duration types

* [#725](https://github.com/tc39/proposal-temporal/issues/725) - Crazy idea: should Temporal.now be a method that returns a LocalDateTime instance?

    * JGT: I think this is easy, I guess the answer is "no".

    * SFC: This is interesting, because we can use this to fix the skew in Temporal.now.

    * PDL: I agree with JGT, let’s just say no here.

* [#702](https://github.com/tc39/proposal-temporal/issues/702) - RFC 5545 vs DST questions for IETF calendar standards ("calext") group

    * JGT: Update: We’ve discussed a bunch of things with the group. They’re making a bunch of changes in JSCalendar based on our discussion, for example, they’re changing the order of ops in subtraction to match Temporal. We’re now working on the weird edge cases with arithmetic around DST boundaries. Neil has a good idea wrt solving these issues, I just need to keep collaborating with them.

* [#819](https://github.com/tc39/proposal-temporal/issues/819) - ISO 8601-2:2019 and CalConnect CC 18011

* (let’s postpone this discussion until next week) [#703](https://github.com/tc39/proposal-temporal/issues/703) - What extended ISO string representation should be used when the time zone is an offset, not an IANA name? Should the offset be in brackets?

    * Before embarking on this point, is there anything we can productively discuss in the meeting? Otherwise we should continue to discuss it online
