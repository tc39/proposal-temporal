Nov 12, 2019

Attendees

	Richard Gibson
	Ujjwal Sharma
	Jaideep Bhoosreddy
	Daniel Ehrenberg
	Philipp Dunkel
	Jeff Walden
	Shane Carr

Agenda:

* Status of project
    * Open issues
        * [https://github.com/tc39/proposal-temporal/issues/255](https://github.com/tc39/proposal-temporal/issues/255) -- No, PD to follow up to close issue
        * [https://github.com/tc39/proposal-temporal/issues/236](https://github.com/tc39/proposal-temporal/issues/236)
            * PD: Do we really want 5 of these? Here and now is enough
            * DE: I think we probably want three of them, DateTime, Absolute and TimeZone
            * Resolution: post on the issue getCurrentDateTime, getCurrentAbsolute, getCurrentTimeZone, and follow up
        * [https://github.com/tc39/proposal-temporal/issues/233](https://github.com/tc39/proposal-temporal/issues/233)
            * PD: Let's drop them
            * Resolution: Drop
        * [https://github.com/tc39/proposal-temporal/issues/237](https://github.com/tc39/proposal-temporal/issues/237)
            * DE: We should check the types. If you want to sort just by time, project explicitly.
            * PD: OK, I'm convinced. Except! It shouldn't throw, since array sort doesn't throw with the default comparator.
            * RG: It should throw, e.g., if you have a string that can't parse. The default comparator will throw if you pass a symbol.
            * Resolution: throw a type error if there's a mismatch
        * [https://github.com/tc39/proposal-temporal/issues/244](https://github.com/tc39/proposal-temporal/issues/244)
            * PD: When you parse an ISO string, you want an Absolute and TimeZone, or DateTime and TimeZone
            * DE: Isn't this logically a DateTime + TimeZone? You could calculate an absolute, but that's not what you're parsing
            * PD: Not quite--the string may have both an offset (+- num) and a timezone ([/])
            * DE: What's used in interchange?
            * PD: Right now, it's mostly just offset, and not timezone. C# and MS are pushing for offset and timezone. That's the only thing that will allow full information interchange. It's an extension on ISO because the [] is allowed as a comment (!) So, the proposal here is to give you all the information that you end up having.
            * SC: Does this round-trip?
            * PD: You can pass in the TimeZone to an Absolute.toString()
            * US: Do we need to have subtypes to DateTime, like Date or Time?
            * DE: I guess the reason why not is that you might pass just a Date or just a Time?
            * SC: We could follow the pattern of Intl.Segmenter and return an object that has getters, so it would be lazy
            * PD to comment with a resolution
        * [https://github.com/tc39/proposal-temporal/issues/198](https://github.com/tc39/proposal-temporal/issues/198)
            * RG: ISO allows alphabetic components in any case; ISO expresses a preference for a , but allows a .
            * PD: Can we not?
            * RG: We certainly can specify something that doesn't. I saw a change come in that was looser than ISO, allowing a space instead of a T
            * PD: This matches RFC 3339, an ISO profile, that allows that
            * RG: No, it doesn't. It also uses the T.
            * PD: It lets you alternate case in RFC 3339
            * DE: Is this in use in interchange?
            * PD: The space is in use
            * RG: Yes
            * PD: Lower case? I don't care. Separation of , vs ., let's just stick with .
            * RG: If we're going to allow any variation at all, I believe we should allow all valid
            * Resolution: Yes, let's get a profile that makes sense, and follow up on the issue.
        * [https://github.com/tc39/proposal-temporal/issues/129](https://github.com/tc39/proposal-temporal/issues/129)
    * Polyfill
        * US: I had been working on things like from/fromString, and just picking up all the design issues that have a conclusion, and working on getting as much consensus as I can. So I'm working to make sure we don't have open polyfill issues.
    * Documentation
        * Jason will do Absolute
        * Philipp will do DateTime
        * Jaideep will do TimeZone
        * (We'll assign more later)
    * Tests
        * PD: I'm running coverage on the tests. They show a lot of holes.
        * US: Ms2ger configured codeconv on the tests
        * PD: It's simple, you can use npm run coverage
    * Spec text
        * [https://github.com/tc39/proposal-temporal/issues/198#issuecomment-552367929](https://github.com/tc39/proposal-temporal/issues/198#issuecomment-552367929)
        * [https://github.com/tc39/proposal-temporal/issues/207#issuecomment-552684236](https://github.com/tc39/proposal-temporal/issues/207#issuecomment-552684236)
        * Ms2ger is all in, adding more and more spec text; US to join in
    * PD: I'm more relaxed about the time goals, more tests are being written to make sure that things are really sensible
    * US: I'm planning on working on various additional issues, like parsing. Hoping that this week, we'd have the API issues done, and no more big open issues for the API. Ms2ger is working through spec issues. I hope in a week or so, we're at a point where we're just finishing up the spec text. We might've hit the phase where the proposal was probably moving too fast and it was a bit concerning, so I do think it'd be good to keep it relaxing for a couple of weeks, to make sure that everyone has had time to review things.
    * PD: I think that's what the last two weeks were about, and I'm glad we're moving more slowly. Maybe with another week we'll be good
    * DE: I haven't seen activity on several of the issues I've filed; I'm not sure if we'll be ready in a week
    * RG: I'm working on a list of use cases, extracted from issues, and plan to upload this soon.
* Next steps
    * New goals:

