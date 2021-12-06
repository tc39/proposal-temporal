# November 18, 2021

## Attendees
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Frank Yung-Fong Tang (FYT)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Yusuke Suzuki
- Philipp Dunkel (PDL)

## Agenda

### Most methods of Temporal.PlainDate require a fresh new Calendar instance for each Temporal.PlainDate ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
(We invited Yusuke for this item.)

- Yusuke: We are implementing this in JSC. We noticed that every time we instantiate PlainDate it requires instantiating a Calendar object. This requires extra memory and a lot of tracking. The comment is correct that we can optimize out a lot of these calendars, but this is really complicated. If we need to do that optimization in JSC, we will, but my question is can we simplify it at all?
- FYT: Is this only limited to PlainDate?
- Yusuke: Also PlainDateTime, PlainYearMonth, etc.
- FYT: Why is a fresh instance needed every time?
- Yusuke: We can't use a singleton because user code can tell the difference.
- FYT: Where in the spec?
- PFC: In the constructor, if you don't pass it in, you need a fresh instance.
- SFC: The reason we originally did this was based on feedback that if someone modifies the calendar, you don't want to infect other users of the calendar. Did we consider making calendar prototypes frozen?
- RGN: That would address a lot of the concerns. I'm not convinced that it would address 100% of them. It would certainly be an unusual pattern.
- SFC: I'm talking about only built-in calendars. When I was originally thinking about this I thought we'd have 12 frozen instances, one for each built-in calendar.
- FYT: Is this a recent change?
- SFC: Certainly it's been around for a while.
- PFC: Can we list out the concerns that made us make this choice in the first place? So we can evaluate whether frozen objects would satisfy the requirements.
- Yusuke: I think frozen objects would help in this case.
- RGN: I'm 90% sure that frozen objects would address the communication issue, but there's also the issue that it's an unusual pattern in ECMAScript.
- Yusuke: We freeze objects in tagged template calls.
- RGN: That does seem very different from this, but IIRC that was also done to avoid a communication issue. That's not a built-in, it's an object that's dynamically constructed at runtime.
- PFC: Would frozen objects help with the issue that FYT raised a few months ago about the storage space of calendars in PlainTime?
- Yusuke: We are considering storing the calendar ID as an unsigned int in order to make the size of the calendar storage as small as possible.
- RGN: If it's undesirable to have action-at-a-distance, the two approaches that have been identified for addressing that, are 1) the status quo and 2) built-in calendar instances that are frozen. That does make the assumption that the action-at-a-distance is a problem that we need to solve, and I think it is, but we should check that assumption.
- FYT: Frozen would mean that users cannot set properties on it?
- Yusuke: The prototype chain as well.
- RGN: That's a risk in itself, because you can't monkeypatch the built-in.
- FYT: Is the action-at-a-distance so bad? Do people actually do that?
- PDL: They do it by accident. We really wanted this for a truly immutable API. Any instance of a Temporal object should never be able to change. We have seen all the negative experiences from the Date object.
- RGN: That goal was not upheld in the status quo, because even now with a fresh instance, you can cause those changes if you overwrite a property on the created fresh instance.
- PFC: Or `Temporal.Calendar.prototype`.
- PDL: Those cases are intentional, though. You can always cause changes if you overwrite function properties on the prototype. I'm less worried about that because you're intentionally messing with the built-in. I'd be OK with shared frozen instances for performance reasons, but I'd be cautious.
- RGN: That brings the risk that you can't patch built-in methods.
- SFC: We had previously had the ability to patch the set of built-in calendars using `Temporal.Calendar.from()` but that was removed due to concerns from the 262 editors. We just don't have that functionality now.
- (...missed some discussion...)
- PDL: The situation is that I have a lot of Temporal objects where the `.calendar` getter has never been called yet. At that point, I can still share one instance between all instances of my Temporal objects. At the moment a getter is called, I can instantiate a Calendar instance for that particular object. That keeps the same semantics as we have now and is unobservable.
- PFC: That's similar to the optimization I suggested in the issue, but with a shared instance instead of a calendar ID.
- PDL: The question is what the benefit of a shared calendar: the possible performance optimization. But if we have this performance optimization possible without shared calendar, then what is the additional benefit?
- RGN: If you have an object reference stored internally, then the counterexample that I gave in the issue is a problem. If it's a calendar ID stored internally, then it's not a problem.
- PDL: No, because `Temporal.Calendar.from()` would create a distinct instance.
- RGN: OK.
- PDL: So, what's the additional benefit?
- SFC: We're having this discussion because Yusuke opened the issue with feedback that the current situation was hard to implement. Yusuke, what do you think about PDL's proposal?
- Yusuke: My concern is that we always have to keep tracking the functions in the Calendar prototype to make sure they are not modified. If we can't avoid this, then I think we can make the optimization in the current semantics, but my question is whether we can avoid this. 
- FYT: Is it observable when we call the Calendar constructor?
- Yusuke: I don't think so.
- Yusuke: My original thought was whether we need the customization allowed by monkey-patching Calendar methods for built-in calendars. If we didn't need to call these methods, we wouldn't need to do this.
- PDL: What happens if we say Calendar.prototype is frozen? That would eliminate the monkey-patching ability.
- Yusuke: Another idea I had would be to get the prototype methods and store them along with the calendar.
- PFC: I investigated that in https://github.com/tc39/proposal-temporal/issues/1294#issuecomment-789335468 and concluded that you get some really weird behaviour in that case when you call an operation that may create Temporal objects inside user code.
- FYT: We need to investigate why one code path in the Temporal.Calendar constructor calls Construct and the other calls OrdinaryCreateFromConstructor.
- (Discussion about that)
- Yusuke: My assumption when raising this issue was that 99% of usage of Temporal would use the built-in calendars. If that's correct, this seems like a lot of complexity for a rare use case.
- JGT: That's correct.
- Yusuke: Is there a use case for overwriting methods on `Temporal.Calendar.prototype`?
- RGN: The monkey-patching use case comes up in polyfilling and testing.
- FYT: If user code modifies `Temporal.Calendar.prototype`, is that observable?
- RGN: That's correct.
- FYT: So it's not true that a shared instance wouldn't be observable until the getter is called?
- Yusuke: Someone can monkey-patch the prototype but it doesn't affect the creation of the object.
- RGN: No relevant property of the prototype is accessed at the time of creation.
- PFC: What can the next steps be? Should we investigate frozen instances and what would need to change?
- Yusuke: If we had frozen instances, we'd either need to also freeze the prototype, or define frozen methods on the instances. Kind of hacky but maybe worth it if 99% of the usage is just built-in calendars.
- RGN: Is it worth it to prevent action-at-a-distance? PDL and I think so.
- PFC: I think it would be unpopular in committee if we had action-at-a-distance.
- RGN: Assuming provisionally that that problem is worth addressing, are the two solutions the status quo and frozen shared instances?
- PDL: I would be fine with frozen shared instances if there were a compelling reason, but I haven't heard one yet.
- Yusuke: Implementations could more easily assume that users can't have messed with the calendar.
- PDL: My take-away is that we should consider as a third option freezing _both_ built-in Calendar instances and `Temporal.Calendar.prototype`, to implement really immutable objects with built-in calendars, in order to do better optimizations.
- RGN: If you freeze Calendar.prototype, you disrupt customization.
- Yusuke: From the implementation perspective, if we can detect "this calendar is unmodified", we can achieve the optimization. One way is freezing the Calendar.prototype, but I don't think that's the only way. Another way would be for built-in calendar instances to have frozen methods overriding the Calendar.prototype ones. Or have a second prototype for built-in calendars that is frozen.
- PFC: Can we conclude that we should investigate the options that Yusuke mentioned? I can do this eventually, but it may take some time before I can get around to it.

### Description of calendar algorithms ([PR #1928](https://github.com/tc39/proposal-temporal/pull/1928))
- PFC: Now that we have a PR, can we skip this item?
- JGT: Nope, still need to decide more. See [this comment](https://github.com/tc39/proposal-temporal/pull/1928#discussion_r751481048).
- FYT: I'd appreciate this being described at two different levels. One is the broad intention of the method (such as "this operation determines whether the year is a leap year"), the other is "how to calculate whether the year is a leap year in the X calendar." But I don't think we should put the latter in the spec.
- JGT: Your opinion would be appreciated on the comment thread.

### Mathematical values in Duration ([#1604](https://github.com/tc39/proposal-temporal/issues/1604))
- From last meeting: Consensus: We will approach SYG about this.
- PFC: I thought I had pinged him on the thread, but it looks like I didn't.
- Action: PFC to ping SYG.

### Ambiguous PlainTime formats ([#1765](https://github.com/tc39/proposal-temporal/issues/1765))
JGT: We discussed last time but forgot to discuss cases like `01-01` where the second `01` could mean an offset, e.g. equivalent to `01-01:00`. Resolution in the comment looks OK.

### Test262 questions
What should be the process for syncing Test262 with new normative PRs?  Tests first or spec changes first?  Also: when to update the submodule?
- JGT: Seems like it's generally the bottleneck of getting test262 tests reviewed.
- PFC: My workflow so far has been:
  - Minor fixes in spec where tests are correct, but maybe want to add new tests: merge those spec PRs in proposal-temporal
  - Larger changes: wait until Test262 changes land, then update spec and polyfill in proposal-temporal
- PDL: Given that test262 is supposed to test spec compliance, it would make sense to merge the spec first. As an implementor I'd want the spec text to represent the status quo.
- PFC: That's valid, but you can also optimize for not having conflicting things in the repo.
- PDL: A conflict can also signal to an implementor that there is something going on that needs attention.
- JGT: Proposal: we check in the spec changes as soon as possible, and have the tests follow as soon as they are ready.
- PFC: I'm happy to do it either way.
- JGT: I'd like to be able to check in the spec changes and polyfill changes when they're ready, with expected failures for test262 tests.
- PDL: Is the polyfill still useful for validating the test262 tests?
- PFC: Yes, very much.
- JGT: I propose, we check in spec text changes and polyfill changes, and if test262 tests fail we should mark them as expected failures until the test262 upstream catches up.
- Consensus.

(for temporal-polyfill) We see Test262 failures from minified & ES5-transpiled code. What is the current best practice for libraries: Include modern ES features, or transpile to ES5? Minify, or leave minifying to the bundler later? 
- PDL: There's no good answer. But generally you ship transpiled code to NPM because you don't know the use case. For a polyfill, the use case is people who don't have a modern browser, so transpiled code would make sense.
- JGT: Is it OK that bundlers then don't have access to the original source?
- PDL: I'd think that especially in the case of a polyfill that's OK. Because it should be dynamically loaded if needed and only if needed. So you don't want to bundle it into your main bundle in the first place.
- JGT: The other issue is that when we do that, test262 fails. When transpiling, the transpiled form of constructors isn't spec-compliant. When minifying, various strict-mode checks fail.
- PDL: I wouldn't worry about the constructor tests. If there is a way we can avoid that, we should, but otherwise shrug. I'd suggest having ES2020 in our TS config, and the result of that should pass tests. Then for shipping I'd transpile it down to whatever is our baseline, and not care whether that passes tests.
- RGN: I'll point out https://github.com/tc39/test262/issues/3196 which doesn't actually have an answer at this point.
- PDL: My answer to that is always use the features of the previous versions. So if Temporal hits stage 4 in ES2021, we use ES2020 in the tests.
- RGN: That doesn't match with the approach of some engines.
- PDL: That's legitimate, but those engines are intentionally not compliant.
- JGT: Summarizing, we'll try to fix the issues either by adding checks in the constructor or adjusting settings in terser. If we can't do that, we can come back and have another discussion.
- PDL: And we test the ES2020 code for correctness, and then test the transpiled code with more expected failures.
