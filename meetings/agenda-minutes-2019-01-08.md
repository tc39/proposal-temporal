Temporal.PlainDate call

January 8, 2019, 18:00 UTC

Attendees:

	Daniel Ehrenberg (DE)

	Shane Carr (SC)

	Richard Gibson (RG)

	Maggie Pint (MP)

	Jeff Walden (JW)

	Philipp Dunkel (PD)

	Sasha Pierson (SP)


Agenda and notes  (please suggest your own additions/refinements):

* Temporal
    * Summarizing TC39 status
        * DE: Stage 2! Hooray
        * PD: Actual management buy-in!
    * Explainer/documentation
        * PD: I can get a start on this, and coordinate with those who want to do the heavy lifting of comparative linguistics
        * DE: It's also important to have documentation in MDN.  The MDN folks are really interested in getting documentation for in-progress proposals so they can be a vector to get feedback.  There is a TC39 outreach group and we are working with MDN.  PD, are you interested in writing MDN documentation?
        * MP: I would expect to see API churn… we could try… maybe it would be helpful for us to write MDN documentation as an exercise that could be informative.
        * DE: Yeah, maybe the process of writing up documentation could make us realize that it is weird.
        * PD: I think we should start from MDN documentation.  It might help us make clearer spec text.  So write docs first, spec text second.
    * Specification
        * MP: This sort of blocks on the modules question
    * Strategy for modules
        * DE: Apple, Google are both pushing for built-in modules outside TC39.  There are GitHub comments I've read.  Apple doesn't really have time to write the spec.  And there are open questions about how polyfills, namespaces, etc., should work with built-in modules.  I expect to see this come up at TC39.  We could be a force on this, or we could go with the flow.
        * PD: The question to me is, if we push for this / advance it as a good use case, which I think it is, what are the chances of this getting blocked on built-in modules since there is always disagreement when we bring it up?  Because I think it's more important to get Temporal through than to hitch it to built-in modules, even though it is a perfect use case.
        * DE: The points of disagreement have been shifting.  No one is really saying "no built-in modules", but people have specific concerns now.  My feeling is that, Temporal is a proposal that polyfills really well.  So one part is getting this shipped in browsers, and another step is getting API adoption.  So, it would be OK if it takes a little longer to get into browsers if it gets high ecosystem adoption first with the polyfill.  So this is an opportunity for us to be a champion of built-in modules.
        * PD: I think it makes sense.  We should re-evaluate it in March and June.
        * MP: Is built-in modules on the agenda for January?
        * DE: I talked to someone who wanted to put it on the agenda, but I don't know the details.
        * DE: If we're going to back up built-in modules, are we going to choose a module specifier?  We could be @std/temporal, for example.
        * PD: Sounds like a plan.
        * DE: So what do you think should be the name?
        * MP: "Temporal" was a "if this has to be global, this is an obscure name" solution.  Are people going to make fun of the name in 10 years?
        * DE: Have you heard anyone say "Temporal" is a bad name?
        * MP: No; the disagreement is mainly about the "civil" prefix.  (talks about the justification for the civil prefix.)
        * DE, RG, MP discuss prefixes.
        * DE: I want to propose that we set a deadline of the end of February for finalizing the spec.  Then we can release a polyfill on npm under @std/temporal, and everything will be great.
        * RG: Love it.
    * Polyfill in npm -- covered above
    * Conformance tests
        * PD: There's one main hiccup… on daylight borders, there could be multiple answers, so you really have to iterate over all of them to figure it out.  There is probably a better way to do this if you're in a browser implementing this in C, but not a performance test in JS.
        * DE: Performance or conformance?
        * PD: Oh, yeah, conformance is easy.
        * DE: Performance we can wait on until it's implemented in browsers.  I think conformance is a good thing to have so we can turn it into test262.  Does anyone want to volunteer to fill out the test suite?
        * MP: I will!
        * DE: Great!
    * Integration with ECMA-402
        * DE: I think this is important and SC could help.
        * MP: I'm happy to join the Ecma 402 meetings.
        * SC: Is this just sugar over date?
        * DE: Temporal has a richer data model than date
        * SC: Is it theoretically possible to write a pure JS library that converts from Temporal to Date with options for Intl.DateTimeFormat that creates a perfect localized string?  Is there anything in Temporal that Intl.DateTimeFormat simply doesn't support right now?
        * JW: Some of this stuff you could fake by making  a Date in 1970 or something with specific bits added, then use Intl.DateTimeFormat to format just those specific parts.  But mostly they’re quite different concepts.
        * ??: Nanosecond granularity?
        * SC: I think it does not make sense to have something like Intl.TemporalFormat; we should just overload Intl.DateTimeFormat.  I'm trying to think ahead to see if there is anything that Intl.DateTimeFormat needs to support that could be done in preparation for Temporal.
        * ??: Temporal and Date are quite different concepts; we can use Intl.DateTimeFormat but I think it needs a lot of internal wiring to be different.
    * Collecting and analyzing feedback
        * MP: This would be interesting
        * PD: It's early for this, since we need to get the polyfill out first
* - Date
    * Summarize TC39 status
        * RG: The proposal was accepted for Stage 1 in September 2018, and I'm starting to work on it more. There was enthusiasm; someone called it taking out the trash.
    * How specific do we want to be?
        * RG: My goal is to provide a safe subset that all implementations ship in the same way, and then have a neighborhood around that which must be rejected as invalid.
        * DE: I'd like to fully specify this, what do you think, Shane and Jeff?
        * JW: In theory, it would break existing websites to force everyone to do the same thing. It could be too many, it could be few enough that we could just do it.
        * RG: I'd like this to be a sequence of proposals.
        * JW: I could believe that proceeding in stages could be useful, if we're defining one bit of syntax, continuing on, we could collect in-field telemetry.
        * RG: It's also possible that we could end up in a good state where the spec says, if the input is not fully specified, then implementations are free to fall back to whatever, but it's recommended to take a certain action. When I talk about multiple proposals, I'm talking about two: the preferred syntax, and then defining it fully. I don't want to do nothing just because we can't do everything.
        * DE: Maybe we could start towards trying to define things completely, and then
    * Do we want to propose adding new features to Date, or only to Temporal?
        * DE: I thought we were going to focus on adding things to Temporal, and not add things to Date.
        * RG: I agree, this is a good default position. I don't think we need to add timezones into Date.
        * MP: We looked into whether we could fix Date. I made a series of blog posts. There's no way Date will ever be immutable.
        * PD: We want people to migrate to Temporal. Shoehorning more things into Date is counterproductive.
        * DE: OK, sounds like we all agree, and I probably misunderstood about adding timezone syntax to Date. We won't do it!
    * Spec text, implementation, and tests?
    * [yulia] Mozilla is retracting [Date.parse fallback semantics proposal](https://github.com/tc39/proposal-date-time-string-format), will this be replaced?
        * RG: The Mozilla proposal was about extending the space of must-be-accepted, which is the second part we were talking about. I'
        * DE: So their goals are important, but I want to be flexible about whether this is in a second proposal or the first proposal.  I'm fine saying that this happens second.  Can we say one doesn't subsume the other?
        * RG: I think yes, the new one replaces the old.
        * JW: Realistically, I don't think there's anyone here who is likely to champion the old proposal.
        * PD: So the new proposal is not really subsuming the old one, but it's the prerequisites for extending the space?  So the new one is the foundation for the old one?
        * RG: Yeah, that's totally fair.
        * JW: I think the extension idea is sort-of right, but really it's more of a union.
* Next steps
    * Should we make this a recurring (e.g., monthly) meeting?
        * Yes, will repeat monthly
