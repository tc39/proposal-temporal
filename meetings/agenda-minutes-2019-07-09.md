Temporal.PlainDate call

July 9, 2019

Attendees:

	Shane Carr - Google i18n (SC)
	Jeff Walden - Mozilla SpiderMonkey (JW)
	Richard Gibson - OpenJS Foundation (RG)
	Ujjwal Sharma - Node.js / V8, Igalia student program (US)
	Philipp Dunkel - Bloomberg, current champion (PD)

SC: Where do we stand in terms of stage advancement?

PD: My aim is to have the spec text in place by the September/October meeting at Bloomberg in New York.  Whoever can or wants to help with anything is appreciated.

SC: We discussed Temporal a bit in the ECMA 402 meeting last month and recommended that Ms2ger move forward with writing spec text for Intl and Temporal based on global objects.

SC: What are actionable items to prepare for Stage 3 advancement?

- Write spec text for Intl DateTimeFormat interaction (Ms2ger)

PD: I'm working on spec text in Markdown.  I'm hoping to have that done by the end of this month.

RG: We have several different places with the same information.  We have the Markdown docs, the spec text, the reference implementation.  Which one do you consider the authoritative state of the proposal?

PD: There's a document that describes the API.  The Markdown file.  That is probably the closest to current.  The spec text is woefully outdated.  The rationale Markdown files … and I've spent some time bringing the polyfill up to date.  In my mind, that is up with what the spec should do.

RG: If there is a disagreement between Markdown and the polyfill, which one wins?

PD: There should not be a discrepancy.  The documents in the polyfill are copied over from the Markdown proposal.  They are not separately maintained.  The intent is to ship documentation with the polyfill.  They are not actually separate documents.

PD: I think there shouldn't be discrepancies.  If there are, it's a case-by-case basis.  I think there shouldn't be any disagreements, and if there are, they are accidental.  Markdown and Polyfill are at the same state of current.

RG: So there's no general rule?

PD: I guess the polyfill is more likely to be working, since I tool around with that a lot.  My workflow is that I work on the polyfill, and then I write it into the documentation.  And I'm basically at the point now that I need to spin that around and write the spec text, and then update the polyfill based on discoveries during the spec text.

SC: Is there something that US can help with?

PD: I'm not good at dividing up the work, but I know there's a ton to do.  Maybe, pick one of the object, send me a message and say that I'm now speccing this object out, and go for it.  The other thing is Test 262, getting actual tests in.

US: That's close to what I had in mind.  I was afraid to step on people's toes.  So I'll contact you privately and decide which object to start with.

SC: Why are there 58 open issues?

PD: Before Berlin, I closed a bunch of issues.  The response I got was, don't do that, because they are valid.

US: Don't you think we can make a single issue for things like, complete the spec text for object Y, and then close all the related issues?  Maybe I can help set up a GitHub project board.

SC: That sounds great if you can help with project management.

PD: Go for it!  I find though that we have trouble getting contributions from contributors who don't have much time.

SC: It might help if the tasks were more well-defined.

PD: Do we have any more unknowns?  Is there anything else that we haven't spent time designing yet?

RG: There are some issues that we need to look if they're valid or not, that could affect the shape of the interface.

PD: Last time I looked, I didn't see one that met that criteria.  RG, maybe you can help label them?  And make that initial judgement?

RG: I can rule out the ones that are definitely unimportant.  But for example, there's the big one from the March meeting.

PD: It would help if there are bullet points for what are still the gaps, because as far as I know, there shouldn't be any.

SC: Another issue to look at is #139, the one from the Google Abseil folks, who wrote a similar date/time library in C++.  I was able to solicit feedback from them.

PD: There's probably some discussion to be had on issue 2.  We are happy having hybrid types.  So we really should have that discussion at some point.  Whether you expose the epoch or not is an implementation detail.  If you create an instance, you should be able to know what instant it is, and the only way to know that is to know the epoch.  That's point 1. But on point 2, basically what he's saying is to not have ZonedDateTime and OffsetDateTime at all.  How and when do we want to have that discussion?

SC: Discussing asynchronously on GItHub should work, or I can help facilitate setting up a meeting.

PD: Let's discuss asynchronously for now and see if that works.

