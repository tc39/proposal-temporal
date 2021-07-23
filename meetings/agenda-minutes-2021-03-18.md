# Mar 18, 2021

## Attendees
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Jase Williams (JWS)
- Philipp Dunkel (PDL)
- Matt Johnson-Pint (MJP)
- Justin Grant (JGT)
- Daniel Ehrenberg (DE)

## Agenda

### Polyfill post stage 3
- PDL: I think we should make the conditional stage 3 changes first in the existing polyfill, and only then move the polyfill elsewhere.
- PFC: Agreed about making the changes first, so everyone is working from the same ground truth.
- JGT: Agreed.
- PDL: Suggestions for where to move the polyfill?
- PFC: The js-temporal org that we opened for proposal-temporal-v2 is a possibility.
- JWS: What would be the distinguishing features of more than one polyfill?
- (Discussion about different environments)
- PDL: We probably want to write it as an ES module and then provide a utility for people to load it onto the global object.
- DE: Not making Temporal global automatically was an important part of Temporal being pre-Stage-3. We'd probably want to include something tree-shakable.
- MJP: I can confirm from Stack Overflow questions that people often want to do things with just PlainDate and PlainDateTime, so they might not need the time zone baggage. Tree-shaking would be a good thing in that case.
- JGT: When we move the polyfill, what else moves with it? The docs and the cookbook? We need to figure out in detail how this will work.
- JWS: Would the docs move too?
- PFC: I'd be very sad if the docs and cookbook had to move. Temporal has put a lot of effort into those, which other TC39 proposals don't usually do, but should in my opinion. It would send the wrong message if we moved them out.

### Stack Overflow tag
- MJP: What's the latest on the Meta Stack Overflow thread about a tag for Stack Overflow?
- JGT: The latest on that thread seemed to be ecmascript-temporal.
- MJP: Can we collaborate on a document seeding the most frequently asked questions?
- USA: At one point we talked about taking over the "temporal" tag since there wasn't much under it.
- JGT: We can consider making "temporal" a synonym of the official one?
- MJP: There are ~200 questions under "temporal" and they're all over the map. There are just too many things in computing that are called "temporal".
- DE: Why are we talking about "ecmascript-temporal" and not "js-temporal"?
- JGT: That was the recommendation from Stack Overflow.
- SFC: I do prefer reusing the existing tag, those ~200 questions are just going to be noise.
- JGT: The recommendation was because SQLServer has something called "temporal tables"; we don't win a lot by caring too much about the name.
- JWS: One point that was made in the thread is that there's an existing loose convention that "js" refers to tooling and "ecmascript" refers to language features.
- JGT: If you type "temporal", then "ecmascript-temporal" will still show up.
- MJP: Another question is how we reflect the status in the tag. People on Stack Overflow will want the tag to reflect whether they are able to use the feature or not.
- JGT: I assume we'd update our README at the same time. Updates probably wouldn't need to happen very often.
