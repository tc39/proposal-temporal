# Mar 4, 2021

## Attendees
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Jase Williams (JWS)

## Agenda

### Remaining tasks for Stage 3

#### Delegate reviews

##### [#1293](https://github.com/tc39/proposal-temporal/issues/1293) Observable `from()` lookups
- PFC: Actions from yesterday are to merge a patch as soon as possible to remove the observable lookups, and then add another patch to implement the local registry argument. It seems unlikely the latter would get done before the plenary, but we can mention it in our slides and have that PR ready for April, and ask for consensus on it then.
- Thumbs up.
- JWS: Will catch up by reading the notes from yesterday.

##### [#1294](https://github.com/tc39/proposal-temporal/issues/1294) Calendar and time zone records
- PFC: I've implemented what JHD asked for in the polyfill. It introduces some weirdnesses. I'm waiting for feedback from JHD and DE since they were primarily in favour of this, before spending time writing the spec text. Please take a look if you're interested. I will also mention this one in the slides.

##### [#1388](https://github.com/tc39/proposal-temporal/issues/1388) Ordering of property accesses
- PFC: This is from BFS's review last week. This seems pretty straightforward to do and won't need to be mentioned in the slides.
- USA: It's nice that the editors have reviewed Temporal and gone into the details! It's common for such editorial fixes to be done in Stage 4 as well.
- PFC: Just to be on the safe side, we should still do them as soon as possible.

#### IETF draft
- USA: Slides for IETF DISPATCH are at: https://docs.google.com/presentation/d/1uQ0EgNmU4ORTbbY9DJ9AdgFN3gxDpgwCHA3DzKq7paQ/edit?usp=sharing Comments are welcome. We have 20 minutes allotted on Monday. Either people will state that CalExt has what we are looking for in its charter, or we will charter a new working group. The draft that we are working on should be adopted either way.

#### Slides / presentation
- PFC: I can present at the plenary, but let me know if you would get a kick out of doing it.
- JWS: Go for it. Happy to help with the slides.
- JWS: How do you feel about the stage advancement?
- PFC: It seems like there are many people with conflicting priorities, any of whom can block it single-handedly. That is nerve-wracking. Nonetheless, I think we got a signal yesterday that people do want it to advance.
- RGN: The goal here is, if it doesn't advance to stage 3, we should have a concrete list of details that the plenary has discussed and wants acted on in pursuit of advancement.
- USA: For IETF I'm positive that it will be adopted one way or the other. Now that we are no longer trying to obsolete 3339 is something that is working on our favour.
- RGN: In the slides we should make clear that we require the stage 4 entrance criteria that the IETF draft has been published rather than just adopted.
- USA: The intended timeline in the working group charter was July.

### [#711](https://github.com/tc39/proposal-temporal/issues/711) Work items
Nothing to discuss this week, we are preparing for TC39 plenary.
