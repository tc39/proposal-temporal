# January 18, 2024

## Attendees
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Jason Williams (JWS)
- Chris de Almeida (CDA)
- Shane Carr (SFC)

## Agenda

### weekOfYear/yearOfWeek for non-ISO calendars ([#2744](https://github.com/tc39/proposal-temporal/issues/2744) / PR [#2756](https://github.com/tc39/proposal-temporal/pull/2756))
- PFC: RGN and I talked about this last week. ADT prepared a PR. I found out that ICU has generalized week-number code for any calendar, so I think we can have week numbers for any calendar that wants them.
- PDL: I wonder if we are doing the right thing here. The week numbers in ICU might make no sense. They make sense for ISO and Gregorian, but for others?
- PFC: I agree that it doesn't necessarily make sense for every calendar.
- JWS: I agree with what SFC wrote in the original issue about undefined. Which calendars have week numbers?
- PFC: We don't have to specify that. We can leave it up to Intl. I don't know if any other calendars have week numbers, but the users of the Hijri calendars who opened the original issue seemed to suggest that there should be week numbers.
- PDL: There was some confusion with first day of week. I think we should specify explicitly that only ISO and Gregorian have week numbers.
- PFC: We haven't done the research for that and I think we should leave it up to Intl.
- JWS: We don't specify it for eras either.
- PDL: Where do we get eras from?
- PFC: ICU.
- JWS: Why can't we take the same approach as we do for era?
- PDL: I'd want to make sure there's an actual specification we can point to.
- PFC: I agree with JWS, I'd prefer to leave it up to Intl. This would be a good thing to ask SFC about.
- PDL: The main thing I want to prevent is divergence between implementations.
- (later)
- SFC: Looking at the CLDR JSON data, there are formatting patterns for week numbers in the Gregorian calendar, and not, for example, in the Buddhist calendar. Defining this would be in scope for the Era and Month Codes proposal.
    - Week formats are in gregorian: [https://github.com/unicode-org/cldr-json/blob/858baad63c1d51e1d576ef99dccc229d92cedda4/cldr-json/cldr-dates-full/main/en/ca-gregorian.json#L396](https://github.com/unicode-org/cldr-json/blob/858baad63c1d51e1d576ef99dccc229d92cedda4/cldr-json/cldr-dates-full/main/en/ca-gregorian.json#L396)
    - But not japanese: [https://github.com/unicode-org/cldr-json/blob/858baad63c1d51e1d576ef99dccc229d92cedda4/cldr-json/cldr-cal-japanese-full/main/en/ca-japanese.json#L1053](https://github.com/unicode-org/cldr-json/blob/858baad63c1d51e1d576ef99dccc229d92cedda4/cldr-json/cldr-cal-japanese-full/main/en/ca-japanese.json#L1053)
- Conclusion:
    - Open an issue in the Era and Month Codes proposal
    - In Temporal, it may be a number or undefined
    - Add a note in the spec text pointing to 402

### Discrepancy between Duration rounding relative to ZDT and rounding in ZDT until/since ([#2742](https://github.com/tc39/proposal-temporal/issues/2742))
- PFC: Adam Shaw has been helpful with opening bugs in the rounding algorithms. I think it's 2 separate bugs.
- PFC: I think the answer might be we keep investigating this and plan an upcoming normative change for the upcoming plenary. Just out of curiosity, what would you think of dropping the relativeTo year/month and totaling out of scope and focusing on the duration units that are always well defined.
- PDL: Wouldn’t the consequence be you can’t round to anything large than a week?
- PFC: Larger than a day, even, or maybe hour.
- PDL: I wonder whether it’s possible to write a comparative test, comparing Chrome’s implementation vs Mozilla’s implementation, as a way to find a lot of these [bugs].
- PFC: What would be more useful is to write exhaustive comparative tests against Temporal and some other library. Because it's more likely that Chrome/Webkit/Mozilla have implemented this spec faithfully. So I suspect if there’s bugs, those implementations would agree with each other.
- PDL: That library doesn't exist though.
- PFC: Right, it doesn't, that's what I'm worried about. It's uncharted territory.
- …
- PDL: Proposal: define Duration round/total/etc. in terms of existing since/until algorithms. For example, Duration round when provided a relativeTo option will return a result equivalent to ``relativeTo.until(relativeTo.add($receiver), $otherOptions)``.
- PFC: That would at least prevent discrepancies between these two algorithms like the ones discovered in this bug.
- RGN: Enthusiastic support.

### ISO 8601-2:2019 amendment about duration balancing
- PFC will email markdown amendment to the champions group and then we can discuss it on an issue.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- RGN: I'm happy with the description but remain unhappy with the result of it. Will create a description of the desired algorithm.
- PFC: Let's see if we can try to resolve this next week.
- SFC: I think in terms of the A, B, C options from my previous comment. Which one is Temporal using right now?
