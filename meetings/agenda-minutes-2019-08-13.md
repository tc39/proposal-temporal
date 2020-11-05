Temporal.PlainDate call

August 13, 2019

Attendees:

	Shane Carr - Google i18n (SC)
	Jeff Walden - Mozilla SpiderMonkey (JW)
	Richard Gibson - OpenJS Foundation (RG)
	Ujjwal Sharma - Node.js / V8, Igalia student program (US)

SC: Thanks Ujjwal for triaging the tickets!

SC: Ms2ger has a PR to add the Intl.DateTimeFormat integration: [https://github.com/tc39/proposal-temporal/pull/140](https://github.com/tc39/proposal-temporal/pull/140)

We need to figure out the logistics for checking it in.

SC: What's the status of the spec text?  Stage 3 reviewers?

SC: Status of remaining open issues?

RG: I still want to triage issues.  I think there are still some big gaps.  I need to evaluate the process document to evaluate if those are Stage 3 concerns.  Before the next meeting, I want to collect things from GitHub and share code that solves those use cases.  For example, someone shared flight time calculation, event scheduling, and other use cases we want to resolve with Temporal.

SC: We shouldn't feel bad to punt for another cycle, but I would like to see progress.

RG: Not sure yet if they are Stage 3 blocking issues.

US: I've done triaging work; not time yet for spec work.  But now I should have more time for the spec.  PD suggested working on Instant first.  I've been spending time doing research on prior art to get a handle on what's expected.

SC: I’m really happy with the progress we’re seeing. Philipp has a PR for OffsetDateTime & ZonedDateTime spec text at [https://github.com/tc39/proposal-temporal/pull/145](https://github.com/tc39/proposal-temporal/pull/145), there has been some initial review and some still-open questions.

RG: If there's missing surface area, the use cases should expose that.  My opinion hasn't changed since I wrote the comment on the PR.

US: One issue is that even if the PR is perfect on technical grounds, DD raised concerns about the built-in module interactions.

SC: I’m skeptical about advancing Temporal as a built-in module, in part because others in the committee and in the web platform are concerned about confusion from having both globals and built-in modules (which itself is only at Stage 1). I think Temporal needs to move ahead as a global and we can pivot if that blocks advancement.

US: We would have to do weird things in the spec with built-in modules.  JHD had some more comments on built-in module, something along the lines of this being a crucial part of the spec that shouldn't be changed at this stage if possible.

SC: We *could* come into October with an update rather than seeking advancement. It’s more a political decision than a technical one, subject to our own time and resources.

JW: Stage 3 is when implementers have a green light.  Global vs Built-In Module should be decided by that point.

SC: If TC39 gives us approval for Stage 3, then that answers the question.

RG: It would be worth sharing how big this feature is.  Everyone deserves congratulations for how far it's come.  There's a lot of depth, complexity, and surface area.

SC: I’m tentatively planning to attend TC39 October in person. Next Temporal call is on September 10.

