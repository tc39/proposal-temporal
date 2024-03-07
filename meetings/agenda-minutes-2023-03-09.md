# March 9, 2023

## Attendees
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)
- Jase Williams (JWS)
- Philipp Dunkel (PDL)
- Daniel Ehrenberg (DE)

## Agenda



### Plans between now and 03-21
- Slides
    - We've gathered the feedback from the implementors and we will put together a proposal.
    - What's left Slide: Nanoseconds / Duration bounding
    - DE: Why not ask the plenary for input on this? Why not say "we're thinking of doing this but keeping nanoseconds"?
    - JGT: If we have a concrete proposal for the plenary we should put it here.
    - PFC: I don't think we should have a discussion where we ask the implementers to thrash it out with us in plenary. We can detail the solution and then say, if you want to discuss it with us, we're available here.
    - IETF meeting next week, if there's any issues we will hear about them next week.
- [#2013](https://github.com/tc39/proposal-temporal/issues/2013), [#2315](https://github.com/tc39/proposal-temporal/issues/2315), [#2247](https://github.com/tc39/proposal-temporal/issues/2247)/[#2289](https://github.com/tc39/proposal-temporal/issues/2289), [#2466](https://github.com/tc39/proposal-temporal/issues/2466), and [#2508](https://github.com/tc39/proposal-temporal/issues/2508)
- DE: Would we be ready to say we’re done in May?
- JGT/PFC: Yes
- SFC: The ZDT issue, there's places where it hasn't been clear, so it is good to clarify.
- PFC: We should present these 5 PRs in this main meeting, and we solve the nanoseconds issue and present one big PR in the next meeting.
- JWS: Are IETF still reviewing?
- PFC: The steering group are still looking at it. Ujjwal said I’ve pinged Carsten and he’s still looking at it.

### ZonedDateTime in Intl.DateTimeFormat.format ([#2479](https://github.com/tc39/proposal-temporal/pull/2479))
- JGT: Last week we picked option 8, we'd like to see if this works for SFC and FYT. I reviewed ADT's PR and I think it has a bug in it.
- SFC: We have a 402 meeting today and I think we should present this there to give FYT the opportunity to speak about it. FYT's objection was that this was a 402 change. FYT's only options were 1 and 2.
- JWS: How does this get decided?
- SFC: I suggest presenting what we decided and giving background if requested. Understand why there are objections if any.
- JGT will present this at the 402 meeting.
- PFC: Option 8 was designed so that it requires at most 1 more bit of storage in DateTimeFormat, correct?
- JGT: All of our preferred options are.

### Era codes discussion
- Homework: review
    - Era Code proposal: [https://github.com/tc39/proposal-intl-era-monthcode](https://github.com/tc39/proposal-intl-era-monthcode)
    - CLDR: [https://github.com/unicode-org/cldr/pull/2665](https://github.com/unicode-org/cldr/pull/2665)
- JGT: Overall I agree with standardizing this. Two changes that I'd like to see in the current proposal:
    1. Don't allow eras to be used in calendars where they don't belong. E.g., reject `{ calendar: 'gregory', era: 'meiji', eraYear: 1 }` and `{ calendar: 'gregory', era: 'ethiopic', eraYear: 1 }`
        - Behavior A: throw
        - Behavior B: don't throw — era year is interpreted in context of `era`, output is in `calendar`.
        - Consensus: A (throw)
    2. Use more-recognizable era codes used for `era` getter, i.e. `bce` not `gregory-inverse`. I'm concerned that we'd be inventing some new format.
        - What should this return?
          ```js
          Temporal.PlainDate.from(
            { calendar: 'gregory', year: -100, month: 1, day: 1 }
          ).era
          ```
        - Behavior A: `bce`
        - Behavior B: `gregory-inverse`
- SFC: Summary of the proposal, we don't want to have to be experts on every calendar in order to pick names for the eras. Every calendar has one era which has the same name as the calendar, which solves one-era calendars. Then there are calendars with a small fixed number of eras. Many of them have one additional era which counts backwards from zero, like BCE in the Gregorian calendar, which we've named `-inverse`. The only complicated scheme is Japanese, which has a variable number of eras. MG came up with a scheme for this last year. Unfortunately we weren't able to get consensus on a scheme pre-Meiji eras in time to move forward with the proposal. Finally, every era is allowed to have aliases, which are calendar-specific. So, `ce` could mean something different in Gregorian vs Julian. Currently shipping in CLDR 43.
- JGT: One thing that helped me understand the context, is that this is a CLDR proposal. So a decision still remains about how it gets exposed in Temporal.
- SFC: It was made with Temporal in mind as a client, but it's not specific to Temporal. One of the concerns we got from TC39 is that we don't want ECMAScript to be doing too much inventing of this stuff. Had it been specifically for Temporal, the weighting of priorities would have been a bit different.
- JGT: Of my two concerns, about the first one, it sounds like that's just not covered by the CLDR proposal.
- SFC: Right, the CLDR proposal doesn't give any opinions about behaviour, it just gives the era codes.
- JGT: Do we have a strong opinion on the implementation of the era codes in Temporal?
- PFC: I agree that calendars should have a limited number of era codes and their aliases that can be used together. What does your code sample do?
- JGT: I think it should throw. I think it's not specified in FYT's TC39 proposal.
- SFC: There are two possibilities. Either what you said, or convert the era/eraYear pair to the gregory era. The CLDR proposal allows both, not necessarily because the second is good behaviour, but is permitted in order to be able to make a calendar-agnostic listing of era codes.
- JGT: Where do you think the limitation should be enforced if we want to enforce it?
- SFC: In FYT's proposal.
- PFC: I agree.
- JGT: Straw poll?
- PFC: For behaviour B, can you uniquely identify a calendar from an era code, especially if it's an alias?
- SFC: No, it would have to be a globally unique era code in this code sample.
- Unanimous strong preference for behaviour A.
- JGT: For question 2, the question is about what is returned from the `.era` getter. I think it's confusing to return the name of the era when an alias is more common parlance, like `gregory` instead of `ce`. Eras are already confusing and I think by using different names we risk even more confusion. However, I'm sensitive to the fact that that would require 402 to have an opinion on whether CE or AD is preferred.
- SFC: The CLDR proposal describes a single, unique, canonical era code. Accepting aliases was added to the proposal to address concerns like this one. I think it's fine if the getter returns the canonical one. If you're setting the field, you can use the aliases. If we were to choose a different canonical alias, like `ce`, you could still write `ad` and it would change to `ce`. Neither CE nor AD is universally understood by all users of the Gregorian calendar, anyway. The only calendar that actively uses eras all the time is Japanese, where this is a non-issue (but is has different issues because the codes are romanizations of the Kanji). If we wanted to go down that road, I'd prefer to go back to CLDR and ask for an addendum for a "canonical alias".
- PFC: I agree with SFC. I don't expect eras will be used very often, so it's a minor issue. I also find the point convincing that there are users of the Gregorian calendar who don't use either CE or AD.
- JGT: I agree it won't come up very often, but for me, if you see `gregory-inverse` in the debugger it's guaranteed a trip to the docs, whereas with `bc` or `bce` it's clear.
- JWS: No strong support either way, but I agree with JGT.
- RGN: Same, but I don't know how much value is actually being provided.
- PDL: I'm not worried about it.
- SFC: I don't think anyone on this call disagrees that JGT's proposed behaviour makes more sense, but it's hard to specify across all calendars what it should be when the CLDR proposal doesn't take an opinion on a "canonical alias."
- JGT: Summarizing, sounds like there is a weak preference for behaviour B but nobody wants to go to the mat for this, including me.
- SFC: We can express this preference and leave it up to FYT and the other 402 champions to make a final call.

### Draft: Reduce impact of TZDB canonicalization changes across time and variation across implementations ([#2516](https://github.com/tc39/proposal-temporal/pull/2516))
- PFC: I think this should be pursued through 402. I don't want Temporal and 402 to have different resolutions for this.
- DE: Agree.
- JGT: As long as 402 has the ability to decide how this goes, then I think that's OK? I don't have a strong opinion about who makes the decision, but I do think that once Temporal ships, it'll be impossible to change the time zones that Safari and Chrome have stuck in the past.
- DE: If 402 decides to keep the current semantics for Intl, then I think we should keep those semantics for Temporal. We can change if 402 resolves to change, but it shouldn't be a blocker.
- JGT: Will talk to 402 today. Can we make a final decision on this next week?
- DE: I'd like to set our decision tree today. 
- SFC: I think this should be solved in the context of 402, as well. 402 may be amenable to some of JGT's suggestions.

### TimeZoneEquals should not fallback to comparison by id ([#2513](https://github.com/tc39/proposal-temporal/issues/2513))
- DE: It's really easy to build a code sample that's affected by that issue, but it was also kind of an explicit design choice. The design is pragmatic.
- RGN: I think that that pragmatism no longer holds with builtin time zones being strings.
- DE: It was discussed in that context as well.
- RGN: Then it seems like a fundamental disagreement.
- PDL: The whole purpose of ever going by the string equality, was to allow making a time zone that implemented a change not yet in the TZDB, without overthrowing everything.
- JGT: I support the current behaviour. I don't want to put developers in the position of having to care whether a time zone is a string or object in a non-intuitive way.
- PFC: Agree with JGT.
- RGN: If everyone supports the current behaviour then I'll yield.
- DE: My original intuition was similar to RGN but I was swayed by the argument JGT mentioned.

### Question: what is expected behavior of custom time zones with built-in IDs?
- Use case: our proposed cookbook sample that uses custom TZDB data
- Do custom time zones need to match canonicalization of built-in ones? Should the last line below return true or false?
  ```js
   zdtCustom.toInstant().equals(zdtBuiltIn.toInstant()); // => true
   zdtBuiltIn.calendarId; // => iso8601
   zdtCustom.calendarId;  // => iso8601
   zdtBuiltIn.timeZoneId; // => Asia/Kiev
   zdtCustom.timeZoneId;  // => Asia/Kyiv
   zdtBuiltIn.equals(zdtCustom); // => true? false?
   ```
- Options
    - Behavior A: custom time zone required to detect the environment's canonicalization and use it
    - Behavior B: custom time zone can use any alias for a built-in time zone, and Temporal will canonicalize aliases before comparing for equality
- DE: The idea is that you choose your ID when you create the custom time zone in order to express what you mean.
- PDL: When you create the custom time zone, you can detect the canonicalization you want. You should report that as your ID if you want to override the builtin. It's your obligation to canonicalize.
- DE: My intuition is that we follow behaviour A. If you make a time zone that doesn't exist, or want your own canonicalization logic, then behaviour B doesn't make sense to me.
- JGT: Is there any case where a library that's imported won't have access to the canonicalization behaviour?
- RGN: You can imagine an arbitrarily virtualized environment. It can make sense to deny anything non-deterministic.
- DE: If the canonicalization was denied, behaviour B might also be denied.
- PFC: Behaviour B is also non-deterministic. If you don't have access to the TZDB, then it doesn't matter what ID you return because it won't override anything.
- DE: I don't see a motivation for this.
- PDL: The normal virtualization thing is that the environment is set up with capabilities at the beginning.
- JGT: Got it, so the thing is that the environment can deny canonicalization, but it would have to patch Temporal consistently as well. So I agree with behaviour A.