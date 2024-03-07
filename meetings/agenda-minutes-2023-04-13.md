# April 13, 2023

## Attendees
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Chris de Almeida (CDA)

## Agenda

### Can we resolve [#2522](https://github.com/tc39/proposal-temporal/pull/2522#discussion_r1162178273) real quick?
- JGT: I'm OK with SFC's last comment.

### Changes to duplicate annotation resolution in IXDTF: [ietf-wg-sedate/draft-ietf-sedate-datetime-extended#38](https://github.com/ietf-wg-sedate/draft-ietf-sedate-datetime-extended/pull/38)
- PFC: This clarification at the last IETF meeting requires a normative change on our part.
- JGT: Yes.
- PFC: I don't think this normative change is avoidable, but it's justifiable.
- JGT: Agreed. Summary of new IETF behavior:
    - If multiple non-critical tags, use the first one
    - If a critical flag on a tag, then any other tag (before or after) with the same key should throw

### Reject non-ISO calendar annotations vs. ignore all but the first in PYM/PMD input like `01-01[u-ca=iso8601][u-ca=chinese]` ([#2538](https://github.com/tc39/proposal-temporal/issues/2538))
- JGT: With the previous issue, we'd need to add to this that if any of them had the critical flag, the parsing operation would throw.
- PFC: This seems like a necessary optimization. I think we can combine this with the previous change.

### Unexpected P1M difference from January 29–31 to February 28 ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT: Summary, if you take the difference from January 31st to February 28, the endpoint is something that would be constrained. There are two ways you could handle that, either constrain it, or back up and return a days difference instead.
- PFC: I seem to remember that we made this decision due to reversibility. If you add 1 month to January 31, it is constrained to February 28, so the months difference between the two should be 1 month as well. I'm not 100% sure if I remembered that correctly.
- JGT: The action here is to dig up the history, then we'll decide whether it needs to be changed.
- PFC: I'd prefer that the outcome is that we just (re)document the rationale. I don't think we should change it at this point.
- RGN: Analogues, e.g. Java as ABL shows in the issue, might be a good enough justification for a change even at this point.

### TimeZoneEquals comparison by `id` ([https://github.com/tc39/proposal-temporal/issues/2513](https://github.com/tc39/proposal-temporal/issues/2513))
- We resolved this one already in the 2023-03-09 meeting.

### Triage new batch of issues by Anba: #2544 through #2552
- My estimation of which ones would have normative consequences: [#2545](https://github.com/tc39/proposal-temporal/issues/2545), [#2546](https://github.com/tc39/proposal-temporal/issues/2546), [#2547](https://github.com/tc39/proposal-temporal/issues/2547), [#2551](https://github.com/tc39/proposal-temporal/issues/2551) (all bug reports in the builtin-calendars-as-strings change, the latter two are already addressed by the user-code audit), [#2552](https://github.com/tc39/proposal-temporal/issues/2552)
- JGT: I think the 'bug report' ones don't need a normative change in plenary. We should treat them as belated review comments on the PR we just merged.
- PFC: Agreed, assuming that there aren't any rules contrary to that.
- JGT: I can add the comments.
- PFC: [#2551](https://github.com/tc39/proposal-temporal/issues/2551) makes an additional suggestion that should be a separate issue, but I believe it's already addressed in the PR [#2519](https://github.com/tc39/proposal-temporal/pull/2519).
- PFC: [#2552](https://github.com/tc39/proposal-temporal/issues/2552) is a comment about the shape checks for objects implementing the Calendar and TimeZone protocols. ABL makes a point about them being excessive and another point about forwards compatibility.
- JGT: I don't see forwards compatibility as a problem. We would just never add to the list of properties that we check for.
- PFC: I don't see the checks as excessive, either. I originally agreed with ABL, but the rest of you convinced me because they are HasProperty operations and not Get, therefore unobservable unless you're dealing with a Proxy, and if we only wanted to check a subset, there's not really a subset that makes sense.
- RGN: Right, implementors of a custom calendar have to opt-in to follow the requirements exactly. As for the forwards compatibility, I think it's a red herring. If we added another method to the protocol, we would have to tolerate it being optional. I think that's fine.
- JGT: No change?
- RGN, PFC: Agreed.
- JGT: Is there any performance question here?
- RGN: No. Although if we have written the spec such that the shape check is performed multiple times on the same object, we should change that.
- PFC: Checking, once an object is stored in a [[Calendar]] or [[TimeZone]] internal slot, we don't perform any further shape checks on it.
- RGN: So the checks only occur at the boundary where objects are passed in to Temporal. E.g. PlainDateTime.prototype.toPlainDate does not perform a check.
- PFC: Right.
- RGN: Should we redirect this issue in to adding a note to ObjectImplementsTemporalCalendarProtocol and ObjectImplementsTemporalTimeZoneProtocol explaining that the list can never be extended and the rationale for checking all the properties?
- PFC, JGT: Agreed.

### IETF progress
- JGT: Today there was a "block" vote on the rechartering of the SEDATE WG.
- PFC: Does the rechartering affect the progress of our draft?
- RGN: Not directly, but it could potentially have blowback.