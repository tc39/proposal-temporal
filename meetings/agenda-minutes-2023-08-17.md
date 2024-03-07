# August 17, 2023

## Attendees
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Shane F. Carr (SFC)

## Agenda

### Status reports
- IETF
    - No activity on the mailing list in the last few weeks.
    - PFC: It seems like there is an impasse between John Klensin and Carsten Bormann over referring to ISO 8601:2019 vs an earlier version.
    - JGT: Carsten also says that most people don't use the 2019 version because it's new and paywalled.
    - SFC: What does RFC 3339 do?
    - PFC: Refers to both the 1988 and 2000 versions.
    - Conclusion: We'll talk to USA with the plan of cross-referencing the places where IXDF refers to ISO 8601:2004 and ensuring that the relevant sections haven't changed, and referring to 2019 as well.
- User call audit
    - PFC: I think this will probably split in 4 or 5 parts. The main blocker is making some editorial revisions to the method lookup records, and other than that it's just test coverage. I think all parts except the last one will be pretty quick.
- Integer math change
    - PFC: Stacked on top of the user call audit. May also split into 2 parts.

### Issues & PRs triage
- [#2649](https://github.com/tc39/proposal-temporal/issues/2649): Need a set of input values that would cause this code to be reached. We can ask Anba to take a look.
- [#2615](https://github.com/tc39/proposal-temporal/issues/2615)
    - RGN: This should track with time zones.
    - JGT: Is this minor enough that it could be a normative PR in 402 later?
    - SFC: Indeed, in the interest of not making Temporal changes.
    - JGT: It's not Temporal-specific, it happens in DateTimeFormat.
    - Conclusion: Move to 402, saying we're not going to action this until Temporal is stage 4.
- [#2648](https://github.com/tc39/proposal-temporal/issues/2648): Wait until the Duration changes have landed and then see if it's still a problem.
- [#2642](https://github.com/tc39/proposal-temporal/issues/2642): Rename makes sense. JGT to write the PR
- [#2640](https://github.com/tc39/proposal-temporal/issues/2640)
    - PFC: I think if you continue to output the reference year/day you can at least parse the string back in and get the same date. Printing an ISO year-month instead of a non-ISO year-month is misleading.
    - JGT: Why do we have the `calendarName: "never"` option in PlainYearMonth/MonthDay toString at all?
    - PFC: I don't think there's a great use case, but I also think it's harmless and don't want to remove it.
    - JGT: Would we want to remove it if we were going back to plenary with some other normative change?
    - PFC: I wouldn't.
    - RGN: Not a strong opinion, but I'd leave it alone.
- [#2638](https://github.com/tc39/proposal-temporal/issues/2638): PFC to check if this is fixed in PR [#2612](https://github.com/tc39/proposal-temporal/pull/2612).
- [#2637](https://github.com/tc39/proposal-temporal/issues/2637): JGT to write the PR.
- [#2631](https://github.com/tc39/proposal-temporal/issues/2631): This is resolved. iCalendar can represent sub-minute offsets, but it doesn't have offset time zones with sub-minute offsets, which is exactly how Temporal works.
- [#2630](https://github.com/tc39/proposal-temporal/issues/2630): PFC to do this after landing the normative changes.
- [#2623](https://github.com/tc39/proposal-temporal/issues/2623): Do when there are no big PRs pending.
- [#2620](https://github.com/tc39/proposal-temporal/issues/2620): PFC to check if this is fixed in PR [#2519](https://github.com/tc39/proposal-temporal/pull/2519).
- [#2619](https://github.com/tc39/proposal-temporal/issues/2619): PFC to fix this in PR [#2519](https://github.com/tc39/proposal-temporal/pull/2519), since it would otherwise be a normative bugfix. Comment on [#2519](https://github.com/tc39/proposal-temporal/pull/2519) in the appropriate place and close this issue.
- [#2618](https://github.com/tc39/proposal-temporal/issues/2618): JGT to write the PR.
- [#2617](https://github.com/tc39/proposal-temporal/issues/2617): PFC to check if this is fixed in PR [#2612](https://github.com/tc39/proposal-temporal/pull/2612).
- [#2616](https://github.com/tc39/proposal-temporal/issues/2616): PFC to check if this is fixed in PR [#2612](https://github.com/tc39/proposal-temporal/pull/2612).
- [#2608](https://github.com/tc39/proposal-temporal/issues/2608):
    - JGT: We don't want infinite length.
    - RGN: Why not? There's no limit on the length in the IXDTF draft.
    - JGT: I assume there's value for implementations in having a fixed-length string here.
    - RGN: In practice, it's matched against a list of valid identifiers.
    - JGT: IANA itself has restrictions on the length. I'd assume we'd take the intersection of IXDTF and IANA.
    - RGN: That mirrors the discussion in [ietf-wg-sedate/draft-ietf-sedate-datetime-extended#46](https://github.com/ietf-wg-sedate/draft-ietf-sedate-datetime-extended/issues/46)
    - PFC: I don't have a strong opinion. I'd like to get rid of the ugly 2-14 characters pyramid, and add a note as discussed in that issue, but not worth a normative change in my opinion.
    - RGN: Normative or not, Temporal must track the IXDTF draft.
    - JGT: Is it an editorial change? Does the type of the thrown exception change?
    - RGN: No.
    - Conclusion: RGN to verify that the change is editorial and make the PR.
- [#2601](https://github.com/tc39/proposal-temporal/issues/2601): RGN to write the PR.
- [#2576](https://github.com/tc39/proposal-temporal/issues/2576): Fixed already in PR [#2570](https://github.com/tc39/proposal-temporal/pull/2570), forgot to close.
- [#2568](https://github.com/tc39/proposal-temporal/issues/2568): Close, pursue in proposal-temporal-v2.
- [#2564](https://github.com/tc39/proposal-temporal/issues/2564):
    - PFC: I don't think this excludes any currently-known cases and not having it makes the test262 tests take unreasonably long.
    - JGT to check if a slightly longer window still affects the test262 tests.