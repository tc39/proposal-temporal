# Apr 29, 2021

## Attendees:
- Ujjwal Sharma (USA)
- Jase Williams (JWS)
- Shane F. Carr (SFC)
- James Wright (JWT)
- Richard Gibson (RGN)
- Daniel Ehrenberg (DE)
- Philip Chimento (PFC)
- Cam Tenny (CJT)

## Agenda:

### How much do we need to specify the Intl calendars?
- USA: This came up in a discussion between me and SFC. The question is how much should each calendar be specified.
- SFC: At a minimum, 402 will have to specify what the string identifiers would be, but treat the calendars themselves as opaque. Or the other extreme would be to specify every calculation. Or something in the middle.
- USA: Each of these calendars would have to be specified anyway. Could we do a mix? Could we say that each implementation should have an `islamic-civil` calendar that supports such-and-such interface but is implementation defined, but for the `japanese` calendar we specify it because it's less complicated.
- DE: Several different ways are all valid. I think this should be decoupled from Temporal. It could be done either before or after Temporal goes to stage 4.
- SFC: I don't think this should be included in the Temporal proposal, no.
- DE: We don't expect that any of the implementations that we're working on would change as a result of this?
- USA: Correct.
- SFC: If you think about this from a test262 perspective, we should expect browsers to implement calendars consistently enough that they pass test262 tests for Intl calendars. If there are test262 tests, then there should be a specification for browsers to obey.
- DE: I think we can decouple that second part. We have the locales part of test262 where you can test things that are not necessarily specified. I agree it's important to include these tests.
- SFC: What does the spec text currently say if you pass a calendar ID string that's not `iso8601`?
- PFC: It goes through [IsBuiltinCalendar](https://tc39.es/proposal-temporal/#sup-temporal-isbuiltincalendar) which checks it against a list of known identifiers. It's only specified that the list must at least contain `iso8601`.
- USA: So we would be further specifying this.
- PFC: Right. In the specifications of calendar methods, anything other than ISO is left as implementation-defined. (e.g. https://tc39.es/proposal-temporal/#sup-temporal.calendar.prototype.year)
- SFC: It sounds like this group doesn't have a strong opinion about this. There's been some pushback in 402 about specifying a list of calendars because it makes the burden on polyfill authors higher.
- JWS: What's the advantage to having a list of calendars?
- PFC: It's cumbersome for userland to have to test each calendar that they might want to use, to see if it exists individually.
- DE: I'm not convinced by the polyfill argument. A polyfill can choose not to include all calendars if they decide that's best for them, they don't have to be spec-compliant in that regard.
- SFC: Does the spec currently standardize `monthCode` and `era` strings?
- PFC: No, it only specifies what's done in the ISO calendar, with no leap months.
- DE: We previously decided it wasn't necessary to standardize the `monthCode` syntax. What changed?
- SFC: The reasoning is that programmers should be able to rely on the strings being in the iCal format.
- DE: I thought MG determined that the iCal syntax wasn't sufficient and we'd have to add extensions.
- SFC: We can make the claim that all of the 402 calendars provide these iCal strings, without specifying that they must always be.
- DE: Okay.

### Hosting for production polyfill
- PFC: Moment was originally positive about hosting the polyfill under their org but later thought differently. I propose we host it under the js-temporal org as was the original plan.
- CJT: Okay.
- DE: That's OK, but we do need to make clear the amount of maintenance that we're able to do on this.
- PFC: I did mention it to the Moment maintainers but haven't gotten a reply yet.
- SFC: It depends on who's going to maintain it. If you put it in js-temporal then that org might get orphaned.
- DE: Igalia can't commit to maintaining it long-term.
- JWS: Bloomberg can't commit to maintaining it long-term either.
- CJT: What about the Google org?
- SFC: I haven't thought about that.
- DE: What is the advantage of hosting it by one of our companies?
- SFC: It makes it clear who assumes the responsibility for maintenance.
- DE: But I don't see an advantage to us as the champions group. We want to encourage community contributions.
- JWS: There are plenty of projects out there that are not in a company namespace.
- USA: My proposal is to keep it on the js-temporal org, meaning it's open to community contributions, and if anyone steps up we can give them access to the org.
- JWS: Where does the concern about orphaning come from? What would people be worried about?
- DE: We'd be worried about it because we'd be essentially orphaning it.
- SFC: This is a question for JWT. Would it give you pause if the polyfill might be unmaintained?
- JWT: The requirements for external library maintainers are often different from the requirements for Google internal clients.
- JWS: What sort of maintenance would be necessary?
- SFC: Build systems change, time zone data needs to be updated, etc.
- JWS: Could we start out doing this and eventually transfer it to the community? Does there need to be someone coordinating these community contributions?
- JWT: Without someone doing that, then my experience is that the state of the polyfill tends to deteriorate.
- JWS: If each company eventually switches to built-in Temporal in the long term, then it could still deteriorate even if a company is hosting it.
