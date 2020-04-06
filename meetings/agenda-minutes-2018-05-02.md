Date meeting minutes

2018 May 2, 1:00 UTC


Attendees:

	Maggie Pint
	Matt Johnson
	Andrew Paprocki
	Quiyi Zhang
	Daniel Ehrenberg

Agenda and notes:

* Next steps on the [Temporal proposal](https://github.com/tc39/proposal-temporal)
    * MP: It got to Stage 1 a year ago. Life gets in the way. I’m behind anyone who wants to drive it or similar. It needs a polyfill: Before we write spec text, we need to write a polyfill to know what we’re writing the spec for. We wouldn’t find the edge cases unless it’s a working library. I started a little bit of this. I think we do have consensus on the general API surface area
    * Matt: The people who raised issues have to be heard and addressed. There is room for modification based on feedback. Not ready to advance until we can pull it together into a polyfill.
    * MP: There may be merit to splitting the types out, since it makes the whole thing less overwhelming.
    * AP: I think that would have a better chance of working if the vision is presented as whole, but it seems like going piecemeal hasn’t been well-received in committee, with cross-cutting concerns, etc. People want to see it all presented together
    * MP: I’m trying to figure out what specific problems can be addressed. It’s hard to ship the whole surface area with something this big.
    * Matt: I’d be interested if someone is interested in helping co-champion this with us. Brian had stepped in, but ultimately none of us have enough time for all this work.
    * MP: It has to be your job. This isn’t adding a parameter, or optional catch binding
    * AP: I can ask around at work. There are a bunch of people who want to get involved in some way, who may be able to do the polyfilling side of it.
    * Matt: And they could tell us what work and what doesn’t. Should be someone who cares about datetime and has cycles to focus on it over a period of time. From experience, we know that this needs longer backing
    * MP: Maybe I can throw one of my employees at it
    * DE: What if we go through the decisions among us, and separate that from authoring a polyfill.
    * AP: We have to be careful to weigh the decisions and document the rationales, and present this, not just say it’s decided
    * Matt: So the plan going forward will be to find this person
    * DE: Is this for the decision-making or polyfill authoring?
    * AP: First polyfill, and we’ll keep reviewing things as this group
    * (Discussion about how to attract people)
    * **Initial plan**: We look around among TC39 members and our coworkers; none of us have time right now.
* [Date.parse standardization](https://github.com/leurfete/proposal-date-time-string-format)
    * DE: I think this would be good to pick up again
    * Matt: I’ve seen tables of what works, and it changes over time
    * AP: Can we do this, with web compat?
    * DE: The web has worked through worse things
    * Matt: We should figure out what quirky strings are permitted and maintain them
    * MP: Does this belong in 402?
    * AP: Maybe the ISO format in the core spec, and the non-iso formats in 402
    * Matt: There’s some amount of it in the spec already, and we already have explicit deviation. Without the Z, it’s parsed as localtime, etc. We’re already explicitly not ISO. I worry about trying to align perfectly. In stack overflow, the solid answer from the community is don’t use JS’s date parser. Either use Moment or parse it yourself. If we were ever going to return it to a status that you can trust it
    * Dan: The goal is just compatibility, not making something that’s good to use. Doesn’t make sense for 402, as this is just parsing a single legacy format, not something with linguistic content, including ICU
    * Matt: Yeah, I agree. Is this existing proposal the union, intersection, or what?
    * DE: Somewhere in the middle, like a lot of compat proposals
    * MP: But this’ll still be completely broken, as it won’t be linguistically accurate
    * DE: We still won’t want people to use this; it’s just for compat
    * MP: With Temporal, we’ll have a nice date parser, like LDML date tokens, eventually.
    * Matt: People will bikeshed about tokens, some won’t like CLDR
    * DE: Where do we want to go on this proposal?
    * AP: After getting through my patches, I’d like to look at this. Can look at writing spec text, asking for data from browsers, etc. The data collection may not be so difficult. The guidance I’d want to get is whether browsers are interested.
    * DE: I’m pretty sure they’re interested
    * AP: It’s not clear whether they’d do it themselves or take a PR
    * **Initial plan**: After Andrew finishes the other patches, he’ll look at pushing this forward. Also, Maggie will take this and look for resources in her team.
    * (Discussion on how the counters would be implemented)
    * AP: It’d be good to get documentation from browsers about how to add telemetry data. Anyway I might have to learn this for my other Date patch.
* any other Date cleanups/fixes [1](https://github.com/tc39/ecma262/pull/778) [2](https://github.com/tc39/ecma262/pull/1144)
    * Matt: For 1, to test, setting the timezone on the machine should be OS-specific, but possible, as long as there’s a process restart, on POSIX. Not clear whether this is feasible in test262, but several browsers will pick up a timezone change. On Windows, the only way would be through API hooking. There are mechanisms in the OS, but you’re going after the win32 calls that are responsible for showing the system timezone and stubbing them out. But generally you have system-wide timezone settings.
    * DE: Sounds like a big project
    * Matt: The OS should have an API for it. The MS people who would create such an API aren’t getting enough signal. If you’re in such a position, a writeup would help.
    * AP: It seems like, if the web platform requires it, this is some strong demand
    * Matt: Even if I can convince people that there should be this API, it will be restricted to a future version of Windows; existing users would fail.
    * AP: If you have this list for API hooking, maybe we can make this work. We do lots of this at Bloomberg.
    * Matt: I can create this list, someone would need to implement it, not the simplest to write. More likely to happen from this detouring perspective than as an OS feature.
    * AP: There’s one guy on our side who does a lot of this detouring. I’d have to dig up the code, but he detours a bunch of APIs to ship to clients all the time. We’d just need the list of APIs
    * Matt: I started investigating this, actually there’s a nice .NET library for this hooking. I can definitely send you thoughts about this. Anyway, if it’s just about the API surface, why not just run on Linux? The thing is that the API is all over the place in Windows, 15 places.
    * AP: I don’t have the domain knowledge of those 15 places; if you can share the list, we can do this. I do this same technique when testing what happens a specific time on the clock.
    * Matt: There’s a bit around that--if you’re testing something small, the technique works. But in a larger distributed system, when connecting to external systems, it’s hard to test running at different times. But changing the timezone shouldn’t run into those issues.
    * **Initial plan**: Matt will document the things that would need to be hooked for the timezone and send it to Andrew, who has a coworker who may be available to implement this; we’ll also look into what can be upstreamed into test262.
    * For 2:
    * AP: I’m trying to iron this out since it seems very straightforward to iron out. Just Firefox does this; others have differing observable behavior. Safari is the most out there. The point of the PR is to clean up the spec text and test262 tests to have an invalid date on these out of range values. This could theoretically be a web compat issue, but it only affects these weird dates
    * Matt: So this standardizes the range?
    * AP: Yes. The problem is that it gives you garbage output, with multiple input values giving the same output. It’s a nasty corner case. Someone just needs to do the work. I’ll present it at the next meeting
    * Matt: When these come up in the real world, I say you’re using the wrong API for things so far in the future or past.
    * Dan: I just wanted to make sure implementers were in the loop on a normative change
    * Matt: The ISO spec has this "by agreement" clause
* Interaction of BigInt with [Date](https://github.com/tc39/proposal-bigint/issues/136) and/or Temporal
    * Matt: Temporal could take a dependency on BigInt?
    * Dan: Yes, BigInt is pretty far along
* Intl.DateTimeFormat (includes calendar, timezone)--how does this API relate to new ones?
* [navigator.ontimezonechange](https://github.com/whatwg/html/pull/3047)
* [Navigator.locales](https://github.com/whatwg/html/pull/3046)
* How to approach shared testing
* How should we work together on these topics going forward
    * MP: This was good, let’s keep doing this.
    * **Initial plan**: Have a call in the third week of June, rotate time, also discuss in TC39 meetings

