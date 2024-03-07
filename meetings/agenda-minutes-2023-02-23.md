# February 23, 2023

## Attendees
- Frank Yung-Fong Tang (FYT)
- Jase Williams (JWS)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Shu-yu Guo (SYG)

## Agenda

#### `Duration.p.round` doesn't balance from hours (or smaller) to weeks (or larger) units [#2508](https://github.com/tc39/proposal-temporal/issues/2508)
- JGT: don't need much discussion, but would like to confirm that this is indeed a bug that we should fix for March plenary.
- PFC: It's a bug. Know how to fix?
- JGT: The problem is that BalanceDuration is the only AO that will convert hours=>days, and it's the last AO called in `Duration.p.round`. I assume that the fix is either:
    - a) refactor, specifically to re-order existing AOs so that BalanceDuration is called earlier
    - b) add additional AO call(s) after BalanceDuration, perhaps BalanceDurationRelative and maybe followed by  MoveRelativeZonedDateTime?

#### ZonedDateTime in Intl.DateTimeFormat.format ([#2479](https://github.com/tc39/proposal-temporal/pull/2479)) - quick vote
- Straw poll from last week
    - PFC: any of 3, 8, 9
    - RGN: prefer 8, 9, would not object to 3
    - PDL: strong preference for 9
    - JGT: prefer 8, but fine with 3, not a big fan of 9
    - SFC: 8 > 9 > 3
    - JWS: (Didn’t have chance to visit issue but will vote this week)
- JGT: looks like 3 is everyone's last choice (except perhaps PFC?) so maybe we could narrow the decision down to just 8 or 9 ?
- JWS: A problem with 8 is if you're receiving objects from somewhere else that you don't control, which could throw in some cases but not others.
- SFC: This would be less likely in a TypeScript application, but I hadn't considered that.
- JGT: A common use case might be porting a working application from legacy Date to ZonedDateTime.
- FYT: The most common use case for DateTimeFormat is legacy Date. Nothing to do with Temporal. From my perspective the most important thing is to not impact that majority use case.
- RGN: That seems like an invalid premise. There are zero uses of Temporal right now, because Temporal hasn't shipped. You can't compare the two.
- FYT: If I make any change that regresses DateTimeFormat in V8 according to benchmarks, it will be rolled back automatically.
- RGN: Surely there is a process to resolve that when the change is according to the spec.
- FYT: It exists, but it slows down the process.
- RGN: But this is in the context of existing use, right?
- FYT: Yes. I just want everyone to be aware of how seriously benchmarks for `Date.prototype.toLocaleString` (which rely upon code shared with `Intl.DateTimeFormat` affect implementation in V8.
- SFC: Both 8 and 9 do come with some implementation costs. It's mitigated, but not fully. DateTimeFormat would gain one bit. Apart from that, there wouldn't be an impact on users.
- PFC: Would it be possible to express that bit in a null pointer?
- SFC: I'll take a look. I think it's a solvable problem.
- FYT: We have to resolve the time zone during creation of the DateTimeFormat object.
- JGT: The null pointer idea wouldn't work for that reason. But maybe you could have a bit in the time zone struct.

#### Nanosecond precision (starting from 08:30)
- PFC: Summary of discussion so far.
- SYG: Question about Duration arithmetic. Would an upper bound be per field, or on the whole duration?
- PFC: There's a hard boundary between hours and days where the fields are not freely convertible without a reference point.
- FYT: There are three kinds of duration arithmetic: (1) duration + duration; (2) duration + exact time; (3) duration + plain time.
- SYG: An even simpler question, if I have 1 year + 1 year expressed in microseconds, does that have a possibility for different loss of precision than 1 year + 1 year?
- PFC: The arithmetic is performed in the mathematical value domain, the loss of precision occurs when storing it into a record.
- SYG: Back to the larger discussion, the technical tradeoffs are that we want to do whatever makes it fast. ABL pointed out that other libraries use 64+32. That's better than a bigint but still not what we want. Ideally we'd live with int64. ABL pointed out that duration balancing still requires arbitrary precision bigint math. I doubt that other libraries like abseil use arbitrary precision for that. Any insights on how you might bound arithmetic?
- PFC: Before we discuss that, maybe there's a shorter question we can resolve — ABL's point about the difference between earliest and latest Instant doesn't fit in int64
- JGT: In other words would it be OK to treat certain units differently? Special case for microseconds difference between Instants.
- SYG: That would probably be OK.
- SYG: In terms of preference, for storage: (1) BigInt, definitely not; (2) happier with 64+32; (3) happiest with 64 only. For runtime performance, (1) unbounded BigInt arithmetic definitely not; (2) 
- JGT: When you create a Duration you create it with Numbers?
- PFC: Numbers on the JS side, float64 on the C++ side.
- JGT: And fractions are not allowed. The upper bound is Number.MAX_VALUE.
- PDL: The only reason we made these float64s is to be compatible with JS Numbers. So if we need to restrict them, then so be it.
- FYT: Most people won't need 2^53 years, consider bounding different duration units differently.
- SYG: If the goal is to bound the arithmetic somehow, does doing that change the overall picture?
- JGT: If you have a huge number of years, and you try to convert it to nanoseconds and it throws, that's not a problem.
- PDL: I think FYT is taking about the bound of what's useful rather than the bounds of arithmetic domain.
- SYG: Bounding years wouldn't affect the unbounded real arithmetic in BalanceDuration though?
- PFC: Right, we need to put the loss of precision somewhere in the spec. We'd want to avoid the situation where we put it somewhere that doesn't help implementations avoid the unbounded arithmetic.
- SYG: In other libraries I see seconds and fractional seconds storage. That helps with understanding the range and the mental model.
- PDL: You can't convert calendar units into each other.
- PFC: Other libraries often don't have calendar units in their duration types, or they have a separate duration type. To keep the mental model consistent, that's why we store them independently.
- JGT: Also for formatting use cases.
- PFC: Although we could consider storing the calendar units independently and storing hours and less in a quantity of seconds and subseconds.
- Recap of duration balancing with/without relativeTo.
- SYG: I don't have any good suggestions, but ideally Duration arithmetic could be implemented as scalar arithmetic underneath? If that's not possible in all cases, could it be possible if the user doesn't have any calendar units? E.g. If Normalize is an operation from Duration to intN, adding two durations is Duration(Normalize(d1) + Normalize(d2))?
- JGT: So essentially pulling out the time units from the date units.
- SYG: Right, and I don't know if calendar units would have to be done in the intN?
- JGT: My proposal from some time ago was to bound calendar units to int32.
- SYG: That's just storage though; I'm taking about the arithmetic domain.
- SYG: My next steps - I've realized we'll never be able to implement duration as arithmetic on one scalar value, because of calendar units. What I'd like is for time units arithmetic to be expressible as an int64 or at most 64+32 operation. I don't know about calendar units.
- PFC: I think this is good input for a new design.
- JGT: I'd really like to consider bounding the calendar units in that new design.
- FYT: I think most of the objects created will be Instants so it makes sense to design the bounds based on that.
- PFC: What lengths would be possible to go to, if we wanted to make the API forwards-compatible with nanoseconds?
- SYG: Zero-cost or close to zero.
- JWS: The trajectory of performance will always be going faster, it’s unlikely to ever go backwards
- SYG: Sure, but there’s no evidence the resolution will change. If measuring performance it's unlikely you will need nanosecond resolution.

#### Forks of IANA TZDB
- JGT: While figuring out how to reply to PFC's comment [here](https://github.com/tc39/proposal-temporal/pull/2492/files#r1091276409), I went down a rabbit hole of researching how the IANA TZDB decides which time zone names are canonical and which ones are aliases (called "Links" in TZDB). From this research I have bad news, more bad news, and a little bit of good news.
  
  The first bad news is that canonical naming changes quite often. This is part of a pruning exercise that's been ongoing for about a decade to merge zones that have had the same time zone rules since 1970. The most recent version (2022g), for example, merges (for example) Europe/Stockholm into Europe/Berlin and Atlantic/Reykyavik into Africa/Abidjan.

  The second bad news is that these changes have so upset some people that the guy who maintains Joda Time, Stephen Colebourne, has [forked](https://twitter.com/jodastephen/status/1558226533839474688) the TZDB to undo these merges so that there's at least one zone per country. See [https://github.com/JodaOrg/global-tz](https://github.com/JodaOrg/global-tz). 

  The somewhat good news is that the main TZDB has a new [PACKRATLIST](https://data.iana.org/time-zones/tzdb/NEWS#:~:text=New%20build%20option%20PACKRATLIST) build option that can undo these changes.

  Anyway, what all this means is that it's no longer clear what "according to the rules in the IANA Time Zone Database" really means. Depending on the build options used, canonical names may be different, as may timestamps before 1970.

  Discuss: should the ECMAScript spec favor one fork or the other? If yes, which fork?
- JWS: Taking the example of Europe/Stockholm and Europe/Berlin, if Sweden decided to change their DST rules, a new Europe/Stockholm zone would be created out of the alias?
- JGT: Right.
- PDL: I don't think we need to resolve this. It's OK to leave this concern to implementors. I can see different choices being the right choice for different environments.
- JGT: I'm not convinced of that. We already have problems caused by browsers resolving Asia/Calcutta and Asia/Kolkata differently. It'd be helpful for us to express an opinion, even if a specific implementation wants to do something different.
- JWS: Do you know why the alias change was done?
- JGT: If you don't prune the TZDB, it'll become unbounded over time. Pre-1970 data is sometimes dubious, so from the maintainer's perspective it doesn't make sense to expend a lot of effort updating it when new sources are discovered.
- PFC: There's a cultural sensitivity issue.
- RGN: Could the TZDB maintainer create a new set of aliases that maintain their canonicalization status?
- JGT: That's essentially what they've done with the build flag.
- RGN: I think it makes sense to recommend using the fork.
- PDL: I don't agree, there's a different tradeoff for e.g. limited data connections.
- RGN: It's a recommendation, not a requirement.
- PDL: You don't make recommendations unless you think they are going to be followed.
- JGT: I'd like to ask us to agree on the fork, and then take that to TG2.
- JWS: I'd like to do some more reading first.
- PDL: Another option would be to not canonicalize the time zone name, instead of choosing a fork, and only canonicalize when comparing.
- PFC: I have some thoughts about that option but I'll put them on GitHub.
- JGT: We'd have to add an equals() method to time zone, and I think we should canonicalize the case, regardless.
- RGN: That would lead to weirdness with Etc/GMT and UTC. I think we're opening a big can of worms.
- JGT: You could say, canonicalize only to UTC.
- JWS: I'd want to tap into any discussion that browsers might be having about using the fork.
- JGT: Next steps: I'll post all the options on a GitHub issue ([https://github.com/tc39/proposal-temporal/issues/2509](https://github.com/tc39/proposal-temporal/issues/2509)) and we can hopefully decide next week.
- RGN: Regarding author-exposed APIs such as `equals`, note that there is a difference between Atlantic/Reykjavik → Africa/Abidjan vs. Asia/Calcutta → Asia/Kolkata (the latter is spelling-only and thus semantically stable, while the former could diverge by territorial policy)
