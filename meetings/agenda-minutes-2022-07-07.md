# July 7, 2022

## Attendees
- Shane F. Carr (SFC)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Justin Grant (JGT)

## Agenda
### Presentation to July TC39 plenary
At the moment, there are 16 normative PRs to present, and several more to discuss in this meeting. Agenda deadline is 2022-07-09 (day after tomorrow).

### Changes to ICU ([#2196](https://github.com/tc39/proposal-temporal/issues/2196))
What part of this work should we be tracking? Is an ICU4C implementation of Temporal impossible without these changes, or just less convenient?
- SFC: FYT has this under control. ICU4X supports much of what Temporal needs in addition, so we should continue to recommend using it. However, v8 is still on ICU4C. Without these changes it's less convenient but not impossible. Without it, a lot of calendar-specific code has to be in v8.

### Frozen built-in calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
Reminder to take a look at PFC's proposed solution.
- SFC: I think we should discuss this with plenary.
- PFC: I would like to have a recommended solution from the champions group first.

### Recursive calendar/timeZone property bag edge case ([#2104](https://github.com/tc39/proposal-temporal/issues/2104))
Where we left off: Recommendation from JGT and PFC is still to change nothing. RGN to make the case to change it.
- SFC: I don't have a strong opinion but I can try to form an opinion.
- RGN: I don't remember the full details but the example presented in the issue I find surprising and bad. We already know what the fix looks like. I don't think the proposal is too mature to fix something like this, and in fact we are now uncovering a number of similarly subtle issues.
- PFC: I'm coming around to the idea of tacking this on to the presentation in July.
- JGT: OK.

**Conclusion:** we'll change this.

### Follow up to options bags in Duration.round ([#1876](https://github.com/tc39/proposal-temporal/issues/1876))
Where we left off: JGT to investigate what is being proposed here.
- JGT: It's not clear to me whether the change proposed here is what JHD is asking for. I think that he doesn't like the current situation where one or the other is required, but he would not mind the proposed solution.
- RGN: One or the other of `largestUnit`/`smallestUnit` should be required.
- JGT: That's how it works now.
- SFC: I don't understand the objection to the status quo.
- JGT: I would think that we could add a requirement for `smallestUnit` like in the other round methods.
- RGN: Agreed, if it's too cumbersome we can relax that in the future without compatibility issues.
- SFC: Disagree, I think this would hurt the ergonomics of Intl.DurationFormat call sites. Balancing a duration to a particular `largestUnit` is an important operation.
- RGN: Do you mean that DurationFormat calls this method directly?
- SFC: No, but DurationFormat doesn't do any balancing or arithmetic, only formats the fields you pass in, so users of DurationFormat rely on this method to get the fields they want.
- PFC: I agree with SFC, it's going to be a common pattern to call `.round({...}).toLocaleString()`, so adding a bogus `smallestUnit: 'nanoseconds'` if you only want `largestUnit` will hurt the ergonomics.
- RGN: I think it's a red herring to compare this to DurationFormat.
- SFC: I'm arguing that in the thread it's mentioned as an edge case, and I don't think that's justified. If we made this change I'd want to go back to DurationFormat and reconsider the principle of not doing arithmetic in DurationFormat.
- JGT: I wouldn't mind it if resolving this discussion required a change in DurationFormat.
- SFC: I don't particularly want to change DurationFormat.
- PFC: I wouldn't want to make a change that makes the API worse. We have an option of closing the issue and doing nothing.
- JGT: I'm not convinced the change is unequivocally bad. It makes some call sites less ergonomic, but it makes all the `round()` methods more consistent. So it depends on what we value.
- SFC: Could we remove the string parameter since that's ambiguous between `smallestUnit` and `largestUnit`?
- PFC: We already made that change at JHD's request.
- RGN: I think the string change was good.
- JGT: I think going back to the specific situation that JHD objected to, is a non-starter.
- RGN: The argument for the current behaviour is that `smallestUnit` is required, except when you are using `largestUnit` to get the additional balancing behaviour; in that case there is an implied default `smallestUnit`.
- JGT: I agree.
- RGN: I would think that an implied default `smallestUnit` would be useful in other places as well, although we disallowed that due to the potential for bugs.
- RGN: I think JHD is objecting to the exception that differentiates Duration.round from other round methods, in that `smallestUnit` is not required under some circumstances.
- JGT: I think he's OK if it's different, but if the requirements are different then the API signature should be different.
- RGN: The comment says "an options bag where one of two arbitrary properties are required". The position of this group is that those are not arbitrary.
- SFC: Can we rename `round()` to `balance()`?
- JGT: "Balance" doesn't have a colloquial meaning.
- SFC: It's not too different from having to teach people the difference between a "plain" and a "zoned" date, we have a section in the docs on what duration balancing is.
- RGN: In that case I'd recommend keeping a `round()` method with `smallestUnit` required, and adding a method that does `largestUnit`, with optional rounding like `since()` and `until()`.
- JGT: Or a new method that only does `largestUnit`.
- SFC: You could chain them, `duration.balance('hours').round('seconds')` as an alternative to `duration.round({largestUnit: 'hours', smallestUnit: 'seconds'})`.
- JGT: If we do add a new method I'd like to bikeshed the name. I don't want to present a placeholder name to plenary.
- RGN: I think there's a strong case for introducing this method. I'm OK with `round()` being the only mechanism but I'm also OK with a dedicated method.
- PFC: I would at least find a dedicated `balance()` method not worse than the status quo, but I'd still prefer to just close the issue.
- RGN: That's also my preference, weakly held.
- JGT: Agree with RGN. Should we take a few minutes to flesh out what this method would do if we added it?
- SFC: My preference would be to add another method that is exactly the same as `round()` but the string parameter would map to `largestUnit`. Also, `round()` would require `smallestUnit`, and balance() would require `largestUnit`.
- RGN: Either that or remove the `largestUnit` behaviour from `round()`.
- PFC: If we did add a second method, I'd prefer that they did two different things.

We take a moment to examine what this counterfactual method would do if we were to make a change. It would be a new "balance" (name TBD) method that acts the same as Duration.p.round, EXCEPT: the `largestUnit` option is required, and the string parameter corresponds to `largestUnit`. Remove `largestUnit` option from `round()` (throw if it is passed in the options bag?)

- SFC: I wouldn't want to remove `largestUnit` from `round()` just for the sake of it.
- JGT: There is a consistency argument that `round()` could act like it does in every other type, i.e. `smallestUnit` only.
- SFC: Every other method that allows rounding, e.g. the other types' `since()`/`until()` methods, has `largestUnit` and `smallestUnit`.
- PFC: To me that's more of a reason to make no change. `since()`/`until()` include an optional round step.
- JGT: It doesn't matter if we call that "round" or "balance".
