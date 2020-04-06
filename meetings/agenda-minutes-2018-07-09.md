Date call

2018 July 9, 16:00 UTC

Attendees:

	Daniel Ehrenberg

	Phillip Dunkel

Yulia Startsev

Richard Gibson

Jeff Walden

	…

Agenda and notes:

* Next steps on the [Temporal proposal](https://github.com/tc39/proposal-temporal)
    * PD: I haven't seen any changes since the last meeting, or the result of their work.
    * DE: Let's revisit when Maggie joins
    * PD: I could write some spec text; I haven't heard more from Maggie
    * MP: My report is halfway through the temporal proposal. We should be able to do Stage 2 at the end of the month. I'll try to get out a PR out by the end of this week (at least for some of it). The spec text will probably be bad, everyone will have to be prepared to yell at us.
    * PD: Could you send me a preview, so I can make sure the polyfill matches the spec text?
    * MP: I'll schedule a meeting this afternoon with her; hopefully we can review something on Wednesday.
    * DE: Is the spec text the combination of the README and Phillip's comments, or more?
    * MP: The README is certainly missing some APIs; we'll have to add them and document it.
    * PD: I'm happy to help with the spec text
    * MP: Let's sync up the three of us and go over it.
* Date.parse standardization
    * Old proposal: [https://github.com/tc39/proposal-date-time-string-format](https://github.com/tc39/proposal-date-time-string-format)
    * [Formats ](http://dygraphs.com/date-formats.html)
    * [Firefox bug ](https://bugzilla.mozilla.org/show_bug.cgi?id=1274354)
    * RG: I'm trying to establish enough constraints to make it so that a purported interchange-format date is either accepted in all engines or rejected in all of them. We're fixing only Date.parse, but I'm only tacking Date.parse and not Date
        * Proposal: [https://github.com/gibson042/ecma262-proposal-uniform-interchange-date-parsing](https://github.com/gibson042/ecma262-proposal-uniform-interchange-date-parsing)
        * Discussion: [https://github.com/gibson042/ecma262-proposal-uniform-interchange-date-parsing#discussion](https://github.com/gibson042/ecma262-proposal-uniform-interchange-date-parsing#discussion)
    * PD: Changing stuff out in the wild is potentially odious, since it breaks things. If we are breaking/making a new API, why not change it to something for Temporal? We can let Date die a slow, painful death.
    * YS: The idea is to bring some sense to Date, which we can't get rid of. There's a bug associated which discusses these compatibility issues. There are a few projects trying to make sense of it.
    * RG: One thing I found is that Firefox is pretty close to the behavior I'd like to see from all browsers. It rejects almost every input that doesn't match the current format, and maybe we should expand the format for that. The variance is more in other browsers accepting too much
    * YS: I added another link which explains the formats that different browsers accept
    * DE: Agreed, we should both make the pretty new thing and clean up the old ugly thing. Also make sure the result is web-compatible; it might not work to just take the strictest one.
    * RG: There's a lot of different inconsistencies, but it should be pretty easy to fix, since Firefox already rejects a lot of these things.
    * DE: Do you really want to separate Date.parse from Date()?
    * RG: All the string input should be handled the same, but Temporal would be different
    * DE: to figure out if its web compatible, we can put code into browsers and see how often specific types of changes cause breakages. I think the V8 team is likely to accept a contribution of this kind.
    * YS: We'll look into if SpiderMonkey wants to do this as well. Thanks for doing this work, RG.
    * RG: I found a lot of broken links along the way; glad it's working out.
* [navigator.ontimezonechange](https://github.com/whatwg/html/pull/3047)
    * DE: Explained the proposal
    * JW: Yeah, we had this in FirefoxOS; we should do this.
* [navigator.locales](https://github.com/whatwg/html/pull/3046)
    * RG: Changing the locale sounds weird, even changing the timezone in the middle is weird
    * DE: We actually already change the timezone in the middle; I'm just talking about making an event for the transition
    * RG: OK, I guess that makes sense.
    * JW: Platforms may be interested, but not clearly high priority
* Interaction of BigInt with [Date](https://github.com/tc39/proposal-bigint/issues/136) and/or Temporal
    * Polyfill uses BigInt
    * PD: The interaction is straightforward; my question is: If we use BigInt now, we're assuming all the places where Temporal will be polyfilled will have BigInt. In the end, we want the polyfill to be 1:1 what the actual proposal will be. How widespread is BigInt, and how widespread will it be 6 months in the future?
    * DE: I'd say, the ideal thing is that it work both with BigInts and without BigInts, in its polyfill.
    * PD: The constructors all take BigInt as an argument. When you create a moment in time, you initialize it with a BigInt nanos since epoch. When you create an Instant or a ZonedInstant, it's always a BigInt operation.
    * RG: OK, that makes it really fundamental. The alternative would be, instead of ns since the epoch, it could preserve the Date epoch of ms since the epoch, and then have another thing for ns within ms.
    * PD: There's an interface which is fromDate, where you pass in a Number or Date, which under the hood uses the constructor. It basically reduces your surface significantly.
    * RG: Having it as one number (ns since epoch) instead of a pair (ms since epoch, 0–999999 ns within ms) brings in the BigInt dependency
    * DE: I thought there was a constructor which took year, month, etc. I think it'd still be useful to have an interface which doesn't require BigInt
    * PD: What about stage advancement with the polyfill?
    * DE: It's not a prerequisite, but a maximally useful polyfill will be great.
* Intl.DateTimeFormat (includes calendar, timezone)--how does this API relate to new ones?
    * DE: Should we overload for Temporal?
    * PD: What I've done for the polyfill is overload valueOf, so these things "already work". If it returns a Number, it'll just work; if it returns a BigInt, it will not work. We may want to make the Intl stuff accept temporal objects
    * DE: Overlapping concepts between Temporal and Intl: calendars, timezones
    * PD: Temporal says, we just have gregorian. 
    * RG: It has the machinery for it--you feed in an timestamp and things come out
