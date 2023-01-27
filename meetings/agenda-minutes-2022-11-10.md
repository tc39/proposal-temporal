# November 10, 2022
## Attendees
- Philip Chimento (PFC)
- Jason Williams (JWS)
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Daniel Ehrenberg (DE)
- Shane F. Carr (SFC)

## Agenda

### TC39 presentation
- 5 issues ready to present to TC39. Expect to get 2 more done before the agenda deadline.
- DE: If you're not paying attention it's maybe not clear to TC39 that there's progress towards closing the issues.
- PFC: It looks like we would be presenting 7 and there's 11 more open.
- DE: Could we set a goal?
- JGT: Around the holidays it'll be a challenge to resolve things before January, but March seems reasonable.
- PFC: Let's assume that no other issues get opened by implementers then March shouldn't be a problem. Some of these discussions we've been having meetings for months and not getting to everything. It would help resolve things if we could stay active on the GitHub issues in-between so we're not starting fresh every time we have a new meeting.
- SFC: It's a bandwidth thing, we spent a lot of bandwidth before stage 3.
- DE: Do we think that a more intense period in January is warranted?
- SFC: I think we should evaluate that in January. In the meantime should we move this meeting back to weekly?
- General agreement.
- PFC: I will have a slide deck ready by next week.

### Implementations progress
- SFC: FYT has been out but is now back.
- PFC: I haven't seen any activity on the JSC implementation.

### IETF standardization work ([#1450](https://github.com/tc39/proposal-temporal/issues/1450))
- No further changes needed. IETF document ends last call today, apparently. IETF needs to publish the document before we can close the issue.
- DE: Now that last call is passing, can we consider this sufficient for shippability?
- RGN: Until it has an RFC number, it's still technically possible for things to change.
- DE: That would be more relevant for stage 4. The probability for changes is low, no?
- RGN: Low, but not zero. In IETF, nothing is final until it goes through Internet Engineering Steering Group review before publishing. This is working group last call, which precedes that.
- DE: OK, that seems justified to wait for.

### `smallestUnit` in `round()` method ([#1876](https://github.com/tc39/proposal-temporal/issues/1876))
- Related to meta discussion about shippability on the agenda.

### Era and eraYear getters in 262 ([#2169](https://github.com/tc39/proposal-temporal/issues/2169))
- PFC: I was looking at this yesterday and thought we should maybe add these after all, as normative optional.
- DE: My intuition aligns with JHD's here, and I don't think we should make them normative optional - people don't know what to expect from that.
- SFC: I'm not 100% aligned on what the problem is and why this can't be done.
- PFC: I agree with that which is why for a long time I thought we could just close this issue. But pragmatically, now that 262 can have calendars with `era` and `eraYear`, and most CLDR calendars have them, this seems good to do specifically for `era`/`eraYear`.
- JGT: Can we get consensus on doing that while finding a process to address the larger question about calendar fields?
- SFC: I think putting the decision making in the hands of 262 is putting it in the wrong place. It's an internationalization question. If the answer is, "it has to go through 262" then so be it, but we need to define that process for all fields, not just `era`/`eraYear`.
- PFC: It's good to think what the alternative process would be if the decision was not in the hands of 262.
- SFC: I thought the alternative process was just 402 declare that these fields are added, and then these fields are added. JHD brings up a point, 402 can't ship anything without TG1's agreement.
- PFC: I expect that the process would probably be TG1 rubberstamping a TG2 decision, in practice. 
- SFC: If that's the understanding and there's reasons to believe these things belong in 262 then that's fine.
- RGN: It doesn't seem like the right place for it though.
- JGT: Do we have a complete understanding of what the problem is?
- JWS: Are there other issues discussing this more generally?
- SFC: I don't understand why 402 can't do this.
- JGT: I think this can be coalesced into a discussion with JHD or others, about what is allowed to exist in 402 that doesn't exist in 262. It's a continuum and we should get agreement on it.
- SFC: This makes sense as a plenary discussion.
- JGT: I think we should try not to get tripped up in a philosophy discussion, and stick to practicalities.
- RGN: There's a distinction between the group of people, and the document. Anything relating to the ECMA documents 262, 402, 404, is under TG1. But, we recently had this discussion, which resulted in the text in 402:
  > This specification introduces new language values observable to ECMAScript code (such as the value of a [[FallbackSymbol]] internal slot and the set of values transitively reachable from %Intl% by property access), and also refines the definition of some functions specified in ECMA-262 (as described below).
- RGN: This strikes me as something very similar to that, and is within the self-proclaimed scope for 402.
- JGT: I think this is a good point, but it only works if you acknowledge that discussion is possible about whether something is over the line or not.
- RGN: Agreed.
- PFC: Do we want to have this discussion in the upcoming plenary?
- (If it's blocked on that discussion, yes)
- JGT: Are you the 402 owner at this point?
- RGN: I'm one of them, yes.
- JGT: SFC, it would be more helpful to have RGN lead this discussion if you would be OK with that, since he might be perceived as more neutral due to not having a strong opinion against adding these getters in 262?
- SFC: Sounds OK to me.

### Optimize built-in calendars ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- JGT presents the current plan.
- JWS: Is there a reason why we couldn't use an internal slot on the instance?
- JGT: In my pseudocode, private fields stand in for internal slots.
- PFC: There's one open question about observably calling `toString()` or the `id` getter.
- RGN: I think there's a specific issue with changing it, if anything it seems backwards. Oh, it's number [#2410](https://github.com/tc39/proposal-temporal/issues/2410)?
- JGT: I think we should flip these, if anything `toString()` should be implemented by calling the `id` getter.
- PFC: I do remember this issue, it has a PR already. It gets both `toString()` and `id` from the internal slot.
- RGN: I think that's probably fine, as long as there's no observable get for either.
- PFC: That still leaves the question of `calendarId` or `timeZoneId`. They'll get the internal slot but for a plain object what should they do?
- JGT: If I think of defining like a plain object, its much more natural to define plain properties than to implement a custom `toString()`. Overriding existing values is relative to creating a simple JSON object which seems a lot more straightforward.
- RGN: We're not talking about a JSON object. We're talking about a class that extends a builtin class.
- JGT: Assuming I will inherit from the Chinese calendar class would I need to override `id` and `toString()`?
- PFC: Now that `id` doesn't call `toString()` you would need to override both.
- RGN: So there is a distinction between a plain object vs an instance of a child class?
- JGT: Do we have consensus on the main plan and could we treat this as an implementation detail?
- (Yes)
- PFC: I'm also happy to proceed with the plan and see if the solution to this question becomes obvious.
- (Some discussion about whether `toString()` should observably Get `id`; seems like no support for that)
- JWS: What's the reason you prefer non-observable behavior?
- RGN: Every instance of observable behavior in built-ins is a hazard.
- JGT: So we'll document that it's required to override both `id` and `toString` for there to be a complete override.
- RGN: It's OK to expect bizarre behaviour if the override is incomplete.
- PFC: That fits with our opinion that custom calendars are an advanced use case and you need to know what you're doing.
- JGT: Next is `getISOFields()`, there's a `timeZone` and `calendar` property in the returned object. I have no opinion about this, it seems fine to have the `string|object` union type returned.
- PFC: Now that I think about it more I like having the string or object for these properties. They provide exactly the values that are in the internal slots so you can construct a new object from them.
- JGT: Are you thinking we would have 1 internal slot or 2 internal slots?
- PFC: 1 internal slot. If you call `getISOFields()` on PlainDate, you get exactly the 4 constructor arguments.
- Action for JGT: to write up the conclusion in the issue

### Check calendar in fast-path conversion to PlainTime ([#2221](https://github.com/tc39/proposal-temporal/issues/2221))
- We don't have PDL for this discussion, re. time calendars.
- PFC: Maybe we could sidestep the issue by renaming the method to `.toPlainTimeISO()`, and reserving `toPlainTime()` for the time-calendar future.
- JGT: Given that we've had no use cases for time calendars I don't want to make the ergonomics worse for something that might never happen.
