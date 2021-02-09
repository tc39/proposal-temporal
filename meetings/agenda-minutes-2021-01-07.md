# Jan 7, 2021

## Attendees
- Ujjwal Sharma (USA)
- Shane F Carr (SFC)
- Richard Gibson (RGN)
- Cam Tenny (CJT)
- Philip Chimento (PFC)
- Daniel Ehrenberg (DE)

## Agenda

### IETF draft status
- USA presents the IETF draft.
- USA: The RFC has deprecated but still allows the use of 2-digit years, it doesn't allow 6-digit years or sub-minute UTC offsets. These are things that we have in Temporal, but of course every change means discussion in the IETF, which might delay our ability to push the change that we care about, which is the time zone and calendar suffixes.
- RGN: I don't care as much about the more "sugar-y" ones.
- USA: What we would want to avoid is another separate revision for years.
- RGN: I don't think RFC 3339 actually allows 2-digit years. The grammar in the appendix might, but that's different.
- DE: USA already identified 2-digit years as the least important part, so I don't think it's that important to pursue, but it would be strange if 6-digit and negative years weren't included.
- JGT: I ran into 2-digit years a lot recently when building non-ISO calendars. I think removing it is a good thing to do for the ecosystem, and we could always reverse it if it generates controversy.
- USA: We can keep it in a separate commit for that purpose.
- JGT: The other comment I had on the spec is that the grammar talks about durations, but there's no other content about durations. We should have at least negative durations standardized somewhere.
- USA: Durations are out of scope for RFC 3339.
- JGT: Should we consider adding them? They should be standardized somewhere.
- RGN: Are you sure they are not standardized? I thought they were added in the 2019 revision of ISO 8601.
- USA: They are. The only thing that is not specified anywhere outside of Temporal is the bracketed suffixes. The important thing is that we add the bracketed suffixes, and we may as well add other things that are within the existing scope of the RFC.
- PFC: I agree with USA, but it is weird that durations are in the grammar.
- USA: That's my next question, should the grammar be dropped?
- JGT: I don't see why.
- RGN: The grammar is kind of a vestigial part of RFC 3339 because the edition of ISO 8601 at the time was not fully characterized, so the appendix was an attempt to formally describe the rest of ISO 8601.
- PFC: The draft would still have a grammar for the things discussed in the document, but we'd be removing the ISO 8601 grammar in the appendix.
- USA: Last question is that Ronald Tse brought up that we might shift to a different standards body, CalConnect instead of the IETF, and CalConnect would work with us to move the work into all of the other standards bodies including IETF. He also mentioned that ECMA requires releasing things under a patent-free license whereas IETF doesn't. My concern is delaying things if we choose to move to CalConnect.
- DE: I thought it would make sense to start this in the IETF but keep CalConnect people in the loop, and eventually move to an ISO standard, but at a lower priority.
- JGT: I support a more limited scope, looking at the 2019 revision of ISO 8601 my concern would be that we'd never get it ratified within a reasonable time and scope if we went that route.
- DE: Ronald raised a concern that it wouldn't be possible to develop a royalty-free spec in IETF. To my knowledge IETF develops royalty-free things all the time. Is anyone aware of this concern?
- USA: The direct quote is "ECMA demands a patent-free license, which IETF work cannot be licensed with"
- DE: ECMA doesn't review our spec, and ECMA has multiple patent policies. TC39 operates under a royalty-free patent policy, but that's not the same as demanding a patent-free license.
- USA: Don't we reference BCP47 normatively in ECMA-402? That's also IETF work.
- RGN: Referencing it is definitely not a problem. You could imagine scenarios where contributing might be a problem, but I'd be surprised.
- USA: Do we care about whether this update propagates to all standards bodies?
- RGN: My opinion has been that at least one broad standards body should adopt it for us to proceed. IETF fits the bill. The problem actually stems from Java's introduction of the bracket as a language-specific thing that "infected" the ecosystem. If they had gone through standardization such as IETF then we wouldn't have this problem.

### Progress towards Stage 3
- PFC: most of the important work includes: the IETF draft, the DurationFormat proposal, questions about calendar localization as well as spec bifurcations. Then there’s a few more minor things associated with the different issues in the milestone. I plan to finish up the spec bifurcation in a day or two.
- USA: MS2 made a pull request updating the Intl.DurationFormat proposal, I expect to merge it by the end of this week. I have a meeting planned with YMD tomorrow, where we will discuss what we need to move forward to Stage 3. Then I have some things to discuss with people before the 402 monthly meeting, which is next week. I think it should be possible to move forward to Stage 3 for January.
- JGT: What is the relationship between DurationFormat and RelativeTimeFormat?
- DE: Integrating durations with RelativeTimeFormat could work, but it can be a separate proposal.
- JGT: I made a comment a few months ago about how there are several ways to refer to durations linguistically: the period of time, a time relative to now, or relative to a time that is not now.. It's strange that we are separating things between DurationFormat and RelativeTimeFormat.
- USA: Having signed durations means that they are always relative to a certain point. DurationFormat is for formatting absolute period of time. This can be done in a separate proposal.
- JGT: But why is a separate DurationFormat API needed at all, when we could extend RelativeTimeFormat to cover all the three use cases. It seems like a lot of work to add and document a new toplevel API.
- USA: ???
- DE: I understand and I'm not sure of the answer. I disagree that adding a new toplevel API is that serious though, DurationFormat is pretty superficial. SFC, do you know why we need a separate constructor for DurationFormat?
- SFC: That's still an open question. There are pros and cons of doing it either way.
- JGT: Why are we prioritizing the absolute use case when the relative case is probably more common?
- USA: When you call `toLocaleString()` on a duration, the only interpretation that makes sense is the absolute interpretation. It seems wrong to format an absolute duration with RelativeTimeFormat.
- JGT: That seems like a purity concern. These three formatting use cases seem really related and it would be odd for developers to have to use a separate formatter for absolute duration formatting.
- USA: I can bring it up at the 402 meeting and try to come to a conclusion.
- DE: Can we decouple Intl.DurationFormat going to Stage 3 from Temporal going to Stage 3?
- PFC: That would involve removing the `Duration.toLocaleString()` method from the Temporal proposal and adding it in the Intl.DurationFormat proposal?
- DE: There were other `toLocaleString()` methods that didn't do anything smart, and then got updated later. We'd have a non-smart `toLocaleString()` method in 262 and nothing overriding it in 402.
- JGT: My only concern is a duration formatter that only deals with half the cases.
- USA: Agreed.
- DE: What happens with negative durations when formatting them absolute?
- USA: The sign is ignored.

### Calendars status
[SFC left.]
- JGT: I finished the calendars PR yesterday. It contains decent-quality implementations of all the ICU calendars. Doing so exposed a bunch of issues in Temporal, which was the purpose. The two main confusing pieces for people unused to non-Gregorian calendars are leap months, and eras, especially eras that count backwards. These are the places where I'd expect that developers who only know the ISO calendars would trip up. There's also a security risk where people could manipulate software by introducing a calendar to code that didn't expect it. For example, my son changes the date on his iPhone to continue getting free trials of games, and I could see something similar happening with non-ISO calendars.
  - Leap months: Follow the iCalendar lead and add a string-based month code. Month would still work, but developers familiar with leap months could use the month code.
  - Eras: Just as with month and month code, there's a reference year for the era.
  - It's important to be able to reconstitute any of these dates from (ISO) year, month, day, and calendar.
  - The PR also includes a few other changes that are talked about in separate issues.
  - The calendars should be in charge of validating the values, not the Temporal abstract operations.
  - MonthDay is a little weird because in a lunisolar calendar, for example, how do you express a birthday that happens in Adar I?
  - What fields does `getFields()` export? This is a bit of an open question.
  - The implementation is hacky, using `formatToParts()`, but it was enough to validate the API.
- PFC: What sort of feedback would you like first?
- JGT: I'd like to validate the `monthCode` and `eraYear`, and then we can proceed to split out the other open questions and start merging things.
- DE: Why `"5L"` and not a numeric month and leap boolean?
- JGT: Main reason was it's already standardized in iCal. The other reason is that if you split one piece of data (the month) into several properties, that creates problems for developers because they might unwittingly split a date into year, month, and day.
