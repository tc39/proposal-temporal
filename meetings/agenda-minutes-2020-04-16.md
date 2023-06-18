# Apr 16, 2020

## Attendees:

- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Shane Carr (SFC)
- Philipp Dunkel (PDL)
- Hemanth H.M (HHM)
- Richard Gibson (RGN)
- Daniel Ehrenberg (DE)

## Agenda:
### NearForm podcast
- PDL: Will be live on NearForm podcast in 15 minutes, would love suggestions around what to talk about.
- PFC: I think you could talk about the polyfill and ask people to try it out and give us feedback. We should avoid people using it in production though.
- PDL: I’ll make a point about not using it in production. Once the proposal is Stage 3, I think it’ll be fairly fast for at least the initial rollout and I intend to participate personally. So it can be done fairly quickly, am I wrong?
- SFC: Need to check with the V8 team. It might take a while, given that Temporal is more complicated than the standard Intl proposal.
- PDL: Thanks for the suggestions. I’ll head out.

### [#490](https://github.com/tc39/proposal-temporal/issues/490), how `with()`/`getDate()` etc. delegate to the calendar
- PFC: This issue is fairly straightforward, it's about the mechanics of how methods like `with()`, `getDate()`, etc., delegate to the calendar. SFC's proposal is to use the `getFields()` method we agreed to add a few weeks ago to implement this.
- SFC: My impression on how that works currently is that a subset of these getters is made obsolete with `getFields()`.
- DE: What is `getFields()` for? Is it specifically for the calendar?
- PFC: It was suggested as a comment to our presentation at the plenary on whether the fields should be enumerable. `getFields()` is what you use if you need an object with enumerable own properties.
- SFC: If we have agreement on this, I will make a PR adding this method to the calendar draft.

### [#428](https://github.com/tc39/proposal-temporal/issues/428), design of parsing methods
- PFC: This is a question we've discussed several times. I made a draft about some alternatives, if people haven't had a chance to read it we could defer this until later, or we could try to get consensus on this.
- SFC: I’d like to defer this to people who have been more thoroughly involved in the parse method.
- RGN: I haven’t had the chance to look at this, but I could do that soon-ish.
- PFC: While this is a hole in the specification currently, it’s certainly not blocking anything else.
- RGN: That’s a fair assessment, thanks.
- PFC: Or we could work on implementing one of those and take it from there.
- SFC: Do you have the pros and cons listed out?
- PFC: Not in the current draft, no. I’ll add them in. Basically alternative 1 prioritizes the "parsing ISO" use case with from() and the "parsing parts" uses `Temporal.parse()`. Alternative 2 prioritizes "parsing parts" with `from()` and to get the ISO semantics you need to use `Temporal.parse()`. Alternative 3 I don't like because it's a mix, although it does make `Temporal.parse()` obsolete.
- SFC: I’ll try to form a stronger opinion on this discussion.
- RGN: My preference is mostly aligned with yours. There are questions about what to do when validation fails, but mostly we’re on the same page.
- PFC: Good to know.

### [#294](https://github.com/tc39/proposal-temporal/issues/294), `idToCalendar`/`idToTimeZone`
- PFC: This issue is about custom calendars and time zones. If you need to resolve a string ID to a custom calendar or time zone, what's a good API for that? The `idToCalendar`/`idToTimeZone` is not super convenient, but it does avoid mutable global state. Some sort of registry would be more convenient but would be global state.
- USA: Why not references instead of IDs?
- SFC: Because it’s easier to send IDs over the wire, and serialize them and store them in a database. It’s harder for objects. The exact calendar comes from either a location in an interchange format. Therefore, we need to support objects, but strings are important for this reason. Another important reason is polyfillability.
- DE: Having a registry would be a global communication channel.
- RGN: I don’t see how that’s any more vulnerable than a global object.
- DE: The idea is that we shouldn’t have global state in slots, I really like how JHD worded it.
- RGN: I think I agree.
- SFC: There’s a few things. Say you’re polyfilling `Intl.RelativeTimeFormat`, you can just add it. It fills in holes in the namespace. Makes it super easy to polyfill calendars into browsers. If you’re doing something completely different, you won’t do it on the Intl namespace, you will probably do it on your own namespace, which would make string conversion hard.
- PFC: If you don’t want to expose timezone data the host knows about, then you probably don’t want to reveal the calendars either, so you’d probably patch it to just expose ISO.
- RGN: It doesn’t feel analogous to adding `Intl.RelativeTimeFormat`. It’s more like adding a locale. It’s less about filling holes and more about patching existing functionality.
- SFC: Does anyone have other, elegant proposals?
- DE: Since we also have user-specified time-zones, are we using the same approach there as well?
- SFC: I actually left a comment on PFC’s pull request about it. We should ideally use a similar approach there.
- DE: When to convert an ID to calendar, it would create a new calendar. The registry would just return the same objects, which would be different perf-wise.
- SFC: The registry idea wouldn’t work without frozen calendars.
- DE: It doesn’t need to be so, not really.
- RGN: I like the analogy to Intl, and I do like that they’re dealt with similarly. I also like the polyfillability angle. However, I cannot come up with a counter-proposal.
- DE: What’s the angle on the polyfillability argument?
- RGN: Adding a single calendar would require a mountain for work, which defeats the purpose.
- DE: There’s nothing like this in Intl. The subclass-ability, registry approach, etc.
- SFC, RGN: We’ve not had to deal with those problems.
- DE: The problem is: I fail to see the use-case here apart from partial implementations?
- PFC: One of the use-cases for custom time-zones is that if you wanted to do date-time arithmetic before time-zones were standardized.
- DE: In case of out-of-date implementations, we could redirect the user to the polyfill.
- SFC: The approach of nuking the existing builtins completely feels awkward to me. You want the ability to patch single calendars or time-zones without getting rid of all the rest.
- DE: The problem is, there are alternative solutions for all of these things.
- SFC: That’s why I proposed two things, they’re on either side of the spectrum.
- DE: I think there’s a cost of all this indirection. My point is, we should have a smaller surface area. The problem is, the stuff around custom calendars and timezones keeps getting more and more complicated and I don’t feel that this is good enough justification.
- SFC: I now see DE’s point, and I see the connection to Intl. A lot of people built wrappers on top of Intl to deal with the fact that Intl doesn’t have the ability to add data. The difference here is that Temporal is sort of a fundamental data type. Maybe we could move Timezones and Calendars out of Temporal and into a more data-driven namespace.
- DE: It’s a rather interesting observation. I wonder what else breaks without the existence of the Temporal object.
- PFC: Any conclusions? Let’s continue on the thread, but unify the discussion. Let’s discuss both TimeZones and Calendars.
- SFC: Now I see the connection between this and [ecma402 #210](https://github.com/tc39/ecma402/issues/210) (data provider). It’s nice that DE picked it up.
- DE: I thought you were working on this because of [#210](https://github.com/tc39/ecma402/issues/210) 😅
- SFC: If Calendar had a `from()` and if we made everything use that, we could make that static a sort of global ID to calendar method.
- Everyone agrees that reusing `from()` would be a nice idea.
