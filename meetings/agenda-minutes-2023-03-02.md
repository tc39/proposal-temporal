# March 2, 2023

## Attendees
- Daniel Ehrenberg (DE)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)

## Agenda

### Plans between now and 03-21
- PFC: Looks like we're on track to present 5 PRs: [#2013](https://github.com/tc39/proposal-temporal/issues/2013), [#2315](https://github.com/tc39/proposal-temporal/issues/2315), [#2247](https://github.com/tc39/proposal-temporal/issues/2247)/[#2289](https://github.com/tc39/proposal-temporal/issues/2289), [#2466](https://github.com/tc39/proposal-temporal/issues/2466), and [#2508](https://github.com/tc39/proposal-temporal/issues/2508). It's unlikely we'll have a coherent proposal for the nanoseconds precision issue.

### Reconsider time zone canonicalization behavior given forking of IANA Time Zone Database ([#2509](https://github.com/tc39/issues/2509))
- JGT: This won't affect as much as I thought, because CLDR is the source for all canonicalizations in engines today. Now I understand why there are time zones with outdated canonicalizations, because it's what CLDR does. Firefox applies overrides on top of CLDR to reverse that. So if we go with the current plan of record, it'll be much more difficult to update canonicalizations in the future. See updated (shorter/simpler!) proposal with two options to decide between: [#2509](https://github.com/tc39/proposal-temporal/issues/2509#issuecomment-1451486758) 
- DE: Current practice shows that implementations ship tailoring, I like the idea to change the spec to permit tailoring. We don't even have to reference CLDR. That's how Intl approaches other things. Your discussion seems based on how web-compatible it would be to change the tailoring once Temporal ships, but I don't think that's a big concern.
- PDL: It's more relevant because time zone strings are exposed by Temporal much more frequently, in every toString. In Intl, it's only exposed in `resolvedOptions()`. So yes, it's accessible, but only if you really go looking for it. With Temporal, if your Europe/Copenhagen gets autoconverted to Europe/Berlin, that's a much bigger deal, which is why it's worth investigating. But, I talked with JWS and RPR. I don't think it's smart to be prescriptive here. I'd rather take the user-provided time zone string and resolve it only when we use it.
- DE: Do we have any evidence that people depend on this at all? The TZDB changes all the time.
- JGT: If we look at the traffic on the TZDB mailing list, when there is a demand for a canonicalization change, there are often very passionate views. In the past decades there have been significant changes in the spelling of time zones. People tend to be very passionate about whether it's spelled Kiev or Kyiv. We have an opportunity to take ourselves out of the loop of negotiating geopolitical issues in ECMAScript.
- DE: I think time zone canonicalization makes sense in order to respect those issues.
- PDL: I do care that this doesn't add any delay to Temporal, from my conversation with JWS and RPR.
- PFC: I would prefer to do nothing, I think this is a problem that TG2 can fix if they like. The potentially harmful situation would be if one browser stuck with the original TZDB and another adopted the fork, but that can happen regardless of what we do.
- PDL: Can we get consensus on PFC's proposal?
- JGT: I'd rather do something to fix it if it's low-cost.
- DE: Given that we want canonicalization, I'd have a hard time with the option B that you raised.
- JGT: I think it's a lost opportunity, though. Once the canonicalization is fixed in Temporal, it raises the stakes to do any changes to canonicalization in the future.
- PDL: I'd have a very hard time believing that we could finalize such a change before the end of March. I'd be happy if someone brought it to TG2, but I don't see the opportunity here.
- (Resuming discussion later)
- DE: I really think that reconsidering canonicalization is something that should've been considered before stage 3. The only new information is that tailoring occurs, which is not really new information.
- JGT: The new information on my side is a deeper understanding of how canonicalization happens and how we got here. Now I think that once Temporal ships, we'll never be able to fix canonicalization again.
- DE: Canonicalization is a feature though. I don't think the fix is not to canonicalize.
- JGT: It's a long standing, if infrequent, complaint about canonicalizations being out of date. I think we have a chance to make that better by turning off canonicalization. With Temporal shipping, there'll be a lot more pressure to change the canonical values because they'll be more visible, and I think responding to that pressure will cause breakage.
- PFC: I agree with DE that canonicalization is a feature. We do want Asia/Calcutta to be turned into Asia/Kolkata. I think the best thing to do here is to get TG2 to get browsers aligned on what tailoring they ship.
- JGT: The situation I'm afraid of is that in 10 years a 10-million-population city changes its name.
- DE: This is like all the other tailoring in Intl. Unicode makes changes, sometimes it breaks compatibility, sometimes Unicode has to walk back the changes. This is just another instance of that.
- JGT: There's a distinction in Temporal between computer-readable values and localized values. Sometimes people break that distinction. This introduces variability in the computer-readable values.
- DE: But toString() _should_ be normalized and computer-readable.
- RGN: If the normalized value follows the current IANA TZDB, that will be a problem. The normalization actually destroys information that is relevant to Temporal. That's an implementation-defined issue, but any implementation that follows TZDB as it stands today will get user reports.
- JGT: If engines use CLDR, they will never pick up what you mentioned, because CLDR has its own canonicalization scheme.
- RGN: Per ECMA-402, that is not even allowed today.
- PFC: The reason I think this should be a TG2 decision is, I think it's a nonstarter if we remove canonicalization in Temporal.TimeZone but keep it in Intl.DateTimeFormat.resolvedOptions.
- JGT: I thought about that, but resolvedOptions communicates that processing has been applied to the value.
- RGN: I can say with confidence that 402 is going to change because the currently dominant canonicalization scheme is not allowed. Which way it goes, I'm not sure. There's also a proposal to add IANA time zone format to Intl.DateTimeFormat, in which case this issue would also have to be resolved.
- JGT: I think we all agree that 402 needs to change to allow what all implementations are currently doing.
- JGT: I think additionally changing Temporal allows the impact to be much smaller when a big city changes its name.
- RGN: How do you envision the spec change you're proposing?
- JGT: Canonicalize the casing, so that implementors can store an enum of the time zone name. Resolve the UTC synonyms to UTC. Don't canonicalize anything else, and add TimeZone.equals() that does the resolution.
- RGN: I'm not clear what would happen in equals()? You don't have a normative reference to CLDR, but what would happen in its place?
- JGT: It would use CanonicalizeTimeZoneName.
- RGN: But that operation has to change.
- JGT: I consider that a completely separate issue than this.
- RGN: So, at creation time we would verify that the value of the id property exists at all, and canonicalize the capitalization. Any other canonicalization would be deferred to the time of use.
- JGT: Correct.
- Conclusion: Justin to write a speculative PR, with the understanding that it may be closed, and we'll discuss it.

### Microsecond precision
- PFC wrote up some [thoughts](https://docs.google.com/document/d/1RhmIjv4uNJhYEOisJAkAAG8tQB0SlB1ZLO80e9PzXzA/edit#).
- DE: What's the motivation for Duration fields being any Number value?
- PFC: The idea was that you create them like property bags, and overflow occurs when you apply them to dates. They don't have to be that way, that's just how it was.
- JGT: Do I understand correctly that Instant would fit in 64-bits if the precision was limited to microseconds?
- PFC: Yes.
- JGT: That seems like a really valuable attribute of this.
- DE: What performance gain are we expecting from Instant if it fits in 64-bit? I'm skeptical of that.
- PFC: My sense was that JSC and SM were OK with >64-bit Instants but V8 didn't prefer it.
- PDL: I got the sense from SYG last week that he was OK with it.
- PFC: Not exactly OK, I think he dispreferred it, but it was better than BigInt.
- DE: So, we could come to this meeting next week with a plan for bounding Duration and then decide whether to reduce precision to nanoseconds.
- PFC: The thing is that if we bound durations, it actually doesn't matter that much what the precision is. 999999 and 999999999 both fit in 32-bits.
- JGT: I strongly support bounding Durations.
- (Sorry, lost some of the discussion due to being involved in it.)
- Conclusion: We'll try to move forward with bounding seconds in Duration calculations to MAX_SAFE_INTEGER. If BigInt arithmetic is still required for calendar units, then we'll additionally bound the calendar units to i32.

### ZonedDateTime in Intl.DateTimeFormat.format ([#2479](https://github.com/tc39/proposal-temporal/pull/2479))
- Choices:
    - 3. Accept ZDT. If the DTF was constructed with an undefined time zone, use the ZDT's time zone. Otherwise, if the DTF's explicit time zone differs from the ZDT's time zone, throw; otherwise, the time zone matches, and use it.
    - 8. Accept ZDT. If the DTF was constructed with an undefined time zone, use the ZDT's time zone. Otherwise (if the DTF has an explicit time zone), throw (even if the time zone matches the ZDT).
    - 9. Accept ZDT; if the DTF was constructed with an undefined time zone, use the ZDT's time zone. Otherwise, use the DTF's time zone, ignoring the ZDT time zone.
- Straw poll from 2 weeks ago
    - PFC: any of 3, 8, 9
    - RGN: prefer 8, 9, would not object to 3
    - PDL: strong preference for 9
    - JGT: prefer 8, but fine with 3, not a big fan of 9
    - SFC: 8 > 9 > 3
    - JWS: (Didn’t have chance to visit issue but will vote this week)
- PFC: I don't have a strong opinion against any of these. If I had to choose one, I'd choose 8.
- DE: 8 seems to accord with PDL's principle of no data-driven exceptions.
- RGN: I don't have any preference between 8 and 9.
- JGT: Can we propose 8 > 9 > 3 and then pick the first one that's acceptable to the skeptics?
- PFC: Previous bugfix was 4 (always use ZDT time zone)
- Conclusion: Adjust the PR to implement 8, in the meantime talk with SFC and FYT.