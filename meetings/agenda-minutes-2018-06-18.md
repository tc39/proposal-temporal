Agenda and notes:

Date call

2018 June 18, 1:00 UTC


Attendees:

	Maggie Pint
	Phillip Dunkel

	Andrew Paprocki

	Qiuyi Zhang

	Daniel Ehrenberg

Agenda and notes:

* Next steps on the [Temporal proposal](https://github.com/tc39/proposal-temporal)
    * [Polyfill published](https://github.com/tc39/proposal-temporal/pull/57)! Next steps? Learnings?
    * MPT: You made some decisions there, including a now method, I know Mark Miller will object. We should talk about this proposal. It should ride on BigInt; I didn’t know if it would get blocked. However, at this point, we should sit on top of BigInt. Also, how will we publish the polyfill and get it used.
    * PD: There are a couple translation methods that make it integrate with Date more easily. It’s based on one BigInt, as opposed to two Numbers.
    * MPT: I’m not concerned about the Date conversions; I’m more concerned about any time we’re accessing data from the global state
    * DE: Let’s not focus on ocap concerns; SES can deal with this, as it’s analogous to the Date constructor, and extremely useful.
    * MPT: Everyone fine with nanoseconds since epoch?
    * AP: If you have the storage for nanoseconds since epoch, seems fine.
    * MPT: Any scenarios where we don’t have 64 bits of storage?
    * AP: BigInt is arbitrary, so if BigInt lands in the spec, we can store whatever.
    * MPT: Now, we can have the BigInt constructor.
    * PD: That’s why I added the toDate/fromDate functions, where you can also pass the Number milliseconds-since-epoch.
    * MPT: Do we also need a nanosecond constructor?
    * PD: We only have a nanosecond constructor, and toDate/fromDate is your millisecond constructor.
    * AP: Even 32-bit systems need to support BigInt
    * MPT: For next steps, I’m happy with the APIs. Phillip, I’ll have to look closer at your choices, but they seem pretty good. Let’s try to get this used and get realistic feedback, and get initial feedback on spec text to push this towards Stage 2. Maybe someone from my staff will write the spec text. How do we want to get the polyfill driven out for people to try?
    * PD: Maybe we can hold back the polyfill until we have spec text--the worst thing we can do is get adoption and change fundamentals. In terms of actually putting it out, publishing as a node module should do it. The web can use it, so no problem.
    * MPT: I’m a little worried about having the polyfill in the proposal, they are not usually put there.
    * DE: Polyfill in the same repo sounds good. How does the tz database work?
    * PD: We use the Intl APIs to get the timezone database, like Luxon
    * DE: How does that work out for performance?
    * MPT: Luxon performance is pretty good. Luxon is part of the moment.js library. You should switch to Luxon if you’re using moment.
    * PD: I didn’t use Luxon, but I figured out the same thing, then read the Luxon code, and fixed my bugs with their logic :)
    * MPT: As long as you’re using a similar caching method to what Luxon is using, it should have similarly good performance.
    * PD: I wonder how relevant performance benchmarks for the polyfill are--you won’t hit performance cases unless you have a crazy loop. The hope is, give it two years and the polyfill should be dead.
    * MPT: It doesn’t give people far-back compatibility, e.g., it doesn’t work in IE.
    * DE: BTW there are historical observable differences between browsers in timezone name handling in Intl
    * (Chaos ensues)
    * PD: Good thing we’re using Intl, so we’re all on the same page
    * MPT: OK, I’ll put this on the agenda for Stage 2 in the July meeting, to force myself
    * PD: I’m happy to help with spec text too
    * MPT: I’d like to play with the polyfill a bit too
    * PD: That’s why I made this world clock simulation, to get what it feels like. It could be done with Intl, anyway
    * MPT: 30 minutes? An hour? Added to the agenda! Let’s work together on spec text, PD.
* [Date.parse standardization](https://github.com/leurfete/proposal-date-time-string-format)
    * Andrew’s patches have consensus [1](https://github.com/tc39/ecma262/pull/778) [2](https://github.com/tc39/ecma262/pull/1144)
    * AP: We’re in a limbo state. I don’t know what the deal is with the editor group. The test262 change was merged by Rick, but before the actual normative PR was merged. Not sure what the editor process is from here.
    * BT: I’ll take a look at it
    * AP: I also found the old Mozilla Date.parse work. I think it’s still worth doing--seems like grammar work to lay out the subset that fits everywhere that everyone should have tests for.
    * MPT: If we’ll do this work, maybe we should make it work for Intl, and the Temporal proposal
    * DE: But the old grammar is terrible. Do we really want to carry it forward?
    * AP: The ISO-8601 subset is supported either way. The other subset is actually RFC 5322. The idea is, instead of leaving Date.parse unspecified, you specify the bare minimum being ISO 8601 and RFC 5322. Then, engines can still keep stuff on top of it.
    * DE: It’d be best if we could actually handled the whole thing, giving a grammar that is what everyone should support, and mandate an error for things outside the grammar. Engine maintainers don’t want to have to keep other things permitted. It wouldn’t make sense to continue piecemeal.
    * BT: It's not possible. the extent to which the web depends on the unspecified date.parse stuff is... very surprising
    * AP: RFC 5322 handles the most important cases.
    * PD, MPT: It parses timezone abbreviations, and it’s weird and bad
    * AP: But the RFC spec, which would be put in spec text, doesn’t have that obsolete stuff. It’d just have the +- 4-digit offset. 5322 has an "obsolete" section, and I’d propose we drop that part. We always have an out, the engines can always keep other things included.
    * DE: This doesn’t sound so great for maintenance or complexity, continuing to kick the can down the road.
    * AP: For V8’s code, it wouldn’t add a third path, but instead fit into the existing else path, mostly
    * DE: This idea doesn’t solve the problem of various engines’ Date.parse implementations being incompatible, and getting lots of bugs filed against each other.
    * AP: I was thinking about this looking at the V8 parser. This would graft perfectly onto the top of what they’re doing. What engines could do, if it were standardized, is, if it’s not one of these two things, then start complaining about it to the console. Then we may eventually deprecate.
    * MPT: Based on moment.js experience, console messages won’t change people.
    * DE: I want a solution which would make it so that, when browser vendors get bugs about these incompatibilities, we have a next step. I’ve been saying, we should refer to this standards effort, like what Morgan was proposing.
    * AP: The engine implementers will have to chime in. Till was going to propose removing Till’s proposal if no one picks it up. I don’t know if engines are interested.
    * DE: Engines are definitely interested, it just will take some work.
    * AP: It will take me more time to get comfortable with the grammar. This proposal just threw up a PEG parser, no comments about whether it captures everything, if there’s additional behavior about what the engines do.
    * MPT: We should look at the actual parsers to see what they do
    * AP: We can just look at the parsers
    * DE: The V8 team might allow a patch upstream which tries out a new date parser proposal and sends up a UseCounter if the legacy-legacy parser is actually hit.
    * AP: Let’s ask Till if he has some more of this data that Morgan made so we can follow up on where things are
* Interaction of BigInt with [Date](https://github.com/tc39/proposal-bigint/issues/136) and/or Temporal
    * Polyfill uses BigInt
* Intl.DateTimeFormat (includes calendar, timezone)--how does this API relate to new ones?
* [navigator.ontimezonechange](https://github.com/whatwg/html/pull/3047)
* [navigator.locales](https://github.com/whatwg/html/pull/3046)
* How to approach shared testing
    * Next steps on virtualization in Windows?
    * Next steps on non-Windows test262 tests?
* How should we work together on these topics going forward
